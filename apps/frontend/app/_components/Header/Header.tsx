import classNames from "classnames";
import { Fragment } from "react";

import { Button } from "@/_components/Button";
import { KofiIcon } from "@/_components/_icons/KofiIcon";
import { genres } from "@/_utils/genre";

import { Logo } from "./Logo";
import { Menu } from "./Menu";
import { Notifications } from "./Notifications";

export const Header = () => (
  <>
    <div
      className={classNames(
        "flex items-between justify-between w-full m-[10px] pb-[10px]",
        "border-b border-secondary-500 pt-[10px]",
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
          <a
            href="https://ko-fi.com/godribbon"
            className="leading-[24px] text-[24px]"
            target="_blank"
          >
            <Button
              className="bg-secondary-500 h-[34px]"
              label={<KofiIcon />}
            />
          </a>
          <Notifications />
          <Menu />
        </div>
      </div>
    </div>
    <div className="justify-between m-[10px] pb-[10px] mb-[30px] w-full flex">
      {Object.entries(genres).map(([slug, name], i) => (
        <Fragment key={slug}>
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
                  <span
                    key={n}
                    className={classNames({
                      "max-[430px]:hidden inline": i > 0,
                    })}
                  >
                    {n}
                  </span>
                  <span className="max-[430px]:hidden inline">
                    {i + 1 !== name.split("//").length && (
                      <>
                        //
                        <br />
                      </>
                    )}
                  </span>
                </Fragment>
              ))}
            </a>
          </div>
          {i !== Object.keys(genres).length - 1 && (
            <div className="self-stretch border-l-1 border-background-500" />
          )}
        </Fragment>
      ))}
    </div>
  </>
);
