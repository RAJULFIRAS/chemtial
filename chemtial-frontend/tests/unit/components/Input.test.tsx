import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../../../src/components/common/Input";

describe("Input", () => {
  it("renders label and placeholder", () => {
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

  it("calls onChange on type", () => {
    const onChange = vi.fn();
    render(<Input id="x" value="" onChange={onChange} />);
    fireEvent.change(screen.getByTestId("x"), { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith("abc");
  });

  it("renders error message", () => {
    render(<Input id="x" value="" onChange={() => {}} error="Invalid" />);
    expect(screen.getByText("Invalid")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(
      <Input id="pw" type="password" value="secret" onChange={() => {}} />,
    );
    const input = screen.getByTestId("pw") as HTMLInputElement;
    expect(input.type).toBe("password");
    const toggle = screen.getByLabelText("input.show_password");
    fireEvent.click(toggle);
    expect(input.type).toBe("text");
  });

  it("calls onClear when clear button clicked", () => {
    const onClear = vi.fn();
    render(<Input id="x" value="abc" onChange={() => {}} onClear={onClear} />);
    fireEvent.click(screen.getByLabelText("input.clear"));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("renders as textarea", () => {
    render(<Input id="t" type="textarea" value="" onChange={() => {}} />);
    expect(screen.getByTestId("t").tagName).toBe("TEXTAREA");
  });

  it("shows required error on blur when empty", () => {
    render(<Input id="r" value="" onChange={() => {}} required />);
    fireEvent.blur(screen.getByTestId("r"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("validates email format on blur", () => {
    const onChange = vi.fn();
    render(
      <Input id="em" type="email" value="bad-email" onChange={onChange} />,
    );
    fireEvent.blur(screen.getByTestId("em"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("validates phone format on blur", () => {
    render(<Input id="ph" type="tel" value="abc" onChange={() => {}} />);
    fireEvent.blur(screen.getByTestId("ph"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("validates url format on blur", () => {
    render(<Input id="u" type="url" value="not-a-url" onChange={() => {}} />);
    fireEvent.blur(screen.getByTestId("u"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("validates minLength", () => {
    render(<Input id="ml" value="ab" onChange={() => {}} minLength={5} />);
    fireEvent.blur(screen.getByTestId("ml"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("validates pattern", () => {
    render(
      <Input id="pt" value="xyz" onChange={() => {}} pattern="^[0-9]+$" />,
    );
    fireEvent.blur(screen.getByTestId("pt"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("clears internal error on valid input", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Input id="v" type="email" value="bad" onChange={onChange} />,
    );
    fireEvent.blur(screen.getByTestId("v"));
    rerender(
      <Input
        id="v"
        type="email"
        value="good@example.com"
        onChange={onChange}
      />,
    );
    fireEvent.blur(screen.getByTestId("v"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not show clear button when disabled", () => {
    render(
      <Input
        id="d"
        value="abc"
        onChange={() => {}}
        onClear={() => {}}
        disabled
      />,
    );
    expect(screen.queryByLabelText("input.clear")).not.toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(<Input id="i" value="" onChange={() => {}} icon={<span>@</span>} />);
    expect(screen.getByText("@")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(
      <Input id="ri" value="" onChange={() => {}} rightIcon={<span>#</span>} />,
    );
    expect(screen.getByText("#")).toBeInTheDocument();
  });

  it("shows character counter when maxLength set", () => {
    render(<Input id="c" value="abc" onChange={() => {}} maxLength={10} />);
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });

  it("calls onFocus and onBlur callbacks", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <Input
        id="f"
        value=""
        onChange={() => {}}
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    );
    fireEvent.focus(screen.getByTestId("f"));
    fireEvent.blur(screen.getByTestId("f"));
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("shows required asterisk when required", () => {
    render(
      <Input id="rq" value="" onChange={() => {}} label="Name" required />,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("uses custom errorPlaceholder", () => {
    render(
      <Input
        id="ep"
        value=""
        onChange={() => {}}
        required
        errorPlaceholder="Custom error"
      />,
    );
    fireEvent.blur(screen.getByTestId("ep"));
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });
});
