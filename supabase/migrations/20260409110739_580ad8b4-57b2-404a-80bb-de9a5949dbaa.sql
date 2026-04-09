
-- Drop the overly permissive policy
DROP POLICY "Authenticated users can receive notifications" ON public.notifications;

-- Create a proper policy that requires authentication
CREATE POLICY "Authenticated can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);
