import { Logo } from "./Logo";
import { Profile } from "./Profile";

export const Header = () => (
  <div className="flex items-between justify-between w-full">
    <Logo />
    <div className="flex">
      <a href="/request-review">Request review</a>
      <a href="/review-requests">Review something</a>
      <Profile />
    </div>
  </div>
);
