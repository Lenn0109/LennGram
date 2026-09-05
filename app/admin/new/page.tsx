import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { ProjectForm } from '@/app/admin/_components/ProjectForm';

export default function NewProjectPage() {
  return (
    <>
      <AdminTopBar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold tracking-tighter mb-6">
          New project
        </h1>
        <ProjectForm />
      </main>
    </>
  );
}
