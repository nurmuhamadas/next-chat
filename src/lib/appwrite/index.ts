import "server-only"

import { cookies } from "next/headers"

import { Account, Client, Databases, Storage, Users } from "node-appwrite"

import { AUTH_COOKIE_KEY } from "@/features/auth/constants"

import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_SECRET_KEY,
  STORAGE_ID,
} from "./config"

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_SECRET_KEY)

  return {
    get account() {
      return new Account(client)
    },
    get users() {
      return new Users(client)
    },
  }
}

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)

  const session = (await cookies()).get(AUTH_COOKIE_KEY)

  if (!session) {
    throw new Error("Unauthorized")
  }

  client.setSession(session.value)

  return {
    get account() {
      return new Account(client)
    },
    get databases() {
      return new Databases(client)
    },
    get storage() {
      return new Storage(client)
    },
  }
}

// APPWRITE URL UTILS
// Construct appwrite file URL - https://appwrite.io/docs/apis/rest#images
export const constructFileUrl = (bucketFileId: string) => {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_ID}/files/${bucketFileId}/view?project=${APPWRITE_PROJECT_ID}`
}

export const destructFileId = (fileUrl: string) => {
  return fileUrl.split(APPWRITE_ENDPOINT)[1].split("/")[5]
}

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_ID}/files/${bucketFileId}/download?project=${APPWRITE_PROJECT_ID}`
}
