import "server-only"

export const validateAuth = async () => {
  try {
    return { isLoggedIn: false, isProfileCompleted: false }
  } catch {
    return { isLoggedIn: false, isProfileCompleted: false }
  }
}
