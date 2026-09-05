import { TopNav } from '@/components/feed/TopNav';
import { Footer } from '@/components/feed/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
