"use client"

import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {usePathname} from "@/navigation";
import {NotificationTable} from "@/components/tables/notification-table";

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
        {t('notification')}
      </h3>
      {themeId && (
        <NotificationTable id={themeId} />
      )}
    </div>
  )
}
