import { Loader } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="h-full min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-8 lg:flex-row">
        <Loader className="h-12 w-12 animate-spin text-gray-500" aria-label="Loading..." />
      </div>
    </div>
  );
}
