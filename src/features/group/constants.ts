export const GROUP_TYPE: Record<GroupType, GroupType> = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
}

export const GROUP_TYPE_OPT: {
  label: string
  value: GroupType
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
