import { useEffect, useState } from "react";

/**
 * Download an image in the background and return `true` when done.
 */
export function useImageProgress(src: string): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    return () => {
      img.onload = null;
    };
  }, [src]);

  return loaded;
}
