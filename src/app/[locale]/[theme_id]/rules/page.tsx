"use client"

import React, {useEffect, useState} from "react";
import {useTranslations} from "use-intl";
import {RulesTable} from "@/components/tables/rules-table";
import {usePathname} from "@/navigation";

export default function Page() {
  const t = useTranslations();
  const path = usePathname();
  const [themeId, setThemeId] = useState<string | null>(null);

  useEffect(() => {
    setThemeId(path.split('/')[1]);
  }, [path]);

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('rules')}
      </h3>
      {themeId && (
        <RulesTable id={themeId} />
      )}
    </div>
  )
}
