export type Role = "contributor" | "editor" | "admin";

export type User = {
  id: number;
  username: string;
  display_name: string;
  fundraiser_link: string | null;
  role: Role;
};

export type LoggedInUser = User & {
  email: string;
};

export type Profile = User & { bio: string };
