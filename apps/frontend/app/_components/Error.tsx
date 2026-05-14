import { PageLayout } from "@/_components/PageLayout";
import { Error as ErrorType } from "@/_types/api";

type ErrorProps = {
  error?: string;
  title?: string;
  requireLoggedIn?: boolean;
  errorResponse?: ErrorType;
};

export const Error = ({
  error = "There was an error loading this page. Please try again later.",
  title = "Everything is broken",
  requireLoggedIn = false,
  errorResponse,
}: ErrorProps) => {
  // eslint-disable-next-line no-console
  if (errorResponse) console.error(errorResponse.error);
  return (
    <PageLayout title={title} requireLoggedIn={requireLoggedIn}>
      <p>{error}</p>
    </PageLayout>
  );
};
