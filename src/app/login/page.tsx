import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons";
import { MotionContainer, MotionItem } from "@/components/animations/motion-wrapper";
import { Camera } from "lucide-react";
import { auth } from "@/auth";

export default async function LoginPage() {
    const session = await auth();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <MotionContainer className="max-w-md w-full space-y-8">
                <MotionItem className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                        <Camera className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tighter">管理者ログイン</h1>
                        <p className="text-muted-foreground font-medium">ギャラリーの管理を行うためにログインしてください</p>
                    </div>
                </MotionItem>

                <MotionItem className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border shadow-2xl space-y-6 text-center">
                    {session ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center space-y-2">
                                {session.user?.image ? (
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg">
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl shadow-inner">
                                        👤
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="font-black text-lg">{session.user?.name}</p>
                                    <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-full text-sm">
                                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                ログイン済みです
                            </div>
                            <div className="pt-2 border-t">
                                <SignOutButton />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center">
                                <SignInButton />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                許可された管理者アカウント（Google環境）でのみログインが可能です。
                            </p>
                        </>
                    )}
                </MotionItem>
            </MotionContainer>
        </div>
    );
}
