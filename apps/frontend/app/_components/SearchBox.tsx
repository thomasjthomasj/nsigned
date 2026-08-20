"use client";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { SearchIcon } from "@/_components/_icons/SearchIcon";

export const SearchBox = () => (
  <div className="flex flex-col w-full">
    <h2>
      <a href="/search">Search</a>
    </h2>
    <form method="GET" action="/search" className="flex w-full">
      <div className="flex gap-[5px] w-full">
        <FormField name="term" className="flex-1" />
        <Button label={<SearchIcon />} type="submit" />
      </div>
    </form>
  </div>
);
