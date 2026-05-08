import classNames from "classnames";

import { Button } from "@/_components/Button";

import { Logo } from "./Logo";
import { Profile } from "./Profile";

export const Header = () => (
  <div
    className={classNames(
      "flex items-between justify-between w-full m-[10px] pb-[10px]",
      "border-b border-secondary-500 mb-[30px]",
    )}
  >
    <Logo />
    <div className="flex items-center h-full gap-[10px]">
      <div className="flex gap-[5px]">
        <a href="/request-review">
          <Button label="Get reviewed" />
        </a>
        <a href="/review-requests">
          <Button label="Write review" />
        </a>
        <Profile />
      </div>
    </div>
  </div>
);
