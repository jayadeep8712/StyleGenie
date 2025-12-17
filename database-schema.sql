-- 1. DROP the old table to start fresh
DROP TABLE IF EXISTS hair_assets CASCADE;

-- 2. CREATE the new table with a 'gender' column
CREATE TABLE hair_assets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  gender TEXT NOT NULL, -- ADDED THIS COLUMN
  tags TEXT[] DEFAULT '{}',
  face_shape_match TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Re-create Indexes
CREATE INDEX idx_gender ON hair_assets (gender); -- Index for fast gender filtering
CREATE INDEX idx_face_shape_match ON hair_assets USING GIN (face_shape_match);
CREATE INDEX idx_tags ON hair_assets USING GIN (tags);

-- 4. Re-enable Security
ALTER TABLE hair_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON hair_assets FOR SELECT USING (true);
