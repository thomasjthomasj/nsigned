import { PageLayout } from "@/_components/PageLayout";
import { get } from "@/_utils/api.server";
import { handleError } from "@/_fns/handle-error";

import type { Author } from "@/_types/api";

const Writers = async () => {
  const authorResponse = await get<Author[]>({
    endpoint: "users/authors",
    cacheKey: "AUTHORS",
    withAuth: false,
  });

  if (!authorResponse.ok) return handleError({ errorResponse: authorResponse });

  const { data: writers } = authorResponse;

  return <PageLayout title="Writers">
    <div className="flex flex-col gap-[20px]">
      <ul>
        {writers.map(w => (
          <li key={w.id}><a href={`/profile/${w.username}`}>{w.display_name}</a></li>
        ))}
      </ul>
    </div>
  </PageLayout>
}

export default Writers;
