import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDialog from "../../../src/components/admin/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("should return null when closed", () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="T"
        message="M"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render title & message", () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete?"
        message="Are you sure?"
      />,
    );
    expect(screen.getByText("Delete?")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("should call onConfirm", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={onConfirm}
        title="T"
        message="M"
      />,
    );
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("should call onClose on cancel", () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        onClose={onClose}
        onConfirm={() => {}}
        title="T"
        message="M"
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should show custom labels", () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={() => {}}
        title="T"
        message="M"
        confirmText="Yes"
        cancelText="No"
      />,
    );
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("should not call onConfirm when loading", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={onConfirm}
        title="T"
        message="M"
        isLoading
      />,
    );
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
