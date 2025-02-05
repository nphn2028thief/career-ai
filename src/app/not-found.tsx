import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import EPath from "@/constants/path";

function NotFound() {
  return (
    <div className="min-h-[100vh] flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link href={EPath.HOME}>
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
