-- Migration 002: Row Level Security Policies for WHITE WOLF COMPANY

-- Enable RLS on all sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PUBLIC READ POLICIES (Products, Brands, Categories, Images, Variants)
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (true);

-- ADMIN ALL POLICIES FOR CATALOG MANAGEMENT
CREATE POLICY "Admin full access brands" ON brands FOR ALL USING (is_admin());
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admin full access products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admin full access product_images" ON product_images FOR ALL USING (is_admin());
CREATE POLICY "Admin full access product_variants" ON product_variants FOR ALL USING (is_admin());

-- PROFILES POLICIES
CREATE POLICY "User can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "User can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- FAVORITES POLICIES
CREATE POLICY "User can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- CARTS & CART ITEMS POLICIES
CREATE POLICY "User can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "User can manage own cart" ON carts FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "User can manage cart items" ON cart_items FOR ALL USING (true);

-- ADDRESSES POLICIES
CREATE POLICY "User can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "User can insert own address" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can update own address" ON addresses FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "User can delete own address" ON addresses FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- ORDERS & ORDER ITEMS POLICIES
CREATE POLICY "User can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "User can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (is_admin());

CREATE POLICY "User can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "User can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- PAYMENTS POLICIES
CREATE POLICY "User can view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "System/Admin can manage payments" ON payments FOR ALL USING (is_admin());
