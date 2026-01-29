# PPanel - High Performance VPS Monitoring

PPanel is a modern, lightweight, and beautiful VPS status monitoring website built with Next.js, Prisma, and Tailwind CSS (MD3 Expressive Style).

## Features

- **User Authentication**: Secure registration and login system using NextAuth.js.
- **VPS Management**: Add multiple VPS instances and manage them from a single dashboard.
- **One-Click Deployment**: Automatically generated monitoring script for quick connection.
- **Real-time Monitoring**: Track CPU, Memory, Disk, and Network usage in real-time.
- **Visualization**: Beautiful charts and data dashboards using Recharts.
- **Historical Data**: Store and query performance metrics over time.
- **Alerting**: Automated notifications when resource usage exceeds thresholds.
- **Responsive Design**: MD3 Expressive style with full Dark Mode support.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4.0, Lucide Icons, Recharts.
- **Backend**: Next.js API Routes, NextAuth.js.
- **Database**: PostgreSQL (via Prisma ORM).
- **Style**: Material Design 3 (MD3) Expressive.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase, Neon, or local)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Copy `.env.example` to `.env` and fill in your database URL and NextAuth secret.
4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Run migrations:
   ```bash
   npx prisma db push
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add your environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) in the Vercel dashboard.
4. Add the Prisma build command in your `package.json`:
   ```json
   "postinstall": "prisma generate"
   ```
5. Deploy!

## License

MIT
