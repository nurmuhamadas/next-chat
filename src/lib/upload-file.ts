import "server-only"

import { ID, Storage } from "node-appwrite"

import { STORAGE_ID } from "./appwrite/config"

export const uploadFile = async (
  storage: Storage,
  { file }: { file: File },
) => {
  const blob = new Blob([file], { type: file.type })
  const newFile = new File([blob], file.name, { type: file.type })
  const uploadedFile = await storage.createFile(
    STORAGE_ID,
    ID.unique(),
    newFile,
  )

  return uploadedFile
}

export const deleteFile = async (storage: Storage, { id }: { id: string }) => {
  await storage.deleteFile(STORAGE_ID, id)
}
