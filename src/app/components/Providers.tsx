'use client'
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { ImageKitProvider } from "@imagekit/next"

export default function Providers({children}:{children:React.ReactNode}) {
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_BASE_URL!
    return (
        <SessionProvider refetchInterval={5*60}>
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                {children}
                <Toaster 
                    position="bottom-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#FFFFFF',
                            color: '#111827',
                            border: '1px solid #E5E7EB',
                        },
                        success: {
                            iconTheme: {
                                primary: '#16A34A',
                                secondary: '#FFFFFF',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#DC2626',
                                secondary: '#FFFFFF',
                            },
                        },
                    }}
                />
            </ImageKitProvider>
        </SessionProvider>
    )
}