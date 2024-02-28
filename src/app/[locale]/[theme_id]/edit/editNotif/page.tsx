"use client"

import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {SubsData, ThemeData, UserData} from "@/types";
import {env} from "@/env.mjs";
import {getCookie} from "cookies-next";
import {Skeleton} from "@/components/ui/skeleton";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {usePathname, useRouter} from "@/navigation";

export default function Page () {
  const router = useRouter();
  const t = useTranslations();
  const path = usePathname();
  const token = getCookie('scano_acess_token');
  const [subs, setSubs] = useState<SubsData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [pending, setPending] = useState<boolean>(true);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserData | null>(null);

  const FormSchema = z.object({
    theme: z.string(),
    users: z.array(z.string()),
    telegrams: z.string(),
    action: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme: '',
      users: [],
      telegrams: '',
      action: []
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/notification_plans/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        telegram_channel_ids: [data.telegrams],
        email_list: data.users,
        theme_id: themeId,
        is_email: true,
        is_telegram: true
      }),
    });
    if (res.ok) {
      router.push(`/${themeId}/notification/`);
    } else {
      console.error('create theme request error');
    }
  }

  async function getUsersData() {
    setPending(true);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      setPending(false);
    } else {
      setPending(false);
      console.error('Get themes data ERROR');
    }
  }

  async function getSubsData() {
    setPending(true);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/subscriptions/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      setSubs(data);
      setPending(false);
    } else {
      setPending(false);
      console.error('Get themes data ERROR');
    }
  }

  useEffect(() => {
    const themes = localStorage.getItem('themeList');
    const user = getCookie('userData');
    if (themes) {
      setThemes(JSON.parse(themes));
    }
    if (user) {
      setCurrentProfile(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    setThemeId(path.split('/')[1]);
  }, [path]);

  useEffect(() => {
    getUsersData();
    getSubsData();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('editNotificationTitle')}
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
            {pending ? (
              <div className="flex flex-col gap-y-2">
                <Skeleton className="w-1/4 h-2" />
                <Skeleton className="w-full h-8" />
              </div>
            ) : (
              <FormField
                name="users"
                control={form.control}
                render={() => (
                  <FormItem className="grid w-full items-center gap-1.5">
                    <Label>{t('users')}</Label>
                    <div className="flex flex-col gap-4">
                      {users.map((item) => (
                        <FormField
                          key={item._id}
                          name="users"
                          control={form.control}
                          render={({field}) => {
                            return (
                              <FormItem
                                key={item._id}
                                className="flex items-center gap-x-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.email)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.email])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.email
                                          )
                                        )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal !m-0">
                                  {item.email}
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
            )}
            {pending ? (
              <div className="flex flex-col gap-y-2">
                <Skeleton className="w-1/4 h-2"/>
                <Skeleton className="w-full h-8"/>
              </div>
            ) : (
              <FormField
                name="telegrams"
                control={form.control}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Telegram</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('chooseSubs')} className="uppercase"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {subs.map((item) => (
                            <SelectItem value={item.header}
                                        key={item.header}>{item.header}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      <a
                        className="flex items-center gap-x-2 cursor-pointer"
                        href={`https://t.me/scanokz_bot?startgroup=${currentProfile?.admin_id}`}
                        target="_blank"
                      >
                        <Plus size={14} />
                        {t('addTelegramChat')}
                      </a>
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-fit">{t('save')}</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
