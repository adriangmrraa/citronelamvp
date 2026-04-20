# Citronela MVP

Plataforma de gestión de cultivos hidropónicos y marketplace.

## Stack
- Next.js 14 (App Router)
- Drizzle ORM
- Neon PostgreSQL
- Tailwind CSS
- shadcn/ui

## Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=tu-secret-segura
```

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy en Vercel

1. Conectá el repo a Vercel
2. Configurá las Environment Variables en Project Settings
3. Listo!

## Estructura

```
app/
├── api/          # API routes
├── login/        # Auth pages
├── register/
├── dashboard/   # Protected area
db/
└── schema.ts    # Drizzle schema
lib/
├── db.ts        # Database connection
└── auth.ts      # Auth utilities
```