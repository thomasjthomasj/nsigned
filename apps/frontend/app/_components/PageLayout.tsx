type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const PageLayout = ({ title, children }: PageLayoutProps) => (
  <div className="w-full flex-1">
    <h2>{title}</h2>
    {children}
  </div>
);
