// ui/components/pages/home/TestimonialsSectionWrapper.tsx
import { TestimonialsSection } from "@/ui/components/testimonials/testimonials-with-marquee";
import { testimonials } from "./mocks";



export default function TestimonialsSectionWrapper() {
  return (
    <section className="bg-muted/50 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TestimonialsSection
          className="py-0"
          description="Don't just take our word for it - hear from our satisfied customers"
          testimonials={testimonials}
          title="What Our Customers Say"
        />
      </div>
    </section>
  );
}
