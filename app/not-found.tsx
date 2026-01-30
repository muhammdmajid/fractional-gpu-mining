"use client";
import { Button } from "@/ui/primitives/button";
import Link from "next/link";

export default function NotFoundErrorPage() {
  return (
    <div className="h-full min-h-screen w-full flex flex-col items-center justify-center">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">Oops! Page Not Found!</span>
        <p className="text-center text-muted-foreground">
          It seems like the page you&apos;re looking for <br />
          does not exist or might have been removed.
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
