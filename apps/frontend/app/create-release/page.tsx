import { PageLayout } from "@/_components/PageLayout";
import { CreateReleaseForm } from "@/_components/_forms/CreateReleaseForm";
import { handleError } from "@/_fns/handle-error";
import { getMe } from "@/_utils/api.server";

const CreateRelease = async () => {
  const userResponse = await getMe();
  if (!userResponse.ok) return handleError({ errorResponse: userResponse });

  const { data: user } = userResponse;
  if (user.role !== "admin") return handleError({ status: 404 });

  return (
    <PageLayout title="Create a release">
      <div className="flex flex-col gap-[20px]">
        <CreateReleaseForm />
      </div>
    </PageLayout>
  );
};

export default CreateRelease;
