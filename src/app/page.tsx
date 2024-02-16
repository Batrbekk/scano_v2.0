"use client"

import { z } from "zod";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {env} from "@/env.mjs";
import {setCookie} from "cookies-next";
import {Loader2} from "lucide-react";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    mail: z.string().min(1, {
        message: 'Введите корректный email'
    }),
    password: z.string().min(8, {
        message: 'Пароль должен содержать не менее 8 символов'
    })
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          mail: '',
          password: ''
      }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: values.mail,
            password: values.password,
        }),
    });
    if (res.ok) {
        setErr(null);
        const data = await res.json();
        setCookie('scano_acess_token', data.access_token);
        await router.push('/main');
    } else {
        setErr('В почте или пароле ошибка, попробуйте снова.');
        setIsLoading(false);
        console.error('Login failed');
    }
  }

    return (
        <>
            <main className="flex h-screen flex-col items-center justify-center gap-y-8">
            <Image priority={true} src={Logo} alt="Logo" />
            <div className="w-full max-w-md flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                name="mail"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                placeholder="mail@example.com"
                                                type="email"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                placeholder="Пароль"
                                                type="password"
                                                autoCapitalize="none"
                                                autoComplete="password"
                                                autoCorrect="off"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {err && (
                                <FormDescription className="text-red-600">
                                    {err}
                                </FormDescription>
                            )}
                        </div>
                        <div className="w-full max-w-md flex flex-col gap-y-4">
                            <Button type="submit" disabled={isLoading}>{
                                isLoading ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Подождите
                                </> : 'Войти'
                            }</Button>
                            <Button variant="link">Забыли пароль ?</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
        </>
    )
}
