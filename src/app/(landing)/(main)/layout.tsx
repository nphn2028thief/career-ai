import { ILayoutProps } from "@/types/layout";

function MainLayout({ children }: ILayoutProps) {
  return <main className="container mx-auto pb-20">{children}</main>;
}

export default MainLayout;
