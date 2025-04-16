
export interface CareerRole {
  id: string;
  title: string;
  years_experience: string;
}

export interface CareerPath {
  id: string;
  title: string;
  color: string;
  roles: CareerRole[];
}
