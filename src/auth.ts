import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const adminEmail = process.env.ADMIN_EMAIL
      if (!user.email || user.email !== adminEmail) {
        console.warn(`Access denied for: ${user.email}`)
        return false // 特定のメールアドレス以外はログイン不可
      }
      return true
    },
  },
})
