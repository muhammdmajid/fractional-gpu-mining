import React from "react";

type PricingHeaderProps = {
  title: string;
  subtitle: string;
};

const HomePricingHeader: React.FC<PricingHeaderProps> = ({ title, subtitle }) => {
  return (
    <section className="mb-8 flex flex-col items-center text-center">
      <h2
        className={`
                  font-display text-3xl leading-tight font-bold tracking-tight
                  md:text-4xl
                `}
      >
        {title}
      </h2>
      <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
      <p className="mt-4 max-w-2xl text-center text-muted-foreground">
        {subtitle}
      </p>
    </section>
  );
};

export default HomePricingHeader;
