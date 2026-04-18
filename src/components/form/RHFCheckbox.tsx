import { Controller, useFormContext } from "react-hook-form";
import Checkbox from "@/components/ui/forms/Checkbox";

interface RHFCheckboxProps {
  name: string;
  label: string;
  [key: string]: any;
}

export default function RHFCheckbox({
  name,
  label,
  ...props
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Checkbox
          {...props}
          label={label}
          checked={field.value}
          onChange={(checked) => field.onChange(checked)}
          error={error ? error.message : undefined}
        />
      )}
    />
  );
}
