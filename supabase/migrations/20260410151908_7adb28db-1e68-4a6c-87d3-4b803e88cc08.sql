
-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'USER', 'CUSTOMER')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Timestamp trigger
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing roles from profiles
INSERT INTO public.user_roles (user_id, role)
SELECT id,
  CASE
    WHEN role = 'admin' THEN 'ADMIN'
    WHEN role = 'manager' THEN 'USER'
    ELSE 'CUSTOMER'
  END
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Update get_user_role to read from user_roles
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = _user_id),
    'CUSTOMER'
  );
$$;

-- Update handle_new_user to also insert into user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'CUSTOMER');
  RETURN NEW;
END;
$$;

-- RLS policies for user_roles
CREATE POLICY "Anyone can view roles"
ON public.user_roles FOR SELECT
USING (true);

CREATE POLICY "Admin can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Admin can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Admin can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'ADMIN'));

-- Allow the trigger (runs as SECURITY DEFINER) to also insert
-- The handle_new_user function runs as superuser so it bypasses RLS

-- Update existing RLS policies on key tables to use new role system
-- Orders: let ADMIN see all
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders or admin/user"
ON public.orders FOR SELECT
USING (
  auth.uid() = user_id
  OR public.get_user_role(auth.uid()) IN ('ADMIN', 'USER')
);

-- Orders: ADMIN and USER can update
DROP POLICY IF EXISTS "Admin/manager can update orders" ON public.orders;
CREATE POLICY "Admin or user can update orders"
ON public.orders FOR UPDATE
USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'USER'));

-- Orders: only ADMIN can delete
DROP POLICY IF EXISTS "Admin can delete orders" ON public.orders;
CREATE POLICY "Admin can delete orders"
ON public.orders FOR DELETE
USING (public.get_user_role(auth.uid()) = 'ADMIN');

-- Products: ADMIN only for mutations
DROP POLICY IF EXISTS "Admin/manager can insert products" ON public.products;
CREATE POLICY "Admin can insert products"
ON public.products FOR INSERT
WITH CHECK (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin/manager can update products" ON public.products;
CREATE POLICY "Admin can update products"
ON public.products FOR UPDATE
USING (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin/manager can delete products" ON public.products;
CREATE POLICY "Admin can delete products"
ON public.products FOR DELETE
USING (public.get_user_role(auth.uid()) = 'ADMIN');

-- Categories: ADMIN only for mutations
DROP POLICY IF EXISTS "Admin/manager can insert categories" ON public.categories;
CREATE POLICY "Admin can insert categories"
ON public.categories FOR INSERT
WITH CHECK (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin/manager can update categories" ON public.categories;
CREATE POLICY "Admin can update categories"
ON public.categories FOR UPDATE
USING (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin/manager can delete categories" ON public.categories;
CREATE POLICY "Admin can delete categories"
ON public.categories FOR DELETE
USING (public.get_user_role(auth.uid()) = 'ADMIN');

-- App settings: use new role
DROP POLICY IF EXISTS "Admin can insert settings" ON public.app_settings;
CREATE POLICY "Admin can insert settings"
ON public.app_settings FOR INSERT
WITH CHECK (public.get_user_role(auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Admin can update settings" ON public.app_settings;
CREATE POLICY "Admin can update settings"
ON public.app_settings FOR UPDATE
USING (public.get_user_role(auth.uid()) = 'ADMIN');
