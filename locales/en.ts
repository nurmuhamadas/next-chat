export default {
  auth: {
    info: {
      title: "Next-Level Conversations, Anytime, Anywhere.",
      desc: "NextChat is a secure, easy-to-use messaging app for seamless conversations and media sharing.",
    },
    sign_in: {
      title: "Sign In",
      submit: "Sign In",
      question: "Don't have an account?",
      forgot: "Forgot password?",
      link: "Create Account",
    },
    sign_up: {
      title: "Create Account",
      submit: "Create Account",
      question: "Already have an account?",
      link: "Sign In",
    },
    profile: {
      title: "Complete Your Profile",
      submit: "Save Profile",
    },
    forgot_password: {
      title: "Forgot Password",
      submit: "Send reset link",
      back: "Back to",
      link: "Sign In",
      success: {
        title: "Password Reset Link Sent",
        desc: "We've sent you an email that contain reset link. Open the link to reset your password",
        question: "Don't receive an email?",
        action: "Resend",
        count: "{count}s",
      },
    },
    reset_password: {
      title: "Enter New Password",
      submit: "Reset Password",
      back: "Back to",
      link: "Sign In",
    },
    email_login: {
      loading: "Verifying",
      success: "Signed In. Redirecting...",
    },
    email_verification: {
      loading: "Verifying",
      success: "Email Verified. Redirecting...",
    },
    form: {
      username: "Username",
      "username.placeholder": "john_doe",
      email: "Email",
      "email.placeholder": "john@example.com",
      password: "Password",
      "password.placeholder": "Enter your password",
      confirm_password: "Confirm Password",
      "confirm_password.placeholder": "Re-enter your password",
      name: "Name",
      "name.placeholder": "John Doe",
      gender: "Gender",
      "gender.placeholder": "Choose your gender",
      bio: "Bio (Optional)",
      "bio.placeholder": "Describe yourself",
    },
    logout: "Logout",

    message: {
      signed_in: "Signed in successfully.",
      register_success: "Account created successfully.",
      signed_out: "You have been signed out.",
      password_reset_success: "Password reset successful.",
    },
  },
  main_menu: {
    my_profile: "My Profile",
    saved_messages: "Saved Messages",
    light_mode: "Light Mode",
    dark_mode: "Dark Mode",
    bloked_users: "Blocked Users",
    settings: "Settings",
    report_bug: "Report Bug",
    about_us: "About NextChat",
    logout: "Logout",
  },
  my_profile: {
    title: "My Profile",
    bio: "Bio",
    username: "Username",
    email: "Email",
    copy_tooltip: "Copy {label} to clipboard",
    edit_tooltip: "Edit profile",
    edit_title: "Edit My Profile",
    edit_submit: "Save Changes",
    messages: {
      profile_created: "Profile created successfully.",
      profile_updated: "Profile updated successfully.",
    },
  },
  blocked_user: {
    title: "Blocked Users",
    no_data: "No blocked users found.",
    messages: {
      block_success: "User blocked successfully.",
      unblock_success: "User unblocked successfully.",
    },
  },
  settings: {
    title: "Settings",
    appearance: {
      title: "Themes and Appearance",
      theme_mode: "Theme Mode",
      theme_opt: {
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      language: "Language",
      language_opt: {
        en: "English",
        id: "Bahasa Indoenesia",
      },
      time_format: "Time Format",
      time_format_opt: {
        "12-hour": "12-Hour",
        "24-hour": "24-Hour",
      },
    },
    notifications: {
      title: "Notifications",
      allow_notifications: "Allow Notifications",
      privat_chat: "Private Chat",
      group: "Group",
      channel: "Channel",
    },
    security: {
      title: "Privacy and Security",
      allow_add_group: "Allow people to add me to the group",
      allow: "Allow",
      dont_allow: "Don't Allow",
      enable_2fa: "Two Factor Authentication (2FA)",
      enable: "Enable",
      disable: "Disable",
    },
    messages: {
      settings_updated: "Settings updated successfully.",
    },
  },
  floating_menu: {
    new_group: "New Group",
    new_channel: "New Channel",
  },
  private_chat: {
    info: {
      title: "User Info",
      bio: "Bio",
      username: "Username",
      male: "(He/Him)",
      female: "(She/Her)",
      email: "Email",
      notifications: "Notifications",
      last_seent: "Last seen at {time}",
    },
    messages: {
      notification_updated: "Notification updated successfully.",
      message_deleted: "Message deleted successfully.",
    },
  },
  group: {
    new: {
      title: "New Group",
      submit: "Create Group",
    },
    edit: {
      title: "Edit Group",
      submit: "Update Group",
    },
    form: {
      name: "Name",
      "name.placeholder": "Enter your group name",
      description: "Description (Optional)",
      "description.placeholder": "Describe your group",
      type: "Type",
      type_opt: {
        public: "Public",
        private: "Private",
      },
      members: "Members",
      "members.placeholder": "Select members",
      "members.empty": "No user found",
    },
    info: {
      title: "Group Info",
      description: "Description",
      link: "Invite Link",
      notifications: "Notifications",
      members: "Members",
      "total_members#zero": "0 members",
      "total_members#one": "1 member",
      "total_members#other": "{count} members",
      "members.empty": "No group members.",
      admin: "Admin",
      remove: "Remove",
    },
    add_members: {
      title: "Add Members",
      search: "Search users",
      "search.empty": "No user found",
      action: "Add",
    },
    admin: {
      title: "Administrators",
      info: "You can add admins to help you manage your group.",
      remove: "Remove",
      add: {
        title: "Add Administrators",
        empty: "No members available.",
        action: "Add",
      },
    },
    tooltip: {
      edit: "Edit Group",
      add_members: "Add Members",
      add_admins: "Add Administrators",
    },
    messages: {
      created: "Group created successfully.",
      updated: "Group updated successfully.",
      added_members: "Members added successfully.",
      removed_members: "Members removed successfully.",
      added_admins: "Admins added successfully.",
      removed_admins: "Admins removed successfully.",
      notification_updated: "Notification updated successfully.",
      left_group: "You have left the group.",
      delete_message: "Message deleted successfully.",
      joined_group: "Joined group successfully",
    },
  },
  channel: {
    new: {
      title: "New Channel",
      submit: "Create Channel",
    },
    edit: {
      title: "Edit Channel",
      submit: "Update Channel",
    },
    form: {
      name: "Name",
      "name.placeholder": "Enter your channel name",
      description: "Description (Optional)",
      "description.placeholder": "Describe your channel",
      type: "Type",
      type_opt: {
        public: "Public",
        private: "Private",
      },
    },
    info: {
      title: "Channel Info",
      description: "Description",
      link: "Invite Link",
      notifications: "Notifications",
      subscribers: "Subscribers",
      "total_subscribers#zero": "0 subscribers",
      "total_subscribers#one": "1 subscriber",
      "total_subscribers#other": "{count} subscribers",
      "subscribers.empty": "No channel subscribers.",
      admin: "Admin",
      remove: "Remove",
      show_more: "Show more",
    },
    admin: {
      title: "Administrators",
      info: "You can add admins to help you manage your channel.",
      remove: "Remove",
      add: {
        title: "Add Administrators",
        empty: "No subscribers available.",
        action: "Add",
      },
    },
    tooltip: {
      edit: "Edit Channel",
      add_admins: "Add Administrators",
    },
    messages: {
      created: "Channel created successfully.",
      updated: "Channel updated successfully.",
      added_admins: "Admins added successfully.",
      removed_admins: "Admins removed successfully.",
      notification_updated: "Notification updated successfully.",
      left_channel: "You have left the channel.",
      delete_message: "Message deleted successfully.",
      joined_channel: "Subscribed channel successfully",
    },
  },
  room_menu: {
    list: {
      pin: "Pin to top",
      unpin: "Unpin from top",
      archive: "Archive",
      delete: "Delete",
    },
    private: {
      mute: "Mute",
      unmute: "Unmute",
      block: "Block User",
      unblock: "Unblock User",
      delete: "Delete Messages",
      confirm_mute: {
        title: "Mute Room",
        message: "Are you sure you want to mute this room?",
      },
      confirm_unmute: {
        title: "Unmute Room",
        message: "Are you sure you want to unmute this room?",
      },
      confirm_block: {
        title: "Block User",
        message: "Are you sure you want to block this user?",
      },
      confirm_unblock: {
        title: "Unblock User",
        message: "Are you sure you want to unblock this user?",
      },
      confirm_delete: {
        title: "Delete Messages",
        message:
          "Are you sure you want to delete messages from this room? This action cannot be undone.",
      },
    },
    group: {
      mute: "Mute",
      unmute: "Unmute",
      leave: "Leave Group",
      delete: "Delete Messages",
      confirm_mute: {
        title: "Mute Group",
        message: "Are you sure you want to mute this group?",
      },
      confirm_unmute: {
        title: "Unmute Group",
        message: "Are you sure you want to unmute this group?",
      },
      confirm_leave: {
        title: "Leave Group",
        message:
          "Are you sure you want to leave this group? You will no longer receive messages from this group.",
      },
      confirm_delete: {
        title: "Delete Messages",
        message:
          "Are you sure you want to delete messages from this group? This action cannot be undone.",
      },
    },
    channel: {
      mute: "Mute",
      unmute: "Unmute",
      leave: "Leave Channel",
      delete: "Delete Messages",
      confirm_mute: {
        title: "Mute Channel",
        message: "Are you sure you want to mute this channel?",
      },
      confirm_unmute: {
        title: "Unmute Channel",
        message: "Are you sure you want to unmute this channel?",
      },
      confirm_leave: {
        title: "Leave Channel",
        message:
          "Are you sure you want to leave this channel? You will no longer receive messages from this channel.",
      },
      confirm_delete: {
        title: "Delete Messages",
        message:
          "Are you sure you want to delete messages from this channel? This action cannot be undone.",
      },
    },
  },
  room: {
    empty_title: "No Conversation found",
    empty_body: "Search and select user to start the conversation",
    no_selected: "No conversation selected",
    no_selected_body: "Selected conversation will be displayed here",
    more: "Show more",
    search: {
      placeholder: "Search",
      users: {
        title: "Users",
        recent: "Recent users",
        available: "Available users",
        empty: "No users found.",
        more: "Show more",
      },
      groups: {
        title: "Groups",
        joined: "Groups you joined",
        public: "Public groups",
        empty: "No groups found.",
        more: "Show more",
      },
      channels: {
        title: "Channels",
        joined: "Channels you joined",
        public: "Public channels",
        empty: "No channels found.",
        more: "Show more",
      },
    },
  },
  messages: {
    "input.placeholder": "Type message here...",
    empty: "No Messages",
    edit: "Edit Message",
    attatchment: "Attachment",
    forwarded: "Forwarded",
    edited: "Edited",
    deleted_for_all: "This message was deleted",
    deleted_by_admin: "This message was deleted by admin",
    group: {
      only_member: "Only group members can view the messages.",
      join: "Join Group",
      success: "Joined group successfully",
    },
    channel: {
      only_member: "Only channel subscribers can view the messages.",
      subscribe: "Subscribe Channel",
    },
    time: {
      today: "Today",
      yestedey: "Yesterday",
    },
    menu: {
      reply: "Reply",
      edit: "Edit",
      copy: "Copy Text",
      forward: "Forward",
      select: "Select",
      delete: "Delete",
    },
    forward: {
      placeholder: "Forward to",
      empty: "No search found",
    },
    select: {
      "count#zero": "No messages selected",
      "count#one": "1 message selected",
      "count#many": "{count} messages selected",
      tooltip: {
        cancel: "Cancel",
        forward: "Forward",
        copy: "Copy",
        delete: "Delete",
      },
    },
    delete: {
      confirm_title: "Delete Messages",
      confirm_body:
        "Are you sure you want to delete these messages? This action cannot be undone.",
      default: "Delete",
      for_me: "Delete just for me",
      for_all: "Delete for everyone",
      cancel: "Cancel",
    },
    tooltip: {
      emoji: "Select emoji",
      send: "Send message",
      start_record: "Start recording",
      pause_record: "Pause recording",
      resume_record: "Resume recording",
      stop_record: "Stop recording",
      upload_image: "Upload image",
      upload_attachment: "Upload attachment",
    },
    messages: {
      text_copied: "Text copied to clipboard",
    },
  },
  error: {
    common: {
      internal_server_error: "Internal Server Error",
      unauthorized: "Unauthorized",
      not_allowed: "Not Allowed",
      invalid_credentials: "Invalid Credentials",
      invalid_type: "Invalid Type",
      required: "Required",
    },
    email: {
      invalid: "Invalid email address",
      required: "Email is required",
      too_long: "Email address is too long",
      already_exist: "Email address already exists",
      not_registered: "Email address is not registered",
      unverified: "Email address is not verified",
      already_verified: "Email address is already verified",
    },
    password: {
      contain_lowercase:
        "Password should contain at least one lowercase letter",
      contain_uppercase:
        "Password should contain at least one uppercase letter",
      too_short: "Password is too short",
      too_long: "Password is too long",
      contain_number: "Password should contain at least one number",
      required: "Password is required",
      dont_match: "Passwords don't match",
      confirm_password_required: "Confirm password is required",
    },
    username: {
      required: "Username is required",
      too_short: "Username is too short",
      too_long: "Username is too long",
      already_exist: "Username already exists",
      invalid_format:
        "Username format is invalid. Allowed characters are a-z, A-Z, 0-9 and _ ",
    },
    name: {
      required: "Name is required",
      too_long: "Name is too long",
      too_short: "Name is too short",
    },
    gender: {
      required: "Gender is required",
      invalid: "Gender is invalid",
    },
    bio: {
      too_long: "Bio is too long",
    },
    image: {
      invalid_type: "Image type is invalid",
      too_large: "Image size is too large",
    },
    token: {
      required: "Token is required",
      invalid: "Token is invalid",
      expired: "Token is expired",
    },
    otp: {
      required: "OTP is required",
      invalid_code_or_otp_id: "OTP code or id is invalid",
    },
    profile: {
      complete_first: "Complete your profile first",
      create_first: "Create your profile first",
      not_found: "Profile not found",
      already_created: "Profile already created",
    },
    blocked_user: {
      not_found: "Blocked user not found",
      already_blocked: "User already blocked",
      cannot_block_it_self: "Cannot block yourself",
    },
    group: {
      name_required: "Group name is required",
      name_too_short: "Group name is too short",
      name_too_long: "Group name is too long",
      name_duplicated: "Group name already exists",
      desc_too_long: "Group description is too long",
      type_required: "Group type is required",
      invalid_type: "Group type is invalid",
      invalid_member_id_type: "Member id type is invalid",
      invalid_member_ids_type: "Member ids type is invalid",
      add_blocked_users_not_allowed: "Add blocked users not allowed",
      add_by_blocked_user_not_allowed: "Add by blocked user not allowed",
      member_id_not_found: "Member id not found",
      not_found: "Group not found",
      owner_not_found: "Group owner not found",
    },
    join_group: {
      join_code_required: "Join code is required",
      invalid_join_code: "Join code is invalid",
      already_member: "Already a member",
      not_member: "Not a member",
      only_admin_add_member: "Only admin can add member",
      added_user_already_member: "Added user already a member",
      added_user_not_found: "Added user not found",
      only_admin_remove_member: "Only admin can remove member",
      removed_user_not_found: "Removed user not found",
      removed_user_is_not_member: "Removed user is not a member",
      user_is_not_member: "User is not a member",
      user_already_admin: "User already an admin",
      user_is_not_admin: "User is not an admin",
      only_one_member: "Can not leave group because it has only one member",
    },
    channel: {
      name_required: "Channel name is required",
      name_too_short: "Channel name is too short",
      name_too_long: "Channel name is too long",
      name_duplicated: "Channel name already exists",
      desc_too_long: "Channel description is too long",
      type_required: "Channel type is required",
      invalid_type: "Channel type is invalid",
      name_already_exist: "Channel name already exists",
      not_found: "Channel not found",
      owner_not_found: "Channel owner not found",
      only_admin_can_add_admin: "Only admin can add admin",
      only_admin_can_remove_admin: "Only admin can remove admin",
      user_is_not_subscriber: "User is not a subscriber",
      already_subscriber: "Already a subscriber",
    },
    settings: {
      notification_required: "Notification is required",
      invalid_notification_type: "Notification type is invalid",
      invalid_time_format: "Time format is invalid",
      invalid_language: "Language is invalid",
    },
    message: {
      required: "Message is required",
      too_long: "Message is too long",
      parent_message_too_long: "Parent message is too long",
      invalid_status: "Message status is invalid",
      room_id_required: "Room id is required",
      room_id_duplicated: "Room id already exists",
      attachment_too_large: "Attachment size is too large",
      not_found: "Message not found",
      parent_message_not_in_room: "Parent message is not in room",
      should_have_message_or_attachment: "Should have message or attachment",
      update_deleted_message_not_allowed: "Update deleted message not allowed",
      already_deleted: "Message already deleted",
      cannot_send_to_blocked_user: "Cannot send message to blocked user",
      no_unread_message: "No unread message",
    },
    room: {
      not_found: "Room not found",
      already_pinned: "Room already pinned",
      not_pinned: "Room not pinned",
      cannot_pin_archived_room: "Cannot pin archived room",
      already_archived: "Room already archived",
      not_archived: "Room not archived",
      cannot_delete_joined_group: "Cannot delete joined group",
      cannot_delete_subscribed_channel: "Cannot delete subscribed channel",
      invalid_room_type: "Room type is invalid",
    },
  },
} as const
