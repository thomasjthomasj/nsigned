"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { post } from "@/_utils/api.client";

type ProfileFormProps = {
  profile: {
    displayName: string;
    bio: string | null;
    fundraiserLink: string | null;
  };
};

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(profile.displayName);
  const [bio, setBio] = useState<string | null>(profile.bio);
  const [fundraiserLink, setFundraiserLink] = useState<string | null>(
    profile.fundraiserLink,
  );
  const router = useRouter();

  const handleUpdate = useCallback(async () => {
    setLoading(true);
    const response = await post({
      endpoint: "users/update",
      data: {
        display_name: displayName,
        bio,
        fundraiser_link: fundraiserLink,
      },
    });
    if (response.ok) router.refresh();
    setLoading(false);
  }, [displayName, bio, fundraiserLink]);

  const buttonDisabled = useMemo(() => loading, [loading]);

  return (
    <div className="flex flex-col w-full">
      <FormField
        name="displayName"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <FormField
        name="bio"
        type="textarea"
        value={bio ?? ""}
        onChange={(e) => setBio(e.target.value)}
        className="w-full"
      />
      <FormField
        name="fundraiserLink"
        value={fundraiserLink ?? ""}
        onChange={(e) => setFundraiserLink(e.target.value)}
      />
      <div>
        <Button
          label="Update"
          onClick={handleUpdate}
          disabled={buttonDisabled}
        />
      </div>
    </div>
  );
};
