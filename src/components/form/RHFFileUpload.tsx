import { Controller, useFormContext } from "react-hook-form";
import FormFileUpload from "@/components/ui/forms/FileUpload";

interface RHFUploadProps {
  name: string;
  label?: string;
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export default function RHFUpload({
  name,
  label,
  accept,
  multiple,
}: RHFUploadProps) {
  const { control, formState: { errors } } = useFormContext();

  const error = name.split(".").reduce((acc: any, key) => acc?.[key], errors);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <FormFileUpload
          label={label}
          value={value}
          onChange={onChange}
          error={error?.message}
          accept={accept}
          multiple={multiple}
        />
      )}
    />
  );
}