
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { CardFooter } from "@/ui/primitives/card";
import Link from "next/link";


interface AuthCardFooterProps {
  message?: string;
  linkHref?: string;
  linkText?: string;
}

export default function AuthCardFooter({
  message="Don`t have an account?",
  linkHref="/auth/sign-up",
  linkText="Sign up",
}: AuthCardFooterProps) {
  const fontSize = useResponsiveFont();

  return (
    <CardFooter className="flex flex-col items-center justify-center w-full mt-0">
      <div className="w-full border-t border-gray-300 mb-4" />
      <p
        className="text-center text-muted-foreground w-full"
        style={{ fontSize: `${0.8 * fontSize}px` }}
      >
        {message}{" "}
        <Link href={linkHref} className="no-underline font-bold hover:text-primary">
          {linkText}
        </Link>
      </p>
    </CardFooter>
  );
}
