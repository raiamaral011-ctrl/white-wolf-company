-- Migration 003: Protect profile role from escalation by customers
-- White Wolf Company

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policy for profile updates
DROP POLICY IF EXISTS "User can update own profile" ON profiles;
CREATE POLICY "User can update own profile" ON profiles FOR UPDATE
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (
  (auth.uid() = user_id AND role = 'customer')
  OR is_admin()
);

-- Trigger to strictly forbid non-admins from changing role
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (public.is_admin()) THEN
      RAISE EXCEPTION 'Apenas administradores podem alterar o nível de permissão (role).';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_prevent_profile_role_escalation ON profiles;
CREATE TRIGGER tr_prevent_profile_role_escalation
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_role_escalation();
