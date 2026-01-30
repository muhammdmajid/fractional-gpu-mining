import { featuresWhyChooseUs } from "@/data/features-why-choose-us";
import { Feature } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/ui/primitives/card";
import React from "react";

interface FeatureCardsProps {
  features?: Feature[];
}

const FeatureCards: React.FC<FeatureCardsProps> = ({
  features = featuresWhyChooseUs,
}) => {
  return (
    <>
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="
            rounded-2xl border-none bg-background shadow transition-all
            duration-300 hover:shadow-lg
          "
        >
          <CardHeader className="flex flex-col items-center text-center pb-2">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {feature.icon}
            </div>
            <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-base text-gray-600 dark:text-gray-300">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default FeatureCards;
