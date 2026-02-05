import { auth } from "@/auth"
import { HeaderClient } from "./header-client"

export async function Header() {
    const session = await auth()
    return <HeaderClient session={session} />
}
