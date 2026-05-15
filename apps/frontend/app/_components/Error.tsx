import { PageLayout } from "@/_components/PageLayout";

export const Error = ({
  error = "There was an error loading this page. Please try again later.",
  title = "Everything is broken",
  requireLoggedIn = false,
}: {
  error?: string;
  title?: string;
  requireLoggedIn?: boolean;
}) => (
  <PageLayout title={title} requireLoggedIn={requireLoggedIn}>
    <p>{error}</p>
  </PageLayout>
);
