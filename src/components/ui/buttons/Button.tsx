import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { useState } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "secondary-light"
  | "none"
  | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  isLoading?: boolean;
  debounceTime?: number;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth,
  className,
  isLoading,
  disabled,
  type = "button",
  onClick,
  debounceTime = 500,
  ...props
}: ButtonProps) {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isDebouncing || disabled || isLoading) {
      if (type !== "submit") e.preventDefault();
      return;
    }

    if (type !== "submit" && debounceTime > 0) {
      setIsDebouncing(true);
      setTimeout(() => {
        setIsDebouncing(false);
      }, debounceTime);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      type={type}
      disabled={disabled || isLoading || isDebouncing}
      className={clsx(
        "px-4 py-2 rounded-[12px] h-12 text-sm font-semibold transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 cursor-pointer",
        fullWidth && "w-full",
        (disabled || isLoading) && "opacity-70 cursor-not-allowed",
        {
          "bg-gradient-to-br from-primary via-primary to-primary/80 text-white shadow-md hover:shadow-lg":
            variant === "primary" && !isLoading,

          "bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-white shadow-md hover:shadow-lg":
            variant === "secondary" && !disabled && !isLoading,

          "bg-gradient-to-br from-secondary-light via-secondary-light to-secondary-light/80 text-secondary shadow-sm":
            variant === "secondary-light" && !disabled && !isLoading,

          "bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-gray-700 hover:shadow":
            variant === "outline" && !disabled && !isLoading,

          "bg-gradient-to-br from-danger via-danger to-danger/80 text-white shadow-md hover:shadow-lg":
            variant === "danger" && !disabled && !isLoading,

          "bg-transparent text-black":
            variant === "none" && !disabled && !isLoading,

          // Disabled styles for variants if needed, though opacity handles most
          "bg-gray-100 text-gray-400 border border-gray-200 shadow-none":
            (disabled || isLoading) && variant === "outline",
        },
        className,
      )}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
