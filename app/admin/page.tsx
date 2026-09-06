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
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-sans font-semibold text-[20px] tracking-tight text-text">
            Projects
          </h1>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 h-10 pl-4 pr-5 bg-accent hover:bg-accent/90 text-white font-semibold text-[14px] tracking-tight rounded-xl shadow-vc hover:shadow-vc-hover transition-all duration-base no-underline"
          >
            <Plus strokeWidth={2} className="h-4 w-4" aria-hidden="true" />
            New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl bg-bg shadow-vc px-6 py-16 text-center">
            <p className="font-sans font-semibold text-[16px] tracking-tight text-text">
              No projects yet
            </p>
            <p className="mt-1 text-[13px] text-text-muted tracking-tight">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-bg shadow-vc overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left">
                    <span className="text-[11px] font-semibold tracking-small uppercase text-text-muted">Project</span>
                  </th>
                  <th className="px-5 py-3.5 text-left hidden sm:table-cell">
                    <span className="text-[11px] font-semibold tracking-small uppercase text-text-muted">Status</span>
                  </th>
                  <th className="px-5 py-3.5 text-left hidden md:table-cell">
                    <span className="text-[11px] font-semibold tracking-small uppercase text-text-muted">Likes</span>
                  </th>
                  <th className="px-5 py-3.5 text-left hidden lg:table-cell">
                    <span className="text-[11px] font-semibold tracking-small uppercase text-text-muted">Updated</span>
                  </th>
                  <th className="px-5 py-3.5 text-right">
                    <span className="text-[11px] font-semibold tracking-small uppercase text-text-muted">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-b-0 hover:bg-bg-muted/40 transition-colors duration-base"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-16 rounded-lg bg-bg-muted flex-shrink-0 overflow-hidden shadow-vc">
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
                          <div className="font-sans font-semibold text-[14px] tracking-tight text-text">
                            {p.title}
                          </div>
                          <div className="text-[12px] text-text-muted tracking-tight mt-0.5">
                            /{p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-semibold tracking-small rounded-full ${
                          p.status === 'published'
                            ? 'bg-accent text-white'
                            : 'bg-bg-muted text-text-muted'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-[14px] font-semibold tracking-tight text-text tabular-nums">
                        {p.like_count}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-[13px] text-text-muted tracking-tight">
                        {new Date(p.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/${p.id}`}
                        className="text-[13px] font-semibold text-accent hover:text-accent/70 tracking-tight transition-colors duration-base"
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
