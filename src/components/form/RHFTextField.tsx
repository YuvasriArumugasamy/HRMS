import { Controller, useFormContext } from "react-hook-form";
import TextInput from "@/components/ui/forms/TextInput";

interface RHFTextFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  rules?: any;
  [key: string]: any;
}

export default function RHFTextField({
  name,
  type = "text",
  rules,
  ...props
}: RHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextInput
          {...field}
          {...props}
          type={type}
          error={error?.message}

          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
}
