import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ProfileForm } from "@/_components/_forms/ProfileForm";
import { get, getMe } from "@/_utils/api.server";

import type { Profile } from "@/_types/api";

const EditProfile = async () => {
  const userResponse = await getMe();
  if (!userResponse.ok) return <Error />;
  const { data: user } = userResponse;

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
            displayName: user.display_name,
            bio: user.bio,
            fundraiserLink: user.fundraiser_link,
          }}
        />
      </div>
    </PageLayout>
  );
};

export default EditProfile;
