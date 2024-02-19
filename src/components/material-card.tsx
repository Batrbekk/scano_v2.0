import React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import { format } from "date-fns";
import {useRouter} from "next/navigation";
import {Share, Star} from "lucide-react";

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
}

const MaterialCard: React.FC<Props> = ({id, title,date,text,tags,img, url, src_name, updateTags}) => {
  const router = useRouter();

  return(
    <div className="border p-4 rounded flex items-start gap-x-2">
      {}
      <Checkbox className="mt-0.5" />
      <div className="w-full flex flex-col gap-y-4">
        <div className="flex items-center gap-x-4">
          <small className="font-medium">Источник: {src_name}</small>
          <small>Ссылка: <Button onClick={() => {
            window.open (url, '_ blank');
          }} className="p-0 h-fit" variant="link">{url}</Button></small>
          <small>{format(new Date(date), 'dd.MM.yyyy HH:mm')}</small>
        </div>
        <div className="flex items-start gap-x-4">
          <div className="w-full flex flex-col gap-y-2">
            <h4 className="text-lg font-semibold">{title}</h4>
            <small className="truncate max-w-96">{text}</small>
          </div>
          <div className="w-1/4">
            <div className="flex items-center gap-x-2">
              <Star size={16} />
              <Share size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {MaterialCard}
