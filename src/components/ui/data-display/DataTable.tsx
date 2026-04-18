import Checkbox from "@/components/ui/forms/Checkbox";
import { globalStrings } from "@/core/constants/strings";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
}

export interface RowAction<T> {
  icon: React.ReactNode;
  onClick: (row: T) => void;
  className?: string;
  title?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  /** Pass visibleColumns from useColumnFilter() in the parent */
  visibleColumns?: Set<string>;
  selectable?: boolean;
  selectedItems?: any[];
  onSelectionChange?: (selected: any[]) => void;
  /** Inline icon actions — always visible in each row */
  rowActions?: RowAction<T>[] | ((row: T) => RowAction<T>[]);
  rowClassName?: string | ((row: T) => string);
  getRowId: (row: T) => any;
  emptyMessage?: string;
  minHeight?: string;
  onRowClick?: (row: T) => void;
  sortConfig?: { key: string; order: "asc" | "desc" };
  onSort?: (key: string) => void;
}

export function useColumnFilter<T>(columns: Column<T>[]) {
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.key)),
  );

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key) && next.size === 1) return prev;
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return { visibleColumns, toggleColumn };
}

export function ColumnFilterButton<T>({
  columns,
  visibleColumns,
  onToggle,
}: {
  columns: Column<T>[];
  visibleColumns: Set<string>;
  onToggle: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{DT_STYLES}</style>
      <div
        ref={wrapRef}
        style={{ position: "relative", display: "inline-block" }}
      >
        <button
          className="dt-col-toggle-btn"
          onClick={() => setOpen((v) => !v)}
        >
          <SlidersHorizontal size={20} />
        </button>

        {open && (
          <div className="dt-filter-panel">
            <div className="dt-filter-header">
              <span className="dt-filter-title">Toggle Columns</span>
              <button
                className="dt-filter-close"
                onClick={() => setOpen(false)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="dt-filter-list">
              {columns.map((col) => {
                const visible = visibleColumns.has(col.key);
                return (
                  <button
                    key={col.key}
                    className={clsx(
                      "dt-filter-item",
                      visible && "dt-filter-item--on",
                    )}
                    onClick={() => onToggle(col.key)}
                  >
                    <span className="dt-filter-check">
                      {visible && <Check size={11} strokeWidth={3} />}
                    </span>
                    {col.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// SORT ICON
// ============================================================================

function SortIcon({
  columnKey,
  sortConfig,
}: {
  columnKey: string;
  sortConfig?: { key: string; order: "asc" | "desc" };
}) {
  const isActive = sortConfig?.key === columnKey;
  const isAsc = isActive && sortConfig?.order === "asc";
  const isDesc = isActive && sortConfig?.order === "desc";

  return (
    <span className="dt-sort-icon">
      <ChevronUp
        size={11}
        className={isAsc ? "dt-sort-active" : ""}
        strokeWidth={isAsc ? 3 : 2}
      />
      <ChevronDown
        size={11}
        className={clsx("dt-sort-down", isDesc ? "dt-sort-active" : "")}
        strokeWidth={isDesc ? 3 : 2}
      />
    </span>
  );
}

// ============================================================================
// MAIN TABLE
// ============================================================================

export function DataTable<T>({
  data,
  columns,
  visibleColumns,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  rowActions = [],
  rowClassName,
  getRowId,
  emptyMessage = globalStrings.noData,
  minHeight = "500px",
  onRowClick,
  sortConfig,
  onSort,
}: TableProps<T>) {
  const activeColumns = visibleColumns
    ? columns.filter((c) => visibleColumns.has(c.key))
    : columns;

  const hasActions =
    rowActions && (Array.isArray(rowActions) ? rowActions.length > 0 : true);

  const toggleSelection = (id: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!onSelectionChange) return;
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter((i) => i !== id)
      : [...selectedItems, id];
    onSelectionChange(newSelection);
  };

  const toggleAllSelection = () => {
    if (!onSelectionChange) return;
    if (selectedItems.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(getRowId));
    }
  };

  return (
    <>
      <style>{DT_STYLES}</style>

      <div className="dt-wrap" style={{ minHeight }}>
        <div className="dt-table-scroll">
          <table className="dt-table">
            {/* THEAD */}
            <thead className="dt-thead">
              <tr>
                {selectable && (
                  <th className="dt-th dt-th--check">
                    <Checkbox
                      checked={
                        selectedItems.length === data.length && data.length > 0
                      }
                      onChange={toggleAllSelection}
                    />
                  </th>
                )}

                {activeColumns.map((column) => (
                  <th
                    key={column.key}
                    className={clsx(
                      "dt-th",
                      column.sortable && "dt-th--sortable",
                      column.headerClassName,
                    )}
                    onClick={() => column.sortable && onSort?.(column.key)}
                  >
                    <div className="dt-th-inner">
                      {column.label}
                      {column.sortable && (
                        <SortIcon
                          columnKey={column.key}
                          sortConfig={sortConfig}
                        />
                      )}
                    </div>
                  </th>
                ))}

                {hasActions && (
                  <th className="dt-th dt-th--actions">Actions</th>
                )}
              </tr>
            </thead>

            {/* TBODY */}
            <tbody className="dt-tbody">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      activeColumns.length +
                      (selectable ? 1 : 0) +
                      (hasActions ? 1 : 0)
                    }
                  >
                    <div className="dt-empty">
                      <div className="dt-empty-icon">🗂️</div>
                      {emptyMessage}
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedItems.includes(rowId);
                  const computedRowClassName =
                    typeof rowClassName === "function"
                      ? rowClassName(row)
                      : rowClassName;

                  const resolvedActions =
                    typeof rowActions === "function"
                      ? rowActions(row)
                      : rowActions;

                  return (
                    <tr
                      key={rowId}
                      onClick={() => onRowClick?.(row)}
                      className={clsx(
                        onRowClick && "dt-row--clickable",
                        isSelected && "dt-row--selected",
                        computedRowClassName,
                      )}
                    >
                      {selectable && (
                        <td className="dt-td dt-td--check">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleSelection(rowId)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}

                      {activeColumns.map((column) => {
                        const cellValue = (row as any)[column.key];
                        return (
                          <td
                            key={column.key}
                            title={
                              typeof cellValue === "string"
                                ? cellValue
                                : undefined
                            }
                            className={clsx("dt-td", column.className)}
                          >
                            {column.render ? column.render(row) : cellValue}
                          </td>
                        );
                      })}

                      {/* INLINE ACTION ICONS — always visible */}
                      {hasActions && (
                        <td
                          className="dt-td dt-td--actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="dt-actions-row">
                            {resolvedActions.map((action, idx) => (
                              <button
                                key={idx}
                                title={action.title}
                                className={action.className ?? "dt-action-btn"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.icon}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// SHARED STYLES
// ============================================================================

const DT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --color-primary:         #014063;
    --color-primary-light:   #00A4FF8F;
    --color-secondary:       #FF7A0F;
    --color-secondary-light: #FFE6D2;
    --color-danger:          #EF4444;
    --color-error:           #EF4414;
    --color-success:         #22C55E;
  }

  .dt-wrap {
    font-family: 'DM Sans', sans-serif;
    border-radius: 14px;
    border: 1px solid #E2EBF0;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(1,64,99,0.04), 0 4px 20px rgba(1,64,99,0.07);
    background: #fff;
  }
  .dt-table-scroll { overflow-x: auto; }

  .dt-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 13.5px;
  }

  /* THEAD */
  .dt-thead {
    background: linear-gradient(to bottom, #EEF5FA, #E6F0F7);
    border-bottom: 2px solid #C8DDE9;
  }
  .dt-th {
    padding: 14px 18px;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-primary);
    white-space: nowrap;
    user-select: none;
  }
  .dt-th--sortable { cursor: pointer; }
  .dt-th--sortable:hover { color: var(--color-secondary); }
  .dt-th-inner { display: flex; align-items: center; gap: 5px; }
  .dt-th--check   { width: 44px; padding: 14px 12px; }
  .dt-th--actions { text-align: left; }

  /* Sort icons */
  .dt-sort-icon {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    line-height: 0;
    color: #B0C4D4;
  }
  .dt-sort-down   { margin-top: -3px; }
  .dt-sort-active { color: var(--color-secondary) !important; }

  /* TBODY */
  .dt-tbody tr {
    border-bottom: 1px solid #EEF2F7;
    transition: background 0.12s;
  }
  .dt-tbody tr:last-child          { border-bottom: none; }
  .dt-tbody tr:nth-child(odd)      { background: #ffffff; }
  .dt-tbody tr:nth-child(even)     { background: #F7FAFC; }
  .dt-tbody tr:hover               { background: #EBF4FA !important; }
  .dt-tbody tr.dt-row--clickable   { cursor: pointer; }
  .dt-tbody tr.dt-row--selected {
    background: #EBF4FA !important;
    box-shadow: inset 3px 0 0 var(--color-secondary);
  }

  .dt-td {
    padding: 14px 18px;
    color: #2D4A5A;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dt-td--check   { padding: 14px 12px; width: 44px; }
  .dt-td--actions { padding: 10px 18px; white-space: nowrap; }

  /* INLINE ACTION BUTTONS */
  .dt-actions-row {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .dt-action-btn {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    color: var(--color-primary);
    transition: background 0.13s, color 0.13s, transform 0.1s;
  }
  .dt-action-btn:hover  { background: #E8EFF5; }
  .dt-action-btn:active { transform: scale(0.88); }

  /* EMPTY */
  .dt-empty {
    text-align: center;
    padding: 60px 20px;
    color: #94A3B8;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
  }
  .dt-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.35; }

  /* COLUMN FILTER BUTTON (in parent) */
  .dt-col-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 12px;
    border-radius: 8px;
    border: 1px solid #D0DDE6;
    background: #fff;
    color: var(--color-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 1px 3px rgba(1,64,99,0.06);
  }
  .dt-col-toggle-btn:hover {
    border-color: var(--color-primary);
    background: #EBF4FA;
  }

  /* COLUMN FILTER PANEL */
  .dt-filter-panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 50;
    background: #fff;
    border: 1px solid #D0DDE6;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(1,64,99,0.14);
    min-width: 180px;
    overflow: hidden;
    animation: dtFadeIn 0.12s ease;
  }
  @keyframes dtFadeIn {
    from { opacity:0; transform:translateY(-6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .dt-filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 8px;
    border-bottom: 1px solid #EEF2F6;
  }
  .dt-filter-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-primary);
    font-family: 'DM Sans', sans-serif;
  }
  .dt-filter-close {
    all: unset;
    cursor: pointer;
    color: #94A3B8;
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.12s;
  }
  .dt-filter-close:hover { color: var(--color-danger); }
  .dt-filter-list { padding: 6px; }
  .dt-filter-item {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 8px;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #334155;
    cursor: pointer;
    transition: background 0.12s;
  }
  .dt-filter-item:hover     { background: #F1F7FB; }
  .dt-filter-item--on       { color: var(--color-primary); font-weight: 500; }
  .dt-filter-check {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1.5px solid #CBD5E1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #fff;
    transition: all 0.12s;
  }
  .dt-filter-item--on .dt-filter-check {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
  }
`;
