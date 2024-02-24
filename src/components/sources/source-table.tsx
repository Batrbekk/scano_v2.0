"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {ThemeData} from "@/types";
import {useEffect, useState} from "react";
import {env} from "@/env.mjs";
import {getCookie, setCookie} from "cookies-next";
import {useLocale, useTranslations} from "use-intl";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {Progress} from "@/components/ui/progress";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {
  ArrowUpDown,
  ChevronDown,
  Copy,
  Loader2,
  MoreHorizontal,
  PauseCircle,
  Pencil,
  Trash2
} from "lucide-react";
import {TonalityChart} from "@/components/ui/tonality-chart";
import {useRouter} from "@/navigation";

export type SourceData = {
  id: number,
  source: string,
  message: string,
  percentage: string,
  positive: string,
  neutral: string,
  negative: string
}

export function SourceTable () {
  const t = useTranslations();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data: SourceData[] = [
    {
      id: 1,
      source: 'vk.ru',
      message: '78',
      percentage: '1,89%',
      positive: '21',
      neutral: '51',
      negative: '6'
    },
    {
      id: 2,
      source: 'Instagram',
      message: '78',
      percentage: '1,89%',
      positive: '21',
      neutral: '51',
      negative: '6'
    },
    {
      id: 3,
      source: 'Facebook',
      message: '78',
      percentage: '1,89%',
      positive: '21',
      neutral: '51',
      negative: '6'
    },
    {
      id: 4,
      source: 'Linkedin',
      message: '78',
      percentage: '1,89%',
      positive: '21',
      neutral: '51',
      negative: '6'
    },
    {
      id: 5,
      source: 'Twitter',
      message: '78',
      percentage: '1,89%',
      positive: '21',
      neutral: '51',
      negative: '6'
    }
  ];

  const columns: ColumnDef<SourceData>[] = [
    {
      accessorKey: "_id",
      header: "#",
      cell: ({ row }) => (
        <div className="capitalize flex items-center gap-x-2">
          <p>{row.original.id}</p>
        </div>
      ),
    },
    {
      accessorKey: "source",
      header: t('sources'),
      cell: ({row}) => (
        <div className="capitalize">
          {row.original.source}
        </div>
      )
    },
    {
      accessorKey: "message",
      header: t('message'),
      cell: ({row}) => (
        <div className="capitalize">
          {row.original.message}
        </div>
      )
    },
    {
      accessorKey: "percentage",
      header: "%",
      cell: ({row}) => (
        <div className="capitalize">
          {row.original.percentage}
        </div>
      )
    },
    {
      accessorKey: 'positive',
      header: t('positiveNotation'),
      cell: ({row}) => (
        <div className="capitalize text-primeGreen">
          {row.original.positive}
        </div>
      )
    },
    {
      accessorKey: 'negative',
      header: t('negativeNotation'),
      cell: ({row}) => (
        <div className="capitalize text-red-500">
          {row.original.negative}
        </div>
      )
    },
    {
      accessorKey: 'neutral',
      header: t('neutralNotation'),
      cell: ({row}) => (
        <div className="capitalize text-blue-500">
          {row.original.neutral}
        </div>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: { pageSize: 5 }
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 w-full">
        <div className="flex items-center gap-x-4 w-1/2">
          <Input
            placeholder={t('searchBySource')}
            value={(table.getColumn("source")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("source")?.setFilterValue(event.target.value)
            }
            className="w-full max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t('show')} <ChevronDown className="ml-2 h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="normal-case"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {t(`${column.id}`)}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-end space-x-4 py-4">
          <p className="text-sm text-muted-foreground">
            {t('paginationCount', {
              currentPage: table.getState().pagination.pageIndex + 1,
              totalPage: table.getPageCount()
            })}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('back')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')}
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <p className="scroll-m-20 text-xl tracking-tight">{t('noData')}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
