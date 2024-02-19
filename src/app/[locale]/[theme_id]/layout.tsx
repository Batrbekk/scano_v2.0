"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getCookie, setCookie} from "cookies-next";
import {UserData} from "@/types";
import {env} from "@/env.mjs";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {SideNav} from "@/components/ui/side-nav";

export default function Layout({children,}: { children: React.ReactNode }) {
  const router = useRouter();
  const token = getCookie('scano_acess_token');
  const [pending, setPending] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  async function getUserData() {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      setUserData(data);
      setPending(false);
      setCookie('userData', data);
    } else {
      setPending(false);
      console.error('Get user data ERROR');
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);
  return (
    <div  className="h-screen">
      <Navbar
        pending={pending}
        name={userData?.first_name}
        surname={userData?.last_name}
        mail={userData?.email}
        role={userData?.role}
        img={userData?.photo_url}
        isDashboard={true}
      />
      <main className="h-[93%]">
        <ResizablePanelGroup
          direction="horizontal"
          className="items-stretch"
        >
          <ResizablePanel
            defaultSize={15}
            className="border-r"
          >
            <SideNav />
          </ResizablePanel>
          <ResizablePanel
            defaultSize={85}
          >
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
