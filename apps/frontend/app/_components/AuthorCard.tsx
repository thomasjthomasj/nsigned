import type { User } from "@/_types/api";

type AuthorCardProps = {
  user: User;
};

export const AuthorCard = ({ user }: AuthorCardProps) => (
  <div className="w-full">
    <p>by {user.display_name}</p>
  </div>
);
