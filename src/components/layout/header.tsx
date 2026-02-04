import Link from "next/link"
import { auth } from "@/auth"
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons"

export async function Header() {
    const session = await auth()

    return (
        <header className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    Hobby Gallery
                </Link>
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                                {session.user?.email}
                            </span>
                            <SignOutButton />
                        </>
                    ) : (
                        <SignInButton />
                    )}
                </div>
            </div>
        </header>
    )
}
