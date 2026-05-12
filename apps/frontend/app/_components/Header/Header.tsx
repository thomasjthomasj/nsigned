import classNames from "classnames";

import { Button } from "@/_components/Button";

import { Logo } from "./Logo";
import { Menu } from "./Menu";

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
          <Button label="Get reviewed" className="hidden sm:block" />
          <Button label="Submit" className="sm:hidden" />
        </a>
        <a href="/review-requests">
          <Button label="Write review" className="hidden sm:block" />
          <Button label="Write" className="sm:hidden" />
        </a>
        <Menu />
      </div>
    </div>
  </div>
);
