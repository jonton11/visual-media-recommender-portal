# Visual Media Recommender Portal


## Problem
Streaming services are scaling back to the cable product and the number 
of subscriptions is out of hand. This portal serves as a log of shows 
watched and adds recommendations of what to check out next.

## Solution
A modern web application that helps you track your watched shows and discover new content through AI-powered recommendations. Built to address the growing complexity of managing multiple streaming service subscriptions.

## Features

- 📺 Track shows and movies you've watched
- 🤖 Get AI-powered recommendations based on your viewing history
- 🌙 Dark mode support
- 📱 Responsive design
- 💾 Local storage persistence

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: OpenAI GPT-4
- **Form Validation**: Zod
- **Theme Management**: next-themes

## Project Structure

```
src/
├── app/                   # Next.js app router files
│   ├── api/              # API routes
│   └── page.tsx          # Main application page
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── sidebar.tsx      # Watch history sidebar
└── lib/                 # Utility functions
```

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and add your OpenAI API key
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the development server:
   ```bash
   bun dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for recommendation generation

## Development

This project uses:
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for UI components
- Zod for input validation
- next-themes for dark mode support
