import { promises as fs } from 'fs';
import { join } from 'path';
import { Story, InsertStory, SocialPost, InsertSocialPost, ApiUsage, InsertApiUsage, StoryCategory } from '@shared/schema';
import { IStorage } from '../storage';

interface CSVStorage {
  stories: Story[];
  socialPosts: SocialPost[];
  apiUsage: ApiUsage[];
}

export class CSVStorageService implements IStorage {
  private dataPath: string;
  private storiesFile: string;
  private socialPostsFile: string;
  private apiUsageFile: string;
  private data: CSVStorage;
  private currentStoryId: number = 1;
  private currentSocialPostId: number = 1;
  private currentApiUsageId: number = 1;

  constructor(dataPath: string = './data') {
    this.dataPath = dataPath;
    this.storiesFile = join(dataPath, 'stories.csv');
    this.socialPostsFile = join(dataPath, 'social_posts.csv');
    this.apiUsageFile = join(dataPath, 'api_usage.csv');
    this.data = {
      stories: [],
      socialPosts: [],
      apiUsage: []
    };
  }

  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      await this.loadData();
    } catch (error) {
      console.error('Failed to initialize CSV storage:', error);
      throw error;
    }
  }

  private async loadData(): Promise<void> {
    try {
      // Load stories
      try {
        const storiesCSV = await fs.readFile(this.storiesFile, 'utf-8');
        this.data.stories = this.parseStoriesCSV(storiesCSV);
        if (this.data.stories.length > 0) {
          this.currentStoryId = Math.max(...this.data.stories.map(s => s.id)) + 1;
        }
      } catch (error) {
        // File doesn't exist, create empty
        await this.saveStoriesCSV();
      }

      // Load social posts
      try {
        const socialPostsCSV = await fs.readFile(this.socialPostsFile, 'utf-8');
        this.data.socialPosts = this.parseSocialPostsCSV(socialPostsCSV);
        if (this.data.socialPosts.length > 0) {
          this.currentSocialPostId = Math.max(...this.data.socialPosts.map(s => s.id)) + 1;
        }
      } catch (error) {
        // File doesn't exist, create empty
        await this.saveSocialPostsCSV();
      }

      // Load API usage
      try {
        const apiUsageCSV = await fs.readFile(this.apiUsageFile, 'utf-8');
        this.data.apiUsage = this.parseApiUsageCSV(apiUsageCSV);
        if (this.data.apiUsage.length > 0) {
          this.currentApiUsageId = Math.max(...this.data.apiUsage.map(a => a.id)) + 1;
        }
      } catch (error) {
        // File doesn't exist, create empty
        await this.saveApiUsageCSV();
      }
    } catch (error) {
      console.error('Failed to load CSV data:', error);
    }
  }

  private parseStoriesCSV(csv: string): Story[] {
    const lines = csv.trim().split('\n');
    if (lines.length <= 1) return []; // Empty or header only

    return lines.slice(1).map(line => {
      const [id, title, description, url, sourceName, publishedAt, category, summary, characterCount, titleHash, additionalSources, echoCount, socialMentions, createdAt] = this.parseCSVLine(line);
      return {
        id: parseInt(id),
        title,
        description,
        url,
        sourceName,
        publishedAt: new Date(publishedAt),
        category: category as StoryCategory,
        summary,
        characterCount: parseInt(characterCount) || 0,
        titleHash,
        additionalSources: additionalSources ? JSON.parse(additionalSources) : null,
        echoCount: parseInt(echoCount) || 0,
        socialMentions,
        createdAt: new Date(createdAt)
      };
    });
  }

  private parseSocialPostsCSV(csv: string): SocialPost[] {
    const lines = csv.trim().split('\n');
    if (lines.length <= 1) return [];

    return lines.slice(1).map(line => {
      const [id, storyId, platform, content, status, postId, createdAt] = this.parseCSVLine(line);
      return {
        id: parseInt(id),
        storyId: parseInt(storyId),
        platform: platform as 'linkedin' | 'twitter',
        content,
        status,
        postId: postId || null,
        createdAt: new Date(createdAt)
      };
    });
  }

  private parseApiUsageCSV(csv: string): ApiUsage[] {
    const lines = csv.trim().split('\n');
    if (lines.length <= 1) return [];

    return lines.slice(1).map(line => {
      const [id, date, newsApiCalls, anthropicApiCalls, createdAt, updatedAt] = this.parseCSVLine(line);
      return {
        id: parseInt(id),
        date,
        newsApiCalls: parseInt(newsApiCalls) || 0,
        anthropicApiCalls: parseInt(anthropicApiCalls) || 0,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt)
      };
    });
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    result.push(current);
    return result;
  }

  private escapeCSVField(field: string | null | undefined): string {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private async saveStoriesCSV(): Promise<void> {
    const header = 'id,title,description,url,sourceName,publishedAt,category,summary,characterCount,titleHash,additionalSources,echoCount,socialMentions,createdAt\n';
    const rows = this.data.stories.map(story => [
      story.id,
      this.escapeCSVField(story.title),
      this.escapeCSVField(story.description),
      this.escapeCSVField(story.url),
      this.escapeCSVField(story.sourceName),
      story.publishedAt.toISOString(),
      story.category,
      this.escapeCSVField(story.summary),
      story.characterCount,
      this.escapeCSVField(story.titleHash),
      this.escapeCSVField(story.additionalSources ? JSON.stringify(story.additionalSources) : ''),
      story.echoCount || 0,
      this.escapeCSVField(story.socialMentions),
      story.createdAt.toISOString()
    ].join(','));

    await fs.writeFile(this.storiesFile, header + rows.join('\n'));
  }

  private async saveSocialPostsCSV(): Promise<void> {
    const header = 'id,storyId,platform,content,status,postId,createdAt\n';
    const rows = this.data.socialPosts.map(post => [
      post.id,
      post.storyId,
      post.platform,
      this.escapeCSVField(post.content),
      post.status,
      this.escapeCSVField(post.postId),
      post.createdAt.toISOString()
    ].join(','));

    await fs.writeFile(this.socialPostsFile, header + rows.join('\n'));
  }

  private async saveApiUsageCSV(): Promise<void> {
    const header = 'id,date,newsApiCalls,anthropicApiCalls,createdAt,updatedAt\n';
    const rows = this.data.apiUsage.map(usage => [
      usage.id,
      usage.date,
      usage.newsApiCalls,
      usage.anthropicApiCalls,
      usage.createdAt.toISOString(),
      usage.updatedAt.toISOString()
    ].join(','));

    await fs.writeFile(this.apiUsageFile, header + rows.join('\n'));
  }

  // Story operations
  async getStories(category?: StoryCategory, limit: number = 50): Promise<Story[]> {
    let filteredStories = this.data.stories;
    
    if (category && category !== 'general') {
      filteredStories = filteredStories.filter(story => story.category === category);
    }
    
    return filteredStories
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    return this.data.stories.find(story => story.id === id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const story: Story = {
      id: this.currentStoryId++,
      ...insertStory,
      publishedAt: insertStory.publishedAt || new Date(),
      createdAt: new Date()
    };

    this.data.stories.push(story);
    await this.saveStoriesCSV();
    return story;
  }

  async updateStory(id: number, updates: Partial<InsertStory>): Promise<Story | undefined> {
    const storyIndex = this.data.stories.findIndex(story => story.id === id);
    if (storyIndex === -1) return undefined;

    this.data.stories[storyIndex] = { ...this.data.stories[storyIndex], ...updates };
    await this.saveStoriesCSV();
    return this.data.stories[storyIndex];
  }

  async clearOldStories(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    this.data.stories = this.data.stories.filter(story => story.createdAt > oneWeekAgo);
    await this.saveStoriesCSV();
  }

  async checkDuplicateStory(titleHash: string): Promise<Story | undefined> {
    return this.data.stories.find(story => story.titleHash === titleHash);
  }

  async updateStoryEchoes(id: number, echoCount: number, socialMentions: string): Promise<void> {
    const storyIndex = this.data.stories.findIndex(story => story.id === id);
    if (storyIndex !== -1) {
      this.data.stories[storyIndex].echoCount = echoCount;
      this.data.stories[storyIndex].socialMentions = socialMentions;
      await this.saveStoriesCSV();
    }
  }

  // Social post operations
  async createSocialPost(insertPost: InsertSocialPost): Promise<SocialPost> {
    const post: SocialPost = {
      id: this.currentSocialPostId++,
      ...insertPost,
      createdAt: new Date()
    };

    this.data.socialPosts.push(post);
    await this.saveSocialPostsCSV();
    return post;
  }

  async getSocialPostsByStory(storyId: number): Promise<SocialPost[]> {
    return this.data.socialPosts.filter(post => post.storyId === storyId);
  }

  async updateSocialPostStatus(id: number, status: string, postId?: string): Promise<void> {
    const postIndex = this.data.socialPosts.findIndex(post => post.id === id);
    if (postIndex !== -1) {
      this.data.socialPosts[postIndex].status = status;
      if (postId) {
        this.data.socialPosts[postIndex].postId = postId;
      }
      await this.saveSocialPostsCSV();
    }
  }

  // API usage operations
  async getTodayApiUsage(): Promise<ApiUsage | undefined> {
    const today = new Date().toISOString().split('T')[0];
    return this.data.apiUsage.find(usage => usage.date === today);
  }

  async incrementNewsApiCalls(count: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    let usage = this.data.apiUsage.find(u => u.date === today);
    
    if (!usage) {
      usage = await this.createApiUsageRecord(today);
    }
    
    usage.newsApiCalls += count;
    usage.updatedAt = new Date();
    await this.saveApiUsageCSV();
  }

  async incrementAnthropicApiCalls(count: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    let usage = this.data.apiUsage.find(u => u.date === today);
    
    if (!usage) {
      usage = await this.createApiUsageRecord(today);
    }
    
    usage.anthropicApiCalls += count;
    usage.updatedAt = new Date();
    await this.saveApiUsageCSV();
  }

  async createApiUsageRecord(date: string): Promise<ApiUsage> {
    const usage: ApiUsage = {
      id: this.currentApiUsageId++,
      date,
      newsApiCalls: 0,
      anthropicApiCalls: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.data.apiUsage.push(usage);
    await this.saveApiUsageCSV();
    return usage;
  }
}