import { ArrowRight, Cpu, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui/primitives/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px]" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Heading */}
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:leading-[1.1] dark:text-white">
              Mine crypto{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                without the hardware
              </span>
            </h1>

            {/* Short Summary */}
            <p className="max-w-2xl text-base font-medium text-gray-600 md:text-lg lg:text-xl dark:text-gray-300">
              Own a share of GPU power and mine crypto without buying expensive hardware. 
              <span className="font-semibold text-primary"> We handle the rigs — you earn rewards.</span>
            </p>

            {/* CTA Buttons */}
          <div
  className="
    grid 
    grid-cols-1          /* Mobile: vertical stack */
    gap-3 sm:gap-4 
    sm:grid-cols-2       /* Tablet: 2×2 layout */
    lg:grid-cols-3       /* Desktop: 3 on top */
    w-full
  "
>

  {/* Start Mining */}
  <Link href="/auth/sign-up">
    <Button
      size="lg"
      className="w-full h-12 gap-1.5 px-8 text-base font-semibold"
    >
      Start Mining <ArrowRight className="h-5 w-5" />
    </Button>
  </Link>

  {/* View Plans */}
  <Link href="/mining-plans">
    <Button
      size="lg"
      variant="outline"
      className="w-full h-12 px-8 text-base font-semibold"
    >
      View Plans
    </Button>
  </Link>

  {/* Install APK */}
  <a href="/app/app-release.apk" download>
    <Button
      size="lg"
      className="
        w-full h-12 px-8 text-base font-semibold
        bg-yellow-400 text-black 
        hover:bg-yellow-500
        shadow-lg shadow-yellow-300/50
        dark:bg-yellow-500 dark:text-black
        dark:hover:bg-yellow-400
        dark:shadow-yellow-600/40
      "
    >
      Install Our App
    </Button>
  </a>

  {/* How to Sign Up */}
  <Link href="/how-to-signup"
    className="
      lg:col-span-3      /* Desktop: full-width bottom row */
    "
  >
    <Button
      size="lg"
      className="
        w-full h-12 px-8 text-base font-semibold
        bg-blue-500 text-white
        hover:bg-blue-600
        shadow-md shadow-blue-300/50
        dark:bg-blue-600 dark:hover:bg-blue-500
        dark:shadow-blue-700/40
      "
    >
      How to Sign Up
    </Button>
  </Link>

</div>


            {/* Highlights */}
            <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                <span className="tracking-wide">Low-Cost GPU Access</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="tracking-wide">Secure & Transparent</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
            <Image
              alt="Fractional GPU Mining"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src="/img/fractional-gpu-mining.png"
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
