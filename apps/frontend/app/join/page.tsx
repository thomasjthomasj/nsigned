import { redirect } from "next/navigation";

import { PageLayout } from "@/_components/PageLayout";
import { LoginForm } from "@/_components/_forms/LoginForm";
import { getMe } from "@/_utils/api.server";

type JoinProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

const Join = async ({ searchParams }: JoinProps) => {
  const { redirect: redirectURL } = await searchParams;
  const userResponse = await getMe();
  if (userResponse.status !== 401) {
    return redirect(redirectURL ?? "/");
  }

  return (
    <PageLayout title="Join // Log in">
      <div className="w-full">
        <LoginForm />
      </div>
    </PageLayout>
  );
};

export default Join;
