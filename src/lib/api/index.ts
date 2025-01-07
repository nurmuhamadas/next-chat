import queryString from "query-string"
import { z } from "zod"

import { searchQuerySchema } from "@/constants"
import { signInSchema, signUpSchema } from "@/features/auth/schema"

import apiClient from "./axios"

export const api = {
  auth: {
    getUsernameAvailability: (username: string) =>
      apiClient.get<unknown, UsernameAvailabilityResponse>(
        `/auth/username-availability/${username}`,
      ),
    signUp: (data: z.infer<typeof signUpSchema>) =>
      apiClient.post<unknown, SignUpResponse>(`/auth/sign-up`, data),
    signIn: (data: z.infer<typeof signInSchema>) =>
      apiClient.post<unknown, SignInResponse>(`/auth/sign-in`, data),
  },
  users: {
    createUserProfile(data: FormData) {
      return apiClient.post<unknown, CreateUserProfileResponse>("/users", data)
    },
    updateUserProfile(data: FormData) {
      return apiClient.patch<unknown, PatchUserProfileResponse>("/users", data)
    },
    search(params: z.infer<typeof searchQuerySchema>) {
      const queryParams = queryString.stringify(params)
      return apiClient.get<unknown, SearchUsersResponse>(
        `/users/search?${queryParams}`,
      )
    },
  },
}
