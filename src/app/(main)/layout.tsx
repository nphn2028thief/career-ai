import { ILayoutProps } from "@/types/layout";
import Header from "./components/Header";

function MainLayout({ children }: ILayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <main className="flex-1 mt-[66px]">{children}</main>
      <footer className="bg-muted/50">
        <div className="container mx-auto py-4 text-center text-gray-200">
          <p>Made by Nhan Hoai Nguyen (阮仁)</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
