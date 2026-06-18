import { Button } from "@/_components/Button";

import type { LoggedInUser } from "@/_types/api";

type SubmitCTAProps = {
  next: () => void;
  user: LoggedInUser | null;
  userLoading: boolean;
};

export const SubmitCTA = ({ next, user, userLoading }: SubmitCTAProps) => (
  <div className="flex flex-1 flex-col gap-[10px] h-full flex-1">
    <div className="flex flex-col gap-[10px]">
      <h2>Welcome to _nsigned!</h2>
      <div className="flex flex-col gap-[10px]">
        <p>The DIY music blog where anyone can get reviewed by anyone!</p>
        <p>
          Read all about it{" "}
          <a className="font-bold" href="/about">
            here
          </a>
          .
        </p>
      </div>
    </div>
    <div className="mt-auto flex justify-between w-full">
      <div>
        {!userLoading &&
          (user ? (
            <a href="/request-review">
              <Button label="Get reviewed" />
            </a>
          ) : (
            <a href="/join">
              <Button label="Sign up" />
            </a>
          ))}
      </div>
      <Button
        className="!bg-background-500 border border-primary-300"
        onClick={next}
        label="Next"
      />
    </div>
  </div>
);
