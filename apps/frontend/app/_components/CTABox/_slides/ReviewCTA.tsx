import { Button } from "@/_components/Button";

export const ReviewCTA = ({ count }: { count: number }) => (
  <div className="flex flex-col gap-[10px] h-full flex-1">
    <div className="flex flex-col gap-[10px]">
      <h2>
        _nsigned wants <span className="text-secondary-500">YOU</span> to write
        a review!
      </h2>
      <div className="flex flex-col gap-[10px]">
        <p>
          There are currently{" "}
          <span className="font-bold text-tertiary-500">{count}</span> releases
          awaiting review.
        </p>
        <p>
          This site relies on people both receiving <strong>and</strong>{" "}
          offering reviews.
        </p>
      </div>
    </div>
    <div className="mt-auto flex justify-end w-full">
      <a href="/review-requests">
        <Button label="Browse releases" />
      </a>
    </div>
  </div>
);
