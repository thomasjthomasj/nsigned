import classNames from "classnames";

import { upper } from "@/_utils/text";

import type { Article } from "@/_types/api";

type ReleaseArticleLinkProps = {
  article: Article;
  size?: "lg" | "sm";
  showReviewType?: boolean;
};

export const ReleaseArticleLink = ({
  article,
  showReviewType,
  ...rest
}: ReleaseArticleLinkProps) => {
  const { release } = article;
  if (!release) return null;

  const size = (rest.size ?? release.release_type === "album") ? "lg" : "sm";

  const { sm: smImage, md: lgImage } = release.images;
  const smImgSize = 96;
  const lgImgSize = 200;
  const image = size === "lg" ? release.images.md : release.images.sm;
  const imgSize = size === "lg" ? 200 : 96;

  return (
    <a key={article.id} href={`/article/${article.id}/${article.slug}`}>
      <div className="flex gap-[25px] hover:bg-background-500" key={article.id}>
        <div className="p-[10px] shrink-0">
          <img
            className={classNames({
              "hidden": size === "sm",
              "hidden sm:block": size === "lg",
            })}
            src={lgImage.url}
            alt={`${release.title} cover art`}
            height={lgImgSize}
            width={lgImgSize}
          />
          <img
            className={classNames({
              "block sm:hidden": size === "lg",
            })}
            src={smImage.url}
            alt={`${release.title} cover art`}
            height={smImgSize}
            width={smImgSize}
          />
        </div>
        <div className="py-[10px]">
          <h3 className={classNames({ "!text-[1rem]": size === "sm" })}>
            {release.title}
          </h3>
          {release.primary_artist && (
            <h4 className={classNames({ "!text-[0.8rem]": size === "sm" })}>
              {release.primary_artist.name}
            </h4>
          )}
          {showReviewType && (
            <p className="text-[12px]">{upper(release.release_type)} review</p>
          )}
        </div>
      </div>
    </a>
  );
};
