import {MaterialCard} from "@/components/material-card";
import React, {useEffect, useState} from "react";
import {MaterialData} from "@/types";
import {env} from "@/env.mjs";
import {getCookie} from "cookies-next";
import {Skeleton} from "@/components/ui/skeleton";

export interface Props {
  theme_id: string
}

const MaterialsList: React.FC<Props> = ({theme_id}) => {
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(true);
  const [materials, setMaterials] = useState<MaterialData[]>([]);

  const [count, setCount] = useState(5);
  const [pageCount, setPageCount] = useState<number>(0);

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

  useEffect(() => {
    setPageCount(Math.ceil(materials.length / count))
  }, [materials, count]);

  return (
    pending ? (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    ) : (
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            {materials.slice(0, 5).map((item) => {
              return (
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
              );
            })}
          </div>
        </div>
    )
  )
}

export {MaterialsList}
