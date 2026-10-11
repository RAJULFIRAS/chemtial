import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

Object.defineProperty(import.meta, "env", {
  value: {
    VITE_API_BASE_URL: "http://localhost:3000/api",
    VITE_SUPPORT_PHONE: "+1 (617) 555-0199",
    VITE_WHATSAPP: "+1 (617) 555-0199",
    VITE_SUPPORT_EMAIL: "inbox@chemtial.com",
    VITE_CAREER_EMAIL: "career@chemtial.com",
    VITE_B2B_EMAIL: "b2b@chemtial.com",
    VITE_COMPANY_ADDRESS: "D St, Boston, MA 02210, United States",
    VITE_MIN_PURCHASE: "50.00",
    VITE_SHIPPING_COST: "3.00",
    VITE_CURRENCY: "USD",
    VITE_OFFICE_LOCATION: "Boston, MA",
    VITE_TIMEZONE: "EST",
    VITE_LEGAL_NAME: "Chemtial LLC",
    VITE_BANK_NAME: "Bank of America",
    VITE_BANK_ACCOUNT_NAME: "Chemtial LLC",
    VITE_BANK_ACCOUNT_NUMBER: "1234567890",
    VITE_BANK_ROUTING_NUMBER: "026009593",
    DEV: false,
    PROD: true,
    MODE: "test",
    SSR: false,
  },
  writable: false,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.scrollTo = vi.fn();
window.open = vi.fn();
