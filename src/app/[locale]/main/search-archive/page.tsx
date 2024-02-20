"use client"

import React from "react";
import {useTranslations} from "use-intl";
import {CalendarIcon, Info} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {date} from "zod";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {ru} from "date-fns/locale";
import {DateRange} from "react-day-picker";

const countries = [
    {
        name: 'Россия',
        value: 'ru'
    },
    {
        name: 'США',
        value: 'us'
    },
    {
        name: 'Китай',
        value: 'cn'
    },
    {
        name: 'Япония',
        value: 'jp'
    },
    {
        name: 'Германия',
        value: 'de'
    },
    {
        name: 'Франция',
        value: 'fr'
    },
    {
        name: 'Великобритания',
        value: 'gb'
    },
    {
        name: 'Индия',
        value: 'in'
    },
    {
        name: 'Канада',
        value: 'ca'
    },
    {
        name: 'Бразилия',
        value: 'br'
    }
];
const langs = [
    {
        value: 'ru',
        label: 'Русский'
    },
    {
        value: 'kk',
        label: 'Казахский'
    },
    {
        value: 'en',
        label: 'Английский'
    }
];

export default function Page () {
    const t = useTranslations();

    const [startDate, setStartDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    return (
        <div className="py-4 flex flex-col gap-y-8">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {t('searchByYear')}
            </h3>
            <div className="flex items-start gap-x-8 w-full">
                <div className="p-4 rounded border w-2/3 flex flex-col gap-y-8">
                    <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label>{t('searchRequest')}</Label>
                            <Label>{t('searchLimit', {limit: 50})}</Label>
                        </div>
                        <Textarea placeholder={t('searchRequest')} className="resize-none"/>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label>{t('minusWord')}</Label>
                            <Label>{t('searchLimit', {limit: 100})}</Label>
                        </div>
                        <Textarea placeholder={t('minusWord')} className="resize-none"/>
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <div className="flex items-center justify-between">
                            <Label>{t('searchArea')}</Label>
                        </div>
                        <div className="flex items-center gap-x-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms"/>
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t('socialMedia')}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms"/>
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t('onlineSMI')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className="w-1/2 grid items-center gap-1.5">
                            <Label htmlFor="picture">{t('country')}</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('chooseCountry')} className="uppercase"/>
                                    <SelectContent>
                                        <SelectGroup>
                                            {countries.map((item) => (
                                                <SelectItem value={item.value}
                                                            key={item.value}>{item.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </SelectTrigger>
                            </Select>
                        </div>
                        <div className="w-1/2 grid items-center gap-1.5">
                            <Label htmlFor="picture">{t('langs')}</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('filterLangPlaceholder')} className="uppercase"/>
                                    <SelectContent>
                                        <SelectGroup>
                                            {langs.map((item) => (
                                                <SelectItem value={item.value}
                                                            key={item.value}>{item.label}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </SelectTrigger>
                            </Select>
                        </div>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="picture">{t('period')}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "justify-between text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {startDate?.from ? (
                                        startDate.to ? (
                                            <>
                                                {format(startDate.from, "dd-MM-yyyy")}{" "}~{" "}{format(startDate.to, "dd-MM-yyyy")}{" "}
                                            </>
                                        ) : (
                                            format(startDate.from, "dd-MM-yyyy")
                                        )
                                    ) : (
                                        <>
                                            <span className="text-muted-foreground">{t('chooseDate')}</span>
                                            <CalendarIcon className="h-4 w-4"/>
                                        </>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    locale={ru}
                                    initialFocus
                                    mode="range"
                                    defaultMonth={startDate?.from}
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button className="w-fit">{t('search')}</Button>
                </div>
                <div className="p-4 rounded border w-1/3">
                    <div className="flex items-start gap-x-4">
                        <Info size={32}/>
                        <div className="flex flex-col gap-y-4 w-[90%]">
                            <code className="relative rounded bg-muted p-2 w-full font-mono font-semibold">
                                {t('searchByYearInfo')}
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}