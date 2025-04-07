
-- Create wiring_diagrams table
CREATE TABLE IF NOT EXISTS public.wiring_diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  votes JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create diagram_comments table
CREATE TABLE IF NOT EXISTS public.diagram_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagram_id UUID REFERENCES public.wiring_diagrams(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wiring_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagram_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wiring_diagrams
CREATE POLICY "Allow read access to wiring diagrams for all users"
  ON public.wiring_diagrams
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON public.wiring_diagrams
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON public.wiring_diagrams
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow delete for authenticated users"
  ON public.wiring_diagrams
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for diagram_comments
CREATE POLICY "Allow read access to diagram comments for all users"
  ON public.diagram_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON public.diagram_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for own comments"
  ON public.diagram_comments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow delete for own comments"
  ON public.diagram_comments
  FOR DELETE
  TO authenticated
  USING (true);
