import { Feature } from "@/types";
import { Cpu, Headphones, Server, ShieldCheck } from "lucide-react";

export const featuresWhyChooseUs: Feature[] = [
  {
    title: "Affordable GPU Power",
    description:
      "Access high-performance GPUs at a fraction of the cost—no need to buy expensive hardware.",
    icon: <Cpu className="h-6 w-6 text-primary" />,
  },
  {
    title: "Secure & Transparent",
    description:
      "All transactions are secure and transparent, powered by blockchain and encryption.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: "Scalable Resources",
    description:
      "Instantly scale mining or AI workloads with on-demand GPU resources worldwide.",
    icon: <Server className="h-6 w-6 text-primary" />,
  },
  {
    title: "24/7 Expert Support",
    description:
      "Receive dedicated support from experts anytime to maximize efficiency and earnings.",
    icon: <Headphones className="h-6 w-6 text-primary" />,
  },
];
