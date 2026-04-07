
-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow all access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all access to order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow all access to app_settings" ON public.app_settings;

-- Categories: public read, admin/manager write
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin/manager can insert categories" ON public.categories FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/manager can update categories" ON public.categories FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/manager can delete categories" ON public.categories FOR DELETE USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- Products: public read, admin/manager write
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin/manager can insert products" ON public.products FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/manager can update products" ON public.products FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/manager can delete products" ON public.products FOR DELETE USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- Orders: users see own, admin/manager see all
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Auth users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin/manager can update orders" ON public.orders FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- Order items: follow order access
CREATE POLICY "Users can view order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.get_user_role(auth.uid()) IN ('admin', 'manager')))
);
CREATE POLICY "Auth users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- App settings: public read, admin write
CREATE POLICY "Anyone can view settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update settings" ON public.app_settings FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admin can insert settings" ON public.app_settings FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');
