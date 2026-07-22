"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth, useTrackUpload } from "@/_hooks";
import { genres } from "@/_utils/genre";

import type { Genre } from "@/_types/api";

export const CreateReleaseForm = () => {
  const [artistName, setArtistName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [genre, setGenre] = useState<Genre | null>(null);
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [imageValid, setImageValid] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const { user } = useAuth();
  const {
    upload,
    progress,
    status: uploadStatus,
    error: uploadError,
  } = useTrackUpload();

  const buttonDisabled = useMemo(() => {
    if (!user || !artistName || !title || !trackFile || !genre) return true;
    if (error) return true;
    if (["in_progress", "processing"].includes(uploadStatus)) return true;
    if (!imageUploaded) return true;
    return false;
  }, [user, artistName, title, trackFile, uploadStatus, imageUploaded]);

  useEffect(() => {
    if (uploadStatus === "invalid" && uploadError) {
      setError(uploadError);
      return;
    }
    if (["error", "invalid"].includes(uploadStatus))
      setError("Could not upload file");
  }, []);

  useEffect(() => {
    if (uploadStatus === "complete") {
      // do something!
      // console.log("SUCCESS");
    }
  }, [uploadStatus]);

  const handleSubmit = useCallback(async () => {
    if (!trackFile || !artistName || !title || !genre) return;

    await upload({
      file: trackFile,
      title,
      genre,
      artistName,
    });
  }, [trackFile, title, genre, artistName]);

  const canUploadImage = useMemo(() => {
    if (["in_progress", "processing", "complete"].includes(uploadStatus))
      return false;
    if (!imageFile) return false;
    if (isUploadingImage) return false;
    return true;
  }, [imageFile, isUploadingImage, uploadStatus]);

  useEffect(() => {
    if (!canUploadImage) return;
    const img = new Image();
    img.src = window.URL.createObjectURL(imageFile!);
    img.onload = () => {
      if (img.naturalWidth === 1000 && img.naturalHeight === 1000) {
        setImageValid(true);
      }
      window.URL.revokeObjectURL(img.src);
    };
  }, [imageFile, canUploadImage]);

  const uploadImage = useCallback(async () => {
    setIsUploadingImage(true);
    //
    setIsUploadingImage(false);
  }, []);

  useEffect(() => {
    if (canUploadImage && imageValid) uploadImage();
  }, [uploadImage, canUploadImage, imageValid]);

  if (uploadStatus === "in_progress") return <p>Uploading: {progress}%</p>;
  if (uploadStatus === "processing") return <p>Processing</p>;
  if (uploadStatus === "complete") return <p>Complete!</p>;

  return (
    <form
      className="flex flex-col gap-[15px] max-w-[450px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {error && <p className="text-primary-500">{error}</p>}
      <div className="flex flex-col w-full gap-[10px]">
        <FormField
          placeholder="Artist name"
          name="artist-name"
          required
          onChange={(e) => setArtistName(e.target.value)}
          value={artistName}
        />
        <FormField
          placeholder="Track title"
          name="track-title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <div className="flex flex-col gap-[5px]">
          <label className="font-bold" htmlFor="genre">
            Which of these most closely describes your music?
          </label>
          <div>
            <select
              className={classNames("bg-background-500 p-[8px]", {
                "border border-1 border-primary-500": !genre,
                "border border-1 border-background-500": genre,
              })}
              name="genre"
              id="genre"
              value={genre ?? ""}
              onChange={(e) => setGenre(e.target.value as Genre)}
            >
              <option value="" disabled>
                Select...
              </option>
              {Object.entries(genres).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-[5px] bg-background-500 p-[20px]">
          <label className="font-bold" htmlFor="cover">
            Cover art
          </label>
          <p
            className={classNames({
              "text-primary-500": imageFile && !imageValid,
            })}
          >
            Must be a <span className="font-bold">1000 x 1000px</span>{" "}
            <span className="font-bold">.jpg</span> or{" "}
            <span className="font-bold">.png</span> file.
          </p>
          <input
            className="bg-background p-[10px]"
            type="file"
            accept=".jpg, .png"
            name="cover"
            disabled={isUploadingImage}
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="flex flex-col gap-[5px] bg-background-500 p-[20px]">
          <label className="font-bold" htmlFor="track">
            Track upload
          </label>
          <p>
            Must be a <span className="font-bold">.wav</span> file no larger
            than <span className="font-bold">250MB</span>
          </p>
          <input
            className="bg-background p-[10px]"
            type="file"
            accept=".wav"
            name="track"
            onChange={(e) => setTrackFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div>
          <Button label="Upload" type="submit" disabled={buttonDisabled} />
        </div>
      </div>
    </form>
  );
};
