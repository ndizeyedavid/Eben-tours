"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useMemo, useState } from "react";

export default function AdminDataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  pageSize = 8,
  renderToolbar,
  loading = false,
  enableRowSelection = false,
  getRowId,
}: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
  pageSize?: number;
  renderToolbar?: (table: Table<TData>) => ReactNode;
  loading?: boolean;
  enableRowSelection?: boolean;
  getRowId?: (originalRow: TData, index: number, parent?: any) => string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const initialState = useMemo(
    () => ({ pagination: { pageIndex: 0, pageSize } }),
    [pageSize]
  );

  const columnsWithSelection = useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectCol: ColumnDef<TData, any> = {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          aria-label="Select all rows"
          checked={table.getIsAllPageRowsSelected()}
          ref={(el) => {
            if (!el) return;
            el.indeterminate = table.getIsSomePageRowsSelected();
          }}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="h-4 w-4 cursor-pointer rounded border-emerald-900/20 text-emerald-700"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label="Select row"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 cursor-pointer rounded border-emerald-900/20 text-emerald-700 disabled:cursor-not-allowed"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 44,
    };

    return [selectCol, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState,
    enableRowSelection,
    getRowId,
  });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm9 16-3.1-3.1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-emerald-900/10 bg-white px-9 py-2.5 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:justify-end">
          {renderToolbar ? (
            <div className="sm:mr-2">{renderToolbar(table)}</div>
          ) : null}
          <div className="text-xs font-semibold text-[var(--muted)]">
            {table.getFilteredRowModel().rows.length} results
            {enableRowSelection && selectedCount > 0 ? (
              <span className="ml-2 text-emerald-700">
                • {selectedCount} selected
              </span>
            ) : null}
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={loading || !table.getCanPreviousPage()}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={loading || !table.getCanNextPage()}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#f6f8f7]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={
                          "whitespace-nowrap px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-[var(--muted)] " +
                          (canSort ? "cursor-pointer select-none" : "")
                        }
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        <div className="inline-flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {sortDir === "asc" && (
                            <span className="text-[var(--color-primary)]">
                              ▲
                            </span>
                          )}
                          {sortDir === "desc" && (
                            <span className="text-[var(--color-primary)]">
                              ▼
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-4 py-10 text-center text-sm font-semibold text-[var(--muted)]"
                  >
                    {loading ? "Loading..." : "No results."}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-emerald-900/10 hover:bg-emerald-50/40"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[var(--color-secondary)]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-emerald-900/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-semibold text-[var(--muted)]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--muted)]">
              Rows
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]"
            >
              {[8, 10, 20, 30].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
