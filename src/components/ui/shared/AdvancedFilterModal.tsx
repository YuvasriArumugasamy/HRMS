import React from "react";
import { RotateCcw } from "lucide-react";
import Modal from "@/components/ui/overlays/Modal";
import Button from "@/components/ui/buttons/Button";
import type { FilterField, FilterValues } from "./ReusableFilterBar";
import TextInput from "@/components/ui/forms/TextInput";
import { SearchableSelect } from "@/components/ui/forms/SearchableSelect";
import DatePicker from "@/components/ui/forms/DatePicker";
import { globalStrings } from "@/core/constants/strings";

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FilterField[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  title?: string;
  subtitle?: string;
}

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  fields,
  values,
  onChange,
  title = "Advanced Filters",
  subtitle = "Refine your search",
}) => {
  const [localValues, setLocalValues] = React.useState<FilterValues>(values);

  React.useEffect(() => {
    if (isOpen) {
      setLocalValues(values);
    }
  }, [isOpen, values]);

  const handleLocalChange = (key: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onChange(localValues);
    onClose();
  };

  const handleReset = () => {
    const empty: FilterValues = {};
    fields.forEach((f) => (empty[f.key] = ""));
    setLocalValues(empty);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      headerClassName="bg-[#FFFAF0]"
      title={
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900">{title as any}</span>
          <span className="text-xs font-normal text-gray-500">{subtitle}</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              {field.placeholder?.replace("Select ", "").replace("Search ", "") || field.key}
            </label>
            {field.type === "search" && (
              <TextInput
                placeholder={field.placeholder ?? globalStrings.searchEllipsis}
                value={localValues[field.key] ?? ""}
                onChange={(e) => handleLocalChange(field.key, e.target.value)}
              />
            )}

            {field.type === "select" && (
              <SearchableSelect
                placeholder={field.placeholder ?? globalStrings.selectEllipsis}
                options={(field as any).options}
                value={localValues[field.key] ?? ""}
                onChange={(v) => handleLocalChange(field.key, v as string)}
                className="w-full"
              />
            )}

            {field.type === "date" && (
              <DatePicker
                placeholder={field.placeholder ?? globalStrings.selectDate}
                value={localValues[field.key] ?? ""}
                onChange={(v) => handleLocalChange(field.key, v)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <button
          onClick={handleReset}
          className="px-6 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset Filters
        </button>
        <div className="flex gap-3">
          <Button
             variant="primary"
             onClick={handleApply}
             className="px-8 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 border-none"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdvancedFilterModal;
