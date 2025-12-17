# StyleGenie - AI-Powered Virtual Stylist

An intelligent virtual try-on application that uses AI to analyze face shapes and recommend personalized hairstyles with real-time overlay visualization.

## 🎨 Features

- **AI-Powered Analysis**: Uses Google Gemini 2.5 Flash to analyze facial features and recommend hairstyles
- **Real-Time Face Detection**: MediaPipe Face Landmarker for precise facial landmark detection
- **Virtual Try-On**: Canvas-based overlay system for realistic hairstyle visualization
- **Smart Recommendations**: Database-driven hairstyle matching based on face shape and skin tone

## 🏗️ Architecture

This is a monorepo containing:
- **Client**: React + Vite frontend with TailwindCSS and ShadcnUI
- **Server**: Node.js + Express backend with Gemini AI integration
- **Database**: Supabase (PostgreSQL) with image storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Google AI API key (Gemini 2.5 Flash)

### Environment Setup

1. **Client Configuration** (`client/.env`):
```env
VITE_API_URL=http://localhost:3001
```

2. **Server Configuration** (`server/.env`):
```env
GOOGLE_AI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=3001
```

### Database Setup

Create a `hair_assets` table in Supabase:

```sql
CREATE TABLE hair_assets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  face_shape_match TEXT[] DEFAULT '{}',
  description TEXT
);

-- Sample data
INSERT INTO hair_assets (name, image_url, tags, face_shape_match, description) VALUES
  ('Classic Bob', 'https://your-storage-url/bob.png', ARRAY['short', 'straight'], ARRAY['oval', 'square'], 'A timeless bob cut that frames the face beautifully'),
  ('Layered Waves', 'https://your-storage-url/waves.png', ARRAY['medium', 'wavy'], ARRAY['round', 'heart'], 'Soft layers with natural waves for added volume'),
  ('Pixie Cut', 'https://your-storage-url/pixie.png', ARRAY['short', 'edgy'], ARRAY['oval', 'heart'], 'Bold and modern pixie cut for a confident look');
```

### Installation & Running

1. **Install Client Dependencies**:
```bash
cd client
npm install
npm run dev
```

2. **Install Server Dependencies**:
```bash
cd server
npm install
npm start
```

The client will run on `http://localhost:5173` and the server on `http://localhost:3001`.

## 📋 How It Works

1. User uploads a selfie
2. MediaPipe detects facial landmarks (forehead, face shape)
3. Image + landmarks sent to backend
4. Gemini AI analyzes facial features
5. AI queries Supabase for matching hairstyles
6. Top 3 recommendations returned with explanations
7. Frontend overlays selected hairstyle using Canvas API

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5.4.11, TailwindCSS 3.4.19, ShadcnUI
- **Backend**: Express, Multer (memory storage)
- **AI**: Google Gemini 2.5 Flash with Function Calling
- **CV**: MediaPipe Face Landmarker
- **Database**: Supabase (PostgreSQL + Storage)
- **Icons**: Lucide React

## 📁 Project Structure

```
style-genie-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API services
│   │   ├── lib/           # Utilities
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── .env
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── config/            # Configuration
│   ├── index.js           # Server entry
│   ├── .env
│   └── package.json
└── README.md
```

## 🔒 Security Notes

- API keys are stored in `.env` files (never commit these!)
- CORS is configured to allow only the client origin
- Multer uses memory storage to prevent disk pollution
- Image uploads are validated and size-limited

## 📝 License

MIT
