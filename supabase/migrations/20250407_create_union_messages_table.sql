
-- Create union_messages table
CREATE TABLE IF NOT EXISTS public.union_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  author_id TEXT NOT NULL,
  anonymous BOOLEAN DEFAULT false,
  category TEXT NOT NULL CHECK (category IN ('complaint', 'suggestion', 'question')),
  status TEXT NOT NULL CHECK (status IN ('new', 'in-review', 'resolved')),
  votes JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.union_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to union messages for all users"
  ON public.union_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON public.union_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON public.union_messages
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow delete for authenticated users"
  ON public.union_messages
  FOR DELETE
  TO authenticated
  USING (true);
