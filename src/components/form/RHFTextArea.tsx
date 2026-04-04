import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";

interface RHFTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  [key: string]: any;
}

export default function RHFTextArea({
  name,
  label,
  placeholder,
  rows = 3,
  required,
  ...props
}: RHFTextAreaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1 w-full">
          {label && (
            <label className="text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <textarea
            {...field}
            {...props}
            rows={rows}
            placeholder={placeholder}
            
            className={clsx(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm",
              error ? "border-red-500" : "border-gray-300",
            )}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              const textarea = e.currentTarget;
              if (e.key === " " && textarea.selectionStart === 0) {
                e.preventDefault();
              }
              props.onKeyDown?.(e);
            }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              e.target.value = e.target.value.trimStart();
              field.onChange(e);
              props.onChange?.(e);
            }}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}