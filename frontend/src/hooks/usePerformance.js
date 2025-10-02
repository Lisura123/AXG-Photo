import { useState, useEffect, useCallback } from "react";

// Custom hook for handling loading states and performance
export const usePerformance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  // Set loading state for a specific key
  const setLoadingState = useCallback((key, loading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  // Check if any loading states are active
  const hasAnyLoading = Object.values(loadingStates).some((loading) => loading);

  useEffect(() => {
    setIsLoading(hasAnyLoading);
  }, [hasAnyLoading]);

  return {
    isLoading,
    loadingStates,
    setLoadingState,
    hasAnyLoading,
  };
};

// Hook for smooth animations with performance considerations
export const useAnimations = (options = {}) => {
  const { respectReducedMotion = true, defaultDuration = 300 } = options;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (respectReducedMotion && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [respectReducedMotion]);

  const getAnimationDuration = useCallback(
    (duration = defaultDuration) => {
      return prefersReducedMotion ? 0 : duration;
    },
    [prefersReducedMotion, defaultDuration]
  );

  const shouldAnimate = useCallback(() => {
    return !prefersReducedMotion;
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    getAnimationDuration,
    shouldAnimate,
  };
};

// Hook for viewport-based animations
export const useInViewport = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, hasBeenInView, options]);

  return {
    isInView,
    hasBeenInView,
  };
};

// Hook for debouncing values (useful for search, resize, etc.)
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for handling network status
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState("unknown");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Get connection info if available
    if ("connection" in navigator) {
      setConnectionType(navigator.connection.effectiveType || "unknown");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    connectionType,
    isSlowConnection: connectionType === "slow-2g" || connectionType === "2g",
  };
};
