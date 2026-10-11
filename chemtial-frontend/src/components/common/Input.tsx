import React, { useState, useCallback } from "react";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type InputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "number"
  | "tel"
  | "url"
  | "textarea";

interface InputProps {
  type?: InputType;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  id?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  errorPlaceholder?: string;
  name?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  debounceDelay?: number;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  onClear,
  className = "",
  icon,
  rightIcon,
  id,
  label,
  error,
  required = false,
  disabled = false,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  errorPlaceholder,
  name,
  onBlur,
  onFocus,
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const isTextarea = type === "textarea";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const validateInput = useCallback(
    (value: string): string | null => {
      if (required && !value.trim()) {
        return errorPlaceholder || t("input.required");
      }

      if (minLength && value.length < minLength) {
        return t("input.min_length", { count: minLength });
      }

      if (maxLength && value.length > maxLength) {
        return t("input.max_length", { count: maxLength });
      }

      if (pattern && value && !new RegExp(pattern).test(value)) {
        return t("input.invalid_format");
      }

      if (
        type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        return t("input.invalid_email");
      }

      if (type === "tel" && value && !/^\+?[1-9]\d{1,14}$/.test(value)) {
        return t("input.invalid_phone");
      }

      if (type === "url" && value && !/^https?:\/\/[^\s]+$/.test(value)) {
        return t("input.invalid_url");
      }

      return null;
    },
    [required, errorPlaceholder, minLength, maxLength, pattern, type, t],
  );

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateInput(value);
    setInternalError(validationError);
    onBlur?.();
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const displayError = error || (touched ? internalError : null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isClearable = !!onClear && value.length > 0 && !disabled;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-secondary mb-1.5"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        {isTextarea ? (
          <textarea
            id={inputId}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            maxLength={maxLength}
            minLength={minLength}
            className={`
              w-full px-3 py-2 text-sm border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              resize-y min-h-[80px]
              ${icon ? "pl-9" : ""}
              ${displayError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"}
              ${className}
            `}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${inputId}-error` : undefined}
            aria-required={required}
            name={name}
            data-testid={inputId}
          />
        ) : (
          <input
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            className={`
              w-full px-3 py-2 text-sm border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${icon ? "pl-9" : ""}
              ${isClearable || isPassword || rightIcon ? "pr-9" : ""}
              ${displayError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"}
              ${className}
            `}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${inputId}-error` : undefined}
            aria-required={required}
            name={name}
            data-testid={inputId}
          />
        )}

        {isClearable && !isPassword && !rightIcon && (
          <button
            onClick={onClear}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
            aria-label={t("input.clear")}
          >
            <X size={16} />
          </button>
        )}

        {isPassword && (
          <button
            onClick={togglePasswordVisibility}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
            aria-label={
              showPassword ? t("input.hide_password") : t("input.show_password")
            }
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
            {rightIcon}
          </div>
        )}

        {displayError && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none"
            aria-hidden="true"
          >
            <AlertCircle size={16} />
          </div>
        )}
      </div>

      {displayError && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-fade-in"
          role="alert"
        >
          <AlertCircle size={14} />
          {displayError}
        </p>
      )}

      {maxLength && (
        <div
          className={`mt-1 text-xs text-right transition-colors ${
            value.length > maxLength * 0.9
              ? value.length > maxLength
                ? "text-red-500"
                : "text-yellow-500"
              : "text-secondary/60"
          }`}
        >
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default Input;
