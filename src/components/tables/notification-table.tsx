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
import {NotificationData, UserData} from "@/types";
import {useEffect, useState} from "react";
import {env} from "@/env.mjs";
import {getCookie, setCookie} from "cookies-next";
import {useTranslations} from "use-intl";
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
  Pencil, PlayCircle,
  Trash2
} from "lucide-react";
import {TonalityChart} from "@/components/ui/tonality-chart";
import {useRouter} from "@/navigation";
import {AvatarFetch} from "@/components/ui/avatar-fetch";

interface Props {
  id: string
}

const NotificationTable: React.FC<Props> = ({id}) => {
  const router = useRouter();
  const t = useTranslations();
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(true);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState<NotificationData[]>([]);

  const columns: ColumnDef<NotificationData>[] = [
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
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.original.theme.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: t('created'),
      cell: ({row}) => (
        <div className="capitalize">
          {format(new Date(row.original.created_at), 'dd/MM/yyyy')}
        </div>
      )
    },
    {
      accessorKey: "email_list",
      header: 'E-mail',
      cell: ({row}) => (
        <div className="capitalize">
          <ul className="list-disc [&>li]:mt-2">
            {row.original.email_list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )
    },
    {
      accessorKey: "telegram_channel_ids",
      header: 'Telegram',
      cell: ({row}) => (
        <div className="capitalize">
          <ul className="list-disc [&>li]:mt-2">
            {row.original.telegram_channel_ids.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "actions",
      header: t('action'),
      enableHiding: false,
      cell: ({row}) => {
        const notif = row.original

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
                onClick={() => navigator.clipboard.writeText(notif._id)}
              >
                <Copy size={14} />
                {t('copy')} ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => {
                  setCookie('editNotifData', notif);
                  router.push(`/${id}/edit/editNotif`);
                }}
              >
                <Pencil size={14} />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => deleteNotif(notif._id)}
              >
                <Trash2 size={14} />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  async function getNotificationData() {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/notification_plans/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      setData(data);
      setPending(false);
    } else {
      setPending(false);
      console.error('Get themes data ERROR');
    }
  }

  async function deleteNotif(id: string) {
    setPending(true);
    setData([]);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/notification_plans/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      getNotificationData();
    } else {
      setPending(false);
      console.error('delete notif ERROR');
    }
  }

  useEffect(() => {
    getNotificationData();
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
          <Button onClick={() => {
            router.push(`/${id}/create/createNotification`);
          }}>
            {t('createNotification')}
          </Button>
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
                  {pending ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-8 w-8 animate-spin"/>
                    </div>
                  ): (
                    <p className="scroll-m-20 text-xl tracking-tight">{t('noData')}</p>
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

export {NotificationTable}
