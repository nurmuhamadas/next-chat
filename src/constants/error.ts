export const ERROR = {
  INVALID_EMAIL: "INVALID_EMAIL",
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  EMAIL_TOO_LONG: "EMAIL_TOO_LONG",
  EMAIL_ALREADY_EXIST: "EMAIL_ALREADY_EXIST",
  EMAIL_NOT_REGISTERED: "EMAIL_NOT_REGISTERED",
  EMAIL_UNVERIFIED: "EMAIL_UNVERIFIED",
  EMAIL_ALREADY_VERIFIED: "EMAIL_ALREADY_VERIFIED",

  PASSWORD_SHOULD_CONTAIN_LOWERCASE: "PASSWORD_CONTAIN_LOWERCASE",
  PASSWORD_SHOULD_CONTAIN_UPPERCASE: "PASSWORD_CONTAIN_UPPERCASE",
  PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
  PASSWORD_TOO_LONG: "PASSWORD_TOO_LONG",
  PASSWORD_SHOULD_CONTAIN_NUMBER: "PASSWORD_CONTAIN_NUMBER",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  PASSWORD_DONT_MATCH: "PASSWORD_DONT_MATCH",
  CONFIRM_PASSWORD_REQUIRED: "CONFIRM_PASSWORD_REQUIRED",

  TOKEN_REQUIRED: "TOKEN_REQUIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INVALID_TYPE: "INVALID_TYPE",
  REQUIRED: "REQUIRED",

  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  UNAUTHORIZE: "UNAUTHORIZE",
  NOT_ALLOWED: "NOT_ALLOWED",

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
  INVALID_CODE_OR_OTP_ID: "INVALID_CODE_OR_OTP_ID",

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
  GROUP_NOT_FOUND: "GROUP_NOT_FOUND",
  GROUP_OWNER_NOT_FOUND: "GROUP_OWNER_NOT_FOUND",

  JOIN_CODE_REQUIRED: "JOIN_CODE_REQUIRED",
  INVALID_JOIN_CODE: "INVALID_JOIN_CODE",
  ALREADY_MEMBER: "ALREADY_MEMBER",
  NOT_GROUP_MEMBER: "NOT_GROUP_MEMBER",
  ONLY_ADMIN_ADD_MEMBER: "ONLY_ADMIN_ADD_MEMBER",
  ADDED_USER_ALREADY_MEMBER: "ADDED_USER_ALREADY_MEMBER",
  ADDED_USER_NOT_FOUND: "ADDED_USER_NOT_FOUND",
  ONLY_ADMIN_REMOVE_MEMBER: "ONLY_ADMIN_REMOVE_MEMBER",
  REMOVED_USER_NOT_FOUND: "REMOVED_USER_NOT_FOUND",
  REMOVED_USER_IS_NOT_MEMBER: "REMOVED_USER_IS_NOT_MEMBER",
  USER_IS_NOT_MEMBER: "USER_IS_NOT_MEMBER",
  USER_ALREADY_ADMIN: "USER_ALREADY_ADMIN",
  USER_IS_NOT_ADMIN: "USER_IS_NOT_ADMIN",

  CHANNEL_NAME_REQUIRED: "CHANNEL_NAME_REQUIRED",
  CHANNEL_NAME_TOO_SHORT: "CHANNEL_NAME_TOO_SHORT",
  CHANNEL_NAME_TOO_LONG: "CHANNEL_NAME_TOO_LONG",
  CHANNEL_NAME_DUPLICATED: "CHANNEL_NAME_DUPLICATED",
  CHANNEL_DESC_TOO_LONG: "CHANNEL_DESC_TOO_LONG",
  CHANNEL_TYPE_REQUIRED: "CHANNEL_TYPE_REQUIRED",
  INVALID_CHANNEL_TYPE: "INVALID_CHANNEL_TYPE",
  CHANNEL_NAME_ALREADY_EXIST: "CHANNEL_NAME_ALREADY_EXIST",
  CHANNEL_NOT_FOUND: "CHANNEL_NOT_FOUND",
  CHANNEL_OWNER_NOT_FOUND: "CHANNEL_OWNER_NOT_FOUND",
  ONLY_ADMIN_CAN_ADD_ADMIN: "ONLY_ADMIN_CAN_ADD_ADMIN",
  ONLY_ADMIN_CAN_REMOVE_ADMIN: "ONLY_ADMIN_CAN_REMOVE_ADMIN",
  USER_IS_NOT_SUBSCRIBER: "USER_IS_NOT_SUBSCRIBER",
  ALREADY_SUBSCRIBER: "ALREADY_SUBSCRIBER",

  USER_ID_REQUIRED: "USER_ID_REQUIRED",
  CANNOT_CREATE_CONVERSATION_WITH_BLOCK_OR_BLOCKED_USER:
    "CANNOT_CREATE_CONVERSATION_WITH_BLOCK_OR_BLOCKED_USER",
  CONVERSATION_ALREADY_EXIST: "CONVERSATION_ALREADY_EXIST",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  CONVERSATION_NOT_FOUND: "CONVERSATION_NOT_FOUND",
  CONVERSATION_ALREADY_DELETED: "CONVERSATION_ALREADY_DELETED",

  NOTIFICATION_REQUIRED: "NOTIFICATION_REQUIRED",
  INVALID_NOTIFICATION_TYPE: "INVALID_NOTIFICATION_TYPE",
  INVALID_TIME_FORMAT: "INVALID_TIME_FORMAT",
  INVALID_LANGUAGE: "INVALID_TIME_FORMAT",

  MESSAGE_REQUIRED: "MESSAGE_REQUIRED",
  MESSAGE_TOO_LONG: "MESSAGE_TOO_LONG",
  PARENT_MESSAGE_TOO_LONG: "PARENT_MESSAGE_TOO_LONG",
  INVALID_MESSAGE_STATUS: "INVALID_MESSAGE_STATUS",
  ROOM_ID_REQUIRED: "ROOM_ID_REQUIRED",
  ROOM_ID_DUPLICATED: "ROOM_ID_DUPLICATED",
  ATTACHMENT_TOO_LARGE: "ATTACHMENT_TOO_LARGE",
  MESSAGE_NOT_FOUND: "MESSAGE_NOT_FOUND",
  SHOULD_HAVE_MESSAGE_OR_ATTACHMENT: "SHOULD_HAVE_MESSAGE_OR_ATTACHMENT",
  UPDATE_DELETED_MESSAGE_NOT_ALLOWED: "UPDATE_DELETED_MESSAGE_NOT_ALLOWED",
  MESSAGE_ALREADY_DELETED: "MESSAGE_ALREADY_DELETED",

  NO_UNREAD_MESSAGE: "NO_UNREAD_MESSAGE",
} as const
