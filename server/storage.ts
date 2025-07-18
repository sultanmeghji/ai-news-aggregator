import { type Story, type InsertStory, type ApiUsage, type InsertApiUsage, type StoryCategory } from "@shared/schema";
import { CSVStorageService } from "./storage/csvStorage";

export interface IStorage {
  // Story operations
  getStories(category?: StoryCategory, limit?: number): Promise<Story[]>;
  getStoryById(id: number): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, updates: Partial<InsertStory>): Promise<Story | undefined>;
  clearOldStories(): Promise<void>;
  checkDuplicateStory(titleHash: string): Promise<Story | undefined>;
  updateStoryEchoes(id: number, echoCount: number, socialMentions: string): Promise<void>;
  

  
  // API usage operations
  getTodayApiUsage(): Promise<ApiUsage | undefined>;
  incrementNewsApiCalls(count: number): Promise<void>;
  incrementAnthropicApiCalls(count: number): Promise<void>;
  createApiUsageRecord(date: string): Promise<ApiUsage>;
}

// Initialize CSV storage
const csvStorage = new CSVStorageService();
csvStorage.initialize().catch(console.error);

export const storage = csvStorage;