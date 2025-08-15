# AI-Assisted Todo App - Project Plan
Project Overview
Building a full-stack Todo application using React + TypeScript + Vite frontend with Supabase for data/auth. Following the 7 Claude rules for simple, incremental development.
Tech Stack Decision

Frontend: React + TypeScript + Vite + Tailwind CSS
Database/Auth: Supabase (Postgres + Auth)
Backend: Frontend-only with Supabase RLS (simplest approach)
Deployment: Vercel (frontend)

# Todo Items
Stage 1 - Supabase Setup

 Create Supabase project and get API keys
 Note down project URL and anon key
 Set up database access

Stage 2 - Project Setup

 Create new Vite + React + TypeScript project
 Install and configure Tailwind CSS
 Set up simplified project structure (auth/, todos/, ui/ components)
 Install Supabase client library
 Set up environment variables
 Create basic project README
 Create /prompts/ folder for AI interactions

Stage 3 - Database Schema

 Design and create todos table in Supabase
 Set up Row Level Security (RLS) policies
 Test database connection from frontend

Stage 4 - Authentication

 Set up Supabase Auth configuration
 Create auth context/provider
 Create sign up/sign in components
 Add protected routes
 Test auth flow (signup, signin, signout)

Stage 5 - Core Todo CRUD

 Create Todo type definitions
 Build todo service functions (create, read, update, delete)
 Create TodoForm component for adding/editing
 Create TodoItem component for display
 Create TodoList component
 Implement basic todo operations

Stage 6 - Todo Features

 Add todo completion toggle
 Implement todo editing (inline or modal)
 Add todo deletion with confirmation
 Add due date picker
 Add priority selection (low/med/high)

Stage 7 - Filters & Views

 Create filter buttons (all, active, completed, due-today, priority)
 Implement filter logic
 Add todo counters for each filter
 Create bulk actions (toggle all, delete completed)

Stage 7 - Filters & Views

 Create filter buttons (all, active, completed, due-today, priority)
 Implement filter logic
 Add todo counters for each filter
 Create bulk actions (toggle all, delete completed)

Stage 8 - UX Polish

 Add loading states for all async operations
 Create empty states (no todos, no filtered results)
 Add error handling and user feedback
 Improve accessibility (ARIA labels, keyboard navigation)
 Make responsive for mobile

Stage 9 - Validation & Type Safety

 Install Zod library
 Create Zod validation schemas
 Implement client-side form validation
 Add input sanitization
 Ensure strict TypeScript (no any types)
 Add server-side validation