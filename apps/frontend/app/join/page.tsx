import { redirect } from "next/navigation";

import { PageLayout } from "@/_components/PageLayout";
import { RegisterForm } from "@/_components/_forms/RegisterForm";
import { getMe } from "@/_utils/api.server";

type JoinProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

const Join = async ({ searchParams }: JoinProps) => {
  const redirectURL = (await searchParams).redirect ?? "/profile";
  const userResponse = await getMe();
  if (userResponse.status !== 401) {
    return redirect(redirectURL ?? "/");
  }

  return (
    <PageLayout title="Join">
      <div className="flex flex-col gap-[10px]">
        <p>
          If you already have an account, you can{" "}
          <a href={`/login${redirectURL ? `?redirect=${redirectURL}` : ""}`}>
            log in here
          </a>
          .
        </p>
        <div className="w-full">
          <RegisterForm />
        </div>
      </div>
    </PageLayout>
  );
};

export default Join;
