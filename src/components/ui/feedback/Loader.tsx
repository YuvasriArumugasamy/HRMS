import clsx from "clsx";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "white" | "primary";
}

export default function Loader({
  className,
  size = "md",
  color = "blue",
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-b-4",
  };

  const colorClasses = {
    blue: "border-blue-600",
    white: "border-white",
    primary: "border-primary",
  };

  return (
    <div
      className={clsx(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    />
  );
}
