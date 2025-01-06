import { z } from "zod"

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
}
