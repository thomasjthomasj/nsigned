"use client";

import { FormField } from "@/_components/FormField";

type SearchBarProps = {
  term: string;
  onChange: (searchTerm: string) => void;
};

export const SearchBar = ({ term, onChange }: SearchBarProps) => (
  <FormField
    name="search-bar"
    placeholder="Search"
    onChange={(e) => onChange(e.target.value)}
    value={term}
  />
);
