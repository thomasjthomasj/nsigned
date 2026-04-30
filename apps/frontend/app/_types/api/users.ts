export type Role = ["user", "contributor", "editor"];

export type User = {
  id: number;
  username: string;
  display_name: string | null;
  email?: string;
  role: Role;
}
