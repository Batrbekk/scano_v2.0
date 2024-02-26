"use client"

import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Info, Loader2} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ThemeData} from "@/types";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {usePathname, useRouter} from "@/navigation";
import {getCookie} from "cookies-next";
import {env} from "@/env.mjs";

export default function Profile () {
  const router = useRouter();
  const t = useTranslations();
  const path = usePathname();
  const token = getCookie('scano_acess_token');
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [themeId, setThemeId] = useState<string | null>(null);

  const mode = [
    {
      label: t('admin'),
      key: 'admin'
    },
    {
      label: t('moderator'),
      key: 'moderator'
    },
    {
      label: t('guest'),
      key: 'guest'
    }
  ];

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: t('inputError')
    }),
    surname: z.string().min(1, {
      message: t('inputError')
    }),
    company: z.string().min(1, {
      message: t('inputError')
    }),
    mail: z.string().min(1, {
      message: t('inputError')
    }),
    rules: z.string(),
    theme: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      surname: '',
      company: '',
      mail: '',
      rules: 'admin',
      theme: []
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            first_name: data.name,
            last_name: data.surname,
            company_name: data.company,
            role: data.rules,
            email: data.mail,
            theme_ids: data.theme
          }),
        }
      );
      if (res.ok) {
        setIsLoading(false);
        await router.push(`/${themeId}/users`);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setThemeId(path.split('/')[1]);
  }, [path]);

  useEffect(() => {
    const themes = localStorage.getItem('themeList');
    if (themes) {
      setThemes(JSON.parse(themes));
    }
  }, []);

  useEffect(() => {
    form.setValue('rules', 'admin');
  }, []);

  return (
    <ScrollArea className="h-screen">
      <div className="p-4 flex flex-col gap-y-8 mb-10">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t('createUser')}
        </h3>
        <div className="flex items-start gap-x-8">
          <div className="p-4 rounded border w-2/3 flex flex-col gap-y-8 mb-20">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
                <div className="flex items-center gap-x-4">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({field}) => (
                      <FormItem className="w-1/2" defaultValue={field.value}>
                        <FormLabel>{t('userName')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="surname"
                    control={form.control}
                    render={({field}) => (
                      <FormItem className="w-1/2" defaultValue={field.value}>
                        <FormLabel>{t('surname')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-start gap-x-4">
                  <FormField
                    name="mail"
                    control={form.control}
                    render={({field}) => (
                      <FormItem className="w-1/2" id="mail" defaultValue={field.value}>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="company"
                    control={form.control}
                    render={({field}) => (
                      <FormItem className="w-1/2" id="company" defaultValue={field.value}>
                        <FormLabel>{t('company')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-start gap-x-4">
                  <FormField
                    name="rules"
                    control={form.control}
                    render={({field}) => (
                      <FormItem className="w-full">
                        <FormLabel>{t('rule')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={field.value} className="uppercase"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {mode.map((item) => (
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
                <FormField
                  name="theme"
                  control={form.control}
                  render={() => (
                    <FormItem className="grid items-start gap-1.5">
                      <Label>{t('theme')}</Label>
                      <div className="flex flex-col gap-4">
                        {themes.map((item) => (
                          <FormField
                            key={item._id}
                            name="theme"
                            control={form.control}
                            render={({field}) => {
                              return (
                                <FormItem
                                  key={item._id}
                                  className="flex items-center gap-x-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item._id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item._id])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item._id
                                            )
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal !m-0">
                                    {item.name}
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
          <div className="p-4 rounded border w-1/3 flex flex-col gap-y-8">
            <div className="flex items-start gap-x-4">
              <Info size={32}/>
              <div className="flex flex-col gap-y-4 w-[90%]">
                <code className="relative rounded bg-muted p-2 w-full font-semibold">
                  {t('createUserInfo1')}
                </code>
              </div>
            </div>
            <div className="flex items-start gap-x-4">
              <Info size={32}/>
              <div className="flex flex-col gap-y-4 w-[90%]">
                <code className="relative rounded bg-muted p-2 w-full font-semibold">
                  {t('createUserInfo2')}
                </code>
              </div>
            </div>
            <div className="flex items-start gap-x-4">
              <Info size={32}/>
              <div className="flex flex-col gap-y-4 w-[90%]">
                <code className="relative rounded bg-muted p-2 w-full font-semibold">
                  {t('createUserInfo3')}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
