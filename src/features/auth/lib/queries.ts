import "server-only"

import { getUserByEmail } from "@/features/user/lib/queries"
import { createSessionClient } from "@/lib/appwrite"

export const validateAuth = async () => {
  try {
    const { account, databases } = await createSessionClient()
    const user = await account.get()

    const userProfile = await getUserByEmail(databases, { email: user.email })

    return { isLoggedIn: !!user, isProfileCompleted: !!userProfile }
  } catch {
    return { isLoggedIn: false, isProfileCompleted: false }
  }
}
