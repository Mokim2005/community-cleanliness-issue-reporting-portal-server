# Vercel Deployment Guide for Clean City Server

## ⚠️ Important Pre-Deployment Checklist

### 1. ✅ Completed Changes (Already Applied)
- [x] Updated package.json with dev script
- [x] Fixed vercel.json configuration with proper build settings  
- [x] Made server support both Vercel serverless and local development
- [x] Added conditional server start (only runs in development)
- [x] Updated CORS origins to include Vercel domains
- [x] Added module.exports for Vercel serverless compatibility

### 2. 📋 Environment Variables Setup

On Vercel Dashboard, add these environment variables:

```
DB_USERNAME=clean-city-10
DB_USERPASS=781OJKHoLJTpFQO0
NODE_ENV=production
```

### 3. 🚀 Deployment Steps

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Login to Vercel**: https://vercel.com
2. **Create New Project** → Import your Git repository
3. **Configure Project**:
   - Framework: Node.js
   - Root Directory: / (root)
   - Build Command: `npm install`
   - Output Directory: (leave empty for serverless)
   - Development Command: `npm run dev`

4. **Add Environment Variables** (in Vercel dashboard):
   - DB_USERNAME = clean-city-10
   - DB_USERPASS = 781OJKHoLJTpFQO0

5. **Deploy!**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel

# Add environment variables
vercel env add DB_USERNAME
vercel env add DB_USERPASS

# Deploy to production
vercel --prod
```

### 4. 🔧 Post-Deployment Configuration

After deployment, you need to:

1. **Update CORS Origins** in index.js:
   - Add your actual Vercel domain (e.g., `https://your-project.vercel.app`)
   - This is critical for frontend to connect!

2. **Update Frontend URLs**:
   - Change API base URL from `http://localhost:3000` to your Vercel domain
   - Example: `https://clean-city-server-10.vercel.app`

3. **Test All Endpoints**:
   ```bash
   # Test root
   curl https://your-domain.vercel.app/
   
   # Test issues endpoint
   curl https://your-domain.vercel.app/issues
   
   # Test user endpoint
   curl https://your-domain.vercel.app/user
   ```

### 5. 📊 Monitoring

- **Vercel Dashboard**: View logs and deployments
- **MongoDB Atlas**: Monitor database connections
- **Vercel Analytics**: Track performance and errors

### 6. 🔄 Update & Redeploy

```bash
# Make changes
git add .
git commit -m "Update something"
git push

# Auto-deployment happens via GitHub integration
# Or manually:
vercel --prod
```

### 7. ⚠️ Known Issues & Solutions

**Issue**: CORS errors from frontend
**Solution**: Add your Vercel domain to CORS origins in index.js

**Issue**: MongoDB connection timeout
**Solution**: Whitelist Vercel IPs in MongoDB Atlas Network Access

**Issue**: Environment variables not loading
**Solution**: Redeploy after adding env vars in Vercel dashboard

### 8. 🌐 Current Configuration

- **MongoDB URI**: `cluster0.ekpzegp.mongodb.net`
- **Database**: `Clean-city_db`
- **Collections**: `issues`, `contribution`, `user`
- **Port**: 3000 (or process.env.PORT)
- **CORS**: Configured for Netlify frontend and localhost

### 💡 Tips

- Vercel free tier includes 100GB bandwidth/month
- Serverless functions may have cold starts
- Use Vercel's preview deployments for testing PRs
- Set up GitHub auto-deployment for seamless updates

## 🎉 Ready to Deploy!

Your server is now Vercel-ready! Just follow the steps above and you'll have a production-ready API server.

Need help? Check Vercel docs: https://vercel.com/docs
