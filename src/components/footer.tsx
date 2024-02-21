"use client"

import {Button} from "@/components/ui/button";
import {useTranslations} from "use-intl";

const Footer = () => {
    const t = useTranslations();

    return (
        <div className="flex justify-between items-center w-full h-16 px-4 border-t fixed bottom-0 z-50 bg-white">
            <Button variant="link" className="text-lg font-semibold p-0">{t('technicalSupport')}</Button>
            <h2 className="text-lg font-semibold">© 2023 Infinity Enterprises</h2>
        </div>
    )
}

export { Footer }
