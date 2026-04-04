import { Controller, useFormContext } from "react-hook-form";
import { SearchableSelect } from "@/components/ui/forms/SearchableSelect";



interface RHFSearchableSelectProps {
  name: string;
  label?: string;
  options: any[];
  placeholder?: string;
  disabled?: boolean;
  onAdd?: (value: string) => Promise<void>;
  onAddClick?: (searchValue: string) => void;
  type?: "default" | "employee";
  multiple?: boolean;
  [key: string]: any;
}

/* ------------------ Employee Helpers ------------------ */


/* ------------------ Component ------------------ */

export default function RHFSearchableSelect({
  name,
  label,
  options,
  placeholder,
  disabled,
  onAdd,
  onAddClick,
  type = "default",
  multiple,
  resolvedRenderOption,
  ...props
}: RHFSearchableSelectProps) {
  const { control } = useFormContext();

  /* -------- Default Employee Renderer -------- */
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SearchableSelect
          {...props}
          label={label}
          name={name}
          options={options as any}
          value={field.value}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          multiple={multiple}
          renderOption={resolvedRenderOption}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          onAddClick={onAddClick}
          onAdd={
            onAdd
              ? async (value) => {
                try {
                  await onAdd(value);
                } catch (error) { }
              }
              : undefined
          }
          error={error ? error.message : undefined}
        />
      )}
    />
  );
}