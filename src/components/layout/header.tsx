import Link from "next/link"
import { auth } from "@/auth"
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons"
import { Camera } from "lucide-react"

export async function Header() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                        <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Hobby Gallery
                    </span>
                </Link>
                <div className="flex items-center gap-6">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold leading-none">{session.user?.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-50">{session.user?.email}</span>
                            </div>
                            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
                            <SignOutButton />
                        </div>
                    ) : (
                        <SignInButton />
                    )}
                </div>
            </div>
        </header>
    )
}
