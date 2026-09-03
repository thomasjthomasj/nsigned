import { PageLayout } from "@/_components/PageLayout";
import { Button } from "@/_components/Button";

import { getAuthorizeURL } from "@/_utils/patreon/auth.server";

const Patreon = async () => {
  const authURL = await getAuthorizeURL();

  return (

// TODO disable button for non-users

    <PageLayout title="Become a supporter!">
      <div className="w-full flex flex-col gap-[15px]">
        <p>blah blah blah</p>
        <a href={authURL} target="_blank">
          <Button label="Support _nsigned on Patreon" />
        </a>
      </div>
    </PageLayout>
  )
}

export default Patreon;
