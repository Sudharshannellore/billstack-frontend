import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search } from "lucide-react";
import { getCardThemeByIndex, type CardTheme } from "./cardThemes";
import { EmptyState, type EmptyStateProps } from "./EmptyState";
import { ErrorState, type ErrorStateProps } from "./ErrorState";
import { TableSkeleton } from "./TableSkeleton";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string | number;
  /** theme accent for the card chrome; defaults to the first palette theme */
  theme?: CardTheme;
  themeIndex?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (row: T) => string;
  pageSize?: number;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  error?: ErrorStateProps | null;
  onRetry?: () => void;
  emptyState?: EmptyStateProps;
  /** Extra toolbar content rendered next to the search input (e.g. status filter dropdowns). */
  toolbar?: ReactNode;
  rowClassName?: (row: T) => string;
  /** When set, rows show a chevron and clicking one expands an inline detail panel below it (see Invoices.tsx for the pattern this generalizes). */
  renderExpanded?: (row: T, index: number) => ReactNode;
}

/**
 * Generic table with search/sort/pagination/row-selection, styled to match the existing
 * hand-rolled "glass card wrapping a <table>" pattern (top accent bar + gradient tint + glow orb)
 * used across Products/Plans/Customers/Subscriptions rather than the plain shadcn Table.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  theme,
  themeIndex = 0,
  searchable = false,
  searchPlaceholder = "Search…",
  searchKeys,
  pageSize = 10,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  onRowClick,
  loading = false,
  error = null,
  onRetry,
  emptyState,
  toolbar,
  rowClassName,
  renderExpanded,
}: DataTableProps<T>) {
  const resolvedTheme = theme ?? getCardThemeByIndex(themeIndex);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim() || !searchKeys) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) => searchKeys(row).toLowerCase().includes(q));
  }, [data, query, searchable, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleRow(id: string | number) {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    );
  }

  function toggleAll() {
    if (!onSelectionChange) return;
    const pageIds = paged.map(getRowId);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    onSelectionChange(
      allSelected
        ? selectedIds.filter((id) => !pageIds.includes(id))
        : [...new Set([...selectedIds, ...pageIds])],
    );
  }

  const allOnPageSelected = paged.length > 0 && paged.every((row) => selectedIds.includes(getRowId(row)));

  return (
    <div className="space-y-4">
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow]"
              />
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2 flex-wrap">{toolbar}</div>}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-card border ${resolvedTheme.border} rounded-2xl overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${resolvedTheme.topAccent} rounded-t-2xl pointer-events-none z-10`} />
        <div className={`absolute inset-0 bg-gradient-to-br ${resolvedTheme.bgGlow} pointer-events-none`} />
        <div className={`absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br ${resolvedTheme.bgGlow} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.01] border-b border-white/[0.04]">
              <tr>
                {renderExpanded && <th className="py-4 px-6 w-8"></th>}
                {selectable && (
                  <th className="py-4 px-6 w-10">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAll}
                      className="rounded border-border accent-[var(--color-primary)]"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left py-4 px-6 text-sm font-medium text-muted-foreground ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                    } ${col.className ?? ""}`}
                  >
                    {col.sortValue ? (
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {col.header}
                        {sortKey === col.key ? (
                          sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                        ) : null}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} columns={columns.length + (selectable ? 1 : 0)} />
              ) : error ? null : paged.length === 0 ? null : (
                paged.map((row, index) => {
                  const id = getRowId(row);
                  const isExpanded = renderExpanded ? expandedId === id : false;
                  return (
                    <>
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          if (renderExpanded) setExpandedId(isExpanded ? null : id);
                          onRowClick?.(row);
                        }}
                        className={`border-b border-border hover:bg-muted/30 transition-colors group ${
                          onRowClick || renderExpanded ? "cursor-pointer" : ""
                        } ${rowClassName?.(row) ?? ""}`}
                      >
                        {renderExpanded && (
                          <td className="py-4 px-6">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </td>
                        )}
                        {selectable && (
                          <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(id)}
                              onChange={() => toggleRow(id)}
                              className="rounded border-border accent-[var(--color-primary)]"
                            />
                          </td>
                        )}
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={`py-4 px-6 ${
                              col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                            } ${col.className ?? ""}`}
                          >
                            {col.render(row, index)}
                          </td>
                        ))}
                      </motion.tr>
                      <AnimatePresence key={`${id}-expanded`}>
                        {renderExpanded && isExpanded && (
                          <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-border bg-muted/10">
                            <td colSpan={columns.length + (selectable ? 1 : 0) + 1} className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                              {renderExpanded(row, index)}
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && error && (
            <ErrorState {...error} onRetry={onRetry ?? error.onRetry} />
          )}
          {!loading && !error && paged.length === 0 && (
            <EmptyState
              title="No results found"
              description={query ? `Nothing matches "${query}".` : "There's nothing here yet."}
              {...emptyState}
            />
          )}
        </div>
      </motion.div>

      {!loading && !error && sorted.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
