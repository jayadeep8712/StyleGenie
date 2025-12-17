# StyleGenie Setup Guide

This guide will walk you through setting up the StyleGenie AI-powered virtual stylist application.

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ and npm installed
- ✅ A Google AI API key (Gemini 2.5 Flash)
- ✅ A Supabase account and project

## Step 1: Get Your API Keys

### Google AI API Key (Gemini)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key (you'll need this later)

### Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to **Project Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

## Step 2: Set Up the Database

1. In your Supabase project, go to the **SQL Editor**
2. Open the `database-schema.sql` file from the project root
3. Copy and paste the entire SQL script into the editor
4. Click **Run** to create the table and insert sample data
5. Verify the data by running: `SELECT * FROM hair_assets;`

## Step 3: Configure Environment Variables

### Server Configuration

1. Navigate to `server/.env`
2. Replace the placeholder values with your actual credentials:

```env
GOOGLE_AI_API_KEY=your_actual_gemini_api_key_here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
PORT=3001
NODE_ENV=development
```

### Client Configuration

The client `.env` is already configured with the default backend URL:

```env
VITE_API_URL=http://localhost:3001
```

If you deploy the backend to a different URL, update this value.

## Step 4: Install Dependencies

Dependencies have already been installed! But if you need to reinstall:

### Client
```bash
cd client
npm install
```

### Server
```bash
cd server
npm install
```

## Step 5: Start the Application

### Start the Backend Server

Open a terminal and run:

```bash
cd server
npm start
```

You should see:
```
🎨 StyleGenie API Server
📍 Environment: development
🚀 Server running on http://localhost:3001
🔗 Health check: http://localhost:3001/health
🤖 Gemini API: ✓ Configured
💾 Supabase: ✓ Configured
```

### Start the Frontend Client

Open a **new terminal** and run:

```bash
cd client
npm run dev
```

You should see:
```
VITE v5.4.11  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 6: Test the Application

1. Open your browser and go to `http://localhost:5173`
2. Upload a clear selfie (front-facing photo)
3. Wait for MediaPipe to detect facial landmarks
4. Click "Get AI Recommendations"
5. View the AI-recommended hairstyles
6. Click on different hairstyles to see them overlaid on your photo

## Troubleshooting

### "No face detected"
- Ensure the photo is well-lit and shows a clear front-facing view
- Try a different photo with better quality

### "Failed to analyze face"
- Check that your Gemini API key is correct in `server/.env`
- Verify the server is running on port 3001
- Check the server console for error messages

### "No hairstyle recommendations found"
- Verify the database was set up correctly by running: `SELECT * FROM hair_assets;` in Supabase
- Check that your Supabase credentials are correct in `server/.env`

### CORS errors
- Ensure the server is running before starting the client
- Check that the `VITE_API_URL` in `client/.env` matches your server URL

### MediaPipe loading issues
- MediaPipe downloads models from CDN on first use
- Ensure you have a stable internet connection
- Check browser console for any errors

## Adding More Hairstyles

To add more hairstyles to the database:

1. Upload hairstyle images to Supabase Storage or use external URLs
2. In Supabase SQL Editor, run:

```sql
INSERT INTO hair_assets (name, image_url, tags, face_shape_match, description) VALUES
  (
    'Your Hairstyle Name',
    'https://your-image-url.com/image.jpg',
    ARRAY['tag1', 'tag2'],
    ARRAY['oval', 'round'],
    'Description of the hairstyle'
  );
```

## Production Deployment

### Backend Deployment (e.g., Railway, Render, Heroku)

1. Set environment variables in your hosting platform
2. Update `NODE_ENV=production`
3. Deploy the `server` directory

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update `VITE_API_URL` to your production backend URL
2. Run `npm run build` to create production build
3. Deploy the `client/dist` directory

## Architecture Overview

```
User uploads selfie
       ↓
MediaPipe detects face landmarks (client-side)
       ↓
Image + landmarks sent to backend
       ↓
Gemini AI analyzes face shape and features
       ↓
Gemini uses function calling to query Supabase
       ↓
Top 3 hairstyles returned with explanations
       ↓
Canvas API overlays hairstyle on user's photo
```

## Tech Stack Summary

- **Frontend**: React 18, Vite 5.4.11, TailwindCSS 3.4.19, ShadcnUI
- **Backend**: Express, Node.js
- **AI**: Google Gemini 2.5 Flash with Function Calling
- **Computer Vision**: MediaPipe Face Landmarker
- **Database**: Supabase (PostgreSQL)
- **Image Upload**: Multer (memory storage)

## Support

If you encounter any issues:

1. Check the browser console for frontend errors
2. Check the server terminal for backend errors
3. Verify all API keys are correctly configured
4. Ensure the database schema was created successfully

---

**Enjoy using StyleGenie! 🎨✨**
