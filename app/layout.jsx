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
  icons: {
    icon: 'https://raw.githubusercontent.com/filtrosofia/calculadora/main/output-onlinepngtools.png',
  },
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

