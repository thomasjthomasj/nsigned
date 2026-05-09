type IconWrapperProps = {
  children: React.ReactNode;
};

export const IconWrapper = ({ children }: IconWrapperProps) => (
  <span className="relative group inline-flex">{children}</span>
);
