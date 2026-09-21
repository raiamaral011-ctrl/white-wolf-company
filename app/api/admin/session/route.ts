import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('ww_admin_token');

  if (!token || !token.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const data = JSON.parse(Buffer.from(token.value, 'base64').toString('utf-8'));
    if (data && (data.user || data.email) && (data.role?.toLowerCase().includes('admin') || data.role === 'admin')) {
      return NextResponse.json({
        authenticated: true,
        user: { 
          username: data.user, 
          email: data.email, 
          role: data.role || 'Administrador' 
        },
      });
    }
  } catch (err) {
    // invalid token
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

