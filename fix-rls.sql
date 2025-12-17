-- Allow INSERTs for the sync script (Public/Anon for now to unblock)
CREATE POLICY "Allow public inserts" ON hair_assets FOR INSERT WITH CHECK (true);

-- Allow UPDATEs if needed
CREATE POLICY "Allow public updates" ON hair_assets FOR UPDATE USING (true);
