import React from "react";

export type SegmentOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type SegmentedControlProps = {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
};

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="w-full max-w-md">
      <div className="flex rounded-xl border border-[var(--color-primary-light)] p-1 h-12 ">
        {options.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300
                ${
                  active
                    ? "bg-[var(--color-primary)] text-white shadow"
                    : "text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/20"
                }
              `}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
