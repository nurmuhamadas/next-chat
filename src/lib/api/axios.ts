/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError, AxiosResponse } from "axios"

import { BASE_API_URL } from "../config"

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response): AxiosResponse<ApiResponse<any> | ApiCollectionResponse<any>> => {
    const data = response.data
    if (data.success) {
      return response.data
    } else {
      throw new Error(data.error.message)
    }
  },
  (error: AxiosError) => {
    const data = error.response?.data as ErrorResponse
    return Promise.reject(data.error)
  },
)

export default apiClient
