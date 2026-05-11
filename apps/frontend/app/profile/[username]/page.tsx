import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ProfileReviews } from "@/_components/ProfileReviews";
import { get } from "@/_utils/api.server";
import { sanitizeHtml, upper } from "@/_utils/text";

import type { Article, Profile as ProfileType } from "@/_types/api";

type ProfileProps = {
  params: Promise<{
    username: string;
  }>;
};

const Profile = async ({ params }: ProfileProps) => {
  const { username } = await params;
  const profileResponse = await get<ProfileType>({
    endpoint: `users/get/${username}`,
  });
  if (!profileResponse.ok)
    return profileResponse.status === 404 ? (
      <Error error="This user not found" />
    ) : (
      <Error />
    );

  const { data: profile } = profileResponse;

  const [authoredResponse, reviewsResponse] = await Promise.all([
    get<Article[]>({
      endpoint: "articles",
      data: { author: profile.id, page_size: 4, type: "review" },
    }),
    get<Article[]>({
      endpoint: "articles",
      data: { artist_user_id: profile.id, page_size: 4, type: "review" },
    }),
  ]);

  const reviewsWritten = authoredResponse.ok
    ? authoredResponse.data
    : ([] as Article[]);
  const reviewsReceived = reviewsResponse.ok
    ? reviewsResponse.data
    : ([] as Article[]);

  return (
    <PageLayout title={profile.display_name}>
      <div className="flex flex-col w-full gap-[10px]">
        {profile.fundraiser_link && (
          <div>
            <p>
              <a href={profile.fundraiser_link} target="_blank">
                Support {profile.display_name}
              </a>
            </p>
          </div>
        )}
        {profile.bio && (
          <div
            className="space-y-[10px]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(profile.bio) }}
          />
        )}
        <div className="flex flex-col mt-[20px] gap-[20px]">
          <ProfileReviews articles={reviewsWritten} title="Writing" />
          <ProfileReviews articles={reviewsReceived} title="Coverage" />
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
