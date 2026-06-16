export const ReviewCTA = ({ count }: { count: number }) => (
  <div className="flex flex-1 flex-col gap-[10px]">
    <h2>
      _nsigned wants <span className="text-secondary-500">YOU</span> to write a
      review!
    </h2>
    <div className="flex flex-col gap-[10px]">
      <p>
        There are currently{" "}
        <span className="font-bold text-tertiary-500">{count}</span> releases
        awaiting review.
      </p>
      <p>
        This site relies on people both receiving <strong>and</strong> offering
        reviews.
      </p>
    </div>
    <p className="font-bold text-[18px] mt-auto">
      <a href="/review-requests" className="text-secondary-500">
        Review something now!
      </a>
    </p>
  </div>
);
