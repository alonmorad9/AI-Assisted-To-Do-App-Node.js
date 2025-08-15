# Row Level Security Implementation

**Date**: August 14, 2025
**AI**: Claude (Anthropic)

## Context
After creating the basic table structure, needed to implement security policies to ensure users only access their own data.

## AI-Generated RLS Policies
```sql
-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own todos
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);