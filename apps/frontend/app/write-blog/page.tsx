import { PageLayout } from "@/_components/PageLayout";
import { CreateArticle } from "@/_components/_forms/CreateArticle";
import { handleError } from "@/_fns/handle-error";
import { getMe } from "@/_utils/api.server";

const WriteBlog = async () => {
  const userResponse = await getMe();
  if (!userResponse.ok) return handleError({ errorResponse: userResponse });
  const { data: user } = userResponse;

  if (user.role !== "admin") handleError({ status: 403 });

  return (
    <PageLayout title="Writing announcement post">
      <div className="flex flex-col gap-[20px]">
        <CreateArticle />
      </div>
    </PageLayout>
  );
};

export default WriteBlog;
