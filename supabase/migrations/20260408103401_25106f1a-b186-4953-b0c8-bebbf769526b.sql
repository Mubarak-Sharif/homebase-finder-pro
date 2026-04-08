
-- Seed Categories
INSERT INTO public.categories (name, description, image_url, is_active, sort_order) VALUES
  ('Italian Marble', 'Premium imported marble from Italy, known for elegance and durability.', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600', true, 1),
  ('Pakistani Marble', 'High-quality local marble sourced from Balochistan and KPK.', 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600', true, 2),
  ('Granite', 'Durable and versatile granite for countertops and flooring.', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', true, 3),
  ('Onyx', 'Luxurious translucent onyx for accent walls and backlighting.', 'https://images.unsplash.com/photo-1544539079-07b92f579dfc?w=600', true, 4),
  ('Travertine', 'Natural travertine with a timeless, earthy appeal.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', true, 5);

-- Seed Products (using subqueries to reference category IDs)
INSERT INTO public.products (name, category_id, price_per_sqft, origin, color, finish, thickness_options, usage, stock_status, featured, primary_image_url, gallery_image_urls, description) VALUES
  ('Carrara White', (SELECT id FROM categories WHERE name='Italian Marble' LIMIT 1), 850, 'Italy', 'White', 'Polished', ARRAY['16mm','18mm','20mm'], 'Flooring', 'IN_STOCK', true,
   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
   ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400','https://images.unsplash.com/photo-1618220179428-22790b461013?w=400'],
   'Classic Italian Carrara marble with soft grey veining. Perfect for luxury flooring and bathrooms.'),

  ('Calacatta Gold', (SELECT id FROM categories WHERE name='Italian Marble' LIMIT 1), 1200, 'Italy', 'White/Gold', 'Polished', ARRAY['18mm','20mm'], 'Countertops', 'IN_STOCK', true,
   'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800',
   ARRAY['https://images.unsplash.com/photo-1618220179428-22790b461013?w=400'],
   'Prestigious Calacatta Gold with bold golden veining. The ultimate luxury marble.'),

  ('Statuario', (SELECT id FROM categories WHERE name='Italian Marble' LIMIT 1), 1100, 'Italy', 'White/Grey', 'Honed', ARRAY['18mm','20mm'], 'Wall Cladding', 'LIMITED', true,
   'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800',
   ARRAY['https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400'],
   'Statuario marble with dramatic grey veins on a bright white background.'),

  ('Ziarat White', (SELECT id FROM categories WHERE name='Pakistani Marble' LIMIT 1), 250, 'Pakistan (Balochistan)', 'White', 'Polished', ARRAY['16mm','18mm'], 'Flooring', 'IN_STOCK', true,
   'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
   ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
   'Premium Ziarat white marble. The most popular Pakistani marble for residential flooring.'),

  ('Badal Grey', (SELECT id FROM categories WHERE name='Pakistani Marble' LIMIT 1), 180, 'Pakistan (KPK)', 'Grey', 'Polished', ARRAY['16mm','18mm'], 'Flooring', 'IN_STOCK', false,
   'https://images.unsplash.com/photo-1544539079-07b92f579dfc?w=800',
   ARRAY['https://images.unsplash.com/photo-1544539079-07b92f579dfc?w=400'],
   'Beautiful grey marble with cloud-like patterns. Affordable luxury for modern homes.'),

  ('Sunny Grey', (SELECT id FROM categories WHERE name='Pakistani Marble' LIMIT 1), 200, 'Pakistan (Balochistan)', 'Light Grey', 'Honed', ARRAY['16mm'], 'Bathroom', 'IN_STOCK', false,
   'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
   ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400'],
   'Elegant light grey marble ideal for bathroom walls and vanity tops.'),

  ('Black Galaxy Granite', (SELECT id FROM categories WHERE name='Granite' LIMIT 1), 550, 'India', 'Black', 'Polished', ARRAY['18mm','20mm'], 'Countertops', 'IN_STOCK', true,
   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
   ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
   'Stunning black granite with golden speckles. Perfect for kitchen countertops.'),

  ('Tropical Green Granite', (SELECT id FROM categories WHERE name='Granite' LIMIT 1), 480, 'Brazil', 'Green', 'Polished', ARRAY['18mm','20mm'], 'Countertops', 'LIMITED', false,
   'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
   ARRAY['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400'],
   'Exotic green granite with natural patterns. A bold choice for modern kitchens.'),

  ('Green Onyx', (SELECT id FROM categories WHERE name='Onyx' LIMIT 1), 1500, 'Pakistan', 'Green', 'Polished', ARRAY['18mm'], 'Accent Wall', 'LIMITED', true,
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
   ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'],
   'Translucent green onyx. Stunning when backlit for feature walls and reception areas.'),

  ('Honey Onyx', (SELECT id FROM categories WHERE name='Onyx' LIMIT 1), 1300, 'Iran', 'Honey/Gold', 'Polished', ARRAY['18mm'], 'Accent Wall', 'OUT_OF_STOCK', false,
   'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
   ARRAY['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400'],
   'Warm honey-toned onyx with beautiful translucency. Ideal for luxury interiors.'),

  ('Classic Travertine', (SELECT id FROM categories WHERE name='Travertine' LIMIT 1), 350, 'Turkey', 'Beige', 'Tumbled', ARRAY['16mm','18mm'], 'Flooring', 'IN_STOCK', false,
   'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
   ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400'],
   'Natural travertine with rustic charm. Popular for outdoor and indoor flooring.'),

  ('Silver Travertine', (SELECT id FROM categories WHERE name='Travertine' LIMIT 1), 400, 'Turkey', 'Silver/Grey', 'Honed', ARRAY['18mm','20mm'], 'Wall Cladding', 'IN_STOCK', false,
   'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
   ARRAY['https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400'],
   'Modern silver travertine with cool grey tones. Great for contemporary designs.');

-- Seed app_settings
INSERT INTO public.app_settings (org_name, default_city, whatsapp_number, delivery_info)
VALUES ('BS Marble Karachi', 'Karachi', '923001234567', 'Free delivery within Karachi for orders above Rs. 50,000. Standard delivery charges apply for other areas.')
ON CONFLICT DO NOTHING;
