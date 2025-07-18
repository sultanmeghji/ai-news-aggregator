# AI News Aggregator & Social Media Automation

A full-stack web application that aggregates AI-related news stories from various sources, generates engaging summaries using Anthropic Claude, and provides social media automation features through Social Pilot integration.

## Features

- **News Aggregation**: Fetches AI stories from trusted sources (TechCrunch, Wired, Reuters, etc.)
- **AI-Generated Summaries**: Uses Anthropic Claude to create engaging social media content
- **Color-Coded Categories**: Visual organization by AI topic (General AI, Financial Services, Healthcare)
- **Rate Limiting**: Respects API limits with 900 News API calls/day and 5 calls/minute
- **Social Media Integration**: One-click posting to Social Pilot for LinkedIn/Twitter distribution
- **Duplicate Detection**: Groups similar stories and displays multiple sources
- **Real-Time Monitoring**: API usage dashboard with live statistics

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **API Keys** (see Configuration section below)

## Installation

1. **Extract the project files** to your desired directory
2. **Navigate to the project directory** in your terminal/command prompt
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following API keys:

```env
# Required: News API (get from https://newsapi.org/)
NEWS_API_KEY=your_news_api_key_here

# Required: Anthropic Claude API (get from https://console.anthropic.com/)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Social Pilot API (get from https://app.socialpilot.co/api)
SOCIAL_PILOT_API_KEY=your_social_pilot_api_key_here
```

### Getting API Keys

1. **News API**:
   - Visit https://newsapi.org/
   - Sign up for a free account
   - Copy your API key from the dashboard

2. **Anthropic Claude API**:
   - Visit https://console.anthropic.com/
   - Create an account and add credits
   - Generate an API key in the API section

3. **Social Pilot API** (optional):
   - Visit https://app.socialpilot.co/
   - Go to Settings > API Access
   - Generate your API key

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The application will be available at:
- **Local**: http://localhost:5000
- **Network**: http://[your-ip]:5000

## Usage

1. **View Stories**: The dashboard displays AI news stories with color-coded categories
2. **Filter Content**: Use the filter buttons to view specific AI topics
3. **Copy Summaries**: Click "Copy Text" to copy AI-generated social media content
4. **Social Posting**: Click "Create Social Pilot Post" to post directly (requires Social Pilot API key)
5. **Monitor Usage**: Check the API Usage card for real-time statistics

## Color Coding

- **Blue**: General AI and privacy-related content
- **Red**: AI in Financial Services
- **Orange**: AI in Healthcare

## Rate Limits

- **News API**: 900 calls per day, 5 calls per minute
- **Anthropic API**: 1000 calls per day
- **Social Pilot API**: 500 calls per day

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities
├── server/               # Express backend
│   ├── services/         # API services
│   └── storage.ts        # Data storage
├── shared/               # Shared types/schemas
└── package.json          # Dependencies
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**:
   - Run `npm install` to ensure all dependencies are installed

2. **API rate limit errors (429)**:
   - Wait for the rate limit window to reset
   - Check your API usage in the dashboard

3. **Missing API keys**:
   - Verify your `.env` file is in the root directory
   - Ensure API keys are correctly formatted

4. **Port already in use**:
   - Change the port by setting `PORT=3000` in your `.env` file
   - Or kill the process using the port

### Environment Variables

You can customize the application with these environment variables in your `.env` file:

```env
PORT=5000                           # Server port (default: 5000)
NODE_ENV=development               # Environment mode
NEWS_API_KEY=your_key             # Required
ANTHROPIC_API_KEY=your_key        # Required
SOCIAL_PILOT_API_KEY=your_key     # Optional
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all API keys are valid and have sufficient credits
3. Check the console logs for detailed error messages

## License

This project is for educational and personal use.