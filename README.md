# NextChat

NextChat is a secure, easy-to-use messaging app for seamless conversations and media sharing.

## Live App

View live app of NextChat [here](https://app-next-chat.vercel.app)

## Key Features

- **Multi-Platform Support**: Accessible on both desktop and mobile devices.
- **Clean UI/UX**: A simple yet appealing interface for ease of use.
- **User Authentication**: Secure login with modern authentication methods.
- **Group and Channel**: Group messaging and channel are available.
- **Realtime Messaging**: Realtime messaging with auto-scrolling.

### Coming soon featues

- **Push Notifications**: (soon)
- **Email Verification**: Verify email address for registration, resetting password, or 2FA.
- **Login with google**:

## Tech Stack

- **Frontend**:

  - React (Next.js)
  - TailwindCSS
  - ShadCN UI
  - React Hook Form
  - Zod
  - Tanstack Query

- **Backend**:

  - Bun (Hono)
  - Prisma (ORM)
  - Zod
  - Inversify (DI)
  - Clean Architecture

- **Database**:

  - PostgreSQL

- **Deployment**:
  - [Vercel](https://vercel.com/) for frontend
  - [Netlify](https://www.netlify.com/) for backend
  - [Neon](https://neon.tech/) for serverless database

## Installation

Follow these steps to run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/username/next-chat.git
cd next-chat
```

### 2. Install Dependencies

Install with your favorite package manager. I use [Bun](https://bun.sh/) here.

```bash
bun install
```

### 3. Configure Environment Variables

Create a .env or .env.local file in the project root and add the following configurations:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:8000/api
AUTH_SECRET=your_jwt_secret_key
```

Make sure `AUTH_SECRET` value samw with the backend environment.

### 4. Setup Backend Server

See backend repo [here](https://github.com/nurmuhamadas/next-chat-be)

### 5. Start the Application

Run the backend server and frontend application:

```bash
bun run dev
```

### 6. Access the Application

Open your browser and visit http://localhost:3000.

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, feel free to reach out:

Email: nurmuhamad.a.13@gmail.com
