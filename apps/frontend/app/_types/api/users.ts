export type Role = "contributor" | "editor" | "admin";

export type User = {
  id: number;
  username: string;
  display_name: string;
  fundraiser_link: string | null;
  role: Role;
  can_email: boolean | null;
};

export type LoggedInUser = User & {
  bio: string;
  email: string;
};

export type Profile = User & { bio: string };

export type UserExists = {
  user_exists: boolean;
};
