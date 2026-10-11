/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SUPPORT_PHONE: string;
  readonly VITE_WHATSAPP: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_CAREER_EMAIL: string;
  readonly VITE_B2B_EMAIL: string;
  readonly VITE_COMPANY_ADDRESS: string;
  readonly VITE_MIN_PURCHASE: string;
  readonly VITE_SHIPPING_COST: string;
  readonly VITE_CURRENCY: string;
  readonly VITE_OFFICE_LOCATION: string;
  readonly VITE_TIMEZONE: string;
  readonly VITE_LEGAL_NAME: string;
  readonly VITE_BANK_NAME: string;
  readonly VITE_BANK_ACCOUNT_NAME: string;
  readonly VITE_BANK_ACCOUNT_NUMBER: string;
  readonly VITE_BANK_ROUTING_NUMBER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly SSR: boolean;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.ico" {
  const value: string;
  export default value;
}

declare module "*.bmp" {
  const value: string;
  export default value;
}

declare module "*.woff" {
  const value: string;
  export default value;
}

declare module "*.woff2" {
  const value: string;
  export default value;
}

declare module "*.ttf" {
  const value: string;
  export default value;
}

declare module "*.eot" {
  const value: string;
  export default value;
}

declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.webm" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}
