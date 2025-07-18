import { z } from "zod";

// Type definitions for CSV storage (no database tables needed)
export interface Story {
  id: number;
  title: string;
  description?: string;
  url: string;
  sourceName: string;
  publishedAt: Date;
  category: StoryCategory;
  summary?: string;
  characterCount: number;
  titleHash?: string;
  additionalSources?: Array<{name: string; url: string}> | null;
  echoCount?: number;
  socialMentions?: string;
  createdAt: Date;
}

export interface SocialPost {
  id: number;
  storyId: number;
  platform: SocialPlatform;
  content: string;
  postId?: string | null;
  createdAt: Date;
  status: string;
}

export interface ApiUsage {
  id: number;
  date: string;
  newsApiCalls: number;
  anthropicApiCalls: number;
  createdAt: Date;
  updatedAt: Date;
}

// Zod schemas for validation
export const insertStorySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  sourceName: z.string().min(1),
  publishedAt: z.date().optional(),
  category: z.enum(['privacy', 'financial', 'healthcare', 'general']),
  summary: z.string().optional(),
  characterCount: z.number().default(0),
  titleHash: z.string().optional(),
  additionalSources: z.array(z.object({
    name: z.string(),
    url: z.string().url()
  })).nullable().optional(),
  echoCount: z.number().optional(),
  socialMentions: z.string().optional(),
});

export const insertSocialPostSchema = z.object({
  storyId: z.number(),
  platform: z.enum(['linkedin', 'twitter']),
  content: z.string().min(1),
  status: z.string().default('pending'),
});

export const insertApiUsageSchema = z.object({
  date: z.string(),
  newsApiCalls: z.number().default(0),
  anthropicApiCalls: z.number().default(0),
});

export type InsertStory = z.infer<typeof insertStorySchema>;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;

// Utility types
export type StoryCategory = 'privacy' | 'financial' | 'healthcare' | 'general';
export type SocialPlatform = 'linkedin' | 'twitter';