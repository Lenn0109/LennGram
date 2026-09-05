import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { getAllProjectsForAdmin } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const projects = await getAllProjectsForAdmin();

  return (
    <>
      <AdminTopBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tighter">Projects</h1>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1 px-3 py-2 border border-border bg-bg hover:bg-bg-muted text-sm no-underline transition-colors duration-fast ease-out"
          >
            <Plus strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
            New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="border border-border px-6 py-12 text-center">
            <p className="text-lg font-semibold">No projects yet</p>
            <p className="mt-2 text-sm text-text-muted">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="border border-border">
            <table className="w-full text-sm">
              <thead className="bg-bg-muted">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    Likes
                  </th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">
                    Updated
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-t border-border align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 bg-bg-muted flex-shrink-0 overflow-hidden">
                          {p.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.cover_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="font-mono text-xs uppercase tracking-widest text-text-muted">
                            /{p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-widest ${
                          p.status === 'published'
                            ? 'bg-text text-bg'
                            : 'bg-bg-muted text-text-muted'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell tabular-nums">
                      {p.like_count}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-text-muted">
                      {new Date(p.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/${p.id}`}
                        className="text-sm underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
