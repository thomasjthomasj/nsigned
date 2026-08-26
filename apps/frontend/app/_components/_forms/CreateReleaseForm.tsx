"use client";

import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import slugify from "slugify";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth, useImageUpload, useTrackUpload } from "@/_hooks";
import { post } from "@/_utils/api.client";
import { genres } from "@/_utils/genre";

import type { Genre, Release } from "@/_types/api";

const LG_IMG_RESOLUTION = 1200;

export const CreateReleaseForm = () => {
  const [artistName, setArtistName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [genre, setGenre] = useState<Genre | null>(null);
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageValid, setImageValid] = useState<boolean>(false);
  const [imageURLsSet, setImageURLsSet] = useState<boolean>(false);

  const { user } = useAuth();
  const {
    upload: uploadTrack,
    progress: trackProgress,
    status: uploadTrackStatus,
    error: uploadTrackError,
    releaseID,
  } = useTrackUpload();
  const {
    upload: uploadImage,
    progress: imageProgress,
    status: uploadImageStatus,
    error: uploadImageError,
    imageUploadID,
  } = useImageUpload();

  const buttonDisabled = useMemo(() => {
    if (
      !user ||
      !artistName ||
      !title ||
      !trackFile ||
      !genre ||
      isUploadingImage
    )
      return true;
    if (error) return true;
    if (["in_progress", "processing"].includes(uploadTrackStatus)) return true;
    return false;
  }, [user, artistName, title, trackFile, uploadTrackStatus, isUploadingImage]);

  useEffect(() => {
    if (uploadTrackStatus === "invalid" && uploadTrackError) {
      setError(uploadTrackError);
      return;
    }
    if (["error", "invalid"].includes(uploadTrackStatus))
      setError("Could not upload file");
  }, []);

  useEffect(() => {
    if (uploadTrackStatus === "complete") {
      // do something!
      // console.log("SUCCESS");
    }
  }, [uploadTrackStatus]);

  const canUploadImage = useMemo(() => {
    if (["in_progress", "processing", "complete"].includes(uploadTrackStatus))
      return false;
    if (!imageFile) return false;
    if (isUploadingImage) return false;
    return true;
  }, [imageFile, isUploadingImage, uploadTrackStatus]);

  useEffect(() => {
    if (!canUploadImage) return;
    const img = new Image();
    img.src = window.URL.createObjectURL(imageFile!);
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setImageValid(w === h && w >= LG_IMG_RESOLUTION);
      window.URL.revokeObjectURL(img.src);
    };
  }, [imageFile, canUploadImage]);

  const imageFilename = useMemo(() => {
    const parts = [];
    if (artistName) parts.push(slugify(artistName).substring(0, 12));
    if (title) parts.push(slugify(title).substring(0, 12));
    parts.push(Math.floor(Date.now() / 1000));
    return parts.join("-");
  }, [artistName, title]);

  const handleSubmit = useCallback(async () => {
    if (
      !trackFile ||
      !artistName ||
      !title ||
      !genre ||
      !imageFile ||
      !imageValid
    )
      return;

    await Promise.all([
      uploadTrack({
        file: trackFile,
        title,
        genre,
        artistName,
      }),
      uploadImage({
        file: imageFile,
        filename: imageFilename,
      }),
    ]);
  }, [
    trackFile,
    uploadTrack,
    uploadImage,
    imageValid,
    title,
    genre,
    artistName,
    imageFile,
    imageFilename,
  ]);

  useEffect(() => {
    if (releaseID === null || imageUploadID === null) return;
    const attachImages = async () => {
      const response = await post<Release>({
        endpoint: `music/release/attach-images/${releaseID}/${imageUploadID}`,
        withAuth: true,
      });
      if (!response.ok) {
        setError("Could not attach images to release");
        return;
      }
      setImageURLsSet(true);
    };
    attachImages();
  }, [uploadImageStatus, releaseID, imageUploadID]);

  if (uploadTrackStatus === "complete" && imageURLsSet)
    return <p>Everything is sorted</p>;

  if (uploadTrackStatus === "in_progress")
    return <p>Uploading: {trackProgress}%</p>;
  if (uploadTrackStatus === "processing") return <p>Processing</p>;
  if (uploadTrackStatus === "complete") return <p>Complete!</p>;

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
            Must be a <span className="font-bold">square .jpg file</span> with a
            minimum resolution of{" "}
            <span className="font-bold">
              {LG_IMG_RESOLUTION} x {LG_IMG_RESOLUTION}px
            </span>
            .
          </p>
          <input
            className="bg-background p-[10px]"
            type="file"
            accept=".jpg,.png"
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
