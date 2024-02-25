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

export type HistoryData = {
    id: number,
    theme: string,
    period: string,
    message: string,
    author: string,
    date: string,
    status: string
}

export function HistoryTable () {
    const t = useTranslations();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const data: HistoryData[] = [
        {
            id: 1,
            theme: 'Павлодарская область',
            period: '11.11.2011 - 22.11.2011',
            message: '301',
            author: 'Aslan Abylkas',
            date: '1.11.2011',
            status: 'Завершен'
        },
        {
            id: 2,
            theme: 'Алматы',
            period: '15.09.2022 - 25.09.2022',
            message: '245 (25%)',
            author: 'Иван Петров',
            date: '5.09.2022',
            status: 'В процессе'
        },
        {
            id: 3,
            theme: 'Астана',
            period: '10.10.2022 - 20.10.2022',
            message: '178',
            author: 'Елена Сидорова',
            date: '25.09.2022',
            status: 'Завершен'
        },
        {
            id: 4,
            theme: 'Караганда',
            period: '03.12.2022 - 15.12.2022',
            message: '412',
            author: 'Сергей Иванов',
            date: '1.12.2022',
            status: 'Завершен'
        },
        {
            id: 5,
            theme: 'Шымкент',
            period: '05.05.2023 - 15.05.2023',
            message: '567 (93%)',
            author: 'Александра Ким',
            date: '1.05.2023',
            status: 'В процессе'
        },
        {
            id: 6,
            theme: 'Актобе',
            period: '20.07.2023 - 30.07.2023',
            message: '123 (32%)',
            author: 'Алексей Попов',
            date: '10.07.2023',
            status: 'В процессе'
        },
        {
            id: 7,
            theme: 'Тараз',
            period: '15.08.2023 - 25.08.2023',
            message: '289',
            author: 'Мария Смирнова',
            date: '10.08.2023',
            status: 'Завершен'
        },
        {
            id: 8,
            theme: 'Костанай',
            period: '01.09.2023 - 10.09.2023',
            message: '376 (42%)',
            author: 'Андрей Козлов',
            date: '20.08.2023',
            status: 'В процессе'
        }
    ];

    const columns: ColumnDef<HistoryData>[] = [
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
            accessorKey: "theme",
            header: t('theme'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.theme}
                </div>
            )
        },
        {
            accessorKey: "period",
            header: t('period'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.period}
                </div>
            )
        },
        {
            accessorKey: "uploadMessage",
            header: t('uploadMessage'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.message}
                </div>
            )
        },
        {
            accessorKey: 'initiator',
            header: t('collectionInitiator'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.author}
                </div>
            )
        },
        {
            accessorKey: 'startDate',
            header: t('startDate'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.date}
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: t('status'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.status}
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
                                    <p className="scroll-m-20 text-xl tracking-tight">Данных нету...</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
