"use client"

import Excel from "@/public/icons/excel.svg";
import Word from "@/public/icons/word.svg";
import Pdf from "@/public/icons/pdf.svg";
import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {SubscribeData, ThemeData} from "@/types";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {env} from "@/env.mjs";
import {getCookie} from "cookies-next";
import {usePathname, useRouter} from "@/navigation";
import {Loader2} from "lucide-react";

const formats = [
  {
    img: Excel,
    label: 'Excel',
    key: 'excel'
  },
  {
    img: Word,
    label: 'Word',
    key: 'docx'
  },
  {
    img: Pdf,
    label: 'PDF',
    key: 'pdf'
  }
]

export default function Page () {
  const router = useRouter();
  const t = useTranslations();
  const path = usePathname();
  const token = getCookie('scano_acess_token');
  const [sub, setSub] = useState<SubscribeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [themeId, setThemeId] = useState<string | null>(null);

  const FormSchema = z.object({
    theme: z.string(),
    mails: z.string(),
    format: z.array(z.string()),
    header: z.string(),
    subheader: z.string()
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme: '',
      mails: '',
      format: [],
      header: '',
      subheader: ''
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/subscriptions/${data.theme}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        theme_id: data.theme,
        file_format_types: data.format,
        emails: data.mails.split(/\s*,\s*/),
        header: data.header,
        subheader: data.subheader
      }),
    });
    if (res.ok) {
      router.push(`/${themeId}/subscribe/`);
    } else {
      setIsLoading(false);
      console.error('create subs request error');
    }
  }

  useEffect(() => {
    const themes = localStorage.getItem('themeList');
    const sub = getCookie('editSubsData');
    if (themes) {
      setThemes(JSON.parse(themes));
    }
    if (sub) {
      setSub(JSON.parse(sub));
    }
  }, []);

  useEffect(() => {
    setThemeId(path.split('/')[1]);
  }, [path]);

  useEffect(() => {
    if (sub) {
      form.setValue('theme', sub.theme.id);
      form.setValue('mails', sub.emails.join(', '));
      form.setValue('header', sub.header);
      form.setValue('subheader', sub.subheader);
      form.setValue('format', sub.file_format_types);
    }
  }, [sub]);

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('editSubsTitle')}
      </h3>
      <div className="flex items-start gap-x-8 mb-20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 p-4 rounded border flex flex-col gap-y-8">
            <FormField
              name="theme"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>{t('theme')}</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={sub ? sub.theme.name : t('chooseTheme')} className="uppercase"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {themes.map((item) => (
                          <SelectItem value={item._id}
                                      key={item._id}>{item.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name="mails"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>E-mail</FormLabel>
                    <FormLabel>{t('emailLimit', {limit: 20})}</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea {...field} className="resize-none"/>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex items-center gap-x-4">
              <FormField
                name="header"
                control={form.control}
                render={({field}) => (
                  <FormItem className="w-1/2" id="header" defaultValue={field.value}>
                    <FormLabel>{t('header')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="subheader"
                control={form.control}
                render={({field}) => (
                  <FormItem className="w-1/2" id="subheader" defaultValue={field.value}>
                    <FormLabel>{t('subheader')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="format"
              control={form.control}
              render={() => (
                <FormItem className="grid w-full items-center gap-1.5">
                  <Label>{t('users')}</Label>
                  <div className="flex flex-col gap-4">
                    {formats.map((item) => (
                      <FormField
                        key={item.key}
                        name="format"
                        control={form.control}
                        render={({field}) => {
                          return (
                            <FormItem
                              key={item.key}
                              className="flex items-center gap-x-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.key)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.key])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.key
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center gap-x-2 !m-0">
                                <Image src={item.img} alt="icon"/>
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-fit" disabled={isLoading}>
              {isLoading ?
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>{t('exportToastPending')}
                </> : t('save')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
