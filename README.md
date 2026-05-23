# KINREL Mirror

> Enterprise Architecture Sandbox — Deep Feature Mirror of DAXELO KINREL

Standalone Next.js 16 application mirroring the core architecture, design system, and API infrastructure of the DAXELO KINREL platform.

## Overview

KINREL Mirror is an independently runnable, deployable, and maintainable ecosystem that replicates the engineering quality and production architecture of the main DAXELO KINREL app — Indian Family Relationship Intelligence Platform.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Prisma ORM + SQLite
- **Auth**: NextAuth.js v4 (JWT + Google OAuth)
- **State**: Zustand + TanStack Query
- **Real-time**: Socket.io WebSocket
- **AI**: z-ai-web-dev-sdk

## Architecture Systems

| System | Status | Description |
|--------|--------|-------------|
| Authentication | ✅ Active | JWT + OAuth2 + Session Management |
| Kinship Engine | ✅ Active | 523 relationships across 13 languages |
| Family Tree Graph | ✅ Active | BFS path-finding + visualization |
| API Infrastructure | ✅ Active | Rate limiting + Idempotency + Scopes |
| Notification Engine | ✅ Active | Multi-channel delivery |
| Content Moderation | ✅ Active | AI classification + Appeals |
| Community & Social | ✅ Active | Posts + Events + Reactions |
| Support System | ✅ Active | SLA + CSAT + Knowledge Base |
| Developer API | ✅ Active | API Keys + Webhooks + Audit |
| WhatsApp Platform | ✅ Active | Templates + DPDP Act compliance |
| Design System | ✅ Active | Tokens + Dark-first + Festival themes |
| Data Layer | ✅ Active | Repository pattern + Caching |

## Getting Started

```bash
# Install dependencies
bun install

# Set up database
bun run db:push

# Start development server
bun run dev
```

## Project Structure

```
kinrel-mirror/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   │   ├── api/          # 80+ API endpoints
│   │   └── ...           # Dashboard, auth, settings pages
│   ├── components/       # React components
│   │   ├── brand/        # Kinrel brand components
│   │   ├── kinrel/       # Feature-specific components
│   │   └── ui/           # shadcn/ui components
│   └── lib/              # Core libraries & utilities
├── prisma/               # Database schema
├── public/               # Static assets & brand
└── skills/               # AI capabilities
```

## License

Proprietary — Daxelo
