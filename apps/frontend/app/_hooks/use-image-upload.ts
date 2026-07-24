import { useCallback, useState } from "react";

import { post } from "@/_utils/api.client";
import { uploadFile } from "@/_utils/uploads";

import type { ImageUploadURL } from "@/_types/api";
import type { UploadStatus } from "@/_types/uploads";

type UploadArgs = {
  file: File;
  filename: string;
};

export const useImageUpload = () => {
  const [status, setStatus] = useState<UploadStatus>("pending");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [imageUploadID, setImageUploadID] = useState<number | null>(null);

  const upload = useCallback(async (args: UploadArgs) => {
    setStatus("in_progress");
    const { file, filename } = args;
    const filetype = (() => {
      if (file.type === "image/jpeg") return "jpg";
      if (file.type === "image/png") return "png";
      setStatus("invalid");
      setError(`Invalid file type ${file.type}`);
      return;
    })();
    if (!filetype) return;

    const uploadURLResponse = await post<ImageUploadURL>({
      endpoint: "images/start-upload",
      data: {
        filename,
        filetype,
      },
      withAuth: true,
    });
    if (!uploadURLResponse.ok) {
      setStatus("error");
      setError("Could not resolve upload URL");
      return;
    }

    const { upload_url: uploadURL, image_upload_id: newImageUploadID } = uploadURLResponse.data;
    setImageUploadID(newImageUploadID);

    try {
      await uploadFile(file, uploadURL, setProgress);
      setStatus("complete");
    } catch {
      setStatus("error");
      setError("An error occurred uploading image");
    }
  }, []);

  return {
    upload,
    progress,
    status,
    error,
    imageUploadID,
  };
};
