export type Role = "contributor" | "editor" | "admin";

export type User = {
  id: number;
  username: string;
  display_name: string;
  role: Role;
};

export type LoggedInUser = User & {
  email: string;
};
