"use client"

import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignInButton() {
    return (
        <Button onClick={() => signIn("google")}>
            Googleでログイン
        </Button>
    )
}

export function SignOutButton() {
    return (
        <Button variant="outline" onClick={() => signOut()}>
            ログアウト
        </Button>
    )
}
