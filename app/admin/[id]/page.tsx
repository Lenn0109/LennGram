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
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold tracking-tighter mb-6">
          Edit project
        </h1>
        <ProjectForm initial={project} />
      </main>
    </>
  );
}
