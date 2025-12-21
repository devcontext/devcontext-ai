import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("HomePage", () => {
  it("renders correctly", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    const description = screen.getByText("New Next.js Project with Feature-Based Architecture");
    const main = screen.getByRole("main");
    const button = screen.getByRole("button", { name: "Get Started" });

    expect(heading).toHaveTextContent("devcontextai-v2");
    expect(description).toHaveTextContent("New Next.js Project with Feature-Based Architecture");
    expect(main).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
