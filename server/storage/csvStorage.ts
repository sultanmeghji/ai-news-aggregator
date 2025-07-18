import { promises as fs } from 'fs';
import { join } from 'path';
import { Story, ApiUsage, InsertStory, InsertApiUsage } from '@shared/schema';
import { IStorage } from '../storage';

interface CSVStorage {
  stories: Story[];
  apiUsage: ApiUsage[];
}

export class CSVStorageService implements IStorage {
  private dataPath: string;
  private storiesFile: string;
  private apiUsageFile: string;
  private data: CSVStorage;
  private currentStoryId: number = 1;
  private currentApiUsageId: number = 1;

  constructor(dataPath: string = './data') {
    this.dataPath = dataPath;
    this.storiesFile = join(dataPath, 'stories.csv');
    this.apiUsageFile = join(dataPath, 'api_usage.csv');
    this.data = { stories: [], apiUsage: [] };
  }

  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      await this.loadData();
    } catch (error) {
      console.error('Error initializing CSV storage:', error);
      throw error;
    }
  }

  private async loadData(): Promise<void> {
    try {
      // Load stories
      try {
        const storiesContent = await fs.readFile(this.storiesFile, 'utf-8');
        this.data.stories = this.parseStoriesCSV(storiesContent);
        this.currentStoryId = Math.max(...this.data.stories.map(s => s.id), 0) + 1;
      } catch (error) {
        await this.saveStoriesCSV();
      }

      // Load API usage
      try {
        const apiUsageContent = await fs.readFile(this.apiUsageFile, 'utf-8');
        this.data.apiUsage = this.parseApiUsageCSV(apiUsageContent);
        this.currentApiUsageId = Math.max(...this.data.apiUsage.map(u => u.id), 0) + 1;
      } catch (error) {
        await this.saveApiUsageCSV();
      }
    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  }

  private parseStoriesCSV(csv: string): Story[] {
    const lines = csv.trim().split('\n');
    if (lines.length <= 1) return [];

    return lines.slice(1).map(line => {
      const [id, title, description, url, sourceName, publishedAt, category, summary, characterCount, titleHash, additionalSources, echoCount, socialMentions, createdAt] = this.parseCSVLine(line);
      return {
        id: parseInt(id),
        title,
        description: description || undefined,
        url,
        sourceName,
        publishedAt: new Date(publishedAt),
        category: category as 'privacy' | 'financial' | 'healthcare' | 'general',
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
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private escapeCSV(value: string | null | undefined): string {
    if (!value) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private async saveStoriesCSV(): Promise<void> {
    const header = 'id,title,description,url,sourceName,publishedAt,category,summary,characterCount,titleHash,additionalSources,echoCount,socialMentions,createdAt\n';
    const rows = this.data.stories.map(story => {
      return [
        story.id,
        this.escapeCSV(story.title),
        this.escapeCSV(story.description),
        this.escapeCSV(story.url),
        this.escapeCSV(story.sourceName),
        story.publishedAt.toISOString(),
        story.category,
        this.escapeCSV(story.summary),
        story.characterCount,
        this.escapeCSV(story.titleHash),
        story.additionalSources ? this.escapeCSV(JSON.stringify(story.additionalSources)) : '',
        story.echoCount || 0,
        this.escapeCSV(story.socialMentions),
        story.createdAt.toISOString()
      ].join(',');
    }).join('\n');
    
    await fs.writeFile(this.storiesFile, header + rows);
  }

  private async saveApiUsageCSV(): Promise<void> {
    const header = 'id,date,newsApiCalls,anthropicApiCalls,createdAt,updatedAt\n';
    const rows = this.data.apiUsage.map(usage => {
      return [
        usage.id,
        usage.date,
        usage.newsApiCalls,
        usage.anthropicApiCalls,
        usage.createdAt.toISOString(),
        usage.updatedAt.toISOString()
      ].join(',');
    }).join('\n');
    
    await fs.writeFile(this.apiUsageFile, header + rows);
  }

  // Story operations
  async getStories(category?: 'privacy' | 'financial' | 'healthcare' | 'general', limit?: number): Promise<Story[]> {
    let stories = [...this.data.stories];
    
    if (category) {
      stories = stories.filter(s => s.category === category);
    }
    
    stories.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    
    if (limit) {
      stories = stories.slice(0, limit);
    }
    
    return stories;
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    return this.data.stories.find(s => s.id === id);
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
    const storyIndex = this.data.stories.findIndex(s => s.id === id);
    if (storyIndex === -1) return undefined;
    
    this.data.stories[storyIndex] = { ...this.data.stories[storyIndex], ...updates };
    await this.saveStoriesCSV();
    
    return this.data.stories[storyIndex];
  }

  async clearOldStories(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    this.data.stories = this.data.stories.filter(s => s.createdAt > oneWeekAgo);
    await this.saveStoriesCSV();
  }

  async checkDuplicateStory(titleHash: string): Promise<Story | undefined> {
    return this.data.stories.find(s => s.titleHash === titleHash);
  }

  async updateStoryEchoes(id: number, echoCount: number, socialMentions: string): Promise<void> {
    const story = this.data.stories.find(s => s.id === id);
    if (story) {
      story.echoCount = echoCount;
      story.socialMentions = socialMentions;
      await this.saveStoriesCSV();
    }
  }

  // API usage operations
  async getTodayApiUsage(): Promise<ApiUsage | undefined> {
    const today = new Date().toISOString().split('T')[0];
    return this.data.apiUsage.find(u => u.date === today);
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

export const csvStorage = new CSVStorageService();