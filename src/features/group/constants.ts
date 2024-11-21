import { GroupType } from "./type"

export const GROUP_TYPE = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const

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
