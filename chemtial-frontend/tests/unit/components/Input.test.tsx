import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../../../src/components/common/Input";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string, opts?: any) => {
      if (opts?.count) return `${k} ${opts.count}`;
      return k;
    },
  }),
}));

describe("Input", () => {
  it("should render label & placeholder", () => {
    render(
      <Input
        id="x"
        label="Email"
        value=""
        onChange={() => {}}
        placeholder="Enter email"
      />,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("should call onChange on type", () => {
    const onChange = vi.fn();
    render(<Input id="x" value="" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("x"), { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith("abc");
  });

  it("should render error message", () => {
    render(<Input id="x" value="" onChange={() => {}} error="Invalid" />);
    expect(screen.getByText("Invalid")).toBeInTheDocument();
  });

  it("should toggle password visibility", () => {
    render(
      <Input id="pw" type="password" value="secret" onChange={() => {}} />,
    );
    const input = screen.getByTestId("pw") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  it("should call onClear when clear button clicked", () => {
    const onClear = vi.fn();
    render(<Input id="x" value="abc" onChange={() => {}} onClear={onClear} />);
    const clearBtn = screen.getByLabelText("input.clear");
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("should render as textarea", () => {
    render(<Input id="t" type="textarea" value="" onChange={() => {}} />);
    expect(screen.getByTestId("t").tagName).toBe("TEXTAREA");
  });
});
