import "server-only"

import { ID } from "node-appwrite"

import { STORAGE_ID } from "./appwrite/config"
import { createAdminClient } from "./appwrite"

export const uploadFile = async ({ file }: { file: File }) => {
  const { storage } = await createAdminClient()

  const blob = new Blob([file], { type: file.type })
  const newFile = new File([blob], file.name, { type: file.type })

  const uploadedFile = await storage.createFile(
    STORAGE_ID,
    ID.unique(),
    newFile,
  )

  return uploadedFile
}

export const deleteFile = async ({ id }: { id: string }) => {
  const { storage } = await createAdminClient()

  await storage.deleteFile(STORAGE_ID, id)
}
