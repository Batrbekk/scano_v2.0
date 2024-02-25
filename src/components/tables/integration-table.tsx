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

export type integrationData = {
  id: number,
  acc: string,
  accType: string,
}

interface Props {
  id: string
}

const IntegrationTable: React.FC<Props> = ({id}) => {
  const t = useTranslations();
  const router = useRouter();


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data: integrationData[] = [
    {
      id: 1,
      acc: 'Aslan Abylkas (abilkasaru)',
      accType: 'Пользователь',
    },
    {
      id: 2,
      acc: 'Dosik SK (mukhametkairov)',
      accType: 'Пользователь',
    },
    {
      id: 3,
      acc: 'Мониторинг - QazaqGaz',
      accType: 'Группа',
    },
    {
      id: 4,
      acc: 'Мониторинг - Turkentan',
      accType: 'Группа',
    },
    {
      id: 5,
      acc: 'Мониторинг - БРК',
      accType: 'Группа',
    },
  ];

  const columns: ColumnDef<integrationData>[] = [
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
      accessorKey: "acc",
      header: t('acc'),
      cell: ({row}) => (
        <div className="capitalize">
          {row.original.acc}
        </div>
      )
    },
    {
      accessorKey: "accType",
      header: t('accType'),
      cell: ({row}) => (
        <div className="capitalize">
          {row.original.accType}
        </div>
      )
    },
    {
      id: "actions",
      header: t('action'),
      enableHiding: false,
      cell: ({row}) => {

        return (
          <Button variant="outline" className="flex items-center gap-x-2">
            <Trash2 size={14} />
            {t('delete')}
          </Button>
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
          <Input
            placeholder={t('searchByAcc')}
            value={(table.getColumn("acc")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("acc")?.setFilterValue(event.target.value)
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

export {IntegrationTable}
