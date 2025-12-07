# 🚀 ARZAQ Backend - Railway Deployment Guide

## 📋 Prerequisites

1. Railway account: https://railway.app
2. PostgreSQL database (Railway provides this)
3. Supabase project for OAuth (optional if only using email/password)
4. PayBox Kazakhstan merchant account

## 🔧 Step 1: Setup Railway Project

### 1.1 Create New Project
```bash
# Install Railway CLI (optional)
npm i -g @railway/cli
railway login
```

### 1.2 Create PostgreSQL Database
1. Go to Railway dashboard
2. Click "New Project"
3. Select "Provision PostgreSQL"
4. Copy the `DATABASE_URL` from the PostgreSQL service

## 🔐 Step 2: Configure Environment Variables

Add these variables in Railway project settings:

```bash
# Application
APP_NAME=ARZAQ Food Rescue API
VERSION=1.0.0
ENVIRONMENT=production

# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secret (generate with: openssl rand -hex 32)
SECRET_KEY=your-generated-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Supabase (for Google OAuth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Frontend URLs
FRONTEND_URL=https://your-frontend.vercel.app
FRONTEND_DEV_URL=http://localhost:5173

# PayBox Kazakhstan
PAYBOX_MERCHANT_ID=your-merchant-id
PAYBOX_SECRET_KEY=your-paybox-secret-key
PAYBOX_PAYMENT_URL=https://api.paybox.money/payment.php
PAYBOX_SUCCESS_URL=https://your-frontend.vercel.app/payment/success
PAYBOX_FAILURE_URL=https://your-frontend.vercel.app/payment/failure
PAYBOX_RESULT_URL=https://your-backend.railway.app/api/payments/callback

# Platform Settings
PLATFORM_FEE_PERCENTAGE=10
RESERVATION_TIMEOUT_MINUTES=10

# File Upload
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=5242880
ALLOWED_EXTENSIONS=jpg,jpeg,png,webp
QR_CODE_DIR=./uploads/qr_codes
```

## 📦 Step 3: Deploy to Railway

### Option A: Deploy from GitHub

1. Push your code to GitHub
2. In Railway: "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect Dockerfile and deploy

### Option B: Deploy with Railway CLI

```bash
cd arzaq-backend
railway init
railway up
```

## 🗄️ Step 4: Run Database Migrations

After deployment, run migrations:

```bash
# Using Railway CLI
railway run alembic upgrade head

# Or via Railway dashboard
# Add this to your service settings:
# Build Command: pip install -r requirements.txt && alembic upgrade head
```

## 👨‍💼 Step 5: Create Admin User

You need to manually create the first admin user in PostgreSQL:

```sql
-- Connect to your Railway PostgreSQL database
INSERT INTO users (
    email,
    hashed_password,
    full_name,
    role,
    is_active,
    is_approved
) VALUES (
    'admin@arzaq.kz',
    '$2b$12$EXAMPLE_HASH',  -- Use bcrypt to hash your password
    'Admin User',
    'admin',
    true,
    true
);
```

To generate password hash:
```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
print(pwd_context.hash("your-admin-password"))
```

## ✅ Step 6: Verify Deployment

1. Check health endpoint: `https://your-app.railway.app/health`
2. View API docs: `https://your-app.railway.app/docs`
3. Test authentication endpoints

## 🔄 Continuous Deployment

Railway automatically redeploys on every push to your main branch.

## 📊 Monitoring

1. View logs in Railway dashboard
2. Check `/health` endpoint for uptime monitoring
3. Monitor PostgreSQL metrics in Railway

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Ensure migrations ran successfully

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel deployment
- Check CORS settings in `main.py`

### File Upload Issues
- Ensure `uploads` directory is created (Dockerfile handles this)
- Check Railway volume settings if needed

### Authentication Errors
- Verify `SECRET_KEY` is set
- Check `SUPABASE_JWT_SECRET` matches Supabase project
- Ensure token expiration settings are correct

## 📝 Important Notes

1. **Never commit `.env` file** - use Railway environment variables
2. **Backup your database regularly** - use Railway backup features
3. **Monitor your logs** - Railway provides real-time logs
4. **Update dependencies** - keep `requirements.txt` up to date
5. **Security** - The Dockerfile runs as non-root user for security

## 🔒 Security Checklist

- ✅ All environment variables set
- ✅ SECRET_KEY is strong and unique
- ✅ PostgreSQL accessible only to Railway services
- ✅ CORS configured for specific origins only
- ✅ Rate limiting considered (add if needed)
- ✅ HTTPS enabled (Railway provides this)

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- FastAPI Docs: https://fastapi.tiangolo.com
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Alembic Docs: https://alembic.sqlalchemy.org

## 🆘 Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Verify environment variables
3. Test endpoints with API docs: `/docs`
4. Review this deployment guide
