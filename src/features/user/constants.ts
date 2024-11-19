export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const

export const GENDER_OPT: {
  label: string
  value: keyof typeof GENDER
}[] = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
]
