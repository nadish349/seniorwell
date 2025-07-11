# Backend Deployment Guide

## Option 1: Railway (Recommended - Free)

### Step 1: Prepare Your Backend
1. Make sure your backend folder is ready
2. All dependencies are in package.json
3. Server.js uses `process.env.PORT`

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Set the root directory to `backend/`
7. Click "Deploy"

### Step 3: Set Environment Variables in Railway
Go to your project → Variables tab and add:

```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/seniorwell
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Step 4: Get Your Backend URL
1. Go to your Railway project
2. Click on your service
3. Copy the generated URL (e.g., `https://your-app.railway.app`)

## Option 2: Render (Alternative - Free)

### Step 1: Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your GitHub repo
5. Set:
   - **Name**: seniorwell-backend
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Set Environment Variables
Same as Railway, add all the environment variables in Render dashboard.

## Option 3: Heroku (Paid)

### Step 1: Deploy to Heroku
1. Install Heroku CLI
2. Run commands:
```bash
cd backend
heroku create your-app-name
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Step 2: Set Environment Variables
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... add all other variables
```

## Required Environment Variables

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster
3. Get connection string
4. Replace `<password>` with your database password

### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com)
2. Create free account
3. Get API credentials

### JWT Secret
Generate a random string for JWT_SECRET

## Testing Your Deployment

1. Visit your backend URL (e.g., `https://your-app.railway.app`)
2. You should see: "API WORKING GOOD!"
3. Test an endpoint: `https://your-app.railway.app/api/doctor/list`

## Update Frontend

Once you have your backend URL, update your frontend environment variable:

```
VITE_BACKEND_URL=https://your-app.railway.app
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check package.json has all dependencies
2. **Database connection fails**: Verify MONGODB_URI is correct
3. **CORS errors**: Update CORS origins in server.js
4. **Environment variables not working**: Double-check variable names

### Debug Commands:
```bash
# Check logs
railway logs

# Restart service
railway service restart
```

## Next Steps

1. Deploy backend to Railway
2. Get the backend URL
3. Update frontend environment variable in Vercel
4. Test the full application 