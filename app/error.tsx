"use client";
import { Button } from "@/ui/primitives/button";
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className={"h-full min-h-screen w-full flex flex-col items-center justify-center"}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-center text-muted-foreground">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>

        <div className="mt-6 flex gap-4">
          {/* Go Back Button */}
          <Button
            variant="outline"

            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
           {/* Back to Home Button with Link */}
           <Link href="/">
            <Button className="text-white dark:text-black">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
