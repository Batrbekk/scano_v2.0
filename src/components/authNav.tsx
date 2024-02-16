"use client"

import React from 'react';
import Image from "next/image";
import {User} from "lucide-react";
import {LogOut} from "lucide-react";
import Logo from "../../public/logo.svg";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";

export interface AuthNavProps {
    pending: boolean,
    name?: string,
    surname?: string,
    mail?: string,
    role?: string,
}

const AuthNav: React.FC<AuthNavProps> = ({pending, name, surname, mail, role}) => {
    return (
        <nav className="flex items-center justify-between border-b h-16 px-4">
            <Image priority={true} src={Logo} height={42} alt="logo" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-x-4 cursor-pointer">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png"/>
                            <AvatarFallback>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </AvatarFallback>
                        </Avatar>
                        {
                            pending ? (
                                <Skeleton className="h-4 w-[150px]" />
                            ) : (
                                <p className="leading-7 font-semibold">{name} {surname}</p>
                            )
                        }
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        {mail}
                        <p className="text-sm font-light">{role}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-x-2">
                            <User />
                            Профиль
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-x-2">
                            <LogOut />
                            Выйти
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}

export {AuthNav};