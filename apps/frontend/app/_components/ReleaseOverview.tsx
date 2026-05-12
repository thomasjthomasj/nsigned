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
  <div className="flex gap-[10px] w-full">
    <a href={link} target="_blank">
      <img src={imageURL} />
    </a>
    <div className="flex-col gap-[5px]">
      {artistName && (
        <p>
          <a href={link} target="_blank">
            {artistName}
          </a>
        </p>
      )}
      <p>
        <a href={link} target="_blank">
          {title}
        </a>
      </p>
      {label && <p>{label}</p>}
      <p>
        Release type: <span className="capitalize">{releaseType}</span>
      </p>
    </div>
  </div>
);
