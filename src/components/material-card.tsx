import React, {useEffect, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import { format } from "date-fns";
import {useRouter} from "next/navigation";
import {Frown, Meh, Plus, Share, Smile, Star, Trash2, X} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useTranslations} from "use-intl";
import {cn} from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {env} from "@/env.mjs";
import {getCookie} from "cookies-next";
import Image from "next/image";
import {Skeleton} from "@/components/ui/skeleton";
import {ScrollArea} from "@/components/ui/scroll-area";

interface Props {
  id: string;
  title: string;
  date: string;
  text: string;
  tags: any;
  img: string | null | undefined;
  url: string;
  src_name: string;
  updateTags: () => void;
  sentiment: string;
}

const MaterialCard: React.FC<Props> = ({id, sentiment, title,date,text,tags,img, url, src_name, updateTags}) => {
  const t = useTranslations();
  const router = useRouter();

  const token = getCookie('scano_acess_token');
  const [tone, setTone] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  async function getPhoto(img: string) {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/files/${img}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPhoto(res.url);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteCard(id: string) {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        updateTags();
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    setTone(sentiment);
    if (img) {
      getPhoto(img);
    }
  }, [sentiment, img]);

  const changeTone = (tone: string) => {
    setTone(tone);
  }

  return(
      <div className="border p-4 rounded flex items-start gap-x-2">
        {}
        <Checkbox className="mt-0.5"/>
        <div className="w-full flex items-start justify-between gap-x-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-4">
              <small className="font-medium">Источник: {src_name}</small>
              <small className="flex items-center gap-x-1">Ссылка: <a href={url} target="_blank" className="flex p-0 h-fit truncate w-24 text-right underline">{url}</a></small>
              <small>{t('time')}: {format(new Date(date), 'dd.MM.yyyy HH:mm')}</small>
            </div>
            <div className="w-full flex flex-col items-start gap-y-2">
              <h4 className="text-lg font-semibold">{title}</h4>
              <small className="truncate max-w-96">{text}</small>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="link" className="p-0 underline">{t('showAllText')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-xl h-1/2">
                  <AlertDialogHeader className="flex flex-row justify-between items-center w-full">
                    <h4 className="scroll-m-20 text-xl font-medium tracking-tight">{t('allText')}</h4>
                    <Button variant="ghost" className="w-fit p-0 h-4 !mt-0">
                      <X size={16} />
                    </Button>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    <ScrollArea className="h-[260px] shadow-inner">
                      {text}
                    </ScrollArea>
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t('close')}
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className="flex items-center gap-x-2">
                <Button variant="link" className="flex items-center gap-x-1 p-0">
                  <Plus size={12} />
                  {t('addTag')}
                </Button>
              </div>
            </div>
          </div>
          <div className="w-1/4 flex flex-col items-end gap-y-4">
            <div className="flex items-center gap-x-2">
              <Popover>
                <PopoverTrigger>
                  <TooltipProvider>
                    <Tooltip delayDuration={400}>
                      <TooltipTrigger>
                        <Button variant="outline" size="sm">
                          {tone === 'negative' && (<Frown size={16}/>)}
                          {tone === 'neutral' && (<Meh size={16}/>)}
                          {tone === 'positive' && (<Smile size={16}/>)}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t(tone)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex items-center gap-x-4">
                    <Button onClick={() => {
                      changeTone('negative')
                    }} variant="outline" size="sm"
                            className={cn(tone === 'negative' && 'bg-red-500 hover:bg-red-500 text-white hover:text-white')}>
                      <Frown size={16}/>
                    </Button>
                    <Button onClick={() => {
                      changeTone('neutral')
                    }} variant="outline" size="sm"
                            className={cn(tone === 'neutral' && 'bg-blue-500 hover:bg-blue-500 text-white hover:text-white')}>
                      <Meh size={16}/>
                    </Button>
                    <Button onClick={() => {
                      changeTone('positive')
                    }} variant="outline" size="sm"
                            className={cn(tone === 'positive' && 'bg-primeGreen hover:bg-primeGreen text-white hover:text-white')}>
                      <Smile size={16}/>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <TooltipProvider>
                <Tooltip delayDuration={400}>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm" onClick={() => {
                      setIsFavorite(!isFavorite)
                    }}>
                      <Star className={cn(isFavorite ? 'fill-amber-300 stroke-amber-300' : '')} size={16}/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('saved')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={400}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm">
                      <Share size={16}/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('share')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialog>
                <AlertDialogTrigger>
                  <TooltipProvider delayDuration={400}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="outline" size="sm">
                          <Trash2 size={16}/>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('delete')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-lg">
                  <AlertDialogHeader className="flex flex-row items-center justify-between">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('confirmDelete', {item: t('material')})}</h4>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('close')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {deleteCard(id)}}>{t('yes')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {photo ? (
                <div className="rounded overflow-hidden w-fit border border-black">
                  <Image src={photo} alt="material img" width={200} height={100}/>
                </div>
            ) : (
                <Skeleton className="w-[200px] h-[100px]"/>
            )}
          </div>
        </div>
      </div>
  )
}

export {MaterialCard}
