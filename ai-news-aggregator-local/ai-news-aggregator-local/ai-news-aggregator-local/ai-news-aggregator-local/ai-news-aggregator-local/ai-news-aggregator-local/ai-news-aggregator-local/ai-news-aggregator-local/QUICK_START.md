# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Node.js
Download and install Node.js (version 18+) from: https://nodejs.org/

### 2. Setup Project
```bash
# Extract the zip file and navigate to the folder
cd ai-news-aggregator

# Install dependencies
npm install

# Setup environment file (this runs automatically after install)
# Edit the .env file with your API keys
```

### 3. Get API Keys

**Required:**
- **News API**: Visit https://newsapi.org/ → Sign up → Copy API key
- **Anthropic Claude**: Visit https://console.anthropic.com/ → Create account → Generate API key

**Optional:**
- **Social Pilot**: Visit https://app.socialpilot.co/api → Generate API key

### 4. Configure API Keys
Edit the `.env` file that was created:
```
NEWS_API_KEY=your_actual_news_api_key
ANTHROPIC_API_KEY=your_actual_anthropic_key
SOCIAL_PILOT_API_KEY=your_social_pilot_key_optional
```

### 5. Run the Application
```bash
# Start in development mode
npm run dev

# Or build and run production
npm run build
npm start
```

### 6. Access the App
Open your browser to: **http://localhost:5000**

## Features Available

✅ **Color-coded AI news stories** (Blue: General AI, Red: Financial, Orange: Healthcare)  
✅ **AI-generated social media summaries** using Claude  
✅ **One-click Social Pilot posting** (with API key)  
✅ **Rate-limited API calls** (respects all API limits)  
✅ **Real-time usage monitoring** dashboard  
✅ **Duplicate story detection** with source grouping  

## Troubleshooting

**Port already in use?** Change PORT=3000 in .env file  
**API errors?** Check your API keys are valid and have credits  
**No stories showing?** Wait a moment for rate limits to reset  

For detailed setup information, see README.md