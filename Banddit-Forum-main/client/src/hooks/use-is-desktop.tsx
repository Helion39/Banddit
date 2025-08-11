import { useState, useEffect } from 'react';

// Corresponds to Tailwind's default breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * A hook to check for screen sizes based on Tailwind's breakpoints.
 * @returns An object with boolean values for each breakpoint.
 * e.g. { isSm: true, isMd: true, isLg: false, isXl: false }
 */
export function useBreakpoint() {
  const getScreenSize = () => {
    // Return true for lg during SSR, assuming a desktop-first approach.
    if (typeof window === 'undefined') {
      return { isSm: false, isMd: false, isLg: true, isXl: false };
    }
    const width = window.innerWidth;
    return {
      isSm: width >= breakpoints.sm,
      isMd: width >= breakpoints.md,
      isLg: width >= breakpoints.lg,
      isXl: width >= breakpoints.xl,
    };
  };

  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
} 