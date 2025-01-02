export default {
  auth: {
    info: {
      title: "Percakapan Tingkat Lanjut, Kapan Saja, Di Mana Saja.",
      desc: "NextChat adalah aplikasi pesan yang aman dan mudah digunakan untuk percakapan dan berbagi media tanpa hambatan.",
    },
    sign_in: {
      title: "Masuk",
      submit: "Masuk",
      question: "Belum punya akun?",
      forgot: "Lupa kata sandi?",
      link: "Buat Akun",
    },
    sign_up: {
      title: "Buat Akun",
      submit: "Buat Akun",
      question: "Sudah punya akun?",
      link: "Masuk",
    },
    profile: {
      title: "Lengkapi Profil Anda",
      submit: "Simpan Profil",
    },
    forgot_password: {
      title: "Lupa Kata Sandi",
      submit: "Kirim tautan reset",
      back: "Kembali ke",
      link: "Masuk",
      success: {
        title: "Tautan Reset Kata Sandi Terkirim",
        desc: "Kami telah mengirimkan email berisi tautan reset. Buka tautan tersebut untuk mereset kata sandi Anda.",
        question: "Belum menerima email?",
        action: "Kirim Ulang",
        count: "{count}s",
      },
    },
    reset_password: {
      title: "Masukkan Kata Sandi Baru",
      submit: "Reset Kata Sandi",
      back: "Kembali ke",
      link: "Masuk",
    },
    email_login: {
      loading: "Memverifikasi",
      success: "Berhasil Masuk. Mengalihkan...",
    },
    email_verification: {
      loading: "Memverifikasi",
      success: "Email Terverifikasi. Mengalihkan...",
    },
    form: {
      username: "Nama Pengguna",
      "username.placeholder": "john_doe",
      email: "Email",
      "email.placeholder": "john@example.com",
      password: "Kata Sandi",
      "password.placeholder": "Masukkan kata sandi Anda",
      confirm_password: "Konfirmasi Kata Sandi",
      "confirm_password.placeholder": "Masukkan kembali kata sandi Anda",
      name: "Nama",
      "name.placeholder": "John Doe",
      gender: "Jenis Kelamin",
      "gender.placeholder": "Pilih jenis kelamin Anda",
      bio: "Bio (Opsional)",
      "bio.placeholder": "Deskripsikan diri Anda",
    },
    logout: "Keluar",

    message: {
      signed_in: "Berhasil masuk.",
      register_success: "Akun berhasil dibuat.",
      signed_out: "Anda telah keluar.",
      password_reset_success: "Reset kata sandi berhasil.",
    },
  },
} as const
