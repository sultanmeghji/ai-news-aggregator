# AI News Aggregator & Social Media Automation

## Overview

This is a full-stack web application that aggregates AI-related news stories from various sources, generates engaging summaries using Anthropic Claude, and provides social media automation features. The application fetches news from trusted sources, categorizes stories by industry (privacy, financial, healthcare, general), and allows users to share content to LinkedIn and Twitter/X with AI-generated engaging content.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o for content generation
- **News Source**: News API for fetching articles from trusted sources
- **Session Management**: Express sessions with PostgreSQL store

### Key Components

#### News Aggregation Service
- Fetches stories from trusted tech sources (TechCrunch, Wired, Reuters, etc.)
- Filters and categorizes content by industry relevance
- Removes duplicate stories and maintains data quality

#### AI Content Generation
- Uses Anthropic Claude (claude-sonnet-4-20250514) to generate engaging social media summaries
- Optimizes content for character limits (250-280 characters)
- Maintains professional tone while adding wit and relatability

#### Rate Limiting System
- Enforces 900 News API calls per day limit
- Tracks daily API usage in real-time
- Prevents excessive API costs and service interruptions
- Visual monitoring dashboard shows current usage statistics

#### Social Media Integration
- Social Pilot API integration for single-click posting to multiple platforms
- Supports LinkedIn, Twitter/X, and other social platforms through Social Pilot
- Automatically creates posts with AI-generated summaries
- Tracks post status and provides feedback on sharing success

#### Data Management
- PostgreSQL database with Drizzle ORM for type-safe queries
- Stories table with metadata (source, category, verification status)
- Social posts table tracking platform-specific sharing

## Data Flow

1. **News Ingestion**: Scheduled fetching from News API with trusted source filtering
2. **AI Processing**: Anthropic Claude generates engaging summaries for each story
3. **Categorization**: Stories are classified into industry categories
4. **User Interface**: React frontend displays filtered, paginated story feeds
5. **Social Sharing**: Users can share AI-generated content to social platforms
6. **Analytics**: Track sharing success and engagement metrics

## External Dependencies

### APIs and Services
- **News API**: Primary source for news articles
- **Anthropic API**: Claude for content generation
- **LinkedIn API**: Professional network integration
- **Twitter/X API**: Social media sharing
- **Neon Database**: PostgreSQL hosting (via @neondatabase/serverless)

### Development Tools
- **Replit**: Cloud development environment
- **Drizzle Kit**: Database migrations and schema management
- **TypeScript**: Type safety across full stack
- **ESBuild**: Fast production builds

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: ESBuild compiles TypeScript server to `dist/index.js`
- Database: Drizzle manages schema migrations

### Environment Configuration
- **Development**: `npm run dev` - TSX for hot reloading
- **Production**: `npm run start` - Compiled Node.js application
- **Database**: `npm run db:push` - Schema synchronization

### Replit Configuration
- Auto-scaling deployment target
- PostgreSQL-16 module for database
- Port 5000 for development, 80 for production
- Parallel workflow execution for optimal performance

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 22, 2025. Initial setup
- June 22, 2025. Switched AI service from OpenAI to Anthropic Claude (claude-sonnet-4-20250514) for generating engaging social media summaries
- June 22, 2025. Implemented rate limiting system for 900 News API calls per day with real-time monitoring dashboard
- June 22, 2025. Removed "humorous" terminology throughout application, replaced with "engaging" content
- June 22, 2025. Implemented Social Pilot API integration for single-click posting to multiple social platforms
- June 23, 2025. Added story memory system with PostgreSQL database for duplicate detection and visual indicators
- June 23, 2025. Implemented title hashing algorithm to track previously seen stories across multiple weeks
- June 23, 2025. Added visual duplicate indicators with amber warning icons showing when stories were first seen
- June 23, 2025. Fixed Social Pilot API authentication methods - requires valid API key from user's Social Pilot dashboard
- June 23, 2025. Added Social Pilot API test endpoint for connection verification and debugging