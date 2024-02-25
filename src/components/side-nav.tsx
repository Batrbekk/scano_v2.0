"use client"

import {useTranslations} from "use-intl";
import {AreaChart, MailCheck, Mails, Minus, Newspaper, Plus, Scroll, Settings, Trash2} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {useEffect, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {usePathname, useRouter} from "@/navigation";
import {cn} from "@/lib/utils";
import {router} from "next/client";

const SideNav = () => {
  const router = useRouter();
  const t = useTranslations();
  const path = usePathname();

  const [lengthPath, setLengthPath] = useState(0);
  const [lastPage, setLastPage] = useState<string>('');
  const [themeId, setThemeId] = useState<string | null>(null);
  const [settingIsOpen, setSettingIsOpen] = useState<boolean>(false);
  const [materialIsOpen, setMaterialIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setLengthPath(path.split('/').length);
    setLastPage(path.split('/')[path.split('/').length - 1]);

    if (path.split('/').length === 2) {
      setMaterialIsOpen(true);
    }

  }, [path]);

  useEffect(() => {
    if (lastPage === 'createTag') {
      setMaterialIsOpen(false);
      setSettingIsOpen(true);
    }
    if (lastPage === 'editTheme') {
      setMaterialIsOpen(false);
      setSettingIsOpen(true);
    }
    if (lastPage === 'analytic') {
      setSettingIsOpen(false);
      setMaterialIsOpen(false);
    }
  }, [lastPage]);

  useEffect(() => {
    setThemeId(path.split('/')[1]);
  }, [path]);

  return (
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-y-6 mb-20">
          <div className="border-b">
            <div className="flex flex-col gap-y-4 p-4">
              <p className="text-lg font-semibold">{t('analytic')}</p>
              <div
                  className={cn(
                    'flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer',
                    lastPage === 'analytic' && 'bg-gray-200',
                  )}
                  onClick={() => {
                    router.push(`/${themeId}/analytic`);
                  }}
              >
                <AreaChart size={20}/>
                <p>{t('analytic')}</p>
              </div>
            </div>
          </div>
          <div className="border-b">
            <div className="flex flex-col gap-y-4 p-4 pt-0">
              <p className="text-lg font-semibold">{t('materials')}</p>
              <Collapsible className="w-full" open={materialIsOpen} onOpenChange={setMaterialIsOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer">
                    <div className="flex items-center gap-x-4">
                      <Newspaper size={20}/>
                      <p>{t('materials')}</p>
                    </div>
                    {materialIsOpen ? <Minus size={16}/> : <Plus size={16}/>}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="border-l ml-4">
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div
                      className={cn(
                        "flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer",
                        lengthPath === 2 && 'bg-gray-200 mb-2'
                      )}
                      onClick={() => {
                        router.push(`/${themeId}/`)
                      }}
                    >
                      {lengthPath === 2 && (
                          <Minus size={20}/>
                      )}
                      <p>{t('all')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                      <p>{t('processed')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                      <p>{t('unprocessed')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                      <p>{t('favorite')}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                <Mails size={20}/>
                <p>{t('news')}</p>
              </div>
              <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                <MailCheck size={20}/>
                <p>{t('subscribe')}</p>
              </div>
              <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                <Scroll size={20}/>
                <p>{t('journal')}</p>
              </div>
              <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                <Trash2 size={20}/>
                <p>{t('spam')}</p>
              </div>
            </div>
          </div>
          <div className="border-b">
            <div className="flex flex-col gap-y-4 p-4">
              <p className="text-lg font-semibold">{t('settings')}</p>
              <Collapsible className="w-full" open={settingIsOpen} onOpenChange={setSettingIsOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer">
                    <div className="flex items-center gap-x-4">
                      <Settings size={20}/>
                      <p>{t('settings')}</p>
                    </div>
                    {settingIsOpen ? <Minus size={16}/> : <Plus size={16}/>}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="border-l ml-4">
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div
                      className={cn(
                        'flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer',
                        lastPage === 'editTheme' && 'bg-gray-200 mb-2'
                      )}
                      onClick={() => {
                        router.push(`/${themeId}/edit/editTheme`);
                      }}
                    >
                      {lastPage === 'editTheme' && <Minus size={20} />}
                      <p>{t('profile')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                      <p>Пользователи</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                      <p>Интеграций</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
                      <p>Правила</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className={cn(
                      'flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer',
                      lastPage === 'createTag' && 'bg-gray-200 my-2'
                    )}>
                      {lastPage === 'createTag' && <Minus size={20} />}
                      <p>{t('createTag')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className={cn(
                      'flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer',
                    )}>
                      <p>Редактировать тему</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </ScrollArea>
  )
}

export {SideNav}
