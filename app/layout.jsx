import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-opensans',
});

export const metadata = {
  title: 'Calculadora Wallet Cambios',
  description: 'La solución a tu problema cambiario - Cambio de divisas en Venezuela, Colombia y Chile',
  metadataBase: new URL('https://walletcambios.com'),
  icons: {
    icon: 'https://raw.githubusercontent.com/filtrosofia/calculadora/main/output-onlinepngtools.png',
  },
  
  // Meta tags para WhatsApp y redes sociales
  openGraph: {
    title: 'Wallet Cambios',
    description: 'Calculadora de cambio de divisas - Venezuela, Colombia y Chile',
    url: 'https://walletcambios.com',
    siteName: 'Wallet Cambios',
    images: [
      {
        url: '/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Wallet Cambios - Calculadora de Divisas',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Wallet Cambios',
    description: 'Calculadora de cambio de divisas',
    images: ['/og-image.jpeg'],
  },
  
  themeColor: '#4BA9C3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-opensans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
