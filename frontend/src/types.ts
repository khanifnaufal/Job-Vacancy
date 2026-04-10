export type User = {
  id: number;
  name: string;
  email: string;
  role: 'seeker' | 'recruiter' | 'admin';
};

export type Vacancy = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
};
