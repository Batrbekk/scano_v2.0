"use client"

import React, {useState} from "react";
import {useTranslations} from "use-intl";
import {ChevronDown, ChevronUp, Info} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";

export default function Page () {
    const t = useTranslations();

    const themeType = [
        {
            label: t('all'),
            key: 'all'
        },
        {
            label: t('news'),
            key: 'news'
        },
        {
            label: t('social'),
            key: 'social_network'
        }
    ];

    const themeSrc = [
        {
            label: t('all'),
            key: 'all'
        },
        {
            label: t('news'),
            key: 'news'
        },
        {
            label: t('social'),
            key: 'social_network'
        },
        {
            label: t('videoInWeb'),
            key: 'video'
        },
        {
            label: t('channelsInMessengers'),
            key: 'messenger_chanel'
        },
        {
            label: t('groupsInMessengers'),
            key: 'messenger_group'
        }
    ];

    const searchArea = [
        {
            label: t('textMessage'),
            key: 'material_text'
        },
        {
            label: t('textPicture'),
            key: 'picture_text'
        },
        {
            label: t('videoTranscript'),
            key: 'video_transcription'
        }
    ];

    const materialTypes = [
        {
            key: 'post',
            label: t('post')
        },
        {
            key: 'comment',
            label: t('comments')
        },
        {
            key: 'repost',
            label: t('repost')
        },
        {
            key: 'stories',
            label: t('stories')
        }
    ];

    const langs = [
        {
            key: 'ru',
            label: t('ru')
        },
        {
            key: 'kk',
            label: t('kk')
        },
        {
            key: 'en',
            label: t('en')
        }
    ];

    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [langTheme, setLangTheme] = useState<string>(langs[0].key);
    const [srcTheme, setSrcTheme] = useState<string>(themeSrc[0].key);
    const [excludeSrc, setExcludeSrc] = useState<string>('');
    const [minusWords, setMinusWords] = useState<string>('');
    const [searchWords, setSearchWords] = useState<string>('');
    const [themeTypeValue, setThemeTypeValue] = useState<string>('');

    const [searchAreaValue, setSearchAreaValue] = useState<string[]>([]);

    const onChangeSearchArea = (key: string) => {
        console.log(key);
    }

    async function createTheme () {
        console.log('name: ',name);
        console.log('themeType: ',themeTypeValue);
        console.log('searchWords: ',searchWords);
        console.log('minusWords: ', minusWords);
        console.log('lang: ', langTheme);
        console.log('excludeWords: ', excludeSrc);
    }

    return (
        <div className="py-4 flex flex-col gap-y-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {t('addTheme')}
            </h3>
            <div className="flex items-start gap-x-8 w-full mb-20">
                <div className="p-4 rounded border w-2/3 flex flex-col gap-y-8">
                    <div className="flex items-center gap-x-4">
                        <div className="grid items-center gap-1.5 w-2/3">
                            <Label>{t('themeName')}</Label>
                            <Input
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                }}
                                type="text"
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="grid items-center gap-1.5 w-1/3">
                            <Label>{t('themeType')}</Label>
                            <Select value={themeTypeValue} onValueChange={setThemeTypeValue}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('chooseThemeType')} className="uppercase"/>
                                    <SelectContent>
                                        <SelectGroup>
                                            {themeType.map((item) => (
                                                <SelectItem value={item.key}
                                                            key={item.key}>{item.label}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </SelectTrigger>
                            </Select>
                        </div>
                    </div>
                    <h4 className="text-lg font-semibold">{t('searchRequest')}</h4>
                    <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label>{t('searchWords')}</Label>
                            <Label>{t('searchLimit', {limit: 20})}</Label>
                        </div>
                        <Textarea
                            value={searchWords}
                            onChange={(event) => {setSearchWords(event.target.value)}}
                            className="resize-none"
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label>{t('minusWord')}</Label>
                            <Label>{t('searchLimit', {limit: 50})}</Label>
                        </div>
                        <Textarea
                            value={minusWords}
                            onChange={(event) => {setMinusWords(event.target.value)}}
                            className="resize-none"
                        />
                    </div>
                    <div className="grid items-center gap-1.5 w-full">
                        <Label>{t('srcFilterTab')}</Label>
                        <Select value={srcTheme} onValueChange={setSrcTheme}>
                            <SelectTrigger>
                                <SelectValue defaultValue={themeSrc[0].key} className="uppercase"/>
                                <SelectContent>
                                    <SelectGroup>
                                        {themeSrc.map((item) => (
                                            <SelectItem value={item.key}
                                                        key={item.key}>{item.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </SelectTrigger>
                        </Select>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <h4 className="text-lg font-semibold">{t('filters')}</h4>
                        <Button variant="outline" className="p-2 h-8" onClick={() => setShowFilter(!showFilter)}>
                            {showFilter ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </Button>
                    </div>
                    {showFilter && (
                        <>
                            <div className="grid w-full items-center gap-3">
                                <Label>{t('searchArea')}</Label>
                                <div className="flex items-center gap-x-4">
                                    {materialTypes.map((item) => (
                                        <div className="flex items-center space-x-2" key={item.key}>
                                            <Checkbox id={item.key}/>
                                            <label
                                                htmlFor={item.key}
                                                className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {item.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label>{t('typeMessage')}</Label>
                                <div className="flex items-center gap-x-4">
                                    {searchArea.map((item) => (
                                        <div className="flex items-center space-x-2" key={item.key}>
                                            <Checkbox
                                                onCheckedChange={() => {
                                                    console.log('asd');
                                                    console.log(item.key)
                                                }}
                                                id={item.key}
                                            />
                                            <label
                                                htmlFor={item.key}
                                                className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {item.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full grid items-center gap-1.5">
                                <Label htmlFor="picture">{t('langs')}</Label>
                                <Select value={langTheme} onValueChange={setLangTheme}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('filterLangPlaceholder')} className="uppercase"/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {langs.map((item) => (
                                                    <SelectItem value={item.key}
                                                                key={item.key}>{item.label}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </SelectTrigger>
                                </Select>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label>{t('excludeSrc')}</Label>
                                    <Label>{t('excludeSrcLimit', {limit: 20})}</Label>
                                </div>
                                <Textarea
                                    value={excludeSrc}
                                    onChange={(event) => {setExcludeSrc(event.target.value)}}
                                    className="resize-none"
                                />
                            </div>
                        </>
                    )}
                    <div className="flex items-start gap-x-4">
                        <Info size={32}/>
                        <code className="relative rounded bg-muted p-2 w-full font-semibold">
                            {t('createThemeInfo')}
                        </code>
                    </div>
                    <Button onClick={createTheme} className="w-fit">{t('createTheme')}</Button>
                </div>
                <div className="p-4 rounded border w-1/3">
                    <div className="flex items-start gap-x-4">
                        <Info size={32}/>
                        <div className="flex flex-col gap-y-4 w-[90%]">
                            <code className="relative rounded bg-muted p-2 w-full font-semibold">
                                {t('createThemeInfo1')}
                                <TooltipProvider>
                                    <Tooltip delayDuration={400}>
                                        <TooltipTrigger>
                                            <code className="underline ml-2">
                                                {t('details')}
                                            </code>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            asd
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </code>
                            <code className="relative rounded bg-muted p-2 w-full font-semibold">
                                {t('description')}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <code className="underline ml-2">
                                                {t('createThemeInfo2')}
                                            </code>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            asd
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </code>
                            <code className="relative rounded bg-muted p-2 w-full font-semibold">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <code className="underline">{t('detailedGuide')}</code>
                                        </TooltipTrigger>
                                            <TooltipContent>
                                                asd
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <code className="ml-2">{t('createThemeInfo3')}</code>
                                </code>
                                <code className="relative rounded bg-muted p-2 w-full font-semibold">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <code className="underline mr-2">{t('createThemeCheck')}</code>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                asd
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {t('createThemeInfo4')}
                                </code>
                                <code className="relative rounded bg-muted p-2 w-full font-semibold">
                                    {t('createThemeInfo5')}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <code className="underline ml-2">{t('detailedAboutRule')}</code>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                asd
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </code>
                                <code className="relative rounded bg-muted p-2 w-full font-semibold">
                                    {t('createThemeInfo6')}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <code className="ml-2 underline">{t('details')}</code>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                asd
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </code>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}