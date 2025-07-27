import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HueNest - Your Safe Space for Better Mental Health',
  description: 'HueNest is your safe space for better mental health, self-expression, and genuine vibes. Connect with university students in wellness-focused group chats.',
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
        <div className="min-h-screen max-h-screen h-screen flex flex-col">
          <main className='flex-1 flex flex-col overflow-y-auto pb-[80px] '>
            {children}
          </main>
          <Navbar />
        </div>
      </body>
    </html>
  );
}