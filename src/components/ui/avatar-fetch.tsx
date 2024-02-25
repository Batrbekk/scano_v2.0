"use client"

import React, {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import Image from "next/image";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import {UserRound} from "lucide-react";

interface Props {
  img_name: string
}

const AvatarFetch: React.FC<Props> = ({img_name}) => {
  const token = getCookie('scano_acess_token');
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(true);

  const getImg = async () => {
    try {
      const res = await fetch(`https://scano-0df0b7c835bf.herokuapp.com/files/${img_name}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      if (res.ok) {
        setPending(false);
        setCurrentImg(res.url);
      }
    } catch (e) {
      setPending(false);
      console.error(e);
    }
  };

  useEffect(() => {
    if (img_name) {
      getImg();
    } else {
      setPending(false);
    }
  }, [img_name]);

  return (
    <Avatar>
      {pending ? (
        <AvatarFallback>
          <Skeleton className="h-12 w-12 rounded-full"/>
        </AvatarFallback>
      ) : (currentImg ? (
        <div className="w-9 h-9 rounded-full overflow-hidden bg-g">
          <Image src={currentImg} alt="ava" width={40} height={42}/>
        </div>
        ) : (
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200">
          <UserRound size={20} />
        </div>
)
      )}
    </Avatar>
  )
}

export {AvatarFetch}
