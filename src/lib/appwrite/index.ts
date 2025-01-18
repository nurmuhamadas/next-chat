import "server-only"

import { Client, Storage } from "node-appwrite"

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
  return fileUrl.split(APPWRITE_ENDPOINT)[1]?.split("/")[5]
}

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_ID}/files/${bucketFileId}/download?project=${APPWRITE_PROJECT_ID}`
}
