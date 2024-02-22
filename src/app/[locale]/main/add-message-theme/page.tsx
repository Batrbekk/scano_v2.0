"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon, Info} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {ru} from "date-fns/locale";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {Progress} from "@/components/ui/progress";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {ThemeData} from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

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

const breaks = [
    {
        value: 'breakpoint',
        label: 'Точка с запятой'
    },
    {
        value: 'comma',
        label: 'Запятая'
    }
];

const timezone = [
    {
        value: 'UTC+6',
        label: '(UTC+6) Казахстан, Алматы'
    },
    {
        value: 'UTC+0',
        label: '(UTC+0) Гринвич, Лондон'
    },
    {
        value: 'UTC+1',
        label: '(UTC+1) Берлин, Париж'
    },
    {
        value: 'UTC+2',
        label: '(UTC+2) Каир, Афины'
    },
    {
        value: 'UTC+3',
        label: '(UTC+3) Москва, Киев'
    }
];

export default function Page () {
    const t = useTranslations();

    const [date, setDate] = React.useState<Date>();
    const [themes, setThemes] = useState<ThemeData[]>([]);

    useEffect(() => {
       const themes = localStorage.getItem('themeList');
       if (themes) {
           setThemes(JSON.parse(themes));
       }
    }, []);

    return (
        <div className="py-4 flex flex-col gap-y-4">
            <div className="flex items-center gap-x-8">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {t('addMessageTopic')}
                </h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Progress className="h-3 w-36" value={33} />
                        </TooltipTrigger>
                        <TooltipContent>
                            {t('progressTooltip', {balance: 33, limit: 100})}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Tabs defaultValue="archive" className="mb-20">
                <TabsList className="flex items-center gap-x-4 max-w-md justify-between">
                    <TabsTrigger value="archive" className="w-1/2">
                        <h4 className="text-lg font-semibold">
                            {t('addMessageOne')}
                        </h4>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="w-1/2">
                        <h4 className="text-lg font-semibold">
                            {t('addMessageFile')}
                        </h4>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="archive" className="mt-8">
                    <div className="flex items-start gap-x-8 w-full">
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
                                <Label htmlFor="picture">{t('link')}</Label>
                                <Input placeholder={t('linkPlaceholder')}/>
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label htmlFor="picture">{t('typeMessage')}</Label>
                                <RadioGroup defaultValue="social" className="flex items-center gap-x-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="social" id="r1"/>
                                        <Label htmlFor="r1">{t('socialMedia')}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="smi" id="r2"/>
                                        <Label htmlFor="r2">{t('onlineSMI')}</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="picture">{t('header')}</Label>
                                <Input placeholder={t('header')}/>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="picture">{t('text')}</Label>
                                <Textarea placeholder={t('text')} className="resize-none"/>
                            </div>
                            <div className="flex items-center gap-x-4">
                                <div className="w-1/2 grid items-center gap-1.5">
                                    <Label htmlFor="picture">{t('authorName')}</Label>
                                    <Input placeholder={t('authorName')}/>
                                </div>
                                <div className="w-1/2 grid items-center gap-1.5">
                                    <Label htmlFor="picture">{t('linkProfileAuthor')}</Label>
                                    <Input placeholder={t('linkProfileAuthor')}/>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-4">
                                <div className="flex items-center gap-x-4 w-1/2">
                                    <div className="w-1/2 grid items-center gap-1.5">
                                        <Label htmlFor="picture">{t('datePublish')}</Label>
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
                                                    {date ? (
                                                      <>
                                                          {format(date, "dd-MM-yyyy")}
                                                      </>
                                                    ) : (
                                                      <>
                                                          <span
                                                            className="text-muted-foreground">{t('chooseDate')}</span>
                                                          <CalendarIcon className="h-4 w-4"/>
                                                      </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  locale={ru}
                                                  initialFocus
                                                  mode="single"
                                                  selected={date}
                                                  onSelect={setDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="w-1/2 grid items-center gap-1.5">
                                        <Label htmlFor="picture">{t('time')}</Label>
                                        <Input placeholder={t('time')}/>
                                    </div>
                                </div>
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
                            </div>
                            <Button className="w-fit">{t('save')}</Button>
                        </div>
                        <div className="p-4 rounded border w-1/3">
                            <div className="flex items-start gap-x-4">
                                <Info size={32}/>
                                <div className="flex flex-col gap-y-4 w-[90%]">
                                    <code className="relative rounded bg-muted p-2 w-full font-mono font-semibold">
                                        {t('addMessageInfo1')}
                                    </code>
                                    <code className="relative rounded bg-muted p-2 w-full font-mono font-semibold">
                                        {t('addMessageInfo2')}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="history" className="mt-8">
                    <div className="flex items-start gap-x-8 w-full">
                        <div className="p-4 rounded border w-2/3 flex flex-col gap-y-8">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="picture">{t('fileMessage')}</Label>
                                <Input id="picture" type="file" className="cursor-pointer"/>
                                <small className="text-sm text-muted-foreground font-medium leading-none ml-2">
                                    {t('formatUpdateMessage')}
                                </small>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label>{t('theme')}</Label>
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
                                <Label>{t('breakColumn')}</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('chooseBreakColumn')} className="uppercase"/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {breaks.map((item) => (
                                                    <SelectItem value={item.value}
                                                                key={item.value}>{item.label}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </SelectTrigger>
                                </Select>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label>{t('timezone')}</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('chooseTimezone')} className="uppercase"/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {timezone.map((item) => (
                                                    <SelectItem value={item.value}
                                                                key={item.value}>{item.label}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </SelectTrigger>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms"/>
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t('acceptMiss')}
                                </label>
                            </div>
                            <Button className="w-fit">{t('send')}</Button>
                        </div>
                        <div className="p-4 rounded border w-1/3">
                            <div className="flex items-start gap-x-4">
                                <Info size={32}/>
                                <div className="flex flex-col gap-y-4 w-[90%]">
                                    <code className="relative rounded bg-muted p-2 w-full font-mono font-semibold">
                                        {t('addMessageInfo3')}
                                    </code>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={400}>
                                            <TooltipTrigger asChild>
                                                <Button variant="link" className="flex justify-start w-fit underline">
                                                    {t('addMessageInfo4')}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                <p>Что то о параметрах...</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
