
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Footer } from '@/components/footer';
import { Poppins } from 'next/font/google';
import { Header } from '@/components/header';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examease-app.vercel.app/';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ExamEase - AI-Powered Question Paper Generator',
  description: 'Generate high-quality, exam-oriented question papers for any subject in seconds with ExamEase. Perfect for students and educators.',
  keywords: ['AI question generator', 'exam preparation', 'test maker', 'study tool', 'CBSE questions', 'student resources', 'educational technology'],
  authors: [{ name: 'Aaditya Kumar', url: 'https://github.com/AadityaGeek' }],
  themeColor: '#29ABE2',
  openGraph: {
    title: 'ExamEase - AI-Powered Question Paper Generator',
    description: 'Generate high-quality, exam-oriented question papers for any subject in seconds. Perfect for students and educators.',
    url: siteUrl,
    siteName: 'ExamEase',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ExamEase - AI-Powered Question Paper Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    "google-site-verification": "C0RBmbB65V8HitJZXbitQ44YTL-WND7luTAaN6cpx2I",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} antialiased min-h-screen bg-background`}>
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
