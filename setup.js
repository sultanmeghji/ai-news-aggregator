#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AI News Aggregator...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created! Please edit it with your API keys.\n');
  } else {
    console.log('📝 Creating .env file...');
    const envContent = `# AI News Aggregator - Environment Variables
# Fill in your actual API keys below

# Required: News API (get from https://newsapi.org/)
NEWS_API_KEY=your_news_api_key_here

# Required: Anthropic Claude API (get from https://console.anthropic.com/)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Social Pilot API (get from https://app.socialpilot.co/api)
SOCIAL_PILOT_API_KEY=your_social_pilot_api_key_here

# Optional: Server configuration
PORT=5000
NODE_ENV=development`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created! Please edit it with your API keys.\n');
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Instructions
console.log('📋 Next steps:');
console.log('1. Edit the .env file with your API keys');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:5000\n');

console.log('🔑 API Keys needed:');
console.log('- News API: https://newsapi.org/');
console.log('- Anthropic Claude: https://console.anthropic.com/');
console.log('- Social Pilot (optional): https://app.socialpilot.co/api\n');

console.log('🎉 Setup complete! Happy news aggregating!');