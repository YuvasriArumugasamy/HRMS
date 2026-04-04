import React from "react";

interface ActionBarProps {
  title?: string;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  className?: string;
}

export default function ActionBar({
  title,
  leftActions,
  rightActions,
  className = "",
}: ActionBarProps) {
  return (
    <div
      className={`flex flex-wrap border-b border-gray-200 px-4 pb-4 items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        {title && <h1 className="text-xl font-bold text-gray-800">{title}</h1>}
        <div className="flex gap-2">{leftActions}</div>
      </div>
      {rightActions && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {rightActions}
        </div>
      )}
    </div>
  );
}
