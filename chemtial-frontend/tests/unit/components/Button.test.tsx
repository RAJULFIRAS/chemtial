import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../../src/components/common/Button";
import { User } from "lucide-react";

describe("Button", () => {
  it("should render children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should handle click", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("should not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should render icon", () => {
    const { container } = render(<Button icon={User}>Icon</Button>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should apply primary variant classes", () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByText("Primary");
    expect(btn.className).toContain("bg-primary");
  });

  it("should apply outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText("Outline").className).toContain("border-2");
  });

  it("should apply size=sm", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small").className).toContain("text-sm");
  });

  it("should render with aria-label", () => {
    render(<Button ariaLabel="cart">x</Button>);
    expect(screen.getByLabelText("cart")).toBeInTheDocument();
  });
});
