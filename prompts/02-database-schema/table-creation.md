# Database Schema Design

**Date**: August 14, 2025
**AI**: Claude (Anthropic)

## Original Prompt
"✅ Dev server working ✅ Database table created"

## AI Response Summary
Claude provided SQL commands to create the todos table with proper constraints and data types. Emphasized:
- Field validation at database level
- Proper data types for each column
- Check constraints for data integrity
- Foreign key relationship to auth.users

## SQL Schema Generated
```sql
-- Create todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  description TEXT,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL
);