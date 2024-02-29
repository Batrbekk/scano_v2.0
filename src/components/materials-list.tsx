import {MaterialCard} from "@/components/material-card";
import React, {useEffect, useState} from "react";
import {MaterialData} from "@/types";
import {env} from "@/env.mjs";
import {getCookie} from "cookies-next";
import {Skeleton} from "@/components/ui/skeleton";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useTranslations} from "use-intl";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem, PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {AlertTriangle} from "lucide-react";

export interface Props {
  theme_id: string
}

const listSize = ['5', '10', '20', '30', '40', '50'];

const MaterialsList: React.FC<Props> = ({theme_id}) => {
  const t = useTranslations();
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [materials, setMaterials] = useState<MaterialData[]>([]);

  const [count, setCount] = useState<string>('5');
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesArray, setPageArray] = useState<number[]>([]);

  const FormSchema = z.object({
    materials_id: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      materials_id: [],
    },
  });

  async function getMaterials() {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/materials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
        setPending(false);
      }
    } catch (err) {
      setPending(false);
      console.error(err);
    }
  }

  async function deleteCard(id: string) {
    setPending(true);
    setMaterials([]);
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        getMaterials();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleUpdate = () => {
    if (token && theme_id) {
      getMaterials();
    }
  };

  useEffect(() => {
    if (theme_id) {
      getMaterials()
    }
  }, [theme_id]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  function chooseAll () {
    const selectedMaterials = materials.slice(0, parseInt(count)).map(material => material._id);
    form.setValue('materials_id', selectedMaterials);
  }

  function deleteMaterial () {
    const materials = form.getValues('materials_id');
    materials.map((item) => {
      deleteCard(item);
    });
  }

  useEffect(() => {
    setPageCount(Math.ceil(materials.length / parseInt(count)));
  }, [materials, count]);

  useEffect(() => {
    const arr = Array.from({ length: pageCount }, (_, index) => index + 1);
    setPageArray(arr);
  }, [pageCount]);

  return (
    pending ? (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    ) : (
        materials.length > 0 ? (
            <div className="flex flex-col gap-y-8">
              <div className="flex flex-col gap-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                    <FormField
                        name="materials_id"
                        control={form.control}
                        render={() => (
                            <FormItem className="grid w-full items-center gap-1.5">
                              <div className="flex flex-col gap-4">
                                {materials.slice(0, parseInt(count)).map((item) => (
                                    <FormField
                                        key={item._id}
                                        name="materials_id"
                                        control={form.control}
                                        render={({field}) => {
                                          return (
                                              <FormItem
                                                  key={item._id}
                                                  className="flex items-start gap-x-2 rounded border p-4"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                      checked={field.value?.includes(item._id)}
                                                      onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...field.value, item._id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                    (value) => value !== item._id
                                                                )
                                                            )
                                                      }}
                                                  />
                                                </FormControl>
                                                <FormLabel className="font-normal w-full !m-0">
                                                  <MaterialCard
                                                      sentiment={item.sentiment}
                                                      key={item._id}
                                                      id={item._id}
                                                      title={item.title}
                                                      date={item.created_at}
                                                      text={item.description}
                                                      tags={item.tags}
                                                      img={item.img_url}
                                                      url={item.url}
                                                      src_name={item.source?.name}
                                                      updateTags={handleUpdate}
                                                  />
                                                </FormLabel>
                                              </FormItem>
                                          )
                                        }}
                                    />
                                ))}
                              </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between rounded">
                      <div className="flex items-center gap-x-4">
                        <Button onClick={chooseAll} variant="outline">{t('chooseAll')}</Button>
                        <Button onClick={() => {
                          form.setValue('materials_id', [])
                        }} variant="outline">{t('clearFilter')}</Button>
                        <Button onClick={deleteMaterial} variant="outline">{t('delete')}</Button>
                      </div>
                      {pagesArray.length > 1 && (
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                    disable={currentPage === 1}
                                    onClick={() => {
                                      if (currentPage === 1) {
                                        return
                                      } else {
                                        setCurrentPage(currentPage - 1);
                                      }
                                    }}
                                />
                              </PaginationItem>
                              {pagesArray.map((item) => (
                                  <PaginationItem className="cursor-pointer rounded border">
                                    <PaginationLink
                                        isActive={currentPage === item}
                                        text={item.toString()}
                                        className="rounded"
                                        onClick={() => {
                                          setCurrentPage(item);
                                        }}
                                    >
                                      {item}
                                    </PaginationLink>
                                  </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                    disable={currentPage === pagesArray.length}
                                    onClick={() => {
                                      if (currentPage === pagesArray.length) {
                                        return
                                      } else {
                                        setCurrentPage(currentPage + 1);
                                      }
                                    }}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                      )}
                      <Select value={count} onValueChange={setCount}>
                        <SelectTrigger className="w-[72px]">
                          <SelectValue placeholder="Select a fruit"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {listSize.map((item, index) => (
                                <SelectItem key={index} value={item}>
                                  {item}
                                </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center gap-y-4 rounded border p-4">
              <AlertTriangle size={32} />
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {t('noData')}
              </h4>
            </div>
        )
    )
  )
}

export {MaterialsList}
