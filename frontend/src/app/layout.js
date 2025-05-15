import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Ensures text remains visible during font loading
  variable: '--font-inter', // Optional: if you want to use it as a CSS variable
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'EcoChain - Transform Your Carbon Footprint',
  description: 'A transparent, efficient, and globally accessible carbon offset marketplace powered by Aptos and IoT verification.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      {/* The default font families from globals.css will apply */}
      <body>
        {children}
      </body>
    </html>
  );
}
