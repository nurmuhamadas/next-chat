export const CHANNEL_TYPE: Record<ChannelType, ChannelType> = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const

export const CHANNEL_TYPE_OPT: {
  label: string
  value: ChannelType
}[] = [
  {
    label: "form.type_opt.public",
    value: "PUBLIC",
  },
  {
    label: "form.type_opt.private",
    value: "PRIVATE",
  },
]
