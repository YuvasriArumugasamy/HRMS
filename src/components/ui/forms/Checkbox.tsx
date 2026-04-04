// Type-only imports
import type { InputHTMLAttributes, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// Runtime imports
import clsx from "clsx";
import { Check } from "lucide-react";
import { Controller } from "react-hook-form";

interface BaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: ReactNode;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  required?: boolean;
}

interface ControlledProps<T extends FieldValues> extends BaseProps {
  name: Path<T>;
  control: Control<T>;
}

interface UncontrolledProps extends BaseProps {
  name?: never;
  control?: never;
}

type CheckboxProps<T extends FieldValues> =
  | ControlledProps<T>
  | UncontrolledProps;

export default function Checkbox<T extends FieldValues>(
  props: CheckboxProps<T>,
) {
  const { label, error, className, checked, onChange, required, ...rest } = props;

  const renderCheckbox = (
    value?: boolean,
    onValChange?: (v: boolean) => void,
  ) => (
    <label className="relative flex items-center gap-2 cursor-pointer select-none">
      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onValChange?.(e.target.checked)}
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer m-0 p-0"
        {...rest}
        required={required}
      />

      {/* Custom UI */}
      <span
        className={clsx(
          "h-4 w-4 flex items-center justify-center rounded border transition-all",
          value ? "bg-[#003B5C] border-[#003B5C]" : "bg-white border-gray-300",
          error && "border-red-500",
          className,
        )}
      >
        {value && <Check size={12} className="text-white" />}
      </span>

      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );

  return (
    <div className="space-y-1">
      {"control" in props && props.control && props.name ? (
        <Controller
          name={props.name}
          control={props.control}
          render={({ field }) => renderCheckbox(field.value, field.onChange)}
        />
      ) : (
        renderCheckbox(checked, onChange)
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
