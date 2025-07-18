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
- **Data Storage**: CSV files for simple deployment without database dependencies
- **AI Integration**: Anthropic Claude for content generation
- **News Source**: News API for fetching articles from trusted sources
- **Social Media**: Direct Twitter and LinkedIn API integration

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



#### Data Management
- CSV file storage for simple deployment without database setup
- Stories stored in data/stories.csv with metadata and verification status
- API usage monitored in data/api_usage.csv for rate limiting

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
- **CSV Storage**: Local file-based data persistence

### Development Tools
- **Replit**: Cloud development environment
- **CSV Storage**: Simple file-based data persistence
- **TypeScript**: Type safety across full stack
- **ESBuild**: Fast production builds

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: ESBuild compiles TypeScript server to `dist/index.js`
- Data Storage: CSV files created automatically in `data/` directory

### Environment Configuration
- **Development**: `npm run dev` - TSX for hot reloading
- **Production**: `npm run start` - Compiled Node.js application
- **Data Storage**: Automatic CSV file initialization in `data/` directory

### Replit Configuration
- Auto-scaling deployment target
- No database dependencies for simple deployment
- Port 5000 for development, 80 for production
- Parallel workflow execution for optimal performance

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Open Source Preparation (2025-01-18)
- ✅ Created MIT License for open source distribution
- ✅ Added comprehensive Contributing Guidelines (CONTRIBUTING.md)
- ✅ Established Code of Conduct for community interactions
- ✅ Created Security Policy for vulnerability reporting
- ✅ Added detailed Changelog for version tracking
- ✅ Enhanced README with open source sections and badges
- ✅ Created comprehensive Installation Guide (INSTALL.md)
- ✅ Added API Documentation (API.md)
- ✅ Created Deployment Guide (DEPLOYMENT.md)
- ✅ Set up GitHub issue templates and PR templates
- ✅ Created proper .gitignore for open source projects
- ✅ Added comprehensive .env.example with detailed configuration
- ✅ Prepared enhanced package.json with open source metadata

### Open Source Components Created:
- **LICENSE**: MIT License for permissive open source use
- **CONTRIBUTING.md**: Complete contributor guidelines and development setup
- **CODE_OF_CONDUCT.md**: Community standards and behavioral expectations
- **SECURITY.md**: Security policy and vulnerability reporting process
- **CHANGELOG.md**: Version history and release notes
- **INSTALL.md**: Detailed installation instructions for all platforms
- **API.md**: Complete API documentation with examples
- **DEPLOYMENT.md**: Production deployment guide for various platforms
- **.env.example**: Comprehensive environment configuration template
- **GitHub Templates**: Issue templates, PR template, and community files
- **.gitignore**: Complete ignore patterns for development and deployment

### Project Status:
- 🚀 **Ready for Open Source**: All necessary documentation and policies in place
- 📋 **Community Ready**: Guidelines and templates for contributors
- 🔒 **Security Focused**: Proper security policies and best practices
- 📖 **Well Documented**: Comprehensive guides for users and developers
- 🛠️ **Developer Friendly**: Easy setup and contribution process

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
- June 25, 2025. Completely removed Social Pilot integration due to repeated API failures
- June 25, 2025. Replaced Social Pilot with direct Twitter and LinkedIn API posting for reliability
- June 25, 2025. Migrated from PostgreSQL database to CSV file storage for simpler deployment
- June 25, 2025. Removed all database dependencies - application now uses local CSV files in data/ directory
- June 25, 2025. Fixed port binding issues with ENOTSUP errors by improving server configuration and error handling
- June 26, 2025. Removed all social media posting functionality (LinkedIn, Twitter) as requested by user
- June 26, 2025. Completed social media removal - application now focuses purely on AI news aggregation with CSV storage
- July 2, 2025. Released v2.0 with enhanced error handling, increased story count (100 per fetch), better financial/healthcare filtering, and comprehensive story categorization
- July 2, 2025. Removed notification system as requested - application focuses purely on enhanced AI news aggregation