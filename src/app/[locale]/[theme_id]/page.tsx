"use client"

import {date} from "zod";
import Image from "next/image";
import { cn } from "@/lib/utils"
import { ru } from 'date-fns/locale';
import {getCookie} from "cookies-next";
import {useTranslations} from "use-intl";
import {useParams} from "next/navigation";
import {DateRange} from "react-day-picker";
import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@radix-ui/react-select";
import React, {useEffect, useState} from 'react';
import { Calendar } from "@/components/ui/calendar";
import {CalendarIcon, Download, Filter, FilterX, X} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Excel from "@/public/icons/excel.svg";
import Word from "@/public/icons/word.svg";
import Pdf from "@/public/icons/pdf.svg";
import {format} from "date-fns";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Checkbox} from "@/components/ui/checkbox";
import {env} from "@/env.mjs";
import {useToast} from "@/components/ui/use-toast";
import {MaterialsList} from "@/components/materials-list";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function Main() {
  const { toast } = useToast();
  const t = useTranslations();
  const params = useParams();
  const themeName = getCookie('themeName');
  const token = getCookie('scano_acess_token');

  const [themeId, setThemeId] = useState<string>('');
  const [searchByMaterial, setSearchByMaterial] = useState<string>('');
  const [startDate, setStartDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [startHour, setStartHour] = React.useState('00');
  const [startMin, setStartMin] = React.useState('00');
  const [endHour, setEndHour] = React.useState('00');
  const [endMin, setEndMin] = React.useState('00');

  const [isExport, setIsExport] = useState<boolean>(false);
  const [exportToast, setExportToast] = useState<string>(t('exportToastPending'));

  const toneOption = [
    {
      key: 'positive',
      label: t('positiveNotation'),
    },
    {
      key: 'negative',
      label: t('negativeNotation'),
    },
    {
      key: 'neutral',
      label: t('neutralNotation'),
    }
  ];
  const materialType = [
    {
      label: t('post'),
      key: 'post'
    },
    {
      label: t('repost'),
      key: 'repost'
    },
    {
      label: t('comments'),
      key: 'comment'
    },
    {
      label: t('stories'),
      key: 'stories'
    }
  ];
  const lang = [
    {
      label: 'Қазақша',
      key: 'kk'
    },
    {
      label: 'Русский',
      key: 'ru'
    },
    {
      label: 'English',
      key: 'en'
    }
  ];
  const collection = [
    {
      label: t('social'),
      key: 'social_network'
    },
    {
      label: t('video'),
      key: 'video'
    },
    {
      label: t('messengerChanel'),
      key: 'messenger_chanel'
    },
    {
      label: t('messengerGroup'),
      key: 'messenger_group'
    },
    {
      label: t('news'),
      key: 'news'
    }
  ];

  const getExportExcel = async () => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${themeId}/download_excel_report`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'arraybuffer',
            'Authorization': `Bearer ${token}`
          },
        }
      ).then(res => res.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "report.xlsx";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setThemeId(params.theme_id.toString());
  }, [params]);

  return (
    <ScrollArea className="h-screen">
      <div className="p-4 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-4 w-full">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight border-r pr-4">
              {t('thems')}: {themeName ? themeName : ''}
            </h4>
            <Input
              value={searchByMaterial}
              onChange={(event) => {
                setSearchByMaterial(event.target.value);
              }}
              placeholder={t('searchByMaterial')}
              className="max-w-xs"
            />
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-between text-left font-normal",
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
            <Button>
              {t('search')}
            </Button>
          </div>
          <Popover open={isExport} onOpenChange={setIsExport}>
            <PopoverTrigger>
              <Button variant="outline" className="flex items-center gap-x-2">
                <Download size={16}/>
                <p>{t('export')}</p>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-y-4" align="end">
              <div
                className="cursor-pointer hover:bg-secondary p-2 rounded flex items-center gap-x-4"
                onClick={() => {
                  setIsExport(false);
                  toast({
                    description: exportToast
                  })
                  getExportExcel()
                }}
              >
                <Image src={Excel} alt="excel-icon"/>
                <p>Excel</p>
              </div>
              <div
                className="cursor-pointer hover:bg-secondary p-2 rounded flex items-center gap-x-4"
                onClick={() => {
                  setIsExport(false);
                }}
              >
                <Image src={Word} alt="excel-icon"/>
                <p>Word</p>
              </div>
              <div
                className="cursor-pointer hover:bg-secondary p-2 rounded flex items-center gap-x-4"
                onClick={() => {
                  setIsExport(false);
                }}
              >
                <Image src={Pdf} alt="excel-icon"/>
                <p>PDF</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight border-r pr-4">
              {t('filter')}
            </h4>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex items-center gap-x-2">
                <Filter size={16}/>
                {t('filter')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl">
              <AlertDialogHeader className="flex flex-row items-center justify-between w-full">
                <p className="text-lg font-medium">{t('filters')}</p>
                <div className="flex items-center gap-x-4">
                  <AlertDialogCancel className="gap-x-2">
                    <X size={16}/>
                    {t('close')}
                  </AlertDialogCancel>
                  <Button variant="outline" className="gap-x-2">
                    <FilterX size={16}/>
                    {t('clearFilter')}
                  </Button>
                  <Button variant="outline" className="gap-x-2">
                    <Filter size={16}/>
                    {t('apply')}
                  </Button>
                </div>
              </AlertDialogHeader>
              <AlertDialogDescription>
                <Tabs defaultValue="main">
                  <TabsList className="w-full flex items-center justify-between">
                    <TabsTrigger value="main">
                      {t('mainFilterTab')}
                    </TabsTrigger>
                    <TabsTrigger value="source">
                      {t('srcFilterTab')}
                    </TabsTrigger>
                    <TabsTrigger value="authors">
                      {t('authorFilterTab')}
                    </TabsTrigger>
                    <TabsTrigger value="geo">
                      {t('geoFilterTab')}
                    </TabsTrigger>
                    <TabsTrigger value="tags">
                      {t('tagFilterTab')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="main">
                    <div className="flex flex-col gap-y-4">
                      <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                        <small className="text-sm font-medium leading-none text-black">{t('tone')}</small>
                        <div className="flex items-center gap-x-4">
                          {toneOption.map((item) => {
                            return (
                              <div key={item.key} className="flex items-center space-x-2">
                                <Checkbox id={item.key}/>
                                <label
                                  htmlFor={item.key}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {item.label}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                        <small className="text-sm font-medium leading-none text-black">{t('materialType')}</small>
                        <div className="flex items-center gap-x-4">
                          {materialType.map((item) => {
                            return (
                              <div key={item.key} className="flex items-center space-x-2">
                                <Checkbox id={item.key}/>
                                <label
                                  htmlFor={item.key}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {item.label}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                        <small className="text-sm font-medium leading-none text-black">{t('materialLang')}</small>
                        <div className="flex items-center gap-x-4">
                          {lang.map((item) => {
                            return (
                              <div key={item.key} className="flex items-center space-x-2">
                                <Checkbox id={item.key}/>
                                <label
                                  htmlFor={item.key}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {item.label}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                        <small className="text-sm font-medium leading-none text-black">{t('srcType')}</small>
                        <div className="flex flex-wrap items-center gap-4">
                          {collection.map((item) => {
                            return (
                              <div key={item.key} className="flex items-center space-x-2">
                                <Checkbox id={item.key}/>
                                <label
                                  htmlFor={item.key}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {item.label}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="source">
                    source
                  </TabsContent>
                  <TabsContent value="authors">
                    authors
                  </TabsContent>
                  <TabsContent value="geo">
                    geo
                  </TabsContent>
                  <TabsContent value="tags">
                    tags
                  </TabsContent>
                </Tabs>
              </AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-start justify-between gap-x-8 pb-10">
          <div className="w-full">
            <MaterialsList theme_id={themeId} />
          </div>
          <div className="w-1/4 rounded border p-4 flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2.5 pb-4 border-b">
              <h4 className="text-lg font-semibold">
                {t('tone')}
              </h4>
              {toneOption.map((item) => {
                return (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox id={item.key}/>
                    <label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-y-2.5 pb-4 border-b">
              <h4 className="text-lg font-semibold">
                {t('materialType')}
              </h4>
              {materialType.map((item) => {
                return (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox id={item.key}/>
                    <label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-y-2.5 pb-4 border-b">
              <h4 className="text-lg font-semibold">
                {t('materialLang')}
              </h4>
              {lang.map((item) => {
                return (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox id={item.key}/>
                    <label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-y-2.5">
              <h4 className="text-lg font-semibold">
                {t('srcType')}
              </h4>
              {collection.map((item) => {
                return (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox id={item.key}/>
                    <label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
            <Button>{t('apply')}</Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
