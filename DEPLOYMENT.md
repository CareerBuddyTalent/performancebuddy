
# Vercel Deployment Guide

## Prerequisites
1. A Vercel account
2. Supabase project (already configured)
3. GitHub repository (recommended)

## Environment Variables Setup

In your Vercel dashboard, add these environment variables:

### Required Variables
```
VITE_SUPABASE_URL=https://eubxxtqbyrlivnenhyjk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Ynh4dHFieXJsaXZuZW5oeWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzMwMzgsImV4cCI6MjA2MDQwOTAzOH0.HtVG14DfSBuZ0dGjsJOHySluwJnCa9eVFx13mQ14ILg
```

### Optional Variables
```
VITE_APP_NAME=CareerBuddy
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_LOGS=false
```

## Deployment Steps

### Option 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push to main

### Option 2: Direct Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

## Supabase Configuration

After deployment, update your Supabase settings:

1. Go to your Supabase project → Authentication → URL Configuration
2. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

## Build Configuration

The project is configured with:
- React Router SPA routing via `vercel.json`
- Production optimizations in `vite.config.ts`
- Security headers for production
- Code splitting for better performance

## Verification Checklist

After deployment:
- [ ] All routes work correctly
- [ ] Authentication flows work
- [ ] Database connections work
- [ ] Edge functions are accessible
- [ ] No console errors in production

## Troubleshooting

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure Supabase URL configuration includes your Vercel domain
4. Check browser console for any errors
