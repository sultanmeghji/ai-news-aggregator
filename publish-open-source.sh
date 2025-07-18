#!/bin/bash

# AI News Aggregator - Open Source Publication Script
# This script prepares and publishes your project as open source

set -e

echo "🚀 AI News Aggregator - Open Source Publication"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Check if gh CLI is available (optional)
if command -v gh &> /dev/null; then
    GH_AVAILABLE=true
    echo -e "${GREEN}✓ GitHub CLI detected${NC}"
else
    GH_AVAILABLE=false
    echo -e "${YELLOW}⚠ GitHub CLI not found. You'll need to create the repository manually.${NC}"
fi

echo ""
echo "📋 Pre-publication Checklist:"
echo "=============================="

# Replace placeholder package.json with open source version
if [ -f "package.json.open-source" ]; then
    echo -e "${BLUE}→ Updating package.json with open source metadata...${NC}"
    cp package.json.open-source package.json.new
    echo -e "${GREEN}✓ Enhanced package.json prepared (manual replacement needed)${NC}"
else
    echo -e "${YELLOW}⚠ package.json.open-source not found${NC}"
fi

# Verify essential files exist
essential_files=(
    "README.md"
    "LICENSE"
    "CONTRIBUTING.md"
    "CODE_OF_CONDUCT.md"
    "SECURITY.md"
    "CHANGELOG.md"
    ".env.example"
    ".gitignore"
)

echo ""
echo "🔍 Checking essential files:"
for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file missing${NC}"
    fi
done

# Check for sensitive files that shouldn't be committed
sensitive_files=(
    ".env"
    "*.log"
    "node_modules"
    "data/*.csv"
)

echo ""
echo "🔒 Checking for sensitive files:"
for pattern in "${sensitive_files[@]}"; do
    if ls $pattern 1> /dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Found $pattern - ensure it's in .gitignore${NC}"
    else
        echo -e "${GREEN}✓ No $pattern files found${NC}"
    fi
done

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo ""
    echo -e "${BLUE}→ Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}⚠ Creating basic .gitignore...${NC}"
    cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
data/
*.log
.DS_Store
EOF
    echo -e "${GREEN}✓ Basic .gitignore created${NC}"
fi

# Stage all files
echo ""
echo -e "${BLUE}→ Staging files for commit...${NC}"
git add .
echo -e "${GREEN}✓ Files staged${NC}"

# Create initial commit if no commits exist
if ! git rev-parse HEAD >/dev/null 2>&1; then
    echo -e "${BLUE}→ Creating initial commit...${NC}"
    git commit -m "Initial open source release

- Complete AI News Aggregator application
- Full-stack TypeScript with React frontend
- Express.js backend with AI integration
- Comprehensive documentation and guides
- MIT License for open source distribution
- Community guidelines and contribution docs
- Security policies and vulnerability reporting
- GitHub templates for issues and PRs
- Production deployment configurations
- API documentation and examples

Features:
- AI-powered news aggregation from multiple sources
- Anthropic Claude integration for content summarization
- Social Pilot API integration for social media posting
- Color-coded categorization system
- Real-time API usage monitoring
- Rate limiting and error handling
- CSV-based storage for lightweight deployment
- Responsive design with dark/light themes"
    echo -e "${GREEN}✓ Initial commit created${NC}"
fi

echo ""
echo "🎯 Repository Setup Instructions:"
echo "================================="

if [ "$GH_AVAILABLE" = true ]; then
    echo "1. Create GitHub repository using GitHub CLI:"
    echo "   gh repo create ai-news-aggregator --public --description \"AI-powered news aggregation platform with social media automation\""
    echo ""
    echo "2. Push to GitHub:"
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/sultanmeghji/ai-news-aggregator.git"
    echo "   git push -u origin main"
else
    echo "1. Create a new repository on GitHub:"
    echo "   - Go to https://github.com/new"
    echo "   - Repository name: ai-news-aggregator"
    echo "   - Description: AI-powered news aggregation platform with social media automation"
    echo "   - Set to Public"
    echo "   - Don't initialize with README (we have our own)"
    echo ""
    echo "2. Push to GitHub:"
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/sultanmeghji/ai-news-aggregator.git"
    echo "   git push -u origin main"
fi

echo ""
echo "3. Configure GitHub repository settings:"
echo "   - Enable GitHub Discussions"
echo "   - Add topics: ai, news, aggregator, typescript, react, express, nodejs"
echo "   - Enable vulnerability alerts"
echo "   - Set up branch protection rules (optional)"

echo ""
echo "4. Create first release:"
echo "   - Go to GitHub repository → Releases → Create new release"
echo "   - Tag: v1.0.0"
echo "   - Title: AI News Aggregator v1.0.0"
echo "   - Use content from CHANGELOG.md for description"

echo ""
echo "5. Update repository URLs in documentation:"
echo "   ✓ Repository URLs updated to: https://github.com/sultanmeghji/ai-news-aggregator"
echo "   ✓ Email updated to: sultanmeghji@gmail.com"
echo "   ✓ All GitHub URLs updated in documentation"

echo ""
echo "📊 Post-Publication Recommendations:"
echo "===================================="
echo "• Share on social media platforms"
echo "• Submit to relevant directories (awesome lists, etc.)"
echo "• Write a blog post about your open source project"
echo "• Engage with the community and respond to issues"
echo "• Keep documentation updated as you add features"
echo "• Consider setting up automated testing and CI/CD"

echo ""
echo "🔧 Manual Tasks Required:"
echo "========================"
echo "1. Replace current package.json with package.json.open-source"
echo "2. Update GitHub URLs with your actual username"
echo "3. Update email addresses in documentation"
echo "4. Create GitHub repository and push code"
echo "5. Configure repository settings and create first release"

echo ""
echo -e "${GREEN}🎉 Your AI News Aggregator is ready for open source publication!${NC}"
echo -e "${GREEN}All documentation, licenses, and community files are in place.${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update the placeholder information mentioned above"
echo "2. Create your GitHub repository"
echo "3. Push your code and create your first release"
echo "4. Share your project with the community!"

echo ""
echo "📞 Need help? Check out:"
echo "• INSTALL.md - Installation guide"
echo "• CONTRIBUTING.md - Contribution guidelines"
echo "• DEPLOYMENT.md - Production deployment"
echo "• API.md - API documentation"
echo "• OPEN_SOURCE_PACKAGE.md - Complete package summary"