"use client";

import { Button } from "@/ui/primitives/button";
import Link from "next/link";

export default function ForbiddenErrorPage() {


  return (
    <div className="h-full min-h-screen w-full flex flex-col items-center justify-center">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">403</h1>
        <span className="font-medium">Access Forbidden</span>
        <p className="text-center text-muted-foreground">
          You don&apos;t have necessary permission <br />
          to view this resource.
        </p>
        <div className="mt-6 flex gap-4">
           {/* Back to Home Button with Link */}
           <Link href="/">
          <Button className="text-white dark:text-black">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
