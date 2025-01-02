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
    },
  },
  room_menu: {
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
} as const
