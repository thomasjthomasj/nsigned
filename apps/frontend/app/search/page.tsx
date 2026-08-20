import { PageLayout } from "@/_components/PageLayout";
import { Searcher } from "@/_components/Searcher";

import type { Article } from "@/_types/api";

type SearchProps = {
  searchParams: Promise<{
    term?: string;
  }>;
};

const Search = async ({ searchParams }: SearchProps) => {
  const { term } = await searchParams;
  const articles: Article[] = [];

  return (
    <PageLayout title="Search">
      <div className="w-full">
        <Searcher articles={articles} term={term ?? ""} />
      </div>
    </PageLayout>
  );
};

export default Search;
