import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
    // 既存の認証ミドルウェアを実行
    const authResponse = await auth(request as any)

    // レスポンスを作成（Next.js の auth は内部的にリダイレクト等を返す場合があるため、それに従う）
    const response = authResponse instanceof NextResponse
        ? authResponse
        : NextResponse.next()

    // --- Content Security Policy (CSP) の定義 ---
    const cspPolicy = {
        "default-src": ["'self'"],
        "script-src": [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'", // Next.js の開発モードや Vercel インフラ等で必要な場合がある
        ],
        "style-src": [
            "'self'",
            "'unsafe-inline'",
            "fonts.googleapis.com",
        ],
        "img-src": [
            "'self'",
            "data:",
            "blob:",
            "storage.googleapis.com",
            "*.googleusercontent.com", // Google Auth プロフィール画像用
        ],
        "font-src": [
            "'self'",
            "fonts.gstatic.com",
            "data:",
        ],
        "connect-src": [
            "'self'",
            "storage.googleapis.com",
            "vitals.vercel-insights.com", // vercel 監視用（必要に応じて）
        ],
        "frame-src": ["'none'"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
        "upgrade-insecure-requests": [],
    }

    const cspString = Object.entries(cspPolicy)
        .map(([key, h]) => `${key} ${(h as string[]).join(" ")}`)
        .join("; ")

    // セキュリティヘッダーを設定
    response.headers.set("Content-Security-Policy", cspString)
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    return response
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
