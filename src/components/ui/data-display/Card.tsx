import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-background-card rounded-sm shadow p-5 ${className || ""}`}
    >
      {children}
    </div>
  );
}
