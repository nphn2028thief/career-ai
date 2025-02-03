import { ILayoutProps } from "@/types/layout";

function AuthLayout({ children }: ILayoutProps) {
  return (
    <main className="h-full flex justify-center items-center">{children}</main>
  );
}

export default AuthLayout;
