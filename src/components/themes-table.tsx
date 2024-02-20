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

export function ThemesTable() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(true);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState<ThemeData[]>([]);

  const columns: ColumnDef<ThemeData>[] = [
    {
      accessorKey: "_id",
      header: "#",
      cell: ({ row }) => (
        <div className="capitalize flex items-center gap-x-2">
          <p>{row.index + 1}</p>
        </div>
      ),
    },
    {
      accessorKey: "theme_type",
      header: t('themeType'),
      cell: ({row}) => (
        <div className="capitalize cursor-pointer">
          <Badge>{t(`${row.getValue('theme_type')}`)}</Badge>
        </div>
      )
    },
    {
      accessorKey: "name",
      header: ({column}) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('themeName')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-4">
            <Button className="p-0" variant="link" onClick={() => {
              setCookie('themeName', row.original.name);
              router.push(`/${row.original._id}`);
            }}>
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight capitalize cursor-pointer">
                {row.getValue("name")}
              </h4>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Progress value={row.original.materials_count} className="h-3 w-20" />
                </TooltipTrigger>
                <TooltipContent>
                  {t('progressThemeTooltip', {balance: row.original.materials_count, limit: row.original.materials_count_max})}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-x-4">
            <p className="leading-7">
              {t('collectionDate', {data: format(new Date(row.original.created_at), 'dd/MM/yyyy')})}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "today",
      header: t('themeToday'),
      cell: ({row}) => (
        <div className="flex flex-col gap-y-2">
          <h4 className="text-lg">{row.original.today.total}</h4>
          <TonalityChart positive={row.original.today.positive} negative={row.original.today.negative} neutral={row.original.today.neutral} />
        </div>
      )
    },
    {
      accessorKey: "week",
      header: t('themeWeek'),
      cell: ({row}) => (
        <div className="flex flex-col gap-y-2">
          <h4 className="text-lg">{row.original.week.total}</h4>
          <TonalityChart positive={row.original.week.positive} negative={row.original.week.negative} neutral={row.original.week.neutral} />
        </div>
      )
    },
    {
      accessorKey: "all",
      header: t('all'),
      cell: ({row}) => (
        <div className="flex flex-col gap-y-2">
          <h4 className="text-lg">{row.original.total.total}</h4>
          <TonalityChart positive={row.original.total.positive} negative={row.original.total.negative} neutral={row.original.total.neutral} />
        </div>
      )
    },
    {
      id: "actions",
      header: t('action'),
      enableHiding: false,
      cell: ({row}) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(payment._id)}
              >
                <Copy size={14} />
                {t('copy')} ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-x-2 cursor-pointer">
                <Pencil size={14} />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-x-2 cursor-pointer">
                <Trash2 size={14} />
                {t('delete')}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-x-2 cursor-pointer">
                <PauseCircle size={14} />
                {t('stop')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  async function getThemesData() {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      setData(data);
      localStorage.setItem('themeList', JSON.stringify(data));
      setPending(false);
    } else {
      setPending(false);
      console.error('Get themes data ERROR');
    }
  }

  useEffect(() => {
    getThemesData();
  }, []);

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
            placeholder={t('searchTheme')}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
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
                  {pending ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-8 w-8 animate-spin"/>
                    </div>
                    ): (
                      <p className="scroll-m-20 text-xl tracking-tight">Данных нету...</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
