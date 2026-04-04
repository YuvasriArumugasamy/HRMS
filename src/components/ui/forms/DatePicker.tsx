import { Calendar } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import moment from "moment";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/* Helpers */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (minDate) {
    const min = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate(),
    );
    if (d < min) return true;
  }
  if (maxDate) {
    const max = new Date(
      maxDate.getFullYear(),
      maxDate.getMonth(),
      maxDate.getDate(),
    );
    if (d > max) return true;
  }
  return false;
}

function isMonthDisabled(
  year: number,
  month: number,
  minDate?: Date,
  maxDate?: Date,
) {
  if (maxDate) {
    const max = new Date(
      maxDate.getFullYear(),
      maxDate.getMonth(),
      maxDate.getDate(),
    );
    const firstOfMonth = new Date(year, month, 1);
    if (firstOfMonth > max) return true;
  }
  if (minDate) {
    const min = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate(),
    );
    const lastOfMonth = new Date(year, month + 1, 0);
    if (lastOfMonth < min) return true;
  }
  return false;
}

function isYearDisabled(year: number, minDate?: Date, maxDate?: Date) {
  if (maxDate && year > maxDate.getFullYear()) return true;
  if (minDate && year < minDate.getFullYear()) return true;
  return false;
}

function buildGrid(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const cells: { day: number; date: Date }[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: 0, date: new Date(0) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: new Date(year, month, d) });
  }
  return cells;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  minDate,
  maxDate,
  placeholder = "Select date",
  required = false,
  disabled = false,
  name,
  className,
}) => {
  const today = new Date();
  const m = value ? moment(value) : null;
  const selectedDate = m && m.isValid() ? m.toDate() : null;

  const defaultViewDate =
    selectedDate ?? (maxDate && maxDate < today ? maxDate : today);

  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"days" | "months" | "years">("days");
  const [viewYear, setViewYear] = useState(defaultViewDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(defaultViewDate.getMonth());
  const [yearGridStart, setYearGridStart] = useState(
    defaultViewDate.getFullYear() - 5,
  );

  // Portal positioning
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Position the popup relative to the trigger button
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const popupHeight = 380;

    if (spaceBelow < popupHeight && rect.top > popupHeight) {
      // Open upward
      setPopupStyle({
        position: "fixed",
        top: rect.top - popupHeight - 4,
        left: rect.left,
        width: 320,
        zIndex: 9999,
      });
    } else {
      // Open downward
      setPopupStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: 320,
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
        setPanel("days");
      }
    }
    function handleScroll() {
      if (open) updatePosition();
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  const cells = buildGrid(viewYear, viewMonth);
  const years = Array.from({ length: 12 }, (_, i) => yearGridStart + i);

  function handlePrev() {
    if (panel === "years") {
      setYearGridStart((y) => y - 12);
    } else if (panel === "months") {
      setViewYear((y) => y - 1);
    } else {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    }
  }

  function handleNext() {
    if (panel === "years") {
      setYearGridStart((y) => y + 12);
    } else if (panel === "months") {
      setViewYear((y) => y + 1);
    } else {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    }
  }

  function selectDay(cell: { day: number; date: Date }) {
    if (cell.day === 0) return;
    if (isDateDisabled(cell.date, minDate, maxDate)) return;
    onChange(toYMD(cell.date));
    setOpen(false);
    setPanel("days");
  }

  function goToday() {
    if (isDateDisabled(today, minDate, maxDate)) return;
    onChange(toYMD(today));
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setOpen(false);
    setPanel("days");
  }

  function openPanel(p: "months" | "years") {
    if (p === "years") setYearGridStart(viewYear - 5);
    setPanel(p);
  }

  function formatDisplayDate(d: Date) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function headerLabel() {
    if (panel === "years") return `${yearGridStart} – ${yearGridStart + 11}`;
    if (panel === "months") return `${viewYear}`;
    return `${MONTHS[viewMonth]} ${viewYear}`;
  }

  const displayValue = selectedDate ? formatDisplayDate(selectedDate) : "";

  const popup = (
    <div
      ref={popupRef}
      style={popupStyle}
      className="rounded-xl shadow-xl bg-white border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50 text-gray-800 rounded-t-xl">
        <div className="flex gap-2">
          {panel === "days" && (
            <>
              <button
                type="button"
                onClick={() => openPanel("months")}
                className="hover:text-orange-500 transition"
              >
                {MONTHS[viewMonth]}
              </button>
              <button
                type="button"
                onClick={() => openPanel("years")}
                className="hover:text-orange-500 transition"
              >
                {viewYear}
              </button>
            </>
          )}
          {panel === "months" && (
            <button
              type="button"
              onClick={() => openPanel("years")}
              className="hover:text-orange-500 transition font-medium"
            >
              {viewYear}
            </button>
          )}
          {panel === "years" && (
            <span className="font-medium text-gray-700">{headerLabel()}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="hover:text-orange-500 transition px-1"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="hover:text-orange-500 transition px-1"
          >
            ›
          </button>
        </div>
      </div>

      {/* Days */}
      {panel === "days" && (
        <div className="p-4">
          <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
            {DAYS.map((d) => (
              <span key={d} className="text-center">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              if (cell.day === 0) return <div key={i} />;
              const disabled_ = isDateDisabled(cell.date, minDate, maxDate);
              return (
                <button
                  type="button"
                  key={i}
                  disabled={disabled_}
                  onClick={() => selectDay(cell)}
                  className={`aspect-square rounded-md text-sm transition
                    ${
                      disabled_
                        ? "text-gray-400 opacity-50 cursor-not-allowed pointer-events-none"
                        : `text-gray-700 hover:bg-gray-100
                        ${selectedDate && isSameDay(cell.date, selectedDate) ? "bg-orange-500 text-white font-semibold" : ""}
                        ${isSameDay(cell.date, today) && !(selectedDate && isSameDay(cell.date, selectedDate)) ? "border border-orange-400 text-orange-500" : ""}`
                    }
                  `}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Months */}
      {panel === "months" && (
        <div className="grid grid-cols-3 gap-2 p-4 text-gray-700">
          {MONTHS_SHORT.map((m, i) => {
            const disabled_ = isMonthDisabled(viewYear, i, minDate, maxDate);
            return (
              <button
                key={m}
                type="button"
                disabled={disabled_}
                onClick={() => {
                  if (!disabled_) {
                    setViewMonth(i);
                    setPanel("days");
                  }
                }}
                className={`py-2 rounded transition
                  ${i === viewMonth ? "bg-orange-500 text-white font-semibold" : ""}
                  ${disabled_ ? "text-gray-400 opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-gray-100"}
                `}
              >
                {m}
              </button>
            );
          })}
        </div>
      )}

      {/* Years */}
      {panel === "years" && (
        <div className="p-4 text-gray-700">
          <div className="grid grid-cols-4 gap-2">
            {years.map((yr) => {
              const disabled_ = isYearDisabled(yr, minDate, maxDate);
              return (
                <button
                  key={yr}
                  type="button"
                  disabled={disabled_}
                  onClick={() => {
                    if (!disabled_) {
                      setViewYear(yr);
                      setPanel("months");
                    }
                  }}
                  className={`py-2 rounded transition
                    ${yr === viewYear ? "bg-orange-500 text-white font-semibold" : ""}
                    ${disabled_ ? "text-gray-400 opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-gray-100"}
                  `}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <button
          onClick={goToday}
          type="button"
          disabled={isDateDisabled(today, minDate, maxDate)}
          className={`text-xs transition
            ${isDateDisabled(today, minDate, maxDate) ? "text-gray-400 opacity-50 cursor-not-allowed" : "text-gray-500 hover:text-orange-500"}
          `}
        >
          Today
        </button>
        {selectedDate && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
   <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {label && (
        <label className="text-sm font-medium text-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full" ref={wrapperRef}>
        <input type="hidden" name={name} value={value} />

        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={`w-full h-12 px-4 rounded-lg border text-sm flex items-center justify-between transition
            ${error ? "border-red-500" : "border-gray-300"}
            ${disabled ? "bg-gray-100 text-gray-400" : "bg-white"}    
          `}
        >
          <span className={displayValue ? "text-gray-800" : "text-gray-400"}>
            {displayValue || placeholder}
          </span>
          <Calendar
            size={18}
            className="transition-all duration-200 text-gray-400"
          />
        </button>
      </div>

      {open && createPortal(popup, document.body)}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
