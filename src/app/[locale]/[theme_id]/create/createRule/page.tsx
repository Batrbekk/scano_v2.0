"use client"

import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ThemeData} from "@/types";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Info} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

export default function Page() {
  const t = useTranslations();
  const [themes, setThemes] = useState<ThemeData[]>([]);

  const actionType = [
    {
      key: 'post_tone',
      label: t('toneRule')
    },
    {
      key: 'post_tag',
      label: t('tagRule')
    },
    {
      key: 'mark',
      label: t('markRule')
    },
    {
      key: 'delete',
      label: t('delete')
    }
  ];

  const FormSchema = z.object({
    theme: z.string(),
    keywords: z.string(),
    minus_keywords: z.string(),
    action: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme: '',
      keywords: '',
      minus_keywords: '',
      action: []
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  useEffect(() => {
    const themes = localStorage.getItem('themeList');
    if (themes) {
      setThemes(JSON.parse(themes));
    }
  }, []);

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('createRuleTitle')}
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
                        <SelectValue placeholder={t('chooseTheme')} className="uppercase"/>
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
              name="keywords"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('searchWords')}</FormLabel>
                    <FormLabel>{t('searchLimit', {limit: 20})}</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea {...field} className="resize-none"/>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minus_keywords"
              render={({field}) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('minusWord')}</FormLabel>
                    <FormLabel>{t('searchLimit', {limit: 100})}</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea {...field} className="resize-none"/>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="action"
              control={form.control}
              render={() => (
                <FormItem className="grid w-full items-center gap-1.5">
                  <Label>{t('action')}</Label>
                  <div className="flex items-center gap-x-4">
                    {actionType.map((item) => (
                      <FormField
                        key={item.key}
                        name="action"
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
                              <FormLabel className="font-normal !m-0">
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
            <Button type="submit" className="w-fit">{t('save')}</Button>
          </form>
        </Form>
        <div className="p-4 rounded border w-1/3">
          <div className="flex items-start gap-x-4">
            <Info size={32}/>
            <div className="flex flex-col gap-y-4 w-[90%]">
              <code className="relative rounded bg-muted p-2 w-full font-semibold">
                {t('createTagInfo')}
                <TooltipProvider>
                  <Tooltip delayDuration={400}>
                    <TooltipTrigger>
                      <code className="underline">
                        {t('createTagInfo2')}
                      </code>
                    </TooltipTrigger>
                    <TooltipContent>
                      asd
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
