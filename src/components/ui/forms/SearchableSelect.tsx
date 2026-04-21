import Button from "@/components/ui/buttons/Button";
import TextInput from "@/components/ui/forms/TextInput";
import Modal from "@/components/ui/overlays/Modal";
import { globalStrings } from "@/core/constants/strings";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface EmployeeOption {
  label: string;
  value: string;
  empCode?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface SearchableSelectProps<T = any> {
  placeholder?: string;
  options: Array<{
    label: string;
    value: string;
    empCode?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }>;
  value?: T;
  onChange: (value: T) => void;
  multiple?: boolean;
  onBlur?: (e: any) => void;
  onAdd?: (value: string) => void;
  onAddClick?: (searchValue: string) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  size?: "sm" | "md" | "lg";
  name?: string;
  required?: boolean;
  renderOption?: (option: { label: string; value: string }) => React.ReactNode;
  type?: "default" | "employee";
  searchable?: boolean;
  maxLength?: number;
  loading?: boolean;
}

export const getInitials = (
  firstName?: string,
  lastName?: string,
  fallback?: string,
): string => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  if (fallback) {
    const parts = fallback.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fallback.substring(0, 2).toUpperCase();
  }
  return "??";
};

export const getAvatarColor = (
  firstName?: string,
  lastName?: string,
  fallback?: string,
): string => {
  const fullName =
    `${firstName || ""}${lastName || ""}`.trim() || fallback || "default";

  let hash = 0;
  for (let i = 0; i < fullName.length; i++) {
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 65;
  const lightness = 55;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function SearchableSelect<T = any>({
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  onBlur,
  onAdd,
  onAddClick,
  className,
  label,
  error,
  disabled,
  size = "md",
  name,
  renderOption,
  multiple = false,
  type = "default",
  searchable = false,
  maxLength,
  loading = false,
  ...props
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldShowSearch = searchable || (options && options.length > 10);

  const selectedValues = multiple
    ? Array.isArray(value)
      ? (value as unknown as string[])
      : []
    : value
      ? [value as unknown as string]
      : [];

  const hasSelection = multiple
    ? Array.isArray(value) && (value as unknown as string[]).length > 0
    : !!value;

  const filteredOptions = options.filter(
    (opt) =>
      opt.label?.toLowerCase().includes(search?.toLowerCase()) ||
      opt.empCode?.toLowerCase().includes(search?.toLowerCase()),
  );

  const truncateText = (text: string, limit = 45) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const displayValue = multiple
    ? options
        .filter((opt) => selectedValues.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ")
    : options.find((opt) => opt.value === (value as unknown as string))
        ?.label ||
      ((value as unknown as string) ?? "");

  // const displayValue = multiple
  //   ? truncateText(
  //     options
  //       .filter((opt) => selectedValues.includes(opt.value))
  //       .map((opt) => opt.label)
  //       .join(", "),
  //     45
  //   )
  //   : truncateText(
  //     options.find((opt) => opt.value === (value as unknown as string))
  //       ?.label ||
  //     ((value as unknown as string) ?? ""),
  //     45
  //   );

  const sizeConfig = { sm: "h-10", md: "h-12", lg: "h-14" };
  const height = sizeConfig[size];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !isAddModalOpen
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
      document.addEventListener("touchstart", handleClickOutside, {
        capture: true,
      });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
      document.removeEventListener("touchstart", handleClickOutside, {
        capture: true,
      });
    };
  }, [isOpen, isAddModalOpen]);

  const handleOptionClick = (optionValue: string) => {
    if (!multiple) {
      onChange(optionValue as unknown as T);
      setIsOpen(false);
      setSearch("");
    } else {
      const currentValues = Array.isArray(value)
        ? (value as unknown as string[])
        : [];
      let newSelected: string[];
      if (currentValues.includes(optionValue)) {
        newSelected = currentValues.filter((v) => v !== optionValue);
      } else {
        newSelected = [...currentValues, optionValue];
      }
      onChange(newSelected as unknown as T);
    }
  };

  const renderEmployeeOption = (opt: EmployeeOption) => {
    const initials = getInitials(opt.firstName, opt.lastName, opt.label);
    const avatarColor = getAvatarColor(opt.firstName, opt.lastName, opt.label);
    return (
      <div className="flex items-center gap-3">
        {opt.avatar ? (
          <img
            src={opt.avatar}
            alt={opt.label}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            style={{ backgroundColor: avatarColor }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {opt.label}
          </p>
          {opt.empCode && (
            <p className="text-xs text-gray-500 truncate">{opt.empCode}</p>
          )}
        </div>
      </div>
    );
  };

  const renderEmployeeDisplayValue = () => {
    if (!hasSelection) return null;

    if (multiple && Array.isArray(value)) {
      const selectedOptions = options.filter((opt) =>
        (value as unknown as string[]).includes(opt.value),
      );

      if (selectedOptions.length === 0) return null;

      if (selectedOptions.length === 1) {
        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-900 truncate">
              {truncateText(selectedOptions[0].label, 15)}
            </span>
            {selectedOptions[0].empCode && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                ({selectedOptions[0].empCode})
              </span>
            )}
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-900 truncate">
            {selectedOptions[0].label} + {selectedOptions.length - 1} more
          </span>
        </div>
      );
    }

    const selectedOption = options.find(
      (opt) => opt.value === (value as unknown as string),
    );

    if (!selectedOption) return null;

    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-900 truncate">
          {truncateText(selectedOption.label, 15)}
        </span>
        {selectedOption.empCode && (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            ({selectedOption.empCode})
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={clsx("relative flex flex-col  gap-2", className)}
    >
      {label && (
        <label className="text-sm font-medium text-text">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          name={name}
          id={name}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onBlur={onBlur}
          disabled={disabled}
          className={clsx(
            "w-full px-3 py-2 text-left bg-white border rounded-[10px] text-sm flex items-center justify-between cursor-pointer focus:outline-none focus:ring-1",
            height,
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-primary",
            disabled && "bg-gray-100 cursor-not-allowed opacity-60",
          )}
        >
          {type === "employee" && hasSelection ? (
            renderEmployeeDisplayValue() || (
              <span className="text-gray-500">{placeholder}</span>
            )
          ) : (
            <span
              className={clsx(
                displayValue ? "text-gray-900" : "text-gray-500",
                "truncate overflow-hidden text-ellipsis",
              )}
            >
              {displayValue || placeholder}
            </span>
          )}
          <svg
            className={clsx(
              "w-4 h-4 transition-transform flex-shrink-0",
              isOpen && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-full z-30 bg-white border border-gray-200 rounded-md shadow-lg">
            {/* Search Input */}
            {shouldShowSearch && (
              <div className="p-4 border-b border-gray-100 bg-white">
                <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 z-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === " ") return;
                        setSearch(val.trimStart());
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      style={{ paddingLeft: '46px' }}
                      className="w-full h-11 pr-4 rounded-[14px] bg-white border border-[#1b6b8f] focus:outline-none focus:ring-2 focus:ring-[#1b6b8f]/20 text-[15px] text-slate-700 placeholder-slate-400 transition-all shadow-sm"
                    />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="max-h-80 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-3 text-sm hover:bg-gray-50 cursor-pointer transition-colors",
                      selectedValues.includes(opt.value) &&
                        "bg-blue-50 hover:bg-blue-100",
                    )}
                    onClick={() => handleOptionClick(opt.value)}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(opt.value)}
                        readOnly
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    )}
                    {type === "employee" ? (
                      renderEmployeeOption(opt as EmployeeOption)
                    ) : renderOption ? (
                      renderOption(opt)
                    ) : (
                      <div className="flex flex-col min-w-0">
                        <span className="flex-1 truncate">{opt.label}</span>
                        {opt.empCode && (
                          <span className="text-xs text-gray-500 truncate">
                            {opt.empCode}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : loading ? (
                <div className="p-3 flex items-center justify-center gap-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500">
                  {globalStrings.noResultsFound}
                </div>
              )}
            </div>

            {/* Add New Value */}
            {(onAdd || onAddClick) && (
              <button
                type="button"
                onClick={() => {
                  if (onAddClick) {
                    onAddClick(search);
                    setIsOpen(false);
                  } else {
                    setNewValue(search);
                    setIsAddModalOpen(true);
                  }
                }}
                className="w-full text-left px-3 py-3 text-sm text-primary bg-white cursor-pointer font-medium border-t border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">+</span> Add new value
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Add New Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add New ${label}`}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <TextInput
            label={`New ${label}`}
            value={newValue}
            onChange={(e) => {
              let val = e.target.value;
              if (val === " ") return;
              val = val.trimStart();
              if (name === "assignedSex" || name === "pronouns") {
                val = val.replace(/[^a-zA-Z\s/]/g, "");
                val = val.replace(/\/+/g, "/");
              }
              setNewValue(val);
            }}
            placeholder={`Enter ${label}`}
            autoFocus
            maxLength={maxLength}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="w-24"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (onAdd && newValue.trim()) {
                  onAdd(newValue);
                  setIsAddModalOpen(false);
                  setIsOpen(false);
                  setSearch("");
                }
              }}
              className="w-24"
              disabled={!newValue.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
