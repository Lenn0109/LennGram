import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { ProjectForm } from '@/app/admin/_components/ProjectForm';
import { getAllProjectsForAdmin } from '@/lib/queries';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const projects = await getAllProjectsForAdmin();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <>
      <AdminTopBar />
      <main className="mx-auto max-w-[680px] px-4 sm:px-6 py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text tracking-tight transition-colors mb-8 no-underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          Back to list
        </Link>
        <h1 className="font-sans font-semibold text-[24px] tracking-tight text-text mb-8">
          Edit project
        </h1>
        <ProjectForm initial={project} />
      </main>
    </>
  );
}
