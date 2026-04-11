export type User = {
  id: number;
  name: string;
  email: string;
  role: 'seeker' | 'recruiter' | 'admin';
  company?: Company;
  profile?: UserProfile;
};

export type Company = {
  id: number;
  name: string;
  email: string;
  website: string | null;
  location: string;
  description: string | null;
  logo_path: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: number;
  user_id: number;
  phone: string | null;
  summary: string | null;
  skills: string | null;
  resume_path: string | null;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: number;
  user_id: number;
  vacancy_id: number;
  cover_letter: string | null;
  resume_path: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  applied_at: string | null;
  reviewed_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  vacancy?: Vacancy;
  user?: User;
};

export type RecruiterStats = {
  total_vacancies: number;
  total_applications: number;
  pending_applications: number;
  reviewed_applications: number;
};

export type Vacancy = {
  id: number;
  title: string;
  description: string;
  company_name?: string; // Legacy string from migration, marked optional
  company_id: number | null;
  company?: Company;
  location: string;
  salary: string | null;
  status: boolean;
  job_type: 'full-time' | 'part-time' | 'contract' | 'remote';
  experience_level: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  applications?: Application[];
};
