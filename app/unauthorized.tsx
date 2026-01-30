"use client";
import { Button } from "@/ui/primitives/button";
import Link from "next/link";

export default function UnauthorisedErrorPage() {
  return (
    <div className="h-full min-h-screen w-full flex flex-col items-center justify-center">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">401</h1>
        <span className="font-medium">Unauthorized Access</span>
        <p className="text-center text-muted-foreground">
          Please log in with the appropriate credentials <br /> to access this
          resource.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/">
              <Button className="text-white dark:text-black">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
