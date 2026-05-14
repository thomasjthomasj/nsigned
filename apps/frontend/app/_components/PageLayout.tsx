import { AuthRedirect } from "@/_components/AuthRedirect";

type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
  requireLoggedIn?: boolean;
};

export const PageLayout = ({
  title,
  children,
  requireLoggedIn,
}: PageLayoutProps) => (
  <div className="w-full flex-1">
    {requireLoggedIn && <AuthRedirect />}
    <h2>{title}</h2>
    {children}
  </div>
);
