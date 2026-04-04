import clsx from "clsx";

interface RadioButtonProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export default function RadioButton({
  label,
  name,
  value,
  checked,
  onChange,
  className,
}: RadioButtonProps) {
  return (
    <label
      className={clsx(
        "flex items-center gap-3 cursor-pointer group",
        className,
      )}
    >
      <div className="relative flex items-center">
        <input
          type="radio"
          name={name}
          value={value}
          className="peer sr-only"
          onChange={() => onChange(value)}
          checked={checked}
        />
        <div
          className={clsx(
            "w-5 h-5 border border-gray-300 rounded-full transition-all flex items-center justify-center",
            checked ? "bg-primary border-primary" : "bg-white",
          )}
        >
          {checked && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>
      <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );
}
