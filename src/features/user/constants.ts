export const GENDER: Record<Gender, Gender> = {
  FEMALE: "FEMALE",
  MALE: "MALE",
}

export const GENDER_OPT: {
  label: string
  value: Gender
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

export const THEME_OPT: {
  label: string
  value: Theme
}[] = [
  {
    label: "Light",
    value: "LIGHT",
  },
  {
    label: "Dark",
    value: "DARK",
  },
  {
    label: "System",
    value: "SYSTEM",
  },
]

export const TIME_FORMAT: Record<TimeFormat, TimeFormat> = {
  "12-HOUR": "12-HOUR",
  "24-HOUR": "24-HOUR",
}
export const TIME_FORMAT_OPT: {
  label: string
  value: TimeFormat
}[] = [
  {
    label: "12 Hour",
    value: "12-HOUR",
  },
  {
    label: "24 Hour",
    value: "24-HOUR",
  },
]

export const LANGUAGE: Record<Language, Language> = {
  en_US: "en_US",
  id_ID: "id_ID",
}
export const LANGUAGE_OPT: {
  label: string
  value: Language
}[] = [
  {
    label: "English",
    value: "en_US",
  },
  {
    label: "Bahasa Indonesia",
    value: "id_ID",
  },
]

export const NOTIFICATION: Record<NotificationType, NotificationType> = {
  PRIVATE: "PRIVATE",
  GROUP: "GROUP",
  CHANNEL: "CHANNEL",
}
export const NOTIFICATION_OPT: {
  label: string
  value: NotificationType
}[] = [
  {
    label: "Private Chat",
    value: "PRIVATE",
  },
  {
    label: "Group",
    value: "GROUP",
  },
  {
    label: "Channel",
    value: "CHANNEL",
  },
]

export const ADD_TO_GROUP_OPT: {
  label: string
  value: boolean
}[] = [
  {
    label: "Allow",
    value: true,
  },
  {
    label: "Don't Allow",
    value: false,
  },
]

export const TWO_FACTOR_AUTH_OPT: {
  label: string
  value: boolean
}[] = [
  {
    label: "Enable",
    value: true,
  },
  {
    label: "Disable",
    value: false,
  },
]
