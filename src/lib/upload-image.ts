import "server-only"

import { ID, Storage } from "node-appwrite"

import { STORAGE_ID } from "./appwrite/config"

export const uploadImage = async (
  storage: Storage,
  { image }: { image: File },
) => {
  const blob = new Blob([image], { type: image.type })
  const imageFile = new File([blob], image.name, { type: image.type })
  const file = await storage.createFile(STORAGE_ID, ID.unique(), imageFile)

  return file
}

export const deleteImage = async (storage: Storage, { id }: { id: string }) => {
  await storage.deleteFile(STORAGE_ID, id)
}
