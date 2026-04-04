import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  placeholder?: string;
  containClassName?: any;
}

export default function TextInput({
  label,
  error,
  leftIcon,
  rightIcon,
  type = "text",
  className,
  containClassName,
  placeholder,
  required,
  ...rest
}: TextInputProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const generatedId = useId();
  const inputId = rest.id || generatedId;

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={clsx("w-full  flex flex-col gap-2", containClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 "
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600">
            {leftIcon}
          </span>
        )}

        <input
          {...rest}
          type={inputType}
          placeholder={
            placeholder || (label ? `Enter ${label.toLowerCase()}` : "")
          }
          onKeyDown={(e) => {
            if (e.key === " " && e.currentTarget.selectionStart === 0) {
              e.preventDefault();
            }
            rest.onKeyDown?.(e);
          }}
          onChange={(e) => {
            let value = e.target.value;

            if (type === "tel") {
              value = value.replace(/\D/g, "").slice(0, 10);
              e.target.value = value;
            }

            if (value.startsWith(" ")) {
              value = value.trimStart();
              e.target.value = value;
            }

            rest.onChange?.(e);
          }}
          className={clsx(
            "w-full h-12 rounded-[10px] border px-3 text-sm focus:outline-none focus:ring-1",
            leftIcon && "pl-10",
            (rightIcon || isPassword) && "pr-10",
            type === "number" &&
              "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-primary",
            className,
          )}
        />

        {/* Right Icon / Password Toggle */}
        {(rightIcon || isPassword) && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-600"
            onClick={isPassword ? () => setShowPassword((p) => !p) : undefined}
          >
            {isPassword ? (
              showPassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )
            ) : (
              rightIcon
            )}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
