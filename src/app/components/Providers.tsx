'use client'
import { SessionProvider } from "next-auth/react"
import { NotificationProvider } from "./Notification"
import { ImageKitProvider } from "@imagekit/next"

export default function Providers({children}:{children:React.ReactNode}) {
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_BASE_URL || process.env.NEXT_PUBLIC_URL_ENDPOINT || "";
    return (
        <SessionProvider refetchInterval={5*60}>
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </ImageKitProvider>
        </SessionProvider>
    )
}