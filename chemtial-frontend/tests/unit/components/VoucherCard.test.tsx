import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VoucherCard from "../../../src/components/voucher/VoucherCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string, opts?: any) => {
      if (opts?.amount) return `${k} ${opts.amount}`;
      if (opts?.date) return `${k} ${opts.date}`;
      return k;
    },
  }),
}));

const baseVoucher = {
  id: "v1",
  code: "CHEM10",
  title: "10% off",
  description: "Get 10% off",
  type: "percentage",
  category: "discount",
  value: 10,
  minPurchase: 50,
  maxDiscount: 20,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
};

describe("VoucherCard", () => {
  it("should render title & code", () => {
    render(<VoucherCard voucher={baseVoucher} />);
    expect(screen.getByText("10% off")).toBeInTheDocument();
    expect(screen.getByText("CHEM10")).toBeInTheDocument();
  });

  it("should show percentage value", () => {
    render(<VoucherCard voucher={baseVoucher} />);
    expect(screen.getByText("10%")).toBeInTheDocument();
  });

  it("should show fixed amount", () => {
    render(
      <VoucherCard voucher={{ ...baseVoucher, type: "fixed", value: 25 }} />,
    );
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });

  it("should show free shipping label", () => {
    render(
      <VoucherCard voucher={{ ...baseVoucher, category: "free_shipping" }} />,
    );
    expect(screen.getByText("voucher_card.free")).toBeInTheDocument();
  });

  it("should call onAction when button clicked", () => {
    const onAction = vi.fn();
    render(
      <VoucherCard
        voucher={baseVoucher}
        onAction={onAction}
        actionLabel="Use"
      />,
    );
    fireEvent.click(screen.getByText("Use"));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("should disable button when disabled", () => {
    const onAction = vi.fn();
    render(
      <VoucherCard
        voucher={baseVoucher}
        onAction={onAction}
        actionLabel="Use"
        disabled
      />,
    );
    fireEvent.click(screen.getByText("Use"));
    expect(onAction).not.toHaveBeenCalled();
  });

  it("should show used label", () => {
    render(<VoucherCard voucher={baseVoucher} variant="used" />);
    expect(screen.getByText("voucher_card.used")).toBeInTheDocument();
  });

  it("should show expired label", () => {
    render(<VoucherCard voucher={baseVoucher} variant="expired" />);
    expect(screen.getByText("voucher_card.expired")).toBeInTheDocument();
  });
});
