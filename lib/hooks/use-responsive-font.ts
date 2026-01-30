"use client";

import { useState, useEffect, useCallback } from "react";

interface UseResponsiveFontConfig {
  baseWidth?: number;
  baseHeight?: number;
  baseFontSize?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

/**
 * Custom Hook for responsive font size with smooth transitions and error handling.
 * @param {UseResponsiveFontConfig} config - Configuration for responsiveness.
 * @returns {number} The calculated font size.
 */
const useResponsiveFont = ({
  baseWidth = 1920,
  baseHeight = 1080,
  baseFontSize = 24,
  minFontSize = 12,
  maxFontSize = 36,
}: UseResponsiveFontConfig = {}): number => {
  const [fontSize, setFontSize] = useState<number>(baseFontSize);

  const calculateFontSize = useCallback(() => {
    try {
      if (typeof window === "undefined") return;

      const widthRatio = window.innerWidth / baseWidth;
      const heightRatio = window.innerHeight / baseHeight;
      const weightedRatio = widthRatio * 0.75 + heightRatio * 0.25;

      const newFontSize = Math.min(
        Math.max(baseFontSize * weightedRatio, minFontSize),
        maxFontSize
      );

      if (Math.abs(newFontSize - fontSize) > 0.05) {
        setFontSize(newFontSize);
      }
    } catch (error) {
      console.error("Error calculating font size:", error);
    }
  }, [fontSize, baseWidth, baseHeight, baseFontSize, minFontSize, maxFontSize]);

  useEffect(() => {
    let animationFrame: number;

    const resizeHandler = () => {
      try {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(calculateFontSize);
      } catch (error) {
        console.error("Error in resize handler:", error);
      }
    };

    try {
      window.addEventListener("resize", resizeHandler);
      calculateFontSize();
    } catch (error) {
      console.error("Error setting up resize listener:", error);
    }

    return () => {
      try {
        window.removeEventListener("resize", resizeHandler);
        if (animationFrame) cancelAnimationFrame(animationFrame);
      } catch (error) {
        console.error("Error cleaning up resize listener:", error);
      }
    };
  }, [calculateFontSize]);

  return fontSize;
};

export default useResponsiveFont;
