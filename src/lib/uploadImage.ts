import "server-only"

import { ID, Storage } from "node-appwrite"

import { STORAGE_ID } from "./appwrite/config"

export const uploadImage = async ({
  image,
  storage,
}: {
  image: File
  storage: Storage
}) => {
  const blob = new Blob([image], { type: image.type })
  const imageFile = new File([blob], image.name, { type: image.type })
  const file = await storage.createFile(STORAGE_ID, ID.unique(), imageFile)

  return file
}
