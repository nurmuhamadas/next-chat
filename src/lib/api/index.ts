import queryString from "query-string"
import { z } from "zod"

import { searchQuerySchema } from "@/constants"
import { signInSchema, signUpSchema } from "@/features/auth/schema"
import { settingSchema } from "@/features/settings/schema"

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
    searchForMember(
      groupId: string,
      params: z.infer<typeof searchQuerySchema>,
    ) {
      const queryParams = queryString.stringify(params)
      return apiClient.get<unknown, SearchUsersForMemberResponse>(
        `/users/search-for-member/${groupId}?${queryParams}`,
      )
    },
    getMyProfile() {
      return apiClient.get<unknown, GetMyProfileResponse>("/users/my-profile")
    },
    getProfile(userId: string) {
      return apiClient.get<unknown, GetMyProfileResponse>(`/users/${userId}`)
    },
  },
  settings: {
    get() {
      return apiClient.get<unknown, GetSettingResponse>("/settings")
    },
    update(data: z.infer<typeof settingSchema>) {
      return apiClient.patch<unknown, UpdateSettingResponse>("/settings", data)
    },
  },
  blockedUsers: {
    get(params: z.infer<typeof searchQuerySchema>) {
      const queryParams = queryString.stringify(params)
      return apiClient.get<unknown, GetBlockedUsersResponse>(
        `/blocked-users?${queryParams}`,
      )
    },
    getIsUserBlocked(userId: string) {
      return apiClient.get<unknown, GetIsBlockedUserResponse>(
        `/blocked-users/${userId}/is-blocked`,
      )
    },
    blockUser(userId: string) {
      return apiClient.post<unknown, BlockUserResponse>(
        `/blocked-users/${userId}`,
      )
    },
  },
}
