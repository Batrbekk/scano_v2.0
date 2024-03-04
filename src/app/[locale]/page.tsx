"use client"

import React from "react";
import {Map} from "@/components/kuryltai-component/map";

export default function Home() {

    return (
        <main className="flex h-screen flex-col items-center justify-center gap-y-8 px-4">
            <Map />
        </main>
    )
}
