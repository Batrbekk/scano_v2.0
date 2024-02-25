"use client"

import {useTranslations} from "use-intl";
import React, {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Info} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {env} from "@/env.mjs";
import {getCookie} from "cookies-next";
import {useRouter} from "@/navigation";

export default function Page() {
  const router = useRouter();
  const t = useTranslations();
  const token = getCookie('scano_acess_token');
  const [loading, setLoading] = useState<boolean>(false);

  const period = [
    {
      label: t('allPeriod'),
      key: 'all'
    },
    {
      label: t('month'),
      key: 'month'
    },
    {
      label: t('week'),
      key: 'week'
    },
    {
      label: t('day'),
      key: 'day'
    }
  ];

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: t('inputError')
    }),
    keywords: z.string(),
    minus_keywords: z.string(),
    tag_color: z.string(),
    parsing_period: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      keywords: '',
      minus_keywords: '',
      tag_color: '#5e72e4',
      parsing_period: 'all',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setLoading(true);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/tags/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        keywords: data.keywords.split(/\s*,\s*/),
        minus_keywords: data.minus_keywords.split(/\s*,\s*/),
        tag_color: data.tag_color,
        parsing_period: data.parsing_period
      }),
    });
    if (res.ok) {
      router.push('/main');
    } else {
      console.error('create theme request error');
    }
  }

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('createTagTitle')}
      </h3>
      <div className="flex items-start gap-x-8 mb-20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 p-4 rounded border flex flex-col gap-y-8">
            <div className="flex items-start gap-x-4">
              <FormField
                name="name"
                control={form.control}
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormLabel>{t('tag')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="tag_color"
                control={form.control}
                render={({field}) => (
                  <FormItem className="w-32">
                    <FormLabel>{t('tagColor')}</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="keywords"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('searchWords')}</FormLabel>
                    <FormLabel>{t('searchLimit', {limit: 100})}</FormLabel>
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
              name="parsing_period"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>{t('period')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue className="uppercase"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {period.map((item) => (
                          <SelectItem value={item.key}
                                      key={item.key}>{item.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
