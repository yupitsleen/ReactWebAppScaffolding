import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "./Loading";

describe("Loading Component", () => {
  it("renders with default and custom text and has proper styling", () => {
    const { rerender } = render(<Loading />);

    // Default text
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Custom text and accessibility
    const customText = "Loading data";
    rerender(<Loading text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();

    const loadingElement = screen.getByText(customText);
    expect(loadingElement.closest("div")).toHaveStyle({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
  });
});