CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.wilayas CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('visage', 'yeux', 'levres', 'palettes', 'accessoires')),
    images TEXT[],
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    variants JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wilayas (
    id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    shipping_bureau DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_bureau >= 0),
    shipping_domicile DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_domicile >= 0),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    wilaya_id INTEGER REFERENCES public.wilayas(id),
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('bureau', 'domicile')),
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
    items JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    admin_password_hash TEXT NOT NULL DEFAULT '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7',
    default_shipping_bureau DECIMAL(10, 2) NOT NULL DEFAULT 500 CHECK (default_shipping_bureau >= 0),
    default_shipping_domicile DECIMAL(10, 2) NOT NULL DEFAULT 800 CHECK (default_shipping_domicile >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON public.products(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_is_bestseller ON public.products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_wilaya_id ON public.orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_wilayas_code ON public.wilayas(code);
CREATE INDEX IF NOT EXISTS idx_wilayas_is_active ON public.wilayas(is_active) WHERE is_active = true;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON public.admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON public.admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Products are publicly readable"
ON public.products FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Products can be inserted" ON public.products;
CREATE POLICY "Products can be inserted"
ON public.products FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Products can be updated" ON public.products;
CREATE POLICY "Products can be updated"
ON public.products FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Products can be deleted" ON public.products;
CREATE POLICY "Products can be deleted"
ON public.products FOR DELETE
USING (true);

DROP POLICY IF EXISTS "Orders are publicly readable" ON public.orders;
CREATE POLICY "Orders are publicly readable"
ON public.orders FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Orders can be created" ON public.orders;
CREATE POLICY "Orders can be created"
ON public.orders FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Orders can be updated" ON public.orders;
CREATE POLICY "Orders can be updated"
ON public.orders FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Orders can be deleted" ON public.orders;
CREATE POLICY "Orders can be deleted"
ON public.orders FOR DELETE
USING (true);

DROP POLICY IF EXISTS "Wilayas are publicly readable" ON public.wilayas;
CREATE POLICY "Wilayas are publicly readable"
ON public.wilayas FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Wilayas can be updated" ON public.wilayas;
CREATE POLICY "Wilayas can be updated"
ON public.wilayas FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Admin settings are publicly readable" ON public.admin_settings;
CREATE POLICY "Admin settings are publicly readable"
ON public.admin_settings FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admin settings can be updated" ON public.admin_settings;
CREATE POLICY "Admin settings can be updated"
ON public.admin_settings FOR UPDATE
USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    public = EXCLUDED.public;

DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
CREATE POLICY "Anyone can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;
CREATE POLICY "Anyone can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

INSERT INTO public.wilayas (id, code, name, shipping_bureau, shipping_domicile, is_active) VALUES
(1, '01', 'Adrar', 500, 800, true),
(2, '02', 'Chlef', 400, 700, true),
(3, '03', 'Laghouat', 500, 800, true),
(4, '04', 'Oum El Bouaghi', 400, 700, true),
(5, '05', 'Batna', 400, 700, true),
(6, '06', 'Béjaïa', 400, 700, true),
(7, '07', 'Biskra', 500, 800, true),
(8, '08', 'Béchar', 600, 900, true),
(9, '09', 'Blida', 300, 600, true),
(10, '10', 'Bouira', 400, 700, true),
(11, '11', 'Tamanrasset', 800, 1200, true),
(12, '12', 'Tébessa', 500, 800, true),
(13, '13', 'Tlemcen', 500, 800, true),
(14, '14', 'Tiaret', 400, 700, true),
(15, '15', 'Tizi Ouzou', 400, 700, true),
(16, '16', 'Alger', 300, 600, true),
(17, '17', 'Djelfa', 500, 800, true),
(18, '18', 'Jijel', 400, 700, true),
(19, '19', 'Sétif', 400, 700, true),
(20, '20', 'Saïda', 400, 700, true),
(21, '21', 'Skikda', 400, 700, true),
(22, '22', 'Sidi Bel Abbès', 400, 700, true),
(23, '23', 'Annaba', 400, 700, true),
(24, '24', 'Guelma', 400, 700, true),
(25, '25', 'Constantine', 400, 700, true),
(26, '26', 'Médéa', 400, 700, true),
(27, '27', 'Mostaganem', 400, 700, true),
(28, '28', 'M''Sila', 500, 800, true),
(29, '29', 'Mascara', 400, 700, true),
(30, '30', 'Ouargla', 600, 900, true),
(31, '31', 'Oran', 400, 700, true),
(32, '32', 'El Bayadh', 500, 800, true),
(33, '33', 'Illizi', 800, 1200, true),
(34, '34', 'Bordj Bou Arréridj', 400, 700, true),
(35, '35', 'Boumerdès', 300, 600, true),
(36, '36', 'El Tarf', 400, 700, true),
(37, '37', 'Tindouf', 800, 1200, true),
(38, '38', 'Tissemsilt', 400, 700, true),
(39, '39', 'El Oued', 600, 900, true),
(40, '40', 'Khenchela', 500, 800, true),
(41, '41', 'Souk Ahras', 400, 700, true),
(42, '42', 'Tipaza', 300, 600, true),
(43, '43', 'Mila', 400, 700, true),
(44, '44', 'Aïn Defla', 400, 700, true),
(45, '45', 'Naâma', 600, 900, true),
(46, '46', 'Aïn Témouchent', 400, 700, true),
(47, '47', 'Ghardaïa', 600, 900, true),
(48, '48', 'Relizane', 400, 700, true),
(49, '49', 'Timimoun', 700, 1000, true),
(50, '50', 'Bordj Badji Mokhtar', 800, 1200, true),
(51, '51', 'Ouled Djellal', 600, 900, true),
(52, '52', 'Béni Abbès', 700, 1000, true),
(53, '53', 'In Salah', 800, 1200, true),
(54, '54', 'In Guezzam', 900, 1300, true),
(55, '55', 'Touggourt', 600, 900, true),
(56, '56', 'Djanet', 900, 1300, true),
(57, '57', 'El M''Ghair', 600, 900, true),
(58, '58', 'El Meniaa', 700, 1000, true)
ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    shipping_bureau = EXCLUDED.shipping_bureau,
    shipping_domicile = EXCLUDED.shipping_domicile,
    is_active = EXCLUDED.is_active;

INSERT INTO public.admin_settings (id, admin_password_hash, default_shipping_bureau, default_shipping_domicile)
VALUES (1, '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7', 500, 800)
ON CONFLICT (id) DO UPDATE SET
    admin_password_hash = COALESCE(EXCLUDED.admin_password_hash, admin_settings.admin_password_hash),
    default_shipping_bureau = COALESCE(EXCLUDED.default_shipping_bureau, admin_settings.default_shipping_bureau),
    default_shipping_domicile = COALESCE(EXCLUDED.default_shipping_domicile, admin_settings.default_shipping_domicile);
