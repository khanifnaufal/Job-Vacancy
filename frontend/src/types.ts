export type User = {
  id: number;
  name: string;
  email: string;
  role: 'seeker' | 'recruiter' | 'admin';
  company?: Company;
  profile?: UserProfile;
  work_experiences?: WorkExperience[];
  educations?: Education[];
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
  avatar_path: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkExperience = {
  id: number;
  user_id: number;
  company: string;
  title: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: number;
  user_id: number;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
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
  recent_vacancies?: Vacancy[];
  recent_applications?: Application[];
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
  is_bookmarked?: boolean;
};
