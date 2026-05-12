import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ReleaseOverview } from "@/_components/ReleaseOverview";
import { CreateArticle } from "@/_components/_forms/CreateArticle";
import { get, getMe } from "@/_utils/api.server";

import type { ReviewRequest } from "@/_types/api";

type WriteReviewProps = {
  params: Promise<{ id: string }>;
};

const WriteReview = async ({ params }: WriteReviewProps) => {
  const { id } = await params;
  const [userResponse, reviewRequestResponse] = await Promise.all([
    getMe(),
    get<ReviewRequest>({ endpoint: `music/review-request/${id}` }),
  ]);

  if (!userResponse.ok) return <Error />;
  if (!reviewRequestResponse.ok)
    return reviewRequestResponse.status === 404 ? (
      <Error error="Not found" />
    ) : (
      <Error />
    );

  const { data: user } = userResponse;
  const { data: reviewRequest } = reviewRequestResponse;
  if (reviewRequest.claimed_by?.id !== user.id) {
    return <Error error="You have not claimed this review." />;
  }
  if (reviewRequest.rejected_by) {
    return (
      <Error error="This release has been deemed ineligible for review." />
    );
  }
  if (reviewRequest.article) {
    return <Error error="This release has already been reviewed." />;
  }

  const { release } = reviewRequest;
  const title = `Reviewing "${release.title}"${release.primary_artist ? ` by ${release.primary_artist.name}` : ""}`;

  return (
    <PageLayout title={title}>
      <div className="flex flex-col gap-[20px]">
        <div>
          <h3>Reviewing:</h3>
          <ReleaseOverview
            artistName={release.primary_artist?.name}
            title={release.title}
            label={release.label?.name}
            imageURL={release.images.sm.url}
            releaseType={release.release_type}
            link={release.links[0].url}
          />
        </div>
        <div>
          <h3>Tips for reviewing</h3>
          <ul>
            <li>
              Be honest, while still considering the feelings of the artist.
              Someone worked hard on this release and they deserve to be treated
              with respect.
            </li>
            <li>
              Speak to the listener, not the artist. This is a review, not an
              advice column.
            </li>
            <li>
              Don't be crass! Swearing is okay in moderation, but slurs are only
              acceptable when quoting lyrics where they must be censored with
              asterisks (*).
            </li>
            <li>
              Do <strong className="!text-secondary-300">not</strong> use AI to write your review.
            </li>
            <li>
              Refer to the{" "}
              <a href="/editorial-guide" target="_blank" className="!text-primary-300">
                editorial guide
              </a>
              .
            </li>
          </ul>
        </div>
        <div>
          <CreateArticle reviewRequest={reviewRequest} />
        </div>
      </div>
    </PageLayout>
  );
};

export default WriteReview;
