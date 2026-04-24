# Skill Registry — citronela

## Project Skills

| Skill | Trigger | Path |
|-------|---------|------|
| neon-postgres | Neon DB, Drizzle ORM, database operations | .claude/skills/neon-postgres/SKILL.md |

## Project Conventions

| File | Purpose |
|------|---------|
| CLAUDE.md | Global user instructions (personality, rules, tools) |

## Compact Rules

### neon-postgres
- Use `@neondatabase/serverless` with `drizzle-orm/neon-http`
- Schema in `db/schema.ts`, connection in `lib/db.ts`
- Always use parameterized queries via Drizzle
- Neon free tier: 0.5 GiB storage, autosuspend after 5min inactivity
