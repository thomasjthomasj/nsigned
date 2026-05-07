import { Button } from "@/_components/Button";

import { Logo } from "./Logo";
import { Profile } from "./Profile";

export const Header = () => (
  <div className="flex items-between justify-between w-full m-[10px]">
    <Logo />
    <div className="flex gap-[10px]">
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
