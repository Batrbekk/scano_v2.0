"use client"

import {date, z} from "zod";
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
import {CalendarIcon, Download} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Excel from "@/public/icons/excel.svg";
import Word from "@/public/icons/word.svg";
import Pdf from "@/public/icons/pdf.svg";
import {format} from "date-fns";
import {env} from "@/env.mjs";
import {useToast} from "@/components/ui/use-toast";
import {MaterialsList} from "@/components/materials-list";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ThemeFilter} from "@/components/theme-filter";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormSchema, FormValues} from "@/types/filter";
import {Badge} from "@/components/ui/badge";

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

  const [filter, setFilter] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tone: [],
      material_type: [],
      language: [],
      source_type: []
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { tone, material_type, language, source_type } = data;

    const combinedFilter = [...tone, ...material_type, ...language, ...source_type];

    setFilter(combinedFilter);
  }

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
                        <p className="truncate w-[95%]">
                          {format(startDate.from, "dd-MM-yyyy")}{" "}{`${startHour}:${startMin}`} ~{" "}
                          {format(startDate.to, "dd-MM-yyyy")}{" "}{`${endHour}:${endMin}`}
                        </p>
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
        <div className="flex items-start justify-between gap-x-8 pb-10">
          <div className="w-3/4 flex flex-col gap-y-4 mb-20">
            <div className="py-4 flex items-center">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight border-r pr-4">
                {t('filter')}
              </h4>
              <div className="flex flex-wrap gap-2 mx-4">
                {filter.map((item, index) => (
                  <Badge key={index}>{t(item)}</Badge>
                ))}
              </div>
            </div>
            <MaterialsList theme_id={themeId}/>
          </div>
          <div className="w-1/4 flex flex-col items-end gap-y-4">
            <FormProvider {...form}>
              <ThemeFilter onlyButton={false} form={form} formSchema={FormSchema} onSubmit={onSubmit} />
            </FormProvider>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
