export interface Role {
  id: number;
  'role-name': string;
  description: string;
  responsibilities: string | null;
  skills: string | null;
  industry: string | null;
  'org-level': string | null;
  medium: string | null;
}

export interface FilterOption {
  value: string;
  label: string;
}
