import { useState, useEffect } from "react";

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const detectTouch = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };

    setIsTouch(detectTouch());
  }, []);

  return isTouch;
}

export default useIsTouchDevice;
