import type { ReactNode } from "react";
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
  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Use skeleton loader if enabled
    if (skeleton) {
      return (
        <div style={{ minHeight: minHeight || 'auto' }}>
          <SkeletonLoader variant={skeletonVariant} count={skeletonCount} />
        </div>
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
      <div style={loadingStyles}>
        <Loading text={loadingText} />
      </div>
    );
  }

  return <>{children}</>;
}
