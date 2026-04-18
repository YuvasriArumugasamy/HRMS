import { Controller, useFormContext } from "react-hook-form";
import TimePicker from "@/components/ui/forms/TimePicker";

interface RHFTimePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export default function RHFTimePicker({
  name,
  label,
  placeholder,
  required,
  disabled,
  className,
  ...props
}: RHFTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          {...props}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={className}
          error={error?.message}
          onChange={(val) => field.onChange(val)}
        />
      )}
    />
  );
}
