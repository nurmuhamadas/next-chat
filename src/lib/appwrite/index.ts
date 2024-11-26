import { cookies } from "next/headers"

import { Account, Client, Databases, Storage, Users } from "node-appwrite"

import { AUTH_COOKIE_KEY } from "@/features/auth/constants"

import "server-only"

import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_SECRET_KEY,
} from "./constants"

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
