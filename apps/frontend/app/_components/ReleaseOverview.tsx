type ReleaseOverviewProps = {
  artistName: string;
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
  <div className="flex gap-[10px]">
    <img src={imageURL} />
    <div className="flex-col gap-[5px]">
      <p>
        <a href={link} target="_blank">
          {artistName}
        </a>
      </p>
      <p>
        {title} ({releaseType})
      </p>
      {label && <p>{label}</p>}
    </div>
  </div>
);
