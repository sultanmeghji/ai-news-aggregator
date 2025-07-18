# Contributing to AI News Aggregator

We welcome contributions to the AI News Aggregator project! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Code Style Guidelines](#code-style-guidelines)

## Code of Conduct

This project adheres to a simple code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your changes

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/sultanmeghji/ai-news-aggregator.git
cd ai-news-aggregator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Required API Keys for Development
- **News API**: Free tier available at https://newsapi.org/
- **Anthropic Claude API**: Available at https://console.anthropic.com/
- **Social Pilot API**: Optional, get from https://app.socialpilot.co/api

## Making Changes

### Branch Naming
Use descriptive branch names:
- `feature/add-new-news-source`
- `fix/rate-limiting-bug`
- `docs/update-installation-guide`

### Commit Messages
Write clear, concise commit messages:
```
feat: add support for Reddit news source
fix: resolve rate limiting issue with News API
docs: update installation instructions
style: fix code formatting in storage.ts
```

### Testing Your Changes
1. Run the development server: `npm run dev`
2. Test all affected functionality
3. Verify the production build: `npm run build && npm start`
4. Check for TypeScript errors: `npx tsc --noEmit`

## Submitting Changes

1. **Create a Pull Request**
   - Push your changes to your fork
   - Create a pull request from your branch to the main repository
   - Fill out the pull request template

2. **PR Requirements**
   - Include a clear description of changes
   - Reference any related issues
   - Ensure all tests pass
   - Update documentation if needed

3. **Review Process**
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your changes will be merged

## Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**: Operating system, Node.js version, npm version
4. **Error Messages**: Full error messages or screenshots
5. **Configuration**: Relevant parts of your `.env` file (without API keys)

### Bug Report Template
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 10, macOS 12.1, Ubuntu 20.04]
- Node.js: [e.g., 18.15.0]
- npm: [e.g., 9.5.0]

## Additional Context
Any other relevant information
```

## Feature Requests

We welcome feature requests! Please include:

1. **Use Case**: Why is this feature needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other ways to achieve the same goal
4. **Additional Context**: Screenshots, examples, or related issues

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add type annotations where helpful

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use proper prop types
- Follow the existing component structure

### File Organization
```
client/src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── lib/           # Utility functions
└── hooks/         # Custom React hooks

server/
├── services/      # API service layers
├── storage/       # Data storage implementations
└── routes.ts      # API route handlers

shared/
└── schema.ts      # Shared TypeScript types
```

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Include error handling
- Validate input data with Zod schemas

### Database/Storage
- Use the storage interface pattern
- Keep storage operations atomic
- Handle errors gracefully
- Document any schema changes

## Development Tips

### Local Development
- Use `npm run dev` for hot reloading
- Check the console for errors
- Test API endpoints with curl or Postman
- Use browser dev tools for frontend debugging

### Common Issues
- **Port conflicts**: Change PORT in .env file
- **API rate limits**: Wait for limits to reset
- **Missing dependencies**: Run `npm install`
- **TypeScript errors**: Check types in shared/schema.ts

## Documentation

When making changes that affect users:
- Update README.md if needed
- Update QUICK_START.md for setup changes
- Add inline code comments for complex logic
- Update API documentation if adding endpoints

## Release Process

The project uses semantic versioning:
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

Releases are handled by maintainers, but contributors can:
- Suggest version bumps in PRs
- Update CHANGELOG.md with their changes
- Test release candidates

## Getting Help

If you need help with contributing:
- Check existing issues and discussions
- Review the README.md and documentation
- Ask questions in new issues with the "question" label
- Check the code for examples of similar implementations

## Recognition

All contributors will be recognized in the project. Significant contributions may be highlighted in release notes.

Thank you for contributing to AI News Aggregator!