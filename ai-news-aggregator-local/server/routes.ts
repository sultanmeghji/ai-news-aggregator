import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { NewsService } from "./services/newsService";
import { ClaudeService } from "./services/claudeService";
import { SocialService } from "./services/socialService";
import { insertStorySchema, insertSocialPostSchema, type StoryCategory } from "@shared/schema";

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
  const socialService = new SocialService(storage);

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
          // Mark as duplicate and update the existing story's duplicate flag
          duplicateStories.push({
            title: article.title,
            firstSeen: existingStory.firstSeenAt,
            category: article.category
          });
          
          // Update existing story to mark as duplicate if not already marked
          if (!existingStory.isDuplicate) {
            await storage.updateStory(existingStory.id, { isDuplicate: true });
          }
          continue;
        }
        
        // Verify URL is accessible
        const isUrlValid = await newsService.verifyUrl(article.url);
        
        if (isUrlValid) {
          const storyData = {
            title: article.title,
            description: article.description,
            url: article.url,
            sourceUrl: article.url,
            sourceName: article.sourceName,
            additionalSources: article.additionalSources ? JSON.stringify(article.additionalSources) : null,
            category: article.category,
            summary: summary.summary,
            publishedAt: article.publishedAt,
            isVerified: true,
            characterCount: summary.characterCount,
            sourceLogo: null,
            titleHash: titleHash,
            isDuplicate: false,
            firstSeenAt: new Date(),
            echoCount: article.echoCount || 0,
            socialMentions: article.socialMentions ? JSON.stringify(article.socialMentions) : null
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
    } catch (error) {
      console.error('Error refreshing stories:', error);
      res.status(500).json({ error: 'Failed to refresh stories: ' + error.message });
    }
  });

  // Test Social Pilot API connection
  app.get("/api/social/test", async (req, res) => {
    try {
      const result = await socialService.testConnection();
      res.json(result);
    } catch (error) {
      console.error('Social test error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create social media post
  app.post("/api/social/post", async (req, res) => {
    try {
      const { storyId, platform, content } = req.body;
      
      if (!storyId || !platform || !content) {
        return res.status(400).json({ error: 'Missing required fields: storyId, platform, content' });
      }

      const story = await storage.getStoryById(storyId);
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }

      // Create social post record
      const socialPost = await storage.createSocialPost({
        storyId,
        platform,
        content,
        status: 'pending'
      });

      // Attempt to post to social media
      const result = await socialService.createDirectPost(content, platform, story.url);
      
      if (result.success) {
        await storage.updateSocialPostStatus(socialPost.id, 'posted', result.postId);
        res.json({ 
          success: true, 
          message: `Posted to ${platform} successfully`,
          postId: result.postId 
        });
      } else {
        await storage.updateSocialPostStatus(socialPost.id, 'failed');
        res.status(400).json({ 
          success: false, 
          error: result.error || 'Failed to post to social media' 
        });
      }
    } catch (error) {
      console.error('Error creating social post:', error);
      res.status(500).json({ error: 'Failed to create social post: ' + error.message });
    }
  });

  // Get social posts for a story
  app.get("/api/stories/:id/social", async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const socialPosts = await storage.getSocialPostsByStory(storyId);
      res.json(socialPosts);
    } catch (error) {
      console.error('Error fetching social posts:', error);
      res.status(500).json({ error: 'Failed to fetch social posts' });
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
        socialPilotCalls: usage?.socialPilotCalls || 0,
        newsApiLimit: 900,
        anthropicApiLimit: 1000,
        socialPilotLimit: 500
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
        claude: !!process.env.ANTHROPIC_API_KEY,
        socialPilot: !!process.env.SOCIAL_PILOT_API_KEY
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
