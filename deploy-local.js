#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Creating local deployment package...\n');

// Files to exclude from the package
const excludePatterns = [
  'node_modules',
  '.git',
  'dist',
  '.env',
  '*.log',
  '.DS_Store',
  'Thumbs.db',
  '.replit',
  'deploy-local.js'
];

// Create package directory
const packageDir = 'ai-news-aggregator-local';
if (fs.existsSync(packageDir)) {
  console.log('🗑️  Removing existing package directory...');
  fs.rmSync(packageDir, { recursive: true, force: true });
}

fs.mkdirSync(packageDir);
console.log('📁 Created package directory');

// Copy all necessary files
const copyFile = (src, dest) => {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
};

const copyDirectory = (src, dest, level = 0) => {
  if (level > 10) return; // Prevent infinite recursion
  
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    // Skip excluded patterns
    if (excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        return item.includes(pattern.replace('*', ''));
      }
      return item === pattern;
    })) {
      continue;
    }
    
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath, level + 1);
    } else {
      copyFile(srcPath, destPath);
    }
  }
};

console.log('📋 Copying project files...');
copyDirectory('.', packageDir);

// Create a simplified package.json for local deployment
const packageJson = {
  "name": "ai-news-aggregator",
  "version": "1.0.0",
  "description": "AI News Aggregator with Social Media Automation",
  "type": "module",
  "scripts": {
    "setup": "node setup.js",
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "postinstall": "node setup.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.37.0",
    "@hookform/resolvers": "^3.10.0",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.6",
    "@radix-ui/react-checkbox": "^1.1.7",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.2",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.1",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.5",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.0.0-alpha.29",
    "@tanstack/react-query": "^5.62.14",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "date-fns": "^4.1.0",
    "drizzle-kit": "^0.30.0",
    "drizzle-orm": "^0.39.3",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.5.2",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "framer-motion": "^11.15.0",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.468.0",
    "next-themes": "^0.4.4",
    "react": "^18.3.1",
    "react-day-picker": "^9.4.4",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.13.3",
    "tailwind-merge": "^2.5.5",
    "tailwindcss": "^3.4.16",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vaul": "^1.1.2",
    "vite": "^6.0.3",
    "wouter": "^3.3.5",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "esbuild": "^0.24.2",
    "postcss": "^8.5.11"
  }
};

fs.writeFileSync(
  path.join(packageDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

console.log('✅ Package created successfully!');
console.log('\n📁 Package contents:');
console.log(`- ${packageDir}/`);
console.log('  ├── README.md (detailed setup guide)');
console.log('  ├── QUICK_START.md (5-minute setup)');
console.log('  ├── package.json (dependencies)');
console.log('  ├── setup.js (auto-setup script)');
console.log('  ├── .env.example (environment template)');
console.log('  ├── client/ (React frontend)');
console.log('  ├── server/ (Express backend)');
console.log('  └── shared/ (TypeScript types)');

console.log('\n🚀 To use the package:');
console.log(`1. Copy the "${packageDir}" folder to your local machine`);
console.log(`2. cd ${packageDir}`);
console.log('3. npm install');
console.log('4. Edit .env with your API keys');
console.log('5. npm run dev');
console.log('6. Open http://localhost:5000');

console.log('\n📦 Ready for deployment!');