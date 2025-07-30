# Vercel Deployment Guide

## Prerequisites
1. A Vercel account (free at vercel.com)
2. Your project pushed to GitHub
3. A Neon database (or any PostgreSQL database)

## Environment Variables to Set in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
DATABASE_URL=your_neon_database_url_here
SESSION_SECRET=your_session_secret_here
```

## Deployment Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Or deploy via CLI**:
   ```bash
   vercel
   ```

## Project Structure for Vercel

- `api/index.ts` - Serverless function for API routes
- `client/` - React frontend
- `server/` - Backend logic (used by API)
- `vercel.json` - Vercel configuration

## API Routes

All API routes will be available at `/api/*` and will be handled by the serverless function.

## Static Files

The React app will be served from the root path `/`.

## Database Setup

Make sure your Neon database is accessible from Vercel's servers. The connection string should be in the format:
```
postgresql://username:password@host:port/database
```

## Troubleshooting

1. **Build fails**: Check that all dependencies are in `package.json`
2. **API routes not working**: Verify `vercel.json` configuration
3. **Database connection issues**: Check `DATABASE_URL` environment variable
4. **Session issues**: Ensure `SESSION_SECRET` is set

## Local Development

For local development, use:
```bash
npm run dev
```

This will start both the frontend and backend on the same port. 