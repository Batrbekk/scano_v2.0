"use client"

import {z} from "zod";
import {env} from "@/env.mjs";
import Image from "next/image";
import {Loader2} from "lucide-react";
import Logo from "@/public/logo.svg";
import React, {useState} from "react";
import {useRouter} from "@/navigation";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form";

const formSchema = z.object({
    mail: z.string().min(1, {
        message: 'Введите корректный email'
    })
});

export default function Page() {
    const router = useRouter();
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mail: '',
        }
    });

    async function onSubmit (values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.mail,
            }),
        });
        if (res.ok) {
            setErr(null);
            router.push(`/`);
        } else {
            setErr('Сервис временно не работает...');
            setIsLoading(false);
            console.error('Forgot-password failed');
        }
    }

    return (
        <main className="flex h-screen flex-col items-center justify-center gap-y-8">
            <Image priority={true} src={Logo} alt="Logo"/>
            <div className="w-full max-w-md flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
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
                        >
                        </FormField>
                        {err && (
                            <FormDescription className="text-red-600">
                                {err}
                            </FormDescription>
                        )}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full max-w-md"
                        >{isLoading ?
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Подождите
                            </> : 'Отправить письмо'}
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}