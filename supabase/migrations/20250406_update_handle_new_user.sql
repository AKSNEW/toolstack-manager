
-- Enable row-level security for employees table if not already enabled
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own employee profile
CREATE POLICY IF NOT EXISTS "Users can view their own employee profile" 
  ON public.employees 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own employee profile
CREATE POLICY IF NOT EXISTS "Users can update their own employee profile" 
  ON public.employees 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Update the handle_new_user function to create employee record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  employee_id UUID;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  
  -- Create an employee record for the new user
  INSERT INTO public.employees (
    id,
    name,
    position,
    department,
    email,
    phone,
    avatar,
    user_id
  ) VALUES (
    gen_random_uuid(),
    COALESCE(new.raw_user_meta_data->>'name', ''),
    '',
    '',
    new.email,
    '',
    '',
    new.id
  )
  RETURNING id INTO employee_id;
  
  RETURN new;
END;
$$;

-- Make sure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
