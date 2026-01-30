"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/ui/primitives/card";
import { Cpu } from "lucide-react";

type MiningRig = {
  src: string;
  alt: string;
  label: string;
  colSpan?: number;
};

const miningRigs: MiningRig[] = [
  { src: "/img/mining/1.jpg", alt: "Rig 1", label: "Rig A" },
  { src: "/img/mining/2.jpg", alt: "Rig 2", label: "Rig B", colSpan: 2 },
  { src: "/img/mining/3.jpg", alt: "Rig 3", label: "Rig C" },
  { src: "/img/mining/4.jpg", alt: "Rig 4", label: "Rig D" },
  { src: "/img/mining/5.jpg", alt: "Rig 5", label: "Rig E" },
  { src: "/img/mining/6.jpg", alt: "Rig 6", label: "Rig F" ,colSpan: 2 },
];

export default function GPUMiningGalleryClient() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <Card className="bg-white dark:bg-gray-800 mb-10 sm:mb-14 shadow-lg">
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              <Cpu className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  GPU Fractional Mining Gallery
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-full sm:max-w-md md:max-w-lg leading-relaxed">
                  Explore fractional GPU mining rigs, monitor performance metrics, and see your shared mining resources in action.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPU Mining Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {miningRigs.map((rig, index) => (
            <motion.div
              key={index}
              className={cn(
                "group relative flex flex-col justify-end overflow-hidden rounded-xl shadow-lg bg-gray-100 dark:bg-gray-800 h-56 md:h-72 lg:h-80 transition-transform",
                rig.colSpan ? `md:col-span-${rig.colSpan}` : ""
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={rig.src}
                alt={rig.alt}
                fill
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 pointer-events-none rounded-xl"></div>
              <div className="relative p-4 flex flex-col gap-1 text-white">
                <span className="font-semibold text-lg md:text-xl">{rig.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
