"use client"

import {z} from "zod";
import {env} from "@/env.mjs";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import {Loader2} from "lucide-react";
import {useRouter} from "@/navigation";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form";

const formSchema = z.object({
    password: z.string().min(8, {
        message: 'Пароль должен содержать не менее 8 символов'
    }),
    confirmPassword: z.string()
});

export default function Page () {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [code, setCode] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    async function onSubmit (values: z.infer<typeof formSchema>) {
        if (values.password !== values.confirmPassword) {
            setErr('Пароли не совпадают, попробуйте еше раз!');
        } else {
            setErr(null);
            const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/set-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: values.password,
                    confirm_password: values.confirmPassword,
                    code: code
                }),
            });
            if (res.ok) {
                setErr(null);
                router.push('/');
            } else {
                setErr('Сервис временно не работает...')
            }
        }
    }

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            setCode(code);
        }
    }, []);

    return (
        <main className="flex flex-col h-screen items-center justify-center gap-y-8">
            <Image priority={true} src={Logo} alt="Logo"/>
            <div className="w-full max-w-md flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
                        <div className="flex flex-col gap-y-4">
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
                            <FormField
                                name="confirmPassword"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                id="confirmPassword"
                                                placeholder="Подтвердить пароль"
                                                type="password"
                                                autoCapitalize="none"
                                                autoComplete="password"
                                                autoCorrect="off"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {err && (
                                <FormDescription className="text-red-600">
                                    {err}
                                </FormDescription>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full max-w-md"
                        >{isLoading ?
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Подождите
                            </> : 'Сохранить'}
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
)
}