"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { WordCount } from "@/_components/WordCount";
import { post } from "@/_utils/api.client";

type ProfileFormProps = {
  profile: {
    displayName: string;
    bio: string | null;
    fundraiserLink: string | null;
  };
};

const MAX_BIO_WORDS = 250;

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(profile.displayName);
  const [bio, setBio] = useState<string | null>(profile.bio);
  const [fundraiserLink, setFundraiserLink] = useState<string | null>(
    profile.fundraiserLink,
  );
  const [bioWordCount, setBioWordCount] = useState<number>(0);

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

  const buttonDisabled = useMemo(
    () => loading || bioWordCount > MAX_BIO_WORDS,
    [loading, bioWordCount],
  );

  return (
    <div className="flex flex-col gap-[15px]">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-[5px]">
        <label htmlFor="displayName">Display name</label>
        <FormField
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <label htmlFor="bio">Bio</label>
        <div className="flex flex-col">
          <FormField
            name="bio"
            type="textarea"
            value={bio ?? ""}
            onChange={(e) => setBio(e.target.value)}
            className="w-full"
            placeholder={`No more than ${MAX_BIO_WORDS} words`}
          />
          <WordCount text={bio ?? ""} setWordCount={setBioWordCount} />
        </div>
        <label htmlFor="fundraiserLink">Fundraiser link</label>
        <FormField
          name="fundraiserLink"
          value={fundraiserLink ?? ""}
          onChange={(e) => setFundraiserLink(e.target.value)}
        />
      </div>
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
