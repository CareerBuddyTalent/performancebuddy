
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

## Build Configuration

The project is now configured with:
- **esbuild minification** (no additional dependencies required)
- **Build-time safety checks** to prevent Supabase connections during build
- **React Router SPA routing** via `vercel.json`
- **Production optimizations** in `vite.config.ts`
- **Security headers** for production
- **Code splitting** for better performance

## Supabase Configuration

After deployment, update your Supabase settings:

1. Go to your Supabase project → Authentication → URL Configuration
2. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

## Troubleshooting Common Issues

### Build Errors

**Error: "terser not found"**
- Fixed in latest configuration by using esbuild instead of terser

**Error: "Failed to get database function names"**
- This was caused by Supabase connections during build time
- Fixed by implementing build-time detection and mock clients

**Error: Missing environment variables**
- Ensure all required VITE_ prefixed variables are set in Vercel dashboard
- Check that variable names match exactly (case-sensitive)

### Runtime Issues

**Authentication not working**
- Verify Supabase URL configuration includes your Vercel domain
- Check that environment variables are properly set in Vercel

**Database connections failing**
- Ensure Supabase project is accessible from your domain
- Verify RLS policies allow your application access

## Verification Checklist

After deployment:
- [ ] All routes work correctly
- [ ] Authentication flows work
- [ ] Database connections work
- [ ] No console errors in production
- [ ] Environment variables are properly loaded

## Performance Optimization

The build is optimized with:
- Code splitting for vendor libraries
- Optimized chunk sizes
- CSS code splitting
- Source maps only in development
- Minification with esbuild

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure Supabase URL configuration includes your Vercel domain
4. Check browser console for any errors
