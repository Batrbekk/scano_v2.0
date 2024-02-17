"use client"

import React, {useEffect, useState} from 'react';
import {Group} from "lucide-react";
import {useTranslations} from "use-intl";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ThemeData} from "@/types";
import {env} from "@/env.mjs";
import {getCookie} from "cookies-next";
import {DataTableDemo} from "@/components/ui/data-table";

export default function Main() {
    const t = useTranslations();

    const token = getCookie('scano_acess_token');
    const [pending, setPending] = useState<boolean>(true);
    const [themes, setThemes] = useState<ReadonlyArray<ThemeData>>([]);

    async function getThemesData() {
        const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            setThemes(data);
            setPending(false);
        } else {
            setPending(false);
            console.error('Get themes data ERROR');
        }
    }

    useEffect(() => {
        getThemesData()
    }, []);

    return (
        <div className="py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-8">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tigh">{t('theme')}</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Progress className="h-3 w-36" color="#60CA23" value={33} />
                            </TooltipTrigger>
                            <TooltipContent>
                                {t('progressTooltip', {balance: 33, limit: 100})}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button>
                        {t('createTheme')}
                    </Button>
                </div>
                <div className="flex items-center gap-x-8">
                    <div className="flex items-center gap-x-2 cursor-pointer">
                        <Group size={16} />
                        {t('groupNotation')}
                    </div>
                    <div className="flex items-center gap-x-2 cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-primeGreen" />
                        {t('positiveNotation')}
                    </div>
                    <div className="flex items-center gap-x-2 cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        {t('negativeNotation')}
                    </div>
                    <div className="flex items-center gap-x-2 cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        {t('neutralNotation')}
                    </div>
                </div>
            </div>
            <div>
                <DataTableDemo />
            </div>
        </div>
    )
}