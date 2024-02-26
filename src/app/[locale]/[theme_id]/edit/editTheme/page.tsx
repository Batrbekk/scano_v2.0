"use client"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ChevronDown, ChevronUp, Info, Loader2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {usePathname, useRouter} from "@/navigation";
import {getCookie} from "cookies-next";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {env} from "@/env.mjs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Skeleton} from "@/components/ui/skeleton";

export default function Page() {
  const t = useTranslations();

  const themeType = [
    {
      label: t('all'),
      key: 'all'
    },
    {
      label: t('news'),
      key: 'news'
    },
    {
      label: t('social'),
      key: 'social_network'
    }
  ];

  const [pending, setPending] = useState<boolean>(true);

  const themeSrc = [
    {
      label: t('news'),
      key: 'news'
    },
    {
      label: t('social'),
      key: 'social_network'
    },
    {
      label: t('videoInWeb'),
      key: 'video'
    },
    {
      label: t('channelsInMessengers'),
      key: 'messenger_chanel'
    },
    {
      label: t('groupsInMessengers'),
      key: 'messenger_group'
    }
  ];
  const searchArea = [
    {
      label: t('textMessage'),
      key: 'material_text'
    },
    {
      label: t('textPicture'),
      key: 'picture_text'
    },
    {
      label: t('videoTranscript'),
      key: 'video_transcription'
    }
  ];
  const materialTypes = [
    {
      key: 'post',
      label: t('post')
    },
    {
      key: 'comment',
      label: t('comments')
    },
    {
      key: 'repost',
      label: t('repost')
    },
    {
      key: 'stories',
      label: t('stories')
    }
  ];
  const langs = [
    {
      key: 'ru',
      label: t('ru')
    },
    {
      key: 'kk',
      label: t('kk')
    },
    {
      key: 'en',
      label: t('en')
    }
  ];

  const path = usePathname();
  const router = useRouter();
  const token = getCookie('scano_acess_token');

  const [themeId, setThemeId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const FormSchema = z.object({
    searchArea: z.array(z.string()),
    materialTypes: z.array(z.string()),
    themeName: z.string(),
    themeType: z.string(),
    searchWords: z.string(),
    minusWords: z.string(),
    themeSource: z.string(),
    language: z.string(),
    excludeSource: z.string()
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      themeName: '',
      searchArea: [],
      materialTypes: [],
      searchWords: '',
      minusWords: '',
      language: '',
      excludeSource: '',
      themeType: '',
      themeSource: ''
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${themeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.themeName,
        theme_type: data.themeType,
        keywords: data.searchWords.split(/\s*,\s*/),
        minus_keywords: data.minusWords.split(/\s*,\s*/),
        source_types: [data.themeSource],
        material_types: data.materialTypes,
        search_domains: data.searchArea,
        language: data.language,
        exclude_sources: data.excludeSource.split(/\s*,\s*/)
      }),
    });
    if (res.ok) {
      router.push('/main');
    } else {
      console.error('create theme request error');
    }
  }

  async function getTheme (id: string) {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (res.ok) {
      const data = await res.json();
      form.setValue('themeName', data.name);
      form.setValue('language', data.language);
      form.setValue('themeType', data.theme_type);
      form.setValue('searchArea', data.search_domains);
      form.setValue('themeSource', data.source_types[0]);
      form.setValue('materialTypes', data.material_types);
      form.setValue('searchWords', data.keywords.join(', '));
      form.setValue('minusWords', data.minus_keywords.join(', '));
      form.setValue('excludeSource', data.exclude_sources.join(', '));
      setPending(false);
    } else {
      console.error('get theme request error');
      setPending(false);
    }
  }

  useEffect(() => {
    setThemeId(path.split('/')[1]);
  }, [path]);

  useEffect(() => {
    if (themeId) {
      getTheme(themeId);
    }
  }, [themeId]);

  return (
    <ScrollArea className="h-screen">
      {pending ? (
        <div className="p-4 flex flex-col gap-y-4">
          <Skeleton className="h-[24px] w-[250px] rounded" />
          <div className="flex items-start gap-x-8 w-full mb-20">
            <div className="flex flex-col gap-y-8 w-2/3">
              <Skeleton className="h-[92px] w-full rounded" />
              <Skeleton className="h-[92px] w-full rounded" />
              <Skeleton className="h-[92px] w-full rounded" />
              <Skeleton className="h-[92px] w-full rounded" />
              <Skeleton className="h-[92px] w-full rounded" />
            </div>
            <Skeleton className="h-[200px] w-1/3 rounded" />
          </div>
        </div>
        ) : (
          <div className="p-4 flex flex-col gap-y-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {t('addTheme')}
            </h3>
            <div className="flex items-start gap-x-8 w-full mb-20">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3">
                  <div className="p-4 rounded border flex flex-col gap-y-8 w-full">
                    <div className="flex items-start gap-x-4">
                      <FormField
                        name="themeName"
                        control={form.control}
                        render={({field}) => (
                          <FormItem className="w-2/3">
                            <FormLabel>{t('themeName')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="themeType"
                        control={form.control}
                        render={({field}) => (
                          <FormItem className="w-1/3">
                            <FormLabel>{t('themeType')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('chooseThemeType')} className="uppercase"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {themeType.map((item) => (
                                    <SelectItem value={item.key}
                                                key={item.key}>{item.label}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                    <h4 className="text-lg font-semibold">{t('searchRequest')}</h4>
                    <FormField
                      name="searchWords"
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
                      name="minusWords"
                      render={({field}) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>{t('minusWord')}</FormLabel>
                            <FormLabel>{t('searchLimit', {limit: 50})}</FormLabel>
                          </div>
                          <FormControl>
                            <Textarea {...field} className="resize-none"/>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="themeSource"
                      control={form.control}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>{t('srcFilterTab')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('chooseThemeSource')} className="uppercase"/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {themeSrc.map((item) => (
                                  <SelectItem value={item.key}
                                              key={item.key}>{item.label}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-x-4">
                      <h4 className="text-lg font-semibold">{t('filters')}</h4>
                      <div
                        className="p-2 h-8 border rounded cursor-pointer"
                        onClick={() => setShowFilter(!showFilter)}
                      >
                        {showFilter ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      </div>
                    </div>
                    {showFilter && (
                      <>
                        <FormField
                          name="searchArea"
                          control={form.control}
                          render={() => (
                            <FormItem className="grid w-full items-center gap-1.5">
                              <Label>{t('searchArea')}</Label>
                              <div className="flex items-center gap-x-4">
                                {searchArea.map((item) => (
                                  <FormField
                                    key={item.key}
                                    name="searchArea"
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
                        <FormField
                          name="materialTypes"
                          control={form.control}
                          render={() => (
                            <FormItem className="grid w-full items-center gap-1.5">
                              <Label>{t('typeMessage')}</Label>
                              <div className="flex items-center gap-x-4">
                                {materialTypes.map((item) => (
                                  <FormField
                                    key={item.key}
                                    name="materialTypes"
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
                        <FormField
                          name="language"
                          control={form.control}
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>{t('langs')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue className="uppercase"/>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    {langs.map((item) => (
                                      <SelectItem value={item.key}
                                                  key={item.key}>{item.label}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="excludeSource"
                          render={({field}) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>{t('excludeSrc')}</FormLabel>
                                <FormLabel>{t('excludeSrcLimit', {limit: 20})}</FormLabel>
                              </div>
                              <FormControl>
                                <Textarea {...field} className="resize-none"/>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <div className="flex items-start gap-x-4">
                      <Info size={32}/>
                      <code className="relative rounded bg-muted p-2 w-full font-semibold">
                        {t('createThemeInfo')}
                      </code>
                    </div>
                    <Button type="submit" className="w-fit" disabled={loading}>
                      {loading ?
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>{t('exportToastPending')}
                        </> : t('save')}
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="p-4 rounded border w-1/3">
                <div className="flex items-start gap-x-4">
                  <Info size={32}/>
                  <div className="flex flex-col gap-y-4 w-[90%]">
                    <code className="relative rounded bg-muted p-2 w-full font-semibold">
                      {t('createThemeInfo1')}
                      <TooltipProvider>
                        <Tooltip delayDuration={400}>
                          <TooltipTrigger>
                            <code className="underline ml-2">
                              {t('details')}
                            </code>
                          </TooltipTrigger>
                          <TooltipContent>
                            asd
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </code>
                    <code className="relative rounded bg-muted p-2 w-full font-semibold">
                      {t('description')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <code className="underline ml-2">
                              {t('createThemeInfo2')}
                            </code>
                          </TooltipTrigger>
                          <TooltipContent>
                            asd
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </code>
                    <code className="relative rounded bg-muted p-2 w-full font-semibold">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <code className="underline">{t('detailedGuide')}</code>
                          </TooltipTrigger>
                          <TooltipContent>
                            asd
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <code className="ml-2">{t('createThemeInfo3')}</code>
                    </code>
                    <code className="relative rounded bg-muted p-2 w-full font-semibold">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <code className="underline mr-2 flex">{t('createThemeCheck')}</code>
                          </TooltipTrigger>
                          <TooltipContent>
                            asd
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {t('createThemeInfo4')}
                    </code>
                    <code className="relative rounded bg-muted p-2 w-full font-semibold">
                      {t('createThemeInfo5')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <code className="underline text-left ml-2 flex">{t('detailedAboutRule')}</code>
                          </TooltipTrigger>
                          <TooltipContent>
                            asd
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </code>
                    <code className="relative rounded bg-muted p-2 w-full font-semibold">
                      {t('createThemeInfo6')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <code className="ml-2 underline">{t('details')}</code>
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
      )}
    </ScrollArea>
  )
}
