"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {date} from "zod";
import {format} from "date-fns";
import {CalendarIcon, Info} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {ru} from "date-fns/locale";
import {DateRange} from "react-day-picker";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {HistoryTable} from "@/components/tables/history-table";
import {ThemeData} from "@/types";

export default function Page () {
    const t = useTranslations();

    const [startDate, setStartDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const [startHour, setStartHour] = React.useState('00');
    const [startMin, setStartMin] = React.useState('00');
    const [endHour, setEndHour] = React.useState('00');
    const [endMin, setEndMin] = React.useState('00');

    const [themes, setThemes] = useState<ThemeData[]>([]);

    useEffect(() => {
        const themes = localStorage.getItem('themeList');
        if (themes) {
            setThemes(JSON.parse(themes));
        }
    }, []);

    return (
        <main className="py-8">
            <Tabs defaultValue="archive">
                <TabsList className="flex items-center gap-x-4 max-w-md justify-between">
                    <TabsTrigger value="archive" className="w-1/2">
                        <h4 className="scroll-m-20 text-xl font-medium tracking-tight">
                            {t('archiveCollection')}
                        </h4>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="w-1/2">
                        <h4 className="scroll-m-20 text-xl font-medium tracking-tight">
                            {t('feeStore')}
                        </h4>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="archive" className="mt-8">
                    <div className="flex items-stretch gap-x-8 w-full">
                        <div className="p-4 rounded border w-2/3 flex flex-col gap-y-8">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="picture">{t('theme')}</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('chooseTheme')} className="uppercase"/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {themes.map((item) => (
                                                    <SelectItem value={item._id} key={item._id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </SelectTrigger>
                                </Select>
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
                                                        {format(startDate.from, "dd-MM-yyyy")}{" "}{`${startHour}:${startMin}`} ~{" "}
                                                        {format(startDate.to, "dd-MM-yyyy")}{" "}{`${endHour}:${endMin}`}
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
                                        <div className="flex items-center p-2">
                                            <div className="flex gap-2 items-center">
                                                <Select defaultValue={startHour} onValueChange={setStartHour}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="00"/>
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="00">00</SelectItem>
                                                        <SelectItem value="01">01</SelectItem>
                                                        <SelectItem value="02">02</SelectItem>
                                                        <SelectItem value="03">03</SelectItem>
                                                        <SelectItem value="04">04</SelectItem>
                                                        <SelectItem value="05">05</SelectItem>
                                                        <SelectItem value="06">06</SelectItem>
                                                        <SelectItem value="07">07</SelectItem>
                                                        <SelectItem value="08">08</SelectItem>
                                                        <SelectItem value="09">09</SelectItem>
                                                        <SelectItem value="10">10</SelectItem>
                                                        <SelectItem value="11">11</SelectItem>
                                                        <SelectItem value="12">12</SelectItem>
                                                        <SelectItem value="13">13</SelectItem>
                                                        <SelectItem value="14">14</SelectItem>
                                                        <SelectItem value="15">15</SelectItem>
                                                        <SelectItem value="16">16</SelectItem>
                                                        <SelectItem value="17">17</SelectItem>
                                                        <SelectItem value="18">18</SelectItem>
                                                        <SelectItem value="19">19</SelectItem>
                                                        <SelectItem value="20">20</SelectItem>
                                                        <SelectItem value="21">21</SelectItem>
                                                        <SelectItem value="22">22</SelectItem>
                                                        <SelectItem value="23">23</SelectItem>
                                                        <SelectItem value="24">24</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select defaultValue={startMin} onValueChange={setStartMin}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="00"/>
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="00">00</SelectItem>
                                                        <SelectItem value="05">05</SelectItem>
                                                        <SelectItem value="10">10</SelectItem>
                                                        <SelectItem value="15">15</SelectItem>
                                                        <SelectItem value="20">20</SelectItem>
                                                        <SelectItem value="25">25</SelectItem>
                                                        <SelectItem value="30">30</SelectItem>
                                                        <SelectItem value="35">35</SelectItem>
                                                        <SelectItem value="40">40</SelectItem>
                                                        <SelectItem value="45">45</SelectItem>
                                                        <SelectItem value="50">50</SelectItem>
                                                        <SelectItem value="55">55</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <p className="mx-4">-</p>
                                            <div className="flex gap-2 items-center">
                                                <Select defaultValue={endHour} onValueChange={setEndHour}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="00"/>
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="00">00</SelectItem>
                                                        <SelectItem value="01">01</SelectItem>
                                                        <SelectItem value="02">02</SelectItem>
                                                        <SelectItem value="03">03</SelectItem>
                                                        <SelectItem value="04">04</SelectItem>
                                                        <SelectItem value="05">05</SelectItem>
                                                        <SelectItem value="06">06</SelectItem>
                                                        <SelectItem value="07">07</SelectItem>
                                                        <SelectItem value="08">08</SelectItem>
                                                        <SelectItem value="09">09</SelectItem>
                                                        <SelectItem value="10">10</SelectItem>
                                                        <SelectItem value="11">11</SelectItem>
                                                        <SelectItem value="12">12</SelectItem>
                                                        <SelectItem value="13">13</SelectItem>
                                                        <SelectItem value="14">14</SelectItem>
                                                        <SelectItem value="15">15</SelectItem>
                                                        <SelectItem value="16">16</SelectItem>
                                                        <SelectItem value="17">17</SelectItem>
                                                        <SelectItem value="18">18</SelectItem>
                                                        <SelectItem value="19">19</SelectItem>
                                                        <SelectItem value="20">20</SelectItem>
                                                        <SelectItem value="21">21</SelectItem>
                                                        <SelectItem value="22">22</SelectItem>
                                                        <SelectItem value="23">23</SelectItem>
                                                        <SelectItem value="24">24</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select defaultValue={endMin} onValueChange={setEndMin}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="00"/>
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="00">00</SelectItem>
                                                        <SelectItem value="05">05</SelectItem>
                                                        <SelectItem value="10">10</SelectItem>
                                                        <SelectItem value="15">15</SelectItem>
                                                        <SelectItem value="20">20</SelectItem>
                                                        <SelectItem value="25">25</SelectItem>
                                                        <SelectItem value="30">30</SelectItem>
                                                        <SelectItem value="35">35</SelectItem>
                                                        <SelectItem value="40">40</SelectItem>
                                                        <SelectItem value="45">45</SelectItem>
                                                        <SelectItem value="50">50</SelectItem>
                                                        <SelectItem value="55">55</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
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
                            <Button className="w-fit">{t('estimateData')}</Button>
                        </div>
                        <div className="p-4 rounded border w-1/3">
                            <div className="flex items-start gap-x-4">
                                <Info size={32} />
                                <div className="flex flex-col gap-y-4">
                                    <code className="relative rounded bg-muted p-2 w-full font-mono font-semibold">
                                        {t('archiveSMI')}
                                    </code>
                                    <code className="relative rounded bg-muted p-2 w-full font-mono font-semibold">
                                        {t('usedInMonth')}:
                                        <ul className="ml-6 list-disc [&>li]:mt-2">
                                            <li>{t('fees', {fee: '3/5'})}</li>
                                            <li>{t('messageLimit', {message: '1791/50 000'})}</li>
                                        </ul>
                                    </code>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={400}>
                                            <TooltipTrigger asChild>
                                                <Button variant="link" className="flex justify-start w-fit underline">
                                                    {t('aboutLimit')}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                <p>Что то о лимитах...</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="history" className="mt-8">
                    <HistoryTable />
                </TabsContent>
            </Tabs>
        </main>
    )
}
