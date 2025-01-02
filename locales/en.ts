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
} as const
