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
import {UserData} from "@/types";
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

const UsersTable: React.FC<Props> = ({id}) => {
  const router = useRouter();
  const t = useTranslations();
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(true);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState<UserData[]>([]);

  const columns: ColumnDef<UserData>[] = [
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
      accessorKey: "photo_url",
      header: t('photo_url'),
      cell: ({row}) => (
        <div className="capitalize cursor-pointer">
          <AvatarFetch img_name={row.original.photo_url} />
        </div>
      )
    },
    {
      accessorKey: "name",
      header: t('userName'),
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.original.first_name ? row.original.first_name : t('nothing')} {row.original.last_name}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: 'E-mail',
      cell: ({row}) => (
        <div className="capitalize">
          <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
        </div>
      )
    },
    {
      accessorKey: "company_name",
      header: t('company'),
      cell: ({row}) => (
        <div className="capitalize">
          <p>{row.original.company_name ? row.original.company_name : t('nothing')}</p>
        </div>
      )
    },
    {
      accessorKey: "role",
      header: t('role'),
      cell: ({row}) => (
        <div className="capitalize">
          <p>{t(row.original.role)}</p>
        </div>
      )
    },
    {
      id: "actions",
      header: t('action'),
      enableHiding: false,
      cell: ({row}) => {
        const user = row.original

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
                onClick={() => navigator.clipboard.writeText(user._id)}
              >
                <Copy size={14} />
                {t('copy')} ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => {
                  setCookie('editUserData', user);
                  router.push(`/${id}/edit/editUser`);
                }}
              >
                <Pencil size={14} />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => deleteUser(user._id)}
              >
                <Trash2 size={14} />
                {t('delete')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => isActiveUser(user._id, user.is_active)}
              >
                {user.is_active ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                {user.is_active ? t('stop') : t('resume')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  async function getUsersData() {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/`, {
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

  async function deleteUser(id: string) {
    setPending(true);
    setData([]);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      getUsersData();
    } else {
      setPending(false);
      console.error('delete themes ERROR');
    }
  }

  async function isActiveUser(id: string, status: boolean) {
    setPending(true);
    setData([]);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        is_active: !status
      }),
    });
    if (res.ok) {
      getUsersData();
    } else {
      setPending(false);
      console.error('ban user ERROR');
    }
  }

  useEffect(() => {
    getUsersData();
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
          <Button>
            {t('createUser')}
          </Button>
          <Input
            placeholder={t('searchByEmail')}
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
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

export {UsersTable}
