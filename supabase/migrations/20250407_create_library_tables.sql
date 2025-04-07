
-- Create library_items table
CREATE TABLE IF NOT EXISTS public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('book', 'instruction', 'standard')),
  author TEXT,
  year TEXT,
  description TEXT NOT NULL,
  external_link TEXT,
  file_url TEXT,
  author_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to library items for all users"
  ON public.library_items
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON public.library_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON public.library_items
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow delete for authenticated users"
  ON public.library_items
  FOR DELETE
  TO authenticated
  USING (true);
