"use client"

import {useTranslations} from "use-intl";
import {AreaChart, MailCheck, Mails, Minus, Newspaper, Plus, Scroll, Settings, Trash2} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {useState} from "react";

const SideNav = () => {
  const t = useTranslations();

  const [materialIsOpen, setMaterialIsOpen] = useState<boolean>(false);
  const [settingIsOpen, setSettingIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="border-b">
        <div className="flex flex-col gap-y-4 p-4">
          <p className="text-lg font-semibold">{t('analytic')}</p>
          <div
            className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer"
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
              <div className="flex items-center justify-between p-2 rounded hover:bg-secondary cursor-pointer">
                <div className="flex items-center gap-x-4">
                  <Newspaper size={20}/>
                  <p>{t('materials')}</p>
                </div>
                {materialIsOpen ? <Minus size={16} /> : <Plus size={16} />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-l ml-4">
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <Minus size={20}/>
                  <p>{t('all')}</p>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <p>{t('processed')}</p>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <p>{t('unprocessed')}</p>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <p>{t('favorite')}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
            <Mails size={20}/>
            <p>{t('news')}</p>
          </div>
          <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
            <MailCheck size={20}/>
            <p>{t('subscribe')}</p>
          </div>
          <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
            <Scroll size={20}/>
            <p>{t('journal')}</p>
          </div>
          <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
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
              <div className="flex items-center justify-between p-2 rounded hover:bg-secondary cursor-pointer">
                <div className="flex items-center gap-x-4">
                  <Settings size={20}/>
                  <p>{t('settings')}</p>
                </div>
                {materialIsOpen ? <Minus size={16} /> : <Plus size={16} />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-l ml-4">
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <Minus size={20}/>
                  <p>{t('all')}</p>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <p>{t('processed')}</p>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <p>{t('unprocessed')}</p>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 ml-2">
                <div className="flex items-center gap-x-4 p-2 rounded hover:bg-secondary cursor-pointer">
                  <p>{t('favorite')}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}

export {SideNav}
