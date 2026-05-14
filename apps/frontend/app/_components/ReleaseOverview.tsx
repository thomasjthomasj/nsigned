type ReleaseOverviewProps = {
  artistName?: string;
  title: string;
  label?: string;
  imageURL: string;
  releaseType: "track" | "album";
  link: string;
};

export const ReleaseOverview = ({
  artistName,
  title,
  label,
  imageURL,
  releaseType,
  link,
}: ReleaseOverviewProps) => (
  <a href={link} target="_blank">
    <div className="flex gap-[10px] w-full">
      <img src={imageURL} />
      <div className="flex-col gap-[5px]">
        {artistName && <p>{artistName}</p>}
        <p>{title}</p>
        {label && <p>{label}</p>}
        <p>
          Release type: <span className="capitalize">{releaseType}</span>
        </p>
      </div>
    </div>
  </a>
);
