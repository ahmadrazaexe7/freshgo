# FreshGo Production Deployment Guide

This guide will help you deploy your FreshGo e-commerce application to production.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.production.local` (for local testing)
- [ ] Set up production database (Supabase, Railway, Neon, or self-hosted PostgreSQL)
- [ ] Generate a strong `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Set your WhatsApp order notification number

### 2. Database Setup
- [ ] Set up PostgreSQL database
- [ ] Run migrations: `npm run prisma:migrate`
- [ ] Seed initial data: `npm run seed`
- [ ] Test database connection

### 3. Code Quality
- [ ] Run `npm run lint` and fix any issues
- [ ] Run `npm run build` and ensure it completes successfully
- [ ] Test all critical user flows locally

### 4. Performance Optimizations
- [ ] Images are optimized (using Next.js Image component)
- [ ] Fonts are loaded efficiently
- [ ] CSS is minified
- [ ] JavaScript bundles are optimized

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all required variables from `.env.example`

5. **Configure Database**
   - Use Vercel's PostgreSQL integration or connect to external database
   - Update `DATABASE_URL` in environment variables

6. **Run Database Migrations**
   ```bash
   vercel env pull .env.production.local
   npm run prisma:migrate
   npm run seed
   ```

### Option 2: Railway

Railway offers easy deployment with built-in PostgreSQL.

#### Steps:
1. **Connect GitHub Repository**
   - Go to railway.app
   - Connect your GitHub account
   - Select your FreshGo repository

2. **Configure Build**
   - Railway will auto-detect Next.js
   - Build command: `npm run build`
   - Start command: `npm start`

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Set Additional Environment Variables**
   - Add `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `WHATSAPP_ORDER_NUMBER`

5. **Deploy**
   - Railway will automatically deploy on push to main branch

### Option 3: Self-Hosted (VPS)

For full control, deploy to a VPS like DigitalOcean, AWS, or Google Cloud.

#### Requirements:
- Node.js 18+
- PostgreSQL 13+
- PM2 or similar process manager
- Nginx (for reverse proxy)

#### Steps:

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/freshgo.git
   cd freshgo
   ```

2. **Install Dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Set up Database**
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

6. **Set up PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "freshgo" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Set up SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions (Automatic Deployments)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📊 Post-Deployment Tasks

### 1. Database Setup
```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data
npm run seed
```

### 2. Testing
- [ ] Test user registration/login
- [ ] Test product browsing and filtering
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test order placement
- [ ] Test admin dashboard
- [ ] Test on mobile devices

### 3. Monitoring Setup
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure log aggregation

### 4. Performance Monitoring
- [ ] Run Lighthouse audit
- [ ] Set up Core Web Vitals monitoring
- [ ] Configure CDN for static assets
- [ ] Set up image optimization

## 🔧 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build
```

### Database Connection Issues
- Check connection string format
- Ensure database is accessible from deployment environment
- Verify SSL requirements for production databases

### Environment Variables Not Loading
- Ensure variables are set in deployment platform
- Check for typos in variable names
- Restart deployment after adding new variables

## 📞 Support

If you encounter issues during deployment:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Prisma deployment guides](https://www.prisma.io/docs/guides/deployment)
3. Check application logs in your deployment platform
4. Search for similar issues in GitHub discussions

## 🎉 Go Live!

Once everything is tested and working:
1. Update DNS records to point to your deployment
2. Enable SSL certificate
3. Remove any maintenance pages
4. Announce your launch! 🚀

---

**Remember**: Always test in a staging environment before deploying to production!