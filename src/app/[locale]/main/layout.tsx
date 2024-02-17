"use client"

import {env} from "@/env.mjs";
import {useEffect, useState} from "react";
import {UserData} from "@/types";
import {getCookie} from "cookies-next";
import {Footer} from "@/components/footer";
import {Navbar} from "@/components/navbar";
import {useRouter} from "next/navigation";

export default function DashboardLayout({children,}: { children: React.ReactNode }) {
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
        <>
            <Navbar
                pending={pending}
                name={userData?.first_name}
                surname={userData?.last_name}
                mail={userData?.email}
                role={userData?.role}
                img={userData?.photo_url}
            />
            <main className="px-8">
                {children}
            </main>
            <Footer />
        </>
    )
}