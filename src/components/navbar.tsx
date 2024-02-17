"use client"

import React, {useEffect, useState, useTransition} from 'react';
import Image from "next/image";
import {User} from "lucide-react";
import {LogOut} from "lucide-react";
import Logo from "../../public/logo.svg";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import {env} from "@/env.mjs";
import {usePathname, useRouter} from "@/navigation";
import {deleteCookie, getCookie} from "cookies-next";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useLocale} from "use-intl";

export interface AuthNavProps {
    pending: boolean,
    name?: string,
    surname?: string,
    mail?: string,
    role?: string,
    img?: string | null
}

const Navbar: React.FC<AuthNavProps> = (
    {
        pending,
        name,
        surname,
        mail,
        role,
        img
    }) => {
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const router = useRouter();
    const token = getCookie('scano_acess_token');
    const [ava, setAva] = useState<string | null>(null);

    async function getUserAva(img: string) {
        try {
            const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/files/${img}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setAva(res.url);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onChangeLang = (value: string) => {
        startTransition(() => {
            router.replace(pathname, {locale: value});
        });
    }

    useEffect(() => {
        if (img) {
            getUserAva(img);
        }
    }, [img]);
    return (
        <nav className="flex items-center justify-between border-b h-16 px-4">
            <Image priority={true} src={Logo} height={42} alt="logo" />
            <div className="flex items-center gap-x-8">
                <Select value={locale} onValueChange={onChangeLang}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder={locale} className="uppercase" />
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="kk">KK</SelectItem>
                                <SelectItem value="ru">RU</SelectItem>
                                <SelectItem value="en">EN</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </SelectTrigger>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-x-4 cursor-pointer">
                            <Avatar>
                                {ava ? (
                                    <div className="w-9 h-9 rounded-full overflow-hidden">
                                        <Image src={ava} alt="ava" width={40} height={42} />
                                    </div>
                                ) : (
                                    <AvatarFallback>
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            {pending ? (
                                <Skeleton className="h-4 w-[150px]" />
                            ) : (
                                <p className="leading-7 font-semibold">{name} {surname}</p>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mt-2">
                        <DropdownMenuLabel>
                            <p className="text-lg">{mail}</p>
                            <p className="text-sm font-light">{role}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-x-2">
                                <User />
                                Профиль
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-x-2" onClick={() => {
                                deleteCookie('scano_acess_token');
                                router.replace('/');
                            }}>
                                <LogOut />
                                Выйти
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export {Navbar};