"use client"

import {Button} from "@/components/ui/button";

const Footer = () => {
    return (
        <div className="flex justify-between items-center w-full h-16 px-4 border-t">
            <Button variant="link" className="text-lg font-semibold p-0">Техническая поддержка</Button>
            <h2 className="text-lg font-semibold">© 2023 Infinity Enterprises</h2>
        </div>
    )
}

export { Footer }