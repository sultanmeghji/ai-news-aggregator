interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: {
      id: string | null;
      name: string;
    };
    author?: string;
    title: string;
    description?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    content?: string;
  }>;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  sourceName: string;
  publishedAt: Date;
  category: string;
  additionalSources?: Array<{name: string, url: string}>;
  echoCount?: number;
  socialMentions?: Array<{platform: string, count: number, urls: string[]}>;
}

export class NewsService {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';
  private dailyLimit = 900; // Rate limit: 900 calls per day
  private minuteLimit = 5; // Rate limit: 5 calls per minute
  private callTimestamps: number[] = []; // Track API call timestamps for rate limiting
  
  // High-reputation sources focused on tech and AI
  private trustedSources = [
    'techcrunch',
    'wired',
    'reuters',
    'the-verge',
    'bloomberg',
    'ars-technica',
    'engladget',
    'the-wall-street-journal',
    'financial-times',
    'cnn',
    'bbc-news'
  ];

  constructor(private storage?: import('../storage').IStorage) {
    this.apiKey = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || '';
    if (!this.apiKey) {
      throw new Error('News API key not found. Please set NEWS_API_KEY or NEWSAPI_KEY environment variable.');
    }
  }

  private async checkRateLimit(): Promise<boolean> {
    const now = Date.now();
    const oneMinuteAgo = now - (60 * 1000);
    
    // Remove timestamps older than 1 minute
    this.callTimestamps = this.callTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
    
    // Check if we're under the minute limit
    if (this.callTimestamps.length >= this.minuteLimit) {
      const oldestCall = Math.min(...this.callTimestamps);
      const waitTime = Math.ceil((oldestCall + (60 * 1000) - now) / 1000);
      console.warn(`News API rate limit reached (${this.callTimestamps.length}/${this.minuteLimit} calls per minute). Wait ${waitTime} seconds.`);
      return false;
    }
    
    return true;
  }

  private recordApiCall(): void {
    this.callTimestamps.push(Date.now());
  }

  // Generate a simple hash for title normalization and duplicate detection
  private generateTitleHash(title: string): string {
    // Normalize the title by removing punctuation, converting to lowercase, and removing extra spaces
    const normalized = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private async fetchSocialEchoes(title: string): Promise<{echoCount: number, socialMentions: Array<{platform: string, count: number, urls: string[]}>}> {
    // Simulate social media echo tracking (in real implementation, this would query Twitter API, LinkedIn API, etc.)
    const normalizedTitle = title.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const keyWords = normalizedTitle.split(' ').filter(word => word.length > 3);
    
    // Calculate echo count based on story relevance and keywords
    let echoCount = 0;
    const socialMentions: Array<{platform: string, count: number, urls: string[]}> = [];
    
    // AI and tech keywords typically get more social engagement
    const highEngagementKeywords = ['ai', 'artificial intelligence', 'chatgpt', 'openai', 'google', 'microsoft', 'apple', 'meta', 'tesla'];
    const hasHighEngagement = keyWords.some(word => 
      highEngagementKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))
    );
    
    if (hasHighEngagement) {
      echoCount = Math.floor(Math.random() * 50) + 10; // 10-60 echoes for high-engagement stories
      socialMentions.push(
        { platform: 'Twitter', count: Math.floor(echoCount * 0.6), urls: [] },
        { platform: 'LinkedIn', count: Math.floor(echoCount * 0.25), urls: [] },
        { platform: 'Reddit', count: Math.floor(echoCount * 0.15), urls: [] }
      );
    } else {
      echoCount = Math.floor(Math.random() * 15) + 2; // 2-17 echoes for regular stories
      socialMentions.push(
        { platform: 'Twitter', count: Math.floor(echoCount * 0.7), urls: [] },
        { platform: 'LinkedIn', count: Math.floor(echoCount * 0.3), urls: [] }
      );
    }
    
    return { echoCount, socialMentions };
  }

  async fetchAIStories(): Promise<NewsArticle[]> {
    // Check rate limit before making any API calls
    if (this.storage) {
      const usage = await this.storage.getTodayApiUsage();
      const currentCalls = usage?.newsApiCalls || 0;
      
      if (currentCalls >= this.dailyLimit) {
        console.warn(`Daily News API limit reached (${currentCalls}/${this.dailyLimit}). Skipping API calls.`);
        return [];
      }
      
      // Check if we have enough calls remaining for all queries
      const queries = [
        'artificial intelligence',
        'AI privacy',
        'AI financial services',
        'AI healthcare',  
        'machine learning',
        'AI regulation',
        'AI ethics'
      ];
      
      const remainingCalls = this.dailyLimit - currentCalls;
      if (remainingCalls < queries.length) {
        console.warn(`Not enough API calls remaining (${remainingCalls}/${queries.length} needed). Reducing queries.`);
        queries.splice(remainingCalls); // Limit queries to available calls
      }
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const queries = [
      'artificial intelligence',
      'AI privacy',
      'AI financial services',
      'AI healthcare',
      'machine learning',
      'AI regulation',
      'AI ethics'
    ];

    const allArticles: NewsArticle[] = [];

    let apiCallsMade = 0;
    
    for (const query of queries) {
      // Check minute-based rate limit before each call
      if (!(await this.checkRateLimit())) {
        console.warn(`Rate limit reached (${this.minuteLimit} calls/minute), skipping remaining queries. Processed ${apiCallsMade} calls.`);
        break;
      }

      try {
        const response = await fetch(
          `${this.baseUrl}/everything?` +
          `q=${encodeURIComponent(query)}&` +
          `sources=${this.trustedSources.join(',')}&` +
          `from=${oneWeekAgo.toISOString()}&` +
          `sortBy=publishedAt&` +
          `pageSize=20&` +
          `apiKey=${this.apiKey}`
        );

        // Increment API call counter and record timestamp
        apiCallsMade++;
        this.recordApiCall();
        
        if (!response.ok) {
          console.error(`News API error for query "${query}":`, response.status, response.statusText);
          
          // If we hit a rate limit, stop making further calls
          if (response.status === 429) {
            console.warn('News API rate limit hit, stopping further calls for this session');
            break;
          }
          continue;
        }

        const data: NewsAPIResponse = await response.json();
        
        if (data.status === 'ok' && data.articles) {
          const articles = await Promise.all(
            data.articles
              .filter(article => this.isAIRelated(article.title, article.description))
              .map(async article => {
                const { echoCount, socialMentions } = await this.fetchSocialEchoes(article.title);
                return {
                  title: article.title,
                  description: article.description || '',
                  url: article.url,
                  sourceName: article.source.name,
                  publishedAt: new Date(article.publishedAt),
                  category: this.categorizeStory(article.title, article.description),
                  echoCount,
                  socialMentions
                };
              })
          );
          
          allArticles.push(...articles);
        }

        // Add a delay between API calls to respect rate limits (12 seconds = 5 calls per minute)
        if (apiCallsMade < queries.length) {
          await new Promise(resolve => setTimeout(resolve, 12000));
        }
      } catch (error) {
        console.error(`Error fetching news for query "${query}":`, error);
        // Still count failed requests as API calls
        apiCallsMade++;
      }
    }

    // Update API usage counter
    if (this.storage && apiCallsMade > 0) {
      await this.storage.incrementNewsApiCalls(apiCallsMade);
      console.log(`Made ${apiCallsMade} News API calls. Total articles fetched: ${allArticles.length}`);
    }

    // Advanced deduplication: group similar stories by title similarity
    const deduplicatedArticles = this.deduplicateByTitleSimilarity(allArticles);

    // Sort by published date (newest first) and limit to top stories
    return deduplicatedArticles
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 25);
  }

  private deduplicateByTitleSimilarity(articles: NewsArticle[]): NewsArticle[] {
    const groups: NewsArticle[][] = [];
    
    for (const article of articles) {
      let foundGroup = false;
      
      for (const group of groups) {
        const representative = group[0];
        if (this.areTitlesSimilar(article.title, representative.title)) {
          // Add as additional source to existing story
          if (!representative.additionalSources) {
            representative.additionalSources = [{
              name: representative.sourceName,
              url: representative.url
            }];
          }
          representative.additionalSources.push({
            name: article.sourceName,
            url: article.url
          });
          foundGroup = true;
          break;
        }
      }
      
      if (!foundGroup) {
        groups.push([article]);
      }
    }
    
    // Return the representative article from each group
    return groups.map(group => group[0]);
  }

  private areTitlesSimilar(title1: string, title2: string): boolean {
    // Normalize titles for comparison
    const normalize = (str: string) => 
      str.toLowerCase()
         .replace(/[^\w\s]/g, '')
         .replace(/\s+/g, ' ')
         .trim();
    
    const norm1 = normalize(title1);
    const norm2 = normalize(title2);
    
    // Check for exact match after normalization
    if (norm1 === norm2) return true;
    
    // Check for substantial overlap in words
    const words1 = norm1.split(' ').filter(w => w.length > 3);
    const words2 = norm2.split(' ').filter(w => w.length > 3);
    
    if (words1.length === 0 || words2.length === 0) return false;
    
    const commonWords = words1.filter(word => words2.includes(word));
    const similarity = commonWords.length / Math.max(words1.length, words2.length);
    
    return similarity > 0.6; // 60% similarity threshold
  }

  private isAIRelated(title: string, description?: string): boolean {
    const aiKeywords = [
      'artificial intelligence', 'AI', 'machine learning', 'ML', 'neural network',
      'deep learning', 'chatbot', 'automation', 'algorithm', 'data science',
      'computer vision', 'natural language', 'GPT', 'OpenAI', 'ChatGPT',
      'LLM', 'large language model', 'generative AI'
    ];

    const text = `${title} ${description || ''}`.toLowerCase();
    return aiKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  private categorizeStory(title: string, description?: string): string {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    // Privacy keywords
    if (text.match(/privacy|data protection|gdpr|surveillance|encryption|security|personal data|biometric/)) {
      return 'privacy';
    }
    
    // Financial services keywords
    if (text.match(/bank|finance|fintech|trading|investment|payment|cryptocurrency|fraud detection|risk assessment/)) {
      return 'financial';
    }
    
    // Healthcare keywords
    if (text.match(/health|medical|hospital|patient|diagnosis|treatment|drug|pharmaceutical|clinical|telemedicine/)) {
      return 'healthcare';
    }
    
    return 'general';
  }

  async verifyUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
      return response.ok;
    } catch {
      return false;
    }
  }
}
