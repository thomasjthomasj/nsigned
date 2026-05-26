type ReleaseOverviewProps = {
  artistName?: string;
  title: string;
  label?: string;
  imageURL: string;
  releaseType: "track" | "album";
  link: string;
  daysSince?: number;
};

export const ReleaseOverview = ({
  artistName,
  title,
  label,
  imageURL,
  releaseType,
  link,
  daysSince,
}: ReleaseOverviewProps) => {
  const daysAgo = (() => {
    if (daysSince === undefined) return null;
    if (daysSince === 0) return "today";
    if (daysSince === 1) return "yesterday";
    return `${daysSince} days ago`;
  })();

  return (
    <a href={link} target="_blank">
      <div className="flex gap-[10px] w-full">
        <img src={imageURL} className="border border-background-500" />
        <div className="flex-col gap-[5px]">
          {artistName && <p>{artistName}</p>}
          <p>{title}</p>
          {label && <p>{label}</p>}
          <p>
            Release type: <span className="capitalize">{releaseType}</span>
          </p>
          {daysAgo && (
            <p>
              Requested <strong>{daysAgo}</strong>.
            </p>
          )}
        </div>
      </div>
    </a>
  );
};
