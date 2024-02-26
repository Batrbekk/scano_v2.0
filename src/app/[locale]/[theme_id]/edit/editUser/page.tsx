"use client"

import React, {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import {useTranslations} from "use-intl";
import {UserData} from "@/types";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {CircleUserRound, Info, Loader2, UserRound} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {env} from "@/env.mjs";
import {usePathname, useRouter} from "@/navigation";

export default function EditUser () {
    const router = useRouter();
    const t = useTranslations();
    const path = usePathname();
    const [file, setFile] = useState<any>();
    const token = getCookie('scano_acess_token');
    const [err, setErr] = useState<string>('');
    const [userAva, setUserAva] = useState<string>('');
    const [pending, setPending] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [themeId, setThemeId] = useState<string | null>(null);

    const timezone = [
        {
            value: 'UCT +6',
            label: '(UCT+6) Казахстан, Алматы'
        },
        {
            value: 'UCT +0',
            label: '(UCT+0) Гринвич, Лондон'
        },
        {
            value: 'UCT +1',
            label: '(UCT+1) Берлин, Париж'
        },
        {
            value: 'UCT +2',
            label: '(UCT+2) Каир, Афины'
        },
        {
            value: 'UCT +3',
            label: '(UCT+3) Москва, Киев'
        }
    ];

    const FormSchema = z.object({
        name: z.string(),
        surname: z.string(),
        company: z.string(),
        timezone: z.string(),
        password: z.string().min(8, {
            message: 'Пароль должен содержать не менее 8 символов'
        }),
        confirmPassword: z.string().min(8, {
            message: 'Пароль должен содержать не менее 8 символов'
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            surname: '',
            company: '',
            timezone: '',
            password: '',
            confirmPassword: ''
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (data.password !== data.confirmPassword) {
            setErr('Пароли не совпадают, попробуйте еше раз!');
        } else {
            setLoading(true);
            const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/${user?._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: data.name,
                    last_name: data.surname,
                    company_name: data.company,
                    timezone: data.timezone,
                    password: data.password
                }),
            });
            if (res.ok) {
                router.push(`/${themeId}/users`);
            }
        }
    }

    const getImg = async () => {
        try {
            const res = await fetch(`https://scano-0df0b7c835bf.herokuapp.com/files/${user?.photo_url}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            if (res.ok) {
                setPending(false);
                setUserAva(res.url);
            }
        } catch (e) {
            setPending(false);
            console.error(e);
        }
    };

    function handleChangePhoto (event: any) {
        setFile(URL.createObjectURL(event.target.files[0]));
    }

    useEffect(() => {
        setThemeId(path.split('/')[1]);
    }, [path]);

    useEffect(() => {
        const user = getCookie('editUserData');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);

    useEffect(() => {
        if (user) {
            getImg();
            form.setValue('name', user.first_name);
            form.setValue('surname', user.last_name);
            form.setValue('company', user.company_name);
            form.setValue('timezone', user.timezone);
        }
    }, [user]);

  return (
      <div className="p-4 flex flex-col gap-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {t('editProfile')}
          </h3>
          <div className="flex items-start gap-x-8">
              <div className="flex flex-col gap-y-8 rounded border p-4 w-2/3">
                  <div className="flex items-start gap-x-4">
                      {pending ? (
                          <Skeleton className="w-32 h-32 rounded" />
                      ) : (
                          file ? (
                              <div className="w-32 h-32 rounded border overflow-hidden">
                                  <Input onChange={handleChangePhoto} id="picture" type="file" accept="image/*"
                                         className="appearance-none cursor-pointer w-32 h-32 opacity-0 absolute"/>
                                  <Image src={file} width={128} height={128} alt="profile-img"/>
                              </div>
                          ) : (
                              user?.photo_url ? (
                                  <div className="w-32 h-32 rounded border overflow-hidden">
                                      <Input onChange={handleChangePhoto} id="picture" type="file" accept="image/*"
                                             className="appearance-none cursor-pointer w-32 h-32 opacity-0 absolute"/>
                                      <Image src={userAva} width={128} height={128} alt="profile-img"/>
                                  </div>
                              ) : (
                                  <div className="w-32 h-32 rounded border overflow-hidden flex items-center justify-center">
                                      <Input onChange={handleChangePhoto} id="picture" type="file" accept="image/*"
                                             className="appearance-none cursor-pointer w-32 h-32 opacity-0 absolute"/>
                                      <div className="p-2 flex flex-col items-center">
                                          <UserRound />
                                          <h3 className="text-center font-semibold">{t('addPhoto')}</h3>
                                      </div>
                                  </div>
                              )
                          )
                      )}
                      <div className="flex flex-col gap-y-2">
                          <h4 className="text-lg font-semibold">
                              {user?.first_name} {user?.last_name}
                          </h4>
                          <div className="flex items-center gap-x-4">
                              <div className="flex items-center gap-x-2">
                                  <CircleUserRound size={18} />
                                  <p className="text-lg font-medium">{t(user?.role)}</p>
                              </div>
                              <TooltipProvider>
                                  <Tooltip>
                                      <TooltipTrigger>
                                          <Info size={18} />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          asd
                                      </TooltipContent>
                                  </Tooltip>
                              </TooltipProvider>
                          </div>
                      </div>
                  </div>
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
                          <div className="w-full flex items-center gap-x-4">
                              <FormField
                                  name="name"
                                  control={form.control}
                                  render={({field}) => (
                                      <FormItem className="w-1/2" defaultValue={field.value}>
                                          <FormLabel>{t('userName')}</FormLabel>
                                          <FormControl>
                                              <Input {...field} />
                                          </FormControl>
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
                                      </FormItem>
                                  )}
                              />
                          </div>
                          <div className="w-full flex items-center gap-x-4">
                              <FormField
                                  name="company"
                                  control={form.control}
                                  render={({field}) => (
                                      <FormItem className="w-1/2" id="company" defaultValue={field.value}>
                                          <FormLabel>{t('company')}</FormLabel>
                                          <FormControl>
                                              <Input {...field} />
                                          </FormControl>
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  name="timezone"
                                  control={form.control}
                                  render={({field}) => (
                                      <FormItem className="w-1/2">
                                          <FormLabel>{t('timezone')}</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger>
                                                      <SelectValue placeholder={field.value} className="uppercase"/>
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  <SelectGroup>
                                                      {timezone.map((item) => (
                                                          <SelectItem value={item.value}
                                                                      key={item.value}>{item.label}</SelectItem>
                                                      ))}
                                                  </SelectGroup>
                                              </SelectContent>
                                          </Select>
                                          <FormMessage/>
                                      </FormItem>
                                  )}
                              />
                          </div>
                          <div className="w-full flex flex-col gap-y-4">
                              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('changePassword')}</h4>
                              <div className="flex items-start gap-x-4">
                                  <FormField
                                      name="password"
                                      control={form.control}
                                      render={({field}) => (
                                          <FormItem className="w-1/2">
                                              <FormLabel>
                                                  {t('newPassword')}
                                              </FormLabel>
                                              <FormControl>
                                                  <Input
                                                      id="password"
                                                      placeholder="Пароль"
                                                      type="password"
                                                      autoCapitalize="none"
                                                      autoComplete="password"
                                                      autoCorrect="off"
                                                      {...field}
                                                  />
                                              </FormControl>
                                              <FormMessage/>
                                          </FormItem>
                                      )}
                                  />
                                  <FormField
                                      name="confirmPassword"
                                      control={form.control}
                                      render={({field}) => (
                                          <FormItem className="w-1/2">
                                              <FormLabel>
                                                  {t('confirmNewPassword')}
                                              </FormLabel>
                                              <FormControl>
                                                  <Input
                                                      id="confirmPassword"
                                                      placeholder="Подтвердить пароль"
                                                      type="password"
                                                      autoCapitalize="none"
                                                      autoComplete="password"
                                                      autoCorrect="off"
                                                      {...field}
                                                  />
                                              </FormControl>
                                              <FormMessage />
                                              {err && (
                                                  <FormDescription className="text-red-600">
                                                      {err}
                                                  </FormDescription>
                                              )}
                                          </FormItem>
                                      )}
                                  />
                              </div>
                          </div>
                          <Button type="submit" className="w-fit" disabled={loading}>
                              {loading ?
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
                              {t('editProfileInfo1')}
                          </code>
                      </div>
                  </div>
                  <div className="flex items-start gap-x-4">
                      <Info size={32}/>
                      <div className="flex flex-col gap-y-4 w-[90%]">
                          <code className="relative rounded bg-muted p-2 w-full font-semibold">
                              {t('editProfileInfo2')}
                          </code>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}
