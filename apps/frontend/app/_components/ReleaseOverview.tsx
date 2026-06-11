import { genres } from "@/_utils/genre";

import type { Genre, Images } from "@/_types/api";

type ReleaseOverviewProps = {
  artistName?: string;
  title: string;
  label?: string;
  images: Images;
  genre?: Genre | null;
  releaseType: "track" | "album";
  link: string;
  daysSince?: number;
  claimed?: boolean;
};

export const ReleaseOverview = ({
  artistName,
  title,
  label,
  images,
  genre,
  releaseType,
  link,
  daysSince,
  claimed,
}: ReleaseOverviewProps) => {
  const daysAgo = (() => {
    if (daysSince === undefined) return null;
    if (daysSince === 0) return "today";
    if (daysSince === 1) return "yesterday";
    return `${daysSince} days ago`;
  })();

  return (
    <a href={link} target="_blank">
      <div className="flex flex-col sm:flex-row gap-[10px] w-full">
        <img
          src={images.sm.url}
          className="border border-background-500 hidden sm:block"
        />
        <img
          src={images.md.url}
          className="border border-background-500 block sm:hidden"
        />
        <div className="flex-col gap-[5px] mr-[10px]">
          {genre && (
            <p className="font-bold text-primary-300">{genres[genre]}</p>
          )}
          {artistName && <p className="text-secondary-500">{artistName}</p>}
          <p className="font-bold">{title}</p>
          {label && <p>{label}</p>}
          <p className="text-foreground-500">
            Release type: <span className="capitalize">{releaseType}</span>
          </p>
          {daysAgo && (
            <p className="text-foreground-500">
              Requested{" "}
              <span className="font-bold text-foreground">{daysAgo}</span>.
            </p>
          )}
          {claimed && (
            <p className="text-foreground-500">
              <strong>A user has claimed this for review.</strong>
            </p>
          )}
        </div>
      </div>
    </a>
  );
};
