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
import {useTranslations} from "use-intl";
import {
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2
} from "lucide-react";
import {useRouter} from "@/navigation";

export type ruleData = {
  id: number,
  theme: string,
  dataComposition: React.ReactNode,
  action: string,
}

interface Props {
  id: string
}

const RulesTable: React.FC<Props> = ({id}) => {
  const t = useTranslations();
  const router = useRouter();


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data: ruleData[] = [
    {
      id: 1,
      theme: 'АО НАК Казатомпром',
      dataComposition: (
        <p className="prose prose-sm text-[#979ca9]">Фильтр » поисковой запрос: <span className="text-[#4c515c]">умз</span></p>
      ),
      action: 'Үлбі металлургия зауыты'
    }
  ];

  const columns: ColumnDef<ruleData>[] = [
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
      accessorKey: "theme",
      header: t('theme'),
      cell: ({row}) => (
        <div className="capitalize">
          {row.original.theme}
        </div>
      )
    },
    {
      accessorKey: "dataComposition",
      header: t('dataComposition'),
      cell: ({row}) => (
        <div className="capitalize">
          {row.original.dataComposition}
        </div>
      )
    },
    {
      id: "actions",
      header: t('action'),
      enableHiding: false,
      cell: ({row}) => {

        return (
          <div className="flex items-center gap-x-4">
            {row.original.action}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-x-2 cursor-pointer">
                  <Pencil size={14} />
                  {t('edit')}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-x-2 cursor-pointer">
                  <Trash2 size={14} />
                  {t('delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
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
      <div className="flex items-center justify-between pb-4 w-full">
        <div className="flex items-center gap-x-4 w-1/2">
          <Button onClick={() => {router.push(`/${id}/create/createRule`)}}>{t('createRule')}</Button>
          <Input
            placeholder={t('searchByTheme')}
            value={(table.getColumn("theme")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("theme")?.setFilterValue(event.target.value)
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

export {RulesTable}
