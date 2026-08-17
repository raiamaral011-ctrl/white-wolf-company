'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/session');
        const data = await res.json();

        if (res.ok && data.authenticated) {
          setAuthenticated(true);
        } else {
          router.replace('/admin/login');
        }
      } catch (err) {
        router.replace('/admin/login');
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4 font-mono">
        <div className="w-12 h-12 border-2 border-wolf-800 border-t-accent rounded-full animate-spin" />
        <span className="text-xs text-wolf-400 uppercase tracking-widest">
          Verificando credenciais de segurança...
        </span>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
