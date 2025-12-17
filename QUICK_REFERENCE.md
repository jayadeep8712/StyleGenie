# StyleGenie - Quick Reference

## 🚀 Quick Start Commands

### Start Backend
```bash
cd server
npm start
```
Server runs on: `http://localhost:3001`

### Start Frontend
```bash
cd client
npm run dev
```
Client runs on: `http://localhost:5173`

## 🔑 Required Environment Variables

### server/.env
```env
GOOGLE_AI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_key
PORT=3001
```

### client/.env
```env
VITE_API_URL=http://localhost:3001
```

## 📊 Database Setup

1. Go to Supabase SQL Editor
2. Run the `database-schema.sql` file
3. Verify with: `SELECT * FROM hair_assets;`

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze-face` | Analyze face and get recommendations |
| GET | `/health` | Health check |

## 📁 Project Structure

```
style-genie-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── lib/
│   └── package.json
├── server/          # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── package.json
└── database-schema.sql
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5.4.11, TailwindCSS 3.4.19
- **Backend**: Express, Gemini 2.5 Flash, Supabase
- **CV**: MediaPipe Face Landmarker
- **Upload**: Multer (memory storage)

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| No face detected | Use clear, front-facing photo |
| API errors | Check API keys in `.env` |
| CORS errors | Ensure server is running first |
| No recommendations | Verify database setup |

## 📝 Key Files

- `client/src/App.jsx` - Main app logic
- `server/controllers/geminiController.js` - AI integration
- `server/config/supabaseClient.js` - Database queries
- `database-schema.sql` - Database schema

## 🎨 Face Shapes Supported

- Oval
- Round
- Square
- Heart
- Diamond
- Oblong
- Triangle

## 📦 Adding New Hairstyles

```sql
INSERT INTO hair_assets (name, image_url, tags, face_shape_match, description)
VALUES (
  'Hairstyle Name',
  'https://image-url.com/image.jpg',
  ARRAY['tag1', 'tag2'],
  ARRAY['oval', 'round'],
  'Description text'
);
```

## 🌐 Deployment

### Backend (Railway/Render)
1. Set environment variables
2. Deploy `server` directory
3. Update `NODE_ENV=production`

### Frontend (Vercel/Netlify)
1. Update `VITE_API_URL` to production URL
2. Run `npm run build`
3. Deploy `client/dist` directory

---

For detailed instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
