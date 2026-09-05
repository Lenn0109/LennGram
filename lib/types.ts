export type ProjectStatus = 'draft' | 'published';

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_url: string | null;
  repo_url: string | null;
  demo_url: string | null;
  tech_stack: string[];
  status: ProjectStatus;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithCount extends Project {
  like_count: number;
}

export interface ProjectLike {
  project_id: string;
  ip_hash: string;
  created_at: string;
}

export interface ProjectView {
  id: number;
  project_id: string;
  ip_hash: string;
  viewed_at: string;
}
