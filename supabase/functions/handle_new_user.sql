
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
