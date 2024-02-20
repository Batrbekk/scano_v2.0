"use client"

import React from 'react';
import {Group} from "lucide-react";
import {useTranslations} from "use-intl";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ThemesTable} from "@/components/themes-table";
import {router} from "next/client";
import {useRouter} from "@/navigation";

export default function Main() {
    const t = useTranslations();
    const router = useRouter();

    return (
        <div className="py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-8">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tigh">{t('theme')}</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Progress className="h-3 w-36" value={33} />
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
            <ThemesTable />
            <div className="flex items-center justify-between w-full pt-4">
                <div className="flex items-center gap-x-4">
                    <Button>{t('createTheme')}</Button>
                    <Button onClick={() => {router.push('/main/search-archive')}}>{t('searchByYear')}</Button>
                </div>
                <div className="flex items-center gap-x-8">
                    <Button
                        className="p-0"
                        variant="link"
                        onClick={() => {router.push('/main/archive')}}
                    >
                        {t('archiveCollection')}
                    </Button>
                    <Button
                        className="p-0"
                        variant="link"
                        onClick={() => {router.push('/main/add-message-theme')}}
                    >
                        {t('addMessageTopic')}
                    </Button>
                    <Button className="p-0" variant="link">{t('copyThemeSetting')}</Button>
                    <Button
                        className="p-0"
                        variant="link"
                        onClick={() => {router.push('/main/report-archive')}}
                    >
                        {t('archiveReport')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
