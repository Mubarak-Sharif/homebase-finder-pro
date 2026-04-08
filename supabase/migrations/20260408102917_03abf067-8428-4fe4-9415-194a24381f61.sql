
-- Add unique constraint on cart (user_id, product_id) to prevent duplicate entries
ALTER TABLE public.cart ADD CONSTRAINT cart_user_product_unique UNIQUE (user_id, product_id);

-- Allow admin to delete orders
CREATE POLICY "Admin can delete orders"
ON public.orders
FOR DELETE
USING (public.get_user_role(auth.uid()) = 'admin');

-- Allow admin/manager to delete categories  
CREATE POLICY "Admin/manager can delete categories already exists - skip"
ON public.categories FOR SELECT USING (true);
-- categories delete policy already exists, skip

-- Add delete policy for order_items when parent order is deleted
CREATE POLICY "Admin can delete order items"
ON public.order_items
FOR DELETE
USING (public.get_user_role(auth.uid()) = 'admin');
