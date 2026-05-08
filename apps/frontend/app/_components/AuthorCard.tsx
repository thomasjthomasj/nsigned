import type { User } from "@/_types/api";

type AuthorCardProps = {
  user: User;
};

export const AuthorCard = ({ user }: AuthorCardProps) => (
  <div className="w-full -mt-[5px] mb-[10px] pl-[20px] italic">
    <p>
      by{" "}
      <a href={`/profile/${user.username}`} className="!text-tertiary-500">
        {user.display_name}
      </a>
    </p>
    <p></p>
  </div>
);
