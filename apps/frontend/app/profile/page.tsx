import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ProfileForm } from "@/_components/_forms/ProfileForm";
import { get, getMe } from "@/_utils/api.server";

import type { Profile } from "@/_types/api";

const EditProfile = async () => {
  const userResponse = await getMe();
  if (!userResponse.ok) return <Error />;
  const { data: user } = userResponse;
  const profileResponse = await get<Profile>({
    endpoint: `users/get/${user.username}`,
  });
  if (!profileResponse.ok) return <Error />;
  const { data: profile } = profileResponse;

  return (
    <PageLayout title={`Editing ${user.display_name}`}>
      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col">
          <h3>Username</h3>
          <p>{user.username}</p>
        </div>
        <div className="flex flex-col">
          <h3>Email</h3>
          <p>{user.email}</p>
        </div>
        <ProfileForm
          profile={{
            displayName: profile.display_name,
            bio: profile.bio,
            fundraiserLink: profile.fundraiser_link,
          }}
        />
      </div>
    </PageLayout>
  );
};

export default EditProfile;
