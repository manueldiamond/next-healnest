import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';

const inter = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'HealNest - Your Safe Space for Better Mental Health',
  description: 'HealNest is your safe space for better mental health, self-expression, and genuine vibes. Connect with university students in wellness-focused group chats.',
  keywords: 'mental health, university students, wellness, safe space, group chat, gen z',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}