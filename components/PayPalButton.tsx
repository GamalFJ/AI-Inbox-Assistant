"use client"

import { useEffect, useRef } from "react"

// Extend Window to satisfy TypeScript
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paypal?: any
    }
}

/**
 * Renders the PayPal hosted button.
 * The SDK script is loaded once in the root layout; this component just
 * mounts the button into the container div after the SDK is ready.
 */
export default function PayPalButton() {
    const containerRef = useRef<HTMLDivElement>(null)
    const rendered = useRef(false)

    useEffect(() => {
        if (rendered.current) return

        const tryRender = () => {
            if (window.paypal?.HostedButtons) {
                rendered.current = true
                window.paypal
                    .HostedButtons({ hostedButtonId: "5PUTY67JAYFMU" })
                    .render("#paypal-container-5PUTY67JAYFMU")
            }
        }

        // If SDK is already loaded, render immediately; otherwise wait a tick.
        if (window.paypal?.HostedButtons) {
            tryRender()
        } else {
            // Poll briefly until the SDK is ready (it loads async in the layout)
            const interval = setInterval(() => {
                if (window.paypal?.HostedButtons) {
                    clearInterval(interval)
                    tryRender()
                }
            }, 100)
            return () => clearInterval(interval)
        }
    }, [])

    return (
        <div
            id="paypal-container-5PUTY67JAYFMU"
            ref={containerRef}
            className="paypal-btn-wrapper mt-10 flex justify-center animate-slide-up-delay-2"
        />
    )
}
