"use client"

import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {usePathname} from "@/navigation";
import {SubscribeTable} from "@/components/tables/subscribe-table";

export default function Page () {
  const t = useTranslations();
  const path = usePathname();
  const [themeId, setThemeId] = useState<string | null>(null);

  useEffect(() => {
    setThemeId(path.split('/')[1]);
  }, [path]);


  return(
    <div className="flex flex-col gap-y-8 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('subscribe')}
      </h3>
      {themeId && (
        <SubscribeTable id={themeId} />
      )}
    </div>
  )
}
