export const ERROR = {
  INVALID_EMAIL: "INVALID_EMAIL",
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  EMAIL_TOO_LONG: "EMAIL_TOO_LONG",
  EMAIL_ALREADY_EXIST: "EMAIL_ALREADY_EXIST",
  EMAIL_NOT_REGISTERED: "EMAIL_NOT_REGISTERED",

  PASSWORD_CONTAIN_LOWERCASE: "PASSWORD_CONTAIN_LOWERCASE",
  PASSWORD_CONTAIN_UPPERCASE: "PASSWORD_CONTAIN_UPPERCASE",
  PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
  PASSWORD_TOO_LONG: "PASSWORD_TOO_LONG",
  PASSWORD_CONTAIN_NUMBER: "PASSWORD_CONTAIN_NUMBER",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  PASSWORD_DONT_MATCH: "PASSWORD_DONT_MATCH",
  CONFIRM_PASSWORD_REQUIRED: "CONFIRM_PASSWORD_REQUIRED",

  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",

  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  UNAUTHORIZE: "UNAUTHORIZE",

  FIRST_NAME_REQUIRED: "FIRST_NAME_REQUIRED",
  FIRST_NAME_TOO_LONG: "FIRST_NAME_TOO_LONG",
  FIRST_NAME_TOO_SHORT: "FIRST_NAME_TOO_SHORT",
  LAST_NAME_TOO_LONG: "LAST_NAME_TOO_LONG",
  LAST_NAME_TOO_SHORT: "LAST_NAME_TOO_SHORT",
  USERNAME_REQUIRED: "USERNAME_REQUIRED",
  USERNAME_TOO_SHORT: "USERNAME_TOO_SHORT",
  USERNAME_TOO_LONG: "USERNAME_TOO_LONG",
  USERNAME_ALREADY_EXIST: "USERNAME_ALREADY_EXIST",
  INVALID_USERNAME_FORMAT: "INVALID_USERNAME_FORMAT",
  GENDER_REQUIRED: "GENDER_REQUIRED",
  INVALID_GENDER: "INVALID_GENDER",
  BIO_TOO_LONG: "BIO_TOO_LONG",

  INPUT_IS_NOT_FILE: "INPUT_IS_NOT_FILE",
  INVALID_IMAGE_TYPE: "INVALID_IMAGE_TYPE",
  IMAGE_TOO_LARGE: "IMAGE_TOO_LARGE",

  OTP_REQUIRED: "OTP_REQUIRED",

  COMPLETE_PROFILE_FIRST: "COMPLETE_PROFILE_FIRST",
  PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",

  BLOCKED_USER_NOT_FOUND: "BLOCKED_USER_NOT_FOUND",
  USER_ALREADY_BLOCKED: "USER_ALREADY_BLOCKED",

  GROUP_NAME_REQUIRED: "GROUP_NAME_REQUIRED",
  GROUP_NAME_TOO_SHORT: "GROUP_NAME_TOO_SHORT",
  GROUP_NAME_TOO_LONG: "GROUP_NAME_TOO_LONG",
  GROUP_NAME_DUPLICATED: "GROUP_NAME_DUPLICATED",
  GROUP_DESC_TOO_LONG: "GROUP_DESC_TOO_LONG",
  GROUP_TYPE_REQUIRED: "GROUP_TYPE_REQUIRED",
  INVALID_GROUP_TYPE: "INVALID_GROUP_TYPE",
  INVALID_MEMBER_ID_TYPE: "INVALID_MEMBER_ID_TYPE",
  INVALID_MEMBER_IDS_TYPE: "INVALID_MEMBER_IDS_TYPE",
  ADD_BLOCKED_USERS_NOT_ALLOWED: "ADD_BLOCKED_USERS_NOT_ALLOWED",
  ADDDED_BY_BLOCKED_USER_NOT_ALLOWED: "ADDDED_BY_BLOCKED_USER_NOT_ALLOWED",
  MEMBER_ID_NOT_FOUND: "MEMBER_ID_NOT_FOUND",
} as const
