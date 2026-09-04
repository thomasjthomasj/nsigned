import { Button } from "@/_components/Button";
import { PageLayout } from "@/_components/PageLayout";
import { getMe } from "@/_utils/api.server";
import { getAuthorizeURL } from "@/_utils/patreon/auth.server";

const Patreon = async () => {
  const authURL = await getAuthorizeURL();
  const userResponse = await getMe();
  const user = userResponse.ok ? userResponse.data : null;

  const userStatus: "logged_out" | "patreon" | "non_patreon" = (() => {
    if (!user) return "logged_out";
    return user.patreon_tier ? "patreon" : "non_patreon";
  })();

  if (user?.patreon_tier) {
    return (
      <PageLayout title="Thank you for your support!">
        <div className="w-full flex flex-col gap-[15px]">
          <p>blah blah blah</p>
          <a href="https://www.patreon.com/cw/nsigned" target="_blank">
            <Button label="Manage your subscription" />
          </a>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Become a supporter!">
      <div className="w-full flex flex-col gap-[15px]">
        <p>blah blah blah</p>
        {!user ? (
          <p>
            You will need to sign up or log in before subscribing to Patreon.
          </p>
        ) : (
          <p>
            If you have already subscribed via Patreon, please click the button
            below to connect your account.
          </p>
        )}
        <div className="flex gap-[10px]">
          {!user && <Button label="Join _nsigned" />}
          <a href={authURL}>
            <Button label="Support _nsigned on Patreon" disabled={!user} />
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default Patreon;
