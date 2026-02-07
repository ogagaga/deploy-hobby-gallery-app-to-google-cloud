"use client"

import { PageTransition } from "@/components/animations/page-transition"
import { ReactNode } from "react"

export default function Template({ children }: { children: ReactNode }) {
    return <PageTransition>{children}</PageTransition>
}
