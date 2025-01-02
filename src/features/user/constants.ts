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
    label: "theme_opt.light",
    value: "LIGHT",
  },
  {
    label: "theme_opt.dark",
    value: "DARK",
  },
  {
    label: "theme_opt.system",
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
    label: "time_format_opt.12-hour",
    value: "12-HOUR",
  },
  {
    label: "time_format_opt.24-hour",
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
    label: "language_opt.en",
    value: "en_US",
  },
  {
    label: "language_opt.id",
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
