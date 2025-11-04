import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./Loading";
import SkeletonLoader, { type SkeletonVariant } from "./SkeletonLoader";

interface LoadingWrapperProps {
  loading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  preserveLayout?: boolean;
  loadingText?: string;
  /** Custom minimum height to prevent layout shift */
  minHeight?: string | number;
  /** Use skeleton loading instead of spinner */
  skeleton?: boolean;
  /** Skeleton variant type */
  skeletonVariant?: SkeletonVariant;
  /** Number of skeleton items */
  skeletonCount?: number;
}

export default function LoadingWrapper({
  loading,
  children,
  fallback,
  preserveLayout = true,
  loadingText = "Loading...",
  minHeight,
  skeleton = false,
  skeletonVariant = "text",
  skeletonCount = 3,
}: LoadingWrapperProps) {
  // Crossfade transition configuration
  const fadeTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  };

  if (loading) {
    if (fallback) {
      return (
        <AnimatePresence mode="wait">
          <motion.div key="fallback" {...fadeTransition}>
            {fallback}
          </motion.div>
        </AnimatePresence>
      );
    }

    // Use skeleton loader if enabled
    if (skeleton) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="skeleton"
            {...fadeTransition}
            style={{ minHeight: minHeight || 'auto' }}
          >
            <SkeletonLoader variant={skeletonVariant} count={skeletonCount} />
          </motion.div>
        </AnimatePresence>
      );
    }

    // Use spinner (default)
    const loadingStyles: React.CSSProperties = {
      ...(minHeight && { minHeight }),
      ...(preserveLayout && {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }),
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div key="spinner" {...fadeTransition} style={loadingStyles}>
          <Loading text={loadingText} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key="content" {...fadeTransition}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
