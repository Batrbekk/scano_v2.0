"use client"

import React from "react";
import { cn } from "@/lib/utils"
import { ru } from 'date-fns/locale';
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import { addDays, format } from "date-fns"
import {CalendarIcon, ChevronRight, Loader2, Mail} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "@/components/ui/alert-dialog";
import {DateRange} from "react-day-picker";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Checkbox} from "@/components/ui/checkbox";
import { DataTableDemo } from "@/components/ui/data-table";
import {useToast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {Skeleton} from "@/components/ui/skeleton";

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export default function Home() {
  const { toast } = useToast();

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const [startDate, setStartDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [startHour, setStartHour] = React.useState('00');
  const [startMin, setStartMin] = React.useState('00');

  const [endHour, setEndHour] = React.useState('00');
  const [endMin, setEndMin] = React.useState('00');

  return (
    <main className="flex flex-wrap p-8 gap-16">
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full"/>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]"/>
            <Skeleton className="h-4 w-[200px]"/>
          </div>
        </div>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>TOAST</p>
        <Button
          onClick={() => {
            toast({
              title: "Привет!",
              description: "Уведомляю вас о выгрузке данных!",
            })
          }}
        >
          Показать Toast
        </Button>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <div className="rounded-md border">
          <DataTableDemo />
        </div>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>CHECKBOX</p>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms"/>
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Label для checkbox
          </label>
        </div>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>RADIO GROUP</p>
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1"/>
            <Label htmlFor="r1">Астана</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="r2"/>
            <Label htmlFor="r2">Павлодар</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="r3"/>
            <Label htmlFor="r3">Алматы</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>PROGRESS BAR</p>
        <Progress value={33}/>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
      <p>PAGINATION</p>
        <Pagination>
          <PaginationContent>
            <Pagination>
              <PaginationPrevious href="#" />
            </Pagination>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>INPUT</p>
        <Input type="email" placeholder="Email"/>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email"/>
        </div>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>DATEPICKER RANGE</p>
        <div className={cn("grid gap-2")}>
        <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4"/>
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
                  <span>Pick a date</span>
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
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>DATEPICKER</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4"/>
              {date ? format(date, "dd-MM-yyyy") : <span>Выберите дату</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
            <Select
              onValueChange={(value: string) =>
                setDate(addDays(new Date(), parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите время"/>
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Сегодня</SelectItem>
                <SelectItem value="1">Завтра</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar mode="single" locale={ru} selected={date} onSelect={setDate}/>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>CALENDAR</p>
        <Calendar
          locale={ru}
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>ACCORDION</p>
        <Accordion type="single" collapsible className="w-44">
          <AccordionItem value="item-1">
            <AccordionTrigger>Аккордион?</AccordionTrigger>
            <AccordionContent>
              Да аккордион
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>MODAL</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Открыть модалку</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Проверить открытие модалки?</AlertDialogTitle>
              <AlertDialogDescription>
                Какое то описание для клиента
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction>Продолжить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="shadow-xl flex items-center flex-col gap-2 justify-center py-2 px-4">
        <p>AVATAR</p>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
          <AvatarFallback>BK</AvatarFallback>
        </Avatar>
      </div>
      <div className="shadow-xl flex items-center flex-col gap-2 justify-center py-2 px-4">
        <p>BADGE</p>
        <Badge>Badge</Badge>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center  justify-center py-2 px-4">
        <p>BUTTONS</p>
        <Button>Кнопка</Button>
        <Button variant="outline">Кнопка</Button>
        <Button variant="ghost">Кнопка</Button>
        <Button variant="link">Кнопка</Button>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4"/>
        </Button>
        <Button>
          <Mail className="mr-2 h-4 w-4"/> Логин
        </Button>
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
          Пожалуйста подождите...
        </Button>
      </div>
      <div className="shadow-xl flex items-center flex-col gap-2 justify-center py-2 px-4">
        <p>POPOVER</p>
        <Popover>
          <PopoverTrigger>Открыть</PopoverTrigger>
          <PopoverContent>Контент для popover</PopoverContent>
        </Popover>
      </div>
      <div className="shadow-xl flex flex-col gap-2 items-center justify-center py-2 px-4">
        <p>SELECT</p>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </main>
  )
}
