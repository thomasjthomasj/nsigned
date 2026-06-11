import classNames from "classnames";
import { Fragment } from "react";

import { Button } from "@/_components/Button";
import { genres } from "@/_utils/genre";

import { Logo } from "./Logo";
import { Menu } from "./Menu";
import { Notifications } from "./Notifications";

export const Header = () => (
  <>
    <div
      className={classNames(
        "flex items-between justify-between w-full m-[10px] pb-[10px]",
        "border-b border-secondary-500 ",
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
          <Notifications />
          <Menu />
        </div>
      </div>
    </div>
    <div className="justify-between m-[10px] pb-[10px] mb-[30px] w-full flex">
      {Object.entries(genres).map(([slug, name]) => (
        <div key={slug}>
          <a
            href={`/archive?genre=${slug}`}
            className="text-nowrap text-secondary-300 hover:text-primary-300 text-[12px] hidden lg:block"
          >
            {name}
          </a>
          <a
            href={`/archive?genre=${slug}`}
            className="text-nowrap text-secondary-300 hover:text-primary-300 text-[12px] block lg:hidden text-center"
          >
            {name.split("//").map((n, i) => (
              <Fragment key={n}>
                {n}
                {i + 1 !== name.split("//").length && (
                  <>
                    //
                    <br />
                  </>
                )}
              </Fragment>
            ))}
          </a>
        </div>
      ))}
    </div>
  </>
);
