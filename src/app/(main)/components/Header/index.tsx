import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EPath from "@/constants/path";

function Header() {
  return (
    <header className="fixed left-0 top-0 right-0 z-[999] border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav className="h-[66px] container mx-auto px-4 flex justify-between items-center">
        <Link href={EPath.HOME}>
          <Image
            src="/logo.png"
            alt="senai-logo"
            width={200}
            height={60}
            priority
            className="p-1 object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href={EPath.DASHBOARD}>
              <Button variant="outline">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:block">Industry Insight</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <StarsIcon className="w-4 h-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="w- h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={EPath.RESUME} className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Build resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={EPath.COVER_LETTER}
                    className="flex items-center gap-2"
                  >
                    <PenBox className="w-4 h-4" />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={EPath.INTERVIEW_PREP}
                    className="flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl={EPath.HOME}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default Header;
