# Vite + React + TypeScript Setup

**Date**: August 14, 2025
**AI**: Claude (Anthropic)

## Original Prompt
"lets change to option 2" (referring to simplified folder structure)

## AI Response Summary
Claude recommended switching from complex folder structure to a simpler, more appropriate structure for a todo app. Provided commands for:
- Creating Vite + React + TypeScript project
- Installing dependencies (Supabase, Tailwind)
- Setting up simplified folder structure
- Configuring environment variables

## Key Decisions Made
- **Folder Structure**: Switched to simpler option 2 (auth/, todos/, ui/ components)
- **Tech Stack**: React + TypeScript + Vite + Supabase + Tailwind
- **Architecture**: Frontend-only with Supabase RLS

## Commands Executed
```bash
npm create vite@latest ai-todo-app -- --template react-ts
cd ai-todo-app
npm install
npm install @supabase/supabase-js @types/node
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p