# Render Deployment Guide

## Prerequisites
1. A Render account (free at render.com)
2. Your project pushed to GitHub
3. A Neon database (or any PostgreSQL database)

## Environment Variables to Set in Render

Go to your Render service settings → Environment and add:

```
NODE_ENV=production
DATABASE_URL=your_neon_database_url_here
SESSION_SECRET=your_session_secret_here
```

## Deployment Steps

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Go to Render Dashboard**:
   - Visit [render.com](https://render.com)
   - Sign in or create an account

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `the-recruiters-club`

3. **Configure the Service**:
   - **Name**: `the-recruiters-club` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose "Free" for testing, "Starter" for production

4. **Set Environment Variables**:
   - Click "Environment" tab
   - Add the following variables:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: Your Neon database connection string
     - `SESSION_SECRET`: A random string (generate with `openssl rand -base64 32`)

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Option 2: Deploy via render.yaml (Blueprints)

1. **Push your code to GitHub** (if not already done)

2. **Use Blueprint**:
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and configure the service

## Project Structure for Render

- `server/index.ts` - Main Express server
- `client/` - React frontend
- `api/` - API routes (handled by server)
- `render.yaml` - Render configuration
- `package.json` - Dependencies and scripts

## Build Process

1. **Install Dependencies**: `npm install`
2. **Build Client**: `vite build` (creates `dist/public/`)
3. **Build Server**: `esbuild server/index.ts` (creates `dist/index.js`)
4. **Start Server**: `node dist/index.js`

## Static File Serving

The server automatically serves the built React app from `dist/public/` in production.

## Database Setup

Make sure your Neon database is accessible from Render's servers. The connection string should be in the format:
```
postgresql://username:password@host:port/database
```

## Health Check

The application includes a health check at the root path `/` that Render will use to verify the service is running.

## Troubleshooting

### Common Issues:

1. **Build fails**:
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility (18+)

2. **Database connection issues**:
   - Check `DATABASE_URL` environment variable
   - Ensure database is accessible from Render's IP ranges

3. **Static files not loading**:
   - Verify build completed successfully
   - Check that `dist/public/` directory exists

4. **Port issues**:
   - Render automatically sets `PORT` environment variable
   - Server listens on `0.0.0.0` to accept external connections

### Logs and Debugging:

- View logs in Render Dashboard → Your Service → Logs
- Check build logs for any compilation errors
- Monitor runtime logs for application errors

## Scaling

- **Free Plan**: 750 hours/month, sleeps after 15 minutes of inactivity
- **Starter Plan**: $7/month, always on, 512MB RAM, shared CPU
- **Standard Plan**: $25/month, always on, 1GB RAM, dedicated CPU

## Custom Domain

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain and configure DNS

## Local Development

For local development, use:
```bash
npm run dev
```

This will start both the frontend and backend on the same port with hot reloading.

## Monitoring

- **Uptime**: Monitor service availability
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and response time metrics
