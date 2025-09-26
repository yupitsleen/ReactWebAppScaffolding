import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingWrapper from "./LoadingWrapper";

describe("LoadingWrapper", () => {
  const TestChild = () => <div data-testid="child-content">Test Content</div>;

  it("handles all loading states and customization options", () => {
    // Loading state
    const { rerender } = render(
      <LoadingWrapper loading={true}>
        <TestChild />
      </LoadingWrapper>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();

    // Children when not loading
    rerender(
      <LoadingWrapper loading={false}>
        <TestChild />
      </LoadingWrapper>
    );

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    // Custom loading text
    rerender(
      <LoadingWrapper loading={true} loadingText="Please wait...">
        <TestChild />
      </LoadingWrapper>
    );

    expect(screen.getByText("Please wait...")).toBeInTheDocument();

    // Custom fallback component
    const CustomFallback = () => (
      <div data-testid="custom-fallback">Custom Loading</div>
    );

    rerender(
      <LoadingWrapper loading={true} fallback={<CustomFallback />}>
        <TestChild />
      </LoadingWrapper>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();

    // Verify custom fallback is rendered properly
    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });
});