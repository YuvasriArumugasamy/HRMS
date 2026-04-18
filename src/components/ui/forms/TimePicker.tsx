import { Clock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";


const ScrollColumn = ({
  options,
  selected,
  onSelect,
  label,
  noBorder
}: {
  options: string[],
  selected: string,
  onSelect: (val: string) => void,
  label: string
  noBorder?: boolean,
}) => (
  <div className="flex flex-col flex-1">
    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 text-center">
      {label}
    </div>
    <div className={clsx("h-48 overflow-y-auto no-scrollbar rounded-lg bg-gray-50/50", !noBorder && "border")}>        {options.map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onSelect(opt)}
        className={clsx(
          "w-full py-2 text-sm transition-all duration-200",
          selected === opt
            ? "bg-primary text-white font-bold"
            : "text-gray-600 hover:bg-primary/20 bg-primary/10 hover:text-primary"
        )}
      >
        {opt}
      </button>
    ))}
    </div>
  </div>
);

interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "HH : MM  AM/PM",
  required = false,
  disabled = false,
  name,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Parse value
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  useEffect(() => {
    if (value) {
      // Assuming value is in "HH:mm" (24h) or "hh:mm A"
      // Let's handle simple "HH:mm" common in HTML5 time inputs first
      const parts = value.split(":");
      if (parts.length >= 2) {
        let h = parseInt(parts[0], 10);
        const m = parts[1].substring(0, 2);
        const p = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        setSelectedHour(String(h).padStart(2, "0"));
        setSelectedMinute(m);
        setSelectedPeriod(p);
      }
    }
  }, [value]);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const popupHeight = 280;

    if (spaceBelow < popupHeight && rect.top > popupHeight) {
      setPopupStyle({
        position: "fixed",
        top: rect.top - popupHeight - 4,
        left: rect.left,
        width: rect.width,
        minWidth: 240,
        zIndex: 9999,
      });
    } else {
      setPopupStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        minWidth: 240,
        zIndex: 9999,
      });
    }
  };

  useEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", () => open && updatePosition(), true);
    window.addEventListener("resize", () => open && updatePosition());
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (h: string, m: string, p: string) => {
    let hour24 = parseInt(h, 10);
    if (p === "PM" && hour24 < 12) hour24 += 12;
    if (p === "AM" && hour24 === 12) hour24 = 0;

    const formattedValue = `${String(hour24).padStart(2, "0")}:${m}`;
    onChange(formattedValue);
  };

  const displayValue = value ? (() => {
    const parts = value.split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const p = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")} : ${m} ${p}`;
  })() : "";


  const popup = (
    <div
      ref={popupRef}
      style={popupStyle}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-in fade-in zoom-in duration-200"
    >
      <div className="flex gap-3">
        <ScrollColumn
          label="Hrs"
          options={HOURS}
          selected={selectedHour}
          onSelect={(h) => {
            setSelectedHour(h);
            handleSelect(h, selectedMinute, selectedPeriod);
          }}
          noBorder
        />
        <ScrollColumn
          label="Min"
          options={MINUTES}
          selected={selectedMinute}
          onSelect={(m) => {
            setSelectedMinute(m);
            handleSelect(selectedHour, m, selectedPeriod);
          }}
          noBorder
        />
        <ScrollColumn
          label="AM/PM"
          options={PERIODS}
          selected={selectedPeriod}
          onSelect={(p) => {
            setSelectedPeriod(p);
            handleSelect(selectedHour, selectedMinute, p);
          }}
          noBorder
        />
      </div>
      <div className="mt-4 pt-3 border-t flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-bold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
        >
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full" ref={wrapperRef}>
        <input type="hidden" name={name} value={value} />
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            "w-full h-12 px-4 rounded-[10px] border text-sm flex items-center justify-between transition-all duration-200",
            error ? "border-red-500 ring-1 ring-red-500/10" : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20",
            disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white text-gray-800 hover:border-gray-400",
            open && "border-primary ring-1 ring-primary/20"
          )}
        >
          <span className={clsx(displayValue ? "text-gray-900 font-medium" : "text-gray-400")}>
            {displayValue || placeholder}
          </span>
          <Clock
            size={18}
            className={clsx("transition-transform duration-200", open ? "text-primary scale-110" : "text-gray-400")}
          />
        </button>
      </div>

      {open && createPortal(popup, document.body)}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default TimePicker;
