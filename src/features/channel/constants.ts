import { ChannelType } from "./type"

export const CHANNEL_TYPE = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const

export const CHANNEL_TYPE_OPT: {
  label: string
  value: ChannelType
}[] = [
  {
    label: "Public",
    value: "PUBLIC",
  },
  {
    label: "Private",
    value: "PRIVATE",
  },
]
