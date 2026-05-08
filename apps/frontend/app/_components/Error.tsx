import { PageLayout } from "@/_components/PageLayout";

export const Error = ({
  error = "There was an error loading this page. Please try again later.",
  title = "Everything is broken",
}: {
  error?: string;
  title?: string;
}) => (
  <PageLayout title={title}>
    <p>{error}</p>
  </PageLayout>
);
