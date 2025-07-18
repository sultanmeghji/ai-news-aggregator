import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { NewsService } from "./services/newsService";
import { ClaudeService } from "./services/claudeService";

import { insertStorySchema, type StoryCategory } from "@shared/schema";

// Generate a simple hash for title normalization and duplicate detection
function generateTitleHash(title: string): string {
  const normalized = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const newsService = new NewsService(storage);
  const claudeService = new ClaudeService(storage);


  // Get all stories with optional filtering
  app.get("/api/stories", async (req, res) => {
    try {
      const category = req.query.category as StoryCategory | undefined;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const stories = await storage.getStories(category, limit);
      
      // Get counts for each category
      const allStories = await storage.getStories();
      const counts = {
        total: allStories.length,
        privacy: allStories.filter(s => s.category === 'privacy').length,
        financial: allStories.filter(s => s.category === 'financial').length,
        healthcare: allStories.filter(s => s.category === 'healthcare').length,
        general: allStories.filter(s => s.category === 'general').length
      };

      res.json({ stories, counts });
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  });

  // Refresh stories from news sources
  app.post("/api/stories/refresh", async (req, res) => {
    try {
      // Clear old stories first
      await storage.clearOldStories();
      
      // Fetch new stories from news API
      const newsArticles = await newsService.fetchAIStories();
      
      if (newsArticles.length === 0) {
        return res.json({ message: 'No new stories found', count: 0 });
      }

      // Generate humorous summaries for all articles
      const summaries = await claudeService.generateMultipleSummaries(
        newsArticles.map(article => ({
          title: article.title,
          description: article.description,
          category: article.category
        }))
      );

      // Save stories with summaries to storage
      const savedStories = [];
      const duplicateStories = [];
      
      for (let i = 0; i < newsArticles.length && i < summaries.length; i++) {
        const article = newsArticles[i];
        const summary = summaries[i];
        
        // Generate title hash for duplicate detection
        const titleHash = generateTitleHash(article.title);
        
        // Check if story already exists
        const existingStory = await storage.checkDuplicateStory(titleHash);
        
        if (existingStory) {
          duplicateStories.push({
            title: article.title,
            url: article.url,
            firstSeenAt: existingStory.createdAt
          });
          continue;
        }
        
        // Verify URL is accessible
        const isUrlValid = await newsService.verifyUrl(article.url);
        
        if (isUrlValid) {
          const storyData = {
            title: article.title,
            description: article.description,
            url: article.url,
            sourceName: article.sourceName,
            additionalSources: article.additionalSources || null,
            category: article.category as StoryCategory,
            summary: summary.summary,
            publishedAt: article.publishedAt,
            characterCount: summary.characterCount,
            titleHash: titleHash,
            echoCount: article.echoCount || 0,
            socialMentions: article.socialMentions ? JSON.stringify(article.socialMentions) : undefined
          };

          const savedStory = await storage.createStory(storyData);
          savedStories.push(savedStory);
        }
      }

      res.json({ 
        message: savedStories.length > 0 
          ? `Stories refreshed successfully. ${savedStories.length} new, ${duplicateStories.length} duplicates detected.`
          : duplicateStories.length > 0 
            ? `No new stories found. ${duplicateStories.length} duplicates detected.`
            : 'No new stories found',
        count: savedStories.length,
        duplicates: duplicateStories.length,
        stories: savedStories 
      });
    } catch (error: any) {
      console.error('Error refreshing stories:', error);
      res.status(500).json({ error: 'Failed to refresh stories: ' + error.message });
    }
  });



  // Get API usage statistics
  app.get("/api/usage", async (req, res) => {
    try {
      const usage = await storage.getTodayApiUsage();
      
      res.json({
        date: new Date().toISOString().split('T')[0],
        newsApiCalls: usage?.newsApiCalls || 0,
        anthropicApiCalls: usage?.anthropicApiCalls || 0,
        newsApiLimit: 900,
        anthropicApiLimit: 1000
      });
    } catch (error) {
      console.error('Error fetching API usage:', error);
      res.status(500).json({ error: 'Failed to fetch API usage' });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      services: {
        news: !!process.env.NEWS_API_KEY,
        claude: !!process.env.ANTHROPIC_API_KEY
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
