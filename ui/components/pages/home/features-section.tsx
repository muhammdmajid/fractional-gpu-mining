import FeatureCards from "@/ui/components/pages/home/feature-cards";

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-16" id="features">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
            Why Choose Us
          </h2>
          <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
          <p className="mt-4 max-w-2xl text-center text-muted-foreground md:text-lg">
           Access GPU power, mine crypto effortlessly, and earn rewards without the technical hassle.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCards />
        </div>
      </div>
    </section>
  );
}
