import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "@/components/ui/forms/DatePicker";

interface RHFDatePickerProps {
  name: string;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  containClassName?: string;
}

export default function RHFDatePicker({
  name,
  label,
  minDate,
  maxDate,
  placeholder,
  required = true,
  disabled = false,
  containClassName = "",
}: RHFDatePickerProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = name.split(".").reduce((acc: any, key) => acc?.[key], errors);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          error={error?.message}
          minDate={minDate}
          maxDate={maxDate}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={containClassName}
        />
      )}
    />
  );
}
