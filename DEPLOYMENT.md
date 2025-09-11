# 🚀 Deployment Guide

This guide covers different deployment options for the Audio Video Separator application.

## Quick Deploy Options

### 1. Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/audio-video-separator)

1. **Connect to GitHub**
   - Fork the repository to your GitHub account
   - Connect your Vercel account to GitHub

2. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository

3. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_APP_NAME=Audio Video Separator
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   MAX_FILE_SIZE=104857600
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

### 2. Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/audio-video-separator)

1. **Connect Repository**
2. **Build Settings**
   - Build command: `pnpm build`
   - Publish directory: `.next`
3. **Environment Variables** (same as Vercel)
4. **Deploy**

## Self-Hosting Options

### Docker Deployment

#### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/audio-video-separator.git
   cd audio-video-separator
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Open http://localhost:3000

#### Option 2: Docker only

1. **Build the image**
   ```bash
   docker build -t audio-video-separator .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -v uploads:/app/uploads \
     -v outputs:/app/outputs \
     -e NODE_ENV=production \
     audio-video-separator
   ```

### Traditional VPS/Server Deployment

#### Requirements
- Node.js 18+ 
- npm/pnpm
- PM2 (for process management)
- Nginx (optional, for reverse proxy)

#### Setup Steps

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/audio-video-separator.git
   cd audio-video-separator
   pnpm install --prod
   ```

2. **Build the application**
   ```bash
   pnpm build
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

4. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "audio-separator" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Railway Deployment

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Settings**
   - Build Command: `pnpm build`
   - Start Command: `pnpm start`

3. **Add Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy**

### Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Configure environment**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MAX_FILE_SIZE=104857600
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Production AI Integration

### Spleeter Setup

1. **Install Python dependencies**
   ```bash
   pip install spleeter tensorflow
   ```

2. **Configure environment**
   ```env
   SPLEETER_MODEL=spleeter:2stems-16kHz
   PYTHON_PATH=/usr/bin/python3
   ```

3. **Update processing logic** in `src/lib/audio-processor.ts`

### Cloud AI Services

#### Option 1: Replicate API
```env
REPLICATE_API_TOKEN=your_token_here
```

#### Option 2: LALAL.AI API
```env
LALAL_API_KEY=your_key_here
```

#### Option 3: OpenAI API
```env
OPENAI_API_KEY=your_key_here
```

## Cloud Storage Integration

### AWS S3
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=audio-separator-files
```

### Google Cloud Storage
```env
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_KEYFILE=path/to/keyfile.json
GCS_BUCKET_NAME=audio-separator-files
```

## Database Setup (Optional)

### PostgreSQL
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createuser --interactive
sudo -u postgres createdb audioseparator
```

### Environment Configuration
```env
DATABASE_URL=postgresql://username:password@localhost:5432/audioseparator
```

## Monitoring & Analytics

### Health Check Endpoint
The application includes a health check at `/api/health`

### Logging
Configure logging level:
```env
LOG_LEVEL=info # debug, info, warn, error
```

### Analytics Integration
```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=your_mixpanel_token
```

## Security Configuration

### API Rate Limiting
```env
API_RATE_LIMIT=100
API_RATE_WINDOW=900000  # 15 minutes
```

### CORS Configuration
```env
CORS_ORIGIN=https://your-domain.com
```

### File Upload Security
```env
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_EXTENSIONS=mp3,mp4,wav,m4a,avi,mov
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB, Cloudflare)
- Separate processing workers
- Redis for job queues
- Shared storage (AWS S3, GCS)

### Performance Optimization
- Enable Next.js image optimization
- Use CDN for static assets
- Implement caching strategy
- Optimize Docker images

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   pnpm clean
   pnpm install
   pnpm build
   ```

2. **Memory Issues**
   - Increase Node.js memory limit
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm start
   ```

3. **File Upload Issues**
   - Check file size limits
   - Verify disk space
   - Check permissions

### Debug Mode
```env
NODE_ENV=development
DEBUG=audio-separator:*
```

## Backup Strategy

### Database Backup
```bash
pg_dump audioseparator > backup.sql
```

### File Backup
```bash
tar -czf uploads_backup.tar.gz uploads/
tar -czf outputs_backup.tar.gz outputs/
```

## Support

For deployment issues:
- Check the [Troubleshooting Guide](./docs/troubleshooting.md)
- Open an [Issue](https://github.com/yourusername/audio-video-separator/issues)
- Join our [Discord Community](https://discord.gg/audio-separator)