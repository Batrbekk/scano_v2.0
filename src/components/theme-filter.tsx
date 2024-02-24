import {useTranslations} from "use-intl";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Filter, FilterX, X} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Checkbox} from "@/components/ui/checkbox";
import React, {useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";

interface Props {
  onlyButton: boolean
}


const ThemeFilter: React.FC<Props> = ({onlyButton}) => {
  const t = useTranslations();

  const toneOption = [
    {
      key: 'positive',
      label: t('positiveNotation'),
    },
    {
      key: 'negative',
      label: t('negativeNotation'),
    },
    {
      key: 'neutral',
      label: t('neutralNotation'),
    }
  ];
  const materialType = [
    {
      label: t('post'),
      key: 'post'
    },
    {
      label: t('repost'),
      key: 'repost'
    },
    {
      label: t('comments'),
      key: 'comment'
    },
    {
      label: t('stories'),
      key: 'stories'
    }
  ];
  const lang = [
    {
      label: 'Қазақша',
      key: 'kk'
    },
    {
      label: 'Русский',
      key: 'ru'
    },
    {
      label: 'English',
      key: 'en'
    }
  ];
  const collection = [
    {
      label: t('social'),
      key: 'social_network'
    },
    {
      label: t('video'),
      key: 'video'
    },
    {
      label: t('messengerChanel'),
      key: 'messenger_chanel'
    },
    {
      label: t('messengerGroup'),
      key: 'messenger_group'
    },
    {
      label: t('news'),
      key: 'news'
    }
  ];

  const FormSchema = z.object({
    tone: z.array(z.string()),
    material_type: z.array(z.string()),
    language: z.array(z.string()),
    source_type: z.array(z.string())
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tone: [],
      material_type: [],
      language: [],
      source_type: []
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 items-end w-full">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex items-center gap-x-2 w-fit">
              <Filter size={16}/>
              {t('filter')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader className="flex flex-row items-center justify-between w-full">
              <p className="text-lg font-medium">{t('filters')}</p>
              <div className="flex items-center gap-x-4">
                <AlertDialogCancel className="gap-x-2">
                  <X size={16}/>
                  {t('close')}
                </AlertDialogCancel>
                <Button variant="outline" className="gap-x-2">
                  <FilterX size={16}/>
                  {t('clearFilter')}
                </Button>
                <Button variant="outline" className="gap-x-2">
                  <Filter size={16}/>
                  {t('apply')}
                </Button>
              </div>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Tabs defaultValue="main">
                <TabsList className="w-full flex items-center justify-between">
                  <TabsTrigger value="main">
                    {t('mainFilterTab')}
                  </TabsTrigger>
                  <TabsTrigger value="source">
                    {t('srcFilterTab')}
                  </TabsTrigger>
                  <TabsTrigger value="authors">
                    {t('authorFilterTab')}
                  </TabsTrigger>
                  <TabsTrigger value="geo">
                    {t('geoFilterTab')}
                  </TabsTrigger>
                  <TabsTrigger value="tags">
                    {t('tagFilterTab')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="main">
                  <div className="flex flex-col gap-y-4">
                    <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                      <small className="text-sm font-medium leading-none text-black">{t('tone')}</small>
                      <div className="flex items-center gap-x-4">
                        {toneOption.map((item) => {
                          return (
                            <div key={item.key} className="flex items-center space-x-2">
                              <Checkbox id={item.key}/>
                              <label
                                htmlFor={item.key}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {item.label}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                      <small className="text-sm font-medium leading-none text-black">{t('materialType')}</small>
                      <div className="flex items-center gap-x-4">
                        {materialType.map((item) => {
                          return (
                            <div key={item.key} className="flex items-center space-x-2">
                              <Checkbox id={item.key}/>
                              <label
                                htmlFor={item.key}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {item.label}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                      <small className="text-sm font-medium leading-none text-black">{t('materialLang')}</small>
                      <div className="flex items-center gap-x-4">
                        {lang.map((item) => {
                          return (
                            <div key={item.key} className="flex items-center space-x-2">
                              <Checkbox id={item.key}/>
                              <label
                                htmlFor={item.key}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {item.label}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="bg-secondary p-4 rounded flex flex-col gap-y-4">
                      <small className="text-sm font-medium leading-none text-black">{t('srcType')}</small>
                      <div className="flex flex-wrap items-center gap-4">
                        {collection.map((item) => {
                          return (
                            <div key={item.key} className="flex items-center space-x-2">
                              <Checkbox id={item.key}/>
                              <label
                                htmlFor={item.key}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {item.label}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="source">
                  source
                </TabsContent>
                <TabsContent value="authors">
                  authors
                </TabsContent>
                <TabsContent value="geo">
                  geo
                </TabsContent>
                <TabsContent value="tags">
                  tags
                </TabsContent>
              </Tabs>
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
        {!onlyButton && (
          <div className="rounded border p-4 flex flex-col gap-y-4 w-full">
            <div className="flex flex-col gap-y-2.5 pb-4 border-b">
              <h4 className="text-lg font-semibold">
                {t('tone')}
              </h4>
              <FormField
                name="tone"
                control={form.control}
                render={() => (
                  <FormItem>
                    {toneOption.map((item) => (
                      <FormField
                        key={item.key}
                        name="tone"
                        control={form.control}
                        render={({field}) => {
                          return (
                            <FormItem
                              key={item.key}
                              className="flex items-center gap-x-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.key)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.key])
                                      : field.onChange(field.value?.filter((value) => value !== item.key))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="!m-0">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-2.5 pb-4 border-b">
              <h4 className="text-lg font-semibold">
                {t('materialType')}
              </h4>
              {materialType.map((item) => {
                return (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox id={item.key}/>
                    <label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-y-2.5 pb-4 border-b">
              <h4 className="text-lg font-semibold">
                {t('materialLang')}
              </h4>
              {lang.map((item) => {
                return (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox id={item.key}/>
                    <label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-y-2.5">
              <h4 className="text-lg font-semibold">
                {t('srcType')}
              </h4>
              {collection.map((item) => {
                return (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox id={item.key}/>
                    <label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
            <Button>{t('apply')}</Button>
          </div>
        )}
      </form>
    </Form>
  )
}

export {ThemeFilter}
