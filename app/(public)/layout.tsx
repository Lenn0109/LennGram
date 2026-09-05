import { TopNav } from '@/components/feed/TopNav';
import { Footer } from '@/components/feed/Footer';
import { BottomNav } from '@/components/feed/BottomNav';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <TopNav />
      <div className="flex-1 pb-12 sm:pb-0">{children}</div>
      <Footer />
      <BottomNav />
    </div>
  );
}
