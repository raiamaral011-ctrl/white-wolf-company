import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { FavoritesProvider } from '@/context/favorites-context';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://white-wolf-company-758y.vercel.app'),
  title: 'WHITE WOLF COMPANY | Tênis Masculinos de Alta Performance',
  description: 'Plataforma premium especializada em tênis masculinos de alta performance das marcas Adidas, Nike, ASICS, Puma e New Balance.',
  keywords: ['tênis masculinos', 'tênis de corrida masculino', 'placa de carbono', 'adidas', 'nike', 'asics', 'puma', 'new balance', 'white wolf company'],
  authors: [{ name: 'White Wolf Company' }],
  openGraph: {
    title: 'WHITE WOLF COMPANY | Tênis Masculinos de Alta Performance',
    description: 'Tênis masculinos de elite e alta performance. Entregas para todo o Brasil.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-wolf-950 text-slate-100 antialiased selection:bg-rose-600 selection:text-white">
        <CartProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
