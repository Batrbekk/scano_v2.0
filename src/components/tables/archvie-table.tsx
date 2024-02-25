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
    Copy, Download,
    Loader2,
    MoreHorizontal,
    PauseCircle,
    Pencil,
    Trash2
} from "lucide-react";
import {TonalityChart} from "@/components/ui/tonality-chart";
import {useRouter} from "@/navigation";

export type archiveData = {
    created: string,
    theme: string,
    period: string,
    format: string,
    author: string,
}

export function ArchiveTable () {
    const t = useTranslations();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const data: archiveData[] = [
        {
            created: '05.07.2023 18:06',
            theme: 'Павлодарская область',
            period: '11.11.2011 - 22.11.2011',
            format: 'DOCX',
            author: 'Aslan Abylkas',
        },
        {
            created: '15.08.2023 09:15',
            theme: 'Алматы',
            period: '01.01.2022 - 31.12.2022',
            format: 'PDF',
            author: 'Elena Ivanova',
        },
        {
            created: '25.09.2023 14:30',
            theme: 'Нур-Султан',
            period: '15.03.2023 - 30.03.2023',
            format: 'XLSX',
            author: 'Sergey Petrov',
        },
        {
            created: '10.10.2023 21:45',
            theme: 'Караганда',
            period: '05.05.2023 - 15.05.2023',
            format: 'PPT',
            author: 'Maria Kuznetsova',
        },
        {
            created: '12.11.2023 11:20',
            theme: 'Астана',
            period: '01.09.2023 - 30.09.2023',
            format: 'DOCX',
            author: 'Alexey Smirnov',
        },
        {
            created: '18.12.2023 16:55',
            theme: 'Алматы',
            period: '01.07.2023 - 31.07.2023',
            format: 'PDF',
            author: 'Anna Kovalenko',
        },
        {
            created: '20.01.2024 08:10',
            theme: 'Шымкент',
            period: '20.02.2024 - 28.02.2024',
            format: 'XLSX',
            author: 'Dmitry Ivanov',
        },
        {
            created: '01.02.2024 19:30',
            theme: 'Актобе',
            period: '10.11.2023 - 20.11.2023',
            format: 'PPT',
            author: 'Olga Petrova',
        },
        {
            created: '10.03.2024 12:15',
            theme: 'Костанай',
            period: '01.12.2023 - 31.12.2023',
            format: 'DOCX',
            author: 'Ivan Sidorov',
        },
        {
            created: '05.04.2024 07:40',
            theme: 'Уральск',
            period: '15.05.2024 - 30.05.2024',
            format: 'PDF',
            author: 'Natalia Smirnova',
        },
    ];

    const columns: ColumnDef<archiveData>[] = [
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
            accessorKey: "created",
            header: t('created'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.created}
                </div>
            )
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
            accessorKey: "format",
            header: t('format'),
            cell: ({row}) => (
                <div className="capitalize">
                    <Badge>
                        {row.original.format}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'initiator',
            header: t('reportCreator'),
            cell: ({row}) => (
                <div className="capitalize">
                    {row.original.author}
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-x-2 cursor-pointer">
                                <Download size={14} />
                                {t('download')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-x-2 cursor-pointer">
                                <Trash2 size={14} />
                                {t('delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
