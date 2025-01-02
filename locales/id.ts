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
  main_menu: {
    my_profile: "Profil Saya",
    saved_messages: "Pesan Tersimpan",
    light_mode: "Mode Terang",
    dark_mode: "Mode Gelap",
    bloked_users: "Pengguna Diblokir",
    settings: "Pengaturan",
    report_bug: "Laporkan Bug",
    about_us: "Tentang NextChat",
    logout: "Keluar",
  },
  my_profile: {
    title: "Profil Saya",
    bio: "Bio",
    username: "Nama Pengguna",
    email: "Email",
    copy_tooltip: "Salin {label} ke papan clip",
    edit_tooltip: "Ubah profil",
    edit_title: "Edit Profil Saya",
    edit_submit: "Simpan Perubahan",
    messages: {
      profile_created: "Profil berhasil dibuat.",
      profile_updated: "Profil berhasil diperbarui.",
    },
  },
  blocked_user: {
    title: "Pengguna Diblokir",
    no_data: "Tidak ada pengguna diblokir ditemukan.",
    messages: {
      block_success: "Pengguna berhasil diblokir.",
      unblock_success: "Pengguna berhasil dibuka blokir.",
    },
  },
  settings: {
    title: "Pengaturan",
    appearance: {
      title: "Tema dan Tampilan",
      theme_mode: "Mode Tema",
      theme_opt: {
        light: "Terang",
        dark: "Gelap",
        system: "Sistem",
      },
      language: "Bahasa",
      language_opt: {
        en: "English",
        id: "Bahasa Indoenesia",
      },
      time_format: "Format Waktu",
      time_format_opt: {
        "12-hour": "12 Jam",
        "24-hour": "24 Jam",
      },
    },
    notifications: {
      title: "Notifikasi",
      allow_notifications: "Izinkan Notifikasi",
      privat_chat: "Obrolan Pribadi",
      group: "Grup",
      channel: "Saluran",
    },
    security: {
      title: "Privasi dan Keamanan",
      allow_add_group: "Izinkan orang lain menambahkan saya ke grup",
      allow: "Izinkan",
      dont_allow: "Tidak Izinkan",
      enable_2fa: "Autentikasi Dua Faktor (2FA)",
      enable: "Aktifkan",
      disable: "Nonaktifkan",
    },
    messages: {
      settings_updated: "Pengaturan berhasil diperbarui.",
    },
  },
  floating_menu: {
    new_group: "Group Baru",
    new_channel: "Saluran Baru",
  },
  group: {
    new: {
      title: "Grup Baru",
      submit: "Buat Grup",
    },
    edit: {
      title: "Edit Grup",
      submit: "Perbarui Grup",
    },
    form: {
      name: "Nama",
      "name.placeholder": "Masukkan nama grup Anda",
      description: "Deskripsi (Opsional)",
      "description.placeholder": "Deskripsikan grup Anda",
      type: "Tipe",
      type_opt: {
        public: "Publik",
        private: "Pribadi",
      },
      members: "Anggota",
      "members.placeholder": "Pilih anggota",
      "members.empty": "Tidak ada user ditemukan.",
    },
    info: {
      title: "Informasi Grup",
      description: "Deskripsi",
      link: "Tautan Undang",
      notifications: "Notifikasi",
      members: "Anggota",
      "total_members#zero": "0 anggota",
      "total_members#one": "1 anggota",
      "total_members#other": "{count} anggota",
      "members.empty": "Tidak ada anggota group.",
      admin: "Admin",
      remove: "Hapus",
    },
    add_members: {
      title: "Tambah Anggota",
      search: "Cari pengguna",
      "search.empty": "Tidak ada pengguna ditemukan",
      action: "Tambah",
    },
    admin: {
      title: "Administrator",
      info: "Anda dapat menambahkan admin untuk membantu Anda mengelola grup Anda.",
      remove: "Hapus",
      add: {
        title: "Tambah Administrator",
        empty: "Tidak ada anggota tersedia.",
        action: "Tambah",
      },
    },
    tooltip: {
      edit: "Edit Grup",
      add_members: "Tambah Anggota",
      add_admins: "Tambah Administrator",
    },
    messages: {
      created: "Grup berhasil dibuat.",
      updated: "Grup berhasil diperbarui.",
      added_members: "Anggota berhasil ditambahkan.",
      removed_members: "Anggota berhasil dihapus.",
      added_admins: "Admin berhasil ditambahkan.",
      removed_admins: "Admin berhasil dihapus.",
      notification_updated: "Notifikasi berhasil diperbarui.",
    },
  },
  channel: {
    new: {
      title: "Saluran Baru",
      submit: "Buat Saluran",
    },
    edit: {
      title: "Edit Saluran",
      submit: "Perbarui Saluran",
    },
    form: {
      name: "Nama",
      "name.placeholder": "Masukkan nama saluran Anda",
      description: "Deskripsi (Opsional)",
      "description.placeholder": "Deskripsikan saluran Anda",
      type: "Tipe",
      type_opt: {
        public: "Publik",
        private: "Pribadi",
      },
    },
    info: {
      title: "Informasi Saluran",
      description: "Deskripsi",
      link: "Tautan Undang",
      notifications: "Notifikasi",
      subscribers: "Pelanggan",
      "total_subscribers#zero": "0 pelanggan",
      "total_subscribers#one": "1 pelanggan",
      "total_subscribers#other": "{count} pelanggan",
      "subscribers.empty": "Tidak ada pelanggan saluran.",
      admin: "Admin",
      remove: "Hapus",
      show_more: "Lebih banyak",
    },
    admin: {
      title: "Administrator",
      info: "Anda dapat menambahkan admin untuk membantu Anda mengelola saluran Anda.",
      remove: "Hapus",
      add: {
        title: "Tambah Administrator",
        empty: "Tidak ada pelanggan tersedia.",
        action: "Tambah",
      },
    },
    tooltip: {
      edit: "Edit Saluran",
      add_admins: "Tambah Administrator",
    },
    messages: {
      created: "Saluran berhasil dibuat.",
      updated: "Saluran berhasil diperbarui.",
      added_admins: "Admin berhasil ditambahkan.",
      removed_admins: "Admin berhasil dihapus.",
      notification_updated: "Notifikasi berhasil diperbarui.",
    },
  },
  room_menu: {
    group: {
      mute: "Bisukan",
      unmute: "Aktifkan",
      leave: "Keluar dari Grup",
      delete: "Hapus Pesan",
      confirm_mute: {
        title: "Bisukan Grup",
        message: "Apakah Anda yakin ingin membisukan grup ini?",
      },
      confirm_unmute: {
        title: "Aktifkan Grup",
        message: "Apakah Anda yakin ingin mengaktifkan grup ini?",
      },
      confirm_leave: {
        title: "Keluar dari Grup",
        message:
          "Apakah Anda yakin ingin keluar dari grup ini? Anda tidak akan lagi menerima pesan dari grup ini.",
      },
      confirm_delete: {
        title: "Hapus Pesan",
        message:
          "Apakah Anda yakin ingin menghapus pesan dari grup ini? Tindakan ini tidak dapat dibatalkan.",
      },
    },
    channel: {
      mute: "Bisukan",
      unmute: "Aktifkan",
      leave: "Keluar dari Saluran",
      delete: "Hapus Pesan",
      confirm_mute: {
        title: "Bisukan Saluran",
        message: "Apakah Anda yakin ingin membisukan saluran ini?",
      },
      confirm_unmute: {
        title: "Aktifkan Saluran",
        message: "Apakah Anda yakin ingin mengaktifkan saluran ini?",
      },
      confirm_leave: {
        title: "Keluar dari Saluran",
        message:
          "Apakah Anda yakin ingin keluar dari saluran ini? Anda tidak akan lagi menerima pesan dari saluran ini.",
      },
      confirm_delete: {
        title: "Hapus Pesan",
        message:
          "Apakah Anda yakin ingin menghapus pesan dari saluran ini? Tindakan ini tidak dapat dibatalkan.",
      },
    },
  },
} as const
