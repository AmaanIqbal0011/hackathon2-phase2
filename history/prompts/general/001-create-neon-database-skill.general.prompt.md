---
id: 001
title: create-neon-database-skill
stage: general
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Aman Iqbal
command: skill-creator
labels: ["skill", "database", "neon"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/neon-database-skill/SKILL.md
tests:
  - none
---

## Prompt

using skill-creator skill and write a skill.skill detail is ---
name: neon-database-skill
description: Create tables, migrations, and schema design for Neon Serverless PostgreSQL. Use for database setup and management.
---

# Neon Database Skill

## Instructions

1. **Schema Design**
   - Identify entities and relationships
   - Normalize data (aim for 3NF)
   - Define primary and foreign keys
   - Choose appropriate data types
   - Add constraints and indexes

2. **Table Creation**
   - Use proper naming conventions (snake_case)
   - Add id as primary key (SERIAL or UUID)
   - Include timestamps (created_at, updated_at)
   - Set NOT NULL where appropriate
   - Define foreign key relationships

3. **Migrations**
   - Create migration files with timestamps
   - Write both UP and DOWN migrations
   - Test migrations in development branch
   - Use transactions for atomic changes
   - Document breaking changes

4. **Neon-Specific Setup**
   - Configure connection pooling (PgBouncer)
   - Set up database branching for testing
   - Use connection strings from environment
   - Enable autoscaling if needed
   - Configure backup retention

## Best Practices

- Always use migrations (never manual SQL in production)
- Add indexes on foreign keys and frequently queried columns
- Use UUID for distributed systems, SERIAL for simpler apps
- Include created_at and updated_at on all tables
- Use ENUM types for fixed value sets
- Set ON DELETE CASCADE carefully (consider SET NULL)
- Use CHECK constraints for data validation
- Keep table names singular (user, post, not users, posts)
- Document complex relationships with comments
- Use connection pooling to avoid connection limits
- Test migrations on Neon branches before production

## Example Structure
```sql
-- Migration: 001_create_users_table.sql

-- UP Migration
CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_username ON user(username);

-- Add trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON user
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- DOWN Migration
DROP TRIGGER IF EXISTS update_user_updated_at ON user;
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP INDEX IF EXISTS idx_user_username;
DROP INDEX IF EXISTS idx_user_email;
DROP TABLE IF EXISTS user;
```
```sql
-- Migration: 002_create_posts_table.sql

-- UP Migration
CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_post_user_id ON post(user_id);
CREATE INDEX idx_post_slug ON post(slug);
CREATE INDEX idx_post_status ON post(status);
CREATE INDEX idx_post_published_at ON post(published_at DESC);

-- Auto-update trigger
CREATE TRIGGER update_post_updated_at
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- DOWN Migration
DROP TRIGGER IF EXISTS update_post_updated_at ON post;
DROP INDEX IF EXISTS idx_post_published_at;
DROP INDEX IF EXISTS idx_post_status;
DROP INDEX IF EXISTS idx_post_slug;
DROP INDEX IF EXISTS idx_post_user_id;
DROP TABLE IF EXISTS post;
```
```sql
-- Migration: 003_create_comments_table.sql

-- UP Migration
CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES post(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comment(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_comment_post_id ON comment(post_id);
CREATE INDEX idx_comment_user_id ON comment(user_id);
CREATE INDEX idx_comment_parent_id ON comment(parent_id);

-- Auto-update trigger
CREATE TRIGGER update_comment_updated_at
BEFORE UPDATE ON comment
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- DOWN Migration
DROP TRIGGER IF EXISTS update_comment_updated_at ON comment;
DROP INDEX IF EXISTS idx_comment_parent_id;
DROP INDEX IF EXISTS idx_comment_user_id;
DROP INDEX IF EXISTS idx_comment_post_id;
DROP TABLE IF EXISTS comment;
```

## Neon Connection Setup
```typescript
// lib/db.ts - Database connection with Neon
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Use connection pooling for better performance
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

export default pool;
```

## Common Patterns

- **One-to-Many**: user (1) → posts (many) - Foreign key in post table
- **Many-to-Many**: posts ↔ tags - Junction table (post_tag)
- **Self-Referencing**: comment.parent_id → comment.id - Threaded comments
- **Soft Delete**: Add deleted_at TIMESTAMP column instead of DELETE
- **Audit Trail**: Create separate audit table with triggers
- **Versioning**: Add version INTEGER column with optimistic locking

## Data Type Guidelines

- **IDs**: SERIAL (auto-increment) or UUID (distributed systems)
- **Strings**: VARCHAR(n) with reasonable limits, TEXT for unlimited
- **Numbers**: INTEGER, BIGINT, DECIMAL(precision, scale)
- **Booleans**: BOOLEAN (not TINYINT or CHAR)
- **Dates**: TIMESTAMP (with timezone), DATE (date only)
- **JSON**: JSONB (indexed) not JSON
- **Arrays**: TEXT[] or INTEGER[] when appropriate
- **Enums**: Use CHECK constraints or CREATE TYPE

## Migration Workflow

1. **Create Migration**: Generate timestamped file
2. **Write UP**: Add new schema changes
3. **Write DOWN**: Reverse all changes
4. **Test on Branch**: Use Neon branch for testing
5. **Review Changes**: Check for breaking changes
6. **Apply to Production**: Run migration with monitoring
7. **Verify**: Check data integrity and indexes

## Performance Tips

- Index foreign keys automatically
- Add composite indexes for multi-column queries
- Use EXPLAIN ANALYZE to check query plans
- Avoid SELECT * (specify columns)
- Use LIMIT for pagination
- Consider materialized views for complex queries
- Use connection pooling (built into Neon)
- Monitor slow query logs
- Leverage Neon's autoscaling for traffic spikes

## Response snapshot

Created .claude/skills/neon-database-skill/SKILL.md with provided content.

## Outcome

- ✅ Impact: Created new database skill
- 🧪 Tests: Verified file creation
- 📁 Files: SKILL.md
- 🔁 Next prompts: None
- 🧠 Reflection: Manual creation due to tool nature

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
