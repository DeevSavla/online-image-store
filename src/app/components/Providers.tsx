'use client'
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { ImageKitProvider } from "@imagekit/next"

export default function Providers({children}:{children:React.ReactNode}) {
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_BASE_URL || process.env.NEXT_PUBLIC_URL_ENDPOINT || "";
    return (
        <SessionProvider refetchInterval={5*60}>
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                {children}
                <Toaster 
                    position="bottom-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1f2937',
                            color: '#fff',
                            border: '1px solid #374151',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </ImageKitProvider>
        </SessionProvider>
    )
}