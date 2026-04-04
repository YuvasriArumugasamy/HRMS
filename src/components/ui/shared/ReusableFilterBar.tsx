import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useCallback, useState } from "react";

import DatePicker from "@/components/ui/forms/DatePicker";
import { SearchableSelect } from "@/components/ui/forms/SearchableSelect";
import TextInput from "@/components/ui/forms/TextInput";
import { globalStrings } from "@/core/constants/strings";
import AdvancedFilterModal from "./AdvancedFilterModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterFieldType = "search" | "select" | "employee-select" | "date";

interface BaseField {
  key: string;
  type: FilterFieldType;
  placeholder?: string;
  className?: string;
}

interface SearchField extends BaseField {
  type: "search";
}

interface SelectOption {
  label: string;
  value: string;
  empCode?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface SelectField extends BaseField {
  type: "select";
  options: SelectOption[];
}

interface EmployeeSelectField extends BaseField {
  type: "employee-select";
  options: SelectOption[];
}

interface DateField extends BaseField {
  type: "date";
}

export type FilterField =
  | SearchField
  | SelectField
  | EmployeeSelectField
  | DateField;

export type FilterValues = Record<string, string>;

interface FilterBarProps {
  fields: FilterField[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  showSort?: boolean;
  defaultSortOrder?: "asc" | "desc";
  onSortChange?: (order: "asc" | "desc") => void;
  showClear?: boolean;
  mode?: "inline" | "advanced";
  title?: string;
  subtitle?: string;
}

// ─── FilterBar ────────────────────────────────────────────────────────────────
export default function FilterBar({
  fields,
  values,
  onChange,
  showSort = false,
  defaultSortOrder = "asc",
  onSortChange,
  // showClear,
  mode = "inline",
  title,
  subtitle,
}: FilterBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);

  const handleChange = useCallback(
    (key: string, value: string) => {
      onChange({ ...values, [key]: value });
    },
    [values, onChange],
  );

  const handleSort = () => {
    const next = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(next);
    onSortChange?.(next);
  };

  const hasActiveFilters = fields.some((f) => !!values[f.key]);

  const defaultWidths: Record<FilterFieldType, string> = {
    search: "flex-1 min-w-[180px]",
    select: "w-full md:w-44",
    "employee-select": "w-full md:w-64",
    date: "w-full md:w-36",
  };

  return (
    <>
      <div
        className={
          mode === "inline"
            ? "bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center flex-wrap"
            : "flex items-center gap-3"
        }
      >
        {mode === "inline" ? (
          fields.map((field) => (
            <div
              key={field.key}
              className={field.className ?? defaultWidths[field.type]}
            >
              {field.type === "search" && (
                <TextInput
                  placeholder={
                    field.placeholder ?? globalStrings.searchEllipsis
                  }
                  value={values[field.key] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === " ") return;
                    handleChange(field.key, val.trimStart());
                  }}
                />
              )}

              {field.type === "select" && (
                <SearchableSelect
                  placeholder={
                    field.placeholder ?? globalStrings.selectEllipsis
                  }
                  options={(field as SelectField).options}
                  value={values[field.key] ?? ""}
                  onChange={(v) => handleChange(field.key, v as string)}
                  className="w-full"
                />
              )}

              {/* Employee select — shows avatar + empCode̊ in dropdown */}
              {field.type === "employee-select" && (
                <SearchableSelect
                  placeholder={
                    field.placeholder ?? globalStrings.selectEmployee
                  }
                  options={(field as EmployeeSelectField).options}
                  value={values[field.key] ?? ""}
                  onChange={(v) => handleChange(field.key, v as string)}
                  type="employee"
                  className="w-full"
                />
              )}

              {field.type === "date" && (
                <DatePicker
                  placeholder={field.placeholder ?? globalStrings.selectDate}
                  value={values[field.key] ?? ""}
                  onChange={(v) => handleChange(field.key, v)}
                />
              )}
            </div>
          ))
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 h-12 bg-white border border-gray-300 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Filter size={18} />
            Advanced Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600">
                {fields.filter((f) => !!values[f.key]).length}
              </span>
            )}
          </button>
        )}

        {showSort && (
          <button
            type="button"
            onClick={handleSort}
            title={
              sortOrder === "asc"
                ? `Sort ${globalStrings.ascending}`
                : `Sort ${globalStrings.descending}`
            }
            className="px-3 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors flex items-center gap-1 justify-center self-center"
          >
            {sortOrder === "asc" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
        )}

        {/* {shouldShowClear && (
          <button
            type="button"
            onClick={clearFilters}
            className={mode === "inline"
              ? "w-full md:w-auto px-3 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-100 self-center"
              : "p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            }
            title={globalStrings.clear}
          >
            <RotateCw size={16} />
            {mode === "inline" && globalStrings.clear}
          </button>
        )} */}
      </div>

      <AdvancedFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fields={fields}
        values={values}
        onChange={onChange}
        title={title}
        subtitle={subtitle}
      />
    </>
  );
}
