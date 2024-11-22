export const CHANNEL_TYPE: Record<ChannelType, ChannelType> = {
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
