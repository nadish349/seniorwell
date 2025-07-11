# Deployment Guide

## Environment Variables Setup

### For Vercel (Frontend)

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:

```
Name: VITE_BACKEND_URL
Value: https://your-backend-url.com
Environment: Production (and Preview if needed)
```

### For Backend Hosting (Railway/Render)

1. Go to your backend hosting platform dashboard
2. Find **Environment Variables** section
3. Add your backend-specific environment variables (MongoDB URI, JWT secret, etc.)

## Common Issues and Solutions

### 404 Error on Vercel
- **Cause**: Missing or incorrect `VITE_BACKEND_URL` environment variable
- **Solution**: Set the environment variable in Vercel dashboard

### CORS Errors
- **Cause**: Backend not configured to accept requests from frontend domain
- **Solution**: Update backend CORS configuration to include your frontend URL

### API Calls Failing
- **Cause**: Backend URL not accessible or incorrect
- **Solution**: 
  1. Verify backend is deployed and running
  2. Check environment variable is set correctly
  3. Test backend URL directly in browser

## Testing Environment Variables

You can test if your environment variables are working by:

1. Adding a console.log in your config file:
```javascript
console.log('Backend URL:', config.backendUrl);
```

2. Check browser console to see the actual URL being used

## Local Development

For local development, create a `.env` file in your frontend directory:

```
VITE_BACKEND_URL=http://localhost:4000
```

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend environment variables set in Vercel
- [ ] CORS configured on backend
- [ ] All API endpoints tested
- [ ] Database connection verified 