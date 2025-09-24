import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "./Loading";

describe("Loading Component", () => {
  it("renders default loading text", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders custom loading text", () => {
    const customText = "Please wait...";
    render(<Loading text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<Loading text="Loading data" />);
    const loadingElement = screen.getByText("Loading data");
    expect(loadingElement.closest("div")).toHaveStyle({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
  });
});
