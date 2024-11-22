export const GROUP_TYPE: Record<GroupType, GroupType> = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
}

export const GROUP_TYPE_OPT: {
  label: string
  value: GroupType
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
