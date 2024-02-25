"use client"

import {Info} from "lucide-react";
import {useTranslations} from "use-intl";
import {ArchiveTable} from "@/components/tables/archvie-table";

export default function Page () {
    const t = useTranslations();

    return (
        <div className="py-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{t('archiveReport')}</h3>
                <div className="rounded border p-2 flex items-center gap-x-2">
                    <Info size={24} />
                    <p>{t('reportInfo')}</p>
                </div>
            </div>
            <ArchiveTable />
        </div>
    )
}
