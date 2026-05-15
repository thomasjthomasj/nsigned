import { PageLayout } from "@/_components/PageLayout";

export const Error = ({
  error = "Something somewhere went very wrong.",
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
