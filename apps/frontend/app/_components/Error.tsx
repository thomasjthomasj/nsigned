export const Error = ({
  error = "There was an error loading this page. Please try again later.",
}: {
  error?: string;
}) => (
  <div className="flex w-full">
    <p>{error}</p>
  </div>
);
