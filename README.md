# NextChat

NextChat is a secure, easy-to-use messaging app for seamless conversations and media sharing.

## Key Features

- **Multi-Platform Support**: Accessible on both desktop and mobile devices.
- **Clean UI/UX**: A simple yet appealing interface for ease of use.
- **User Authentication**: Secure login with modern authentication methods.
- **Group and Channel**: Group messaging and channel are available.

### Coming soon featues

- **Realtime Messaging**: Currently this app not implement real-time data due to issues with the websocket server in Next.js. It should create custom server and will unable to deploy in vercel. (I'm not dedicate VPS for this app 😆).
  I will create separate backend server with Hono (not in Next.js). So I can create socket to make this app real-time.
- **Push Notifications**: (soon)

## Tech Stack

- **Frontend**:

  - React (Next.js)
  - TailwindCSS
  - ShadCN UI

- **Backend**:
  - Next.js integrated with Hono
  - Prisma (ORM)
- **Database**:
  - PostgreSQL

## Installation

Follow these steps to run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/username/nextchat.git
cd nextchat
```

### 2. Install Dependencies

Make sure Node.js and npm are installed on your system.

```bash
bun install
```

### 3. Configure Environment Variables

Create a .env file in the project root and add the following configurations:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_APPWRITE_SECRET_KEY=your_key
NEXT_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_APPWRITE_PROJECT_ID=your_project_id
NEXT_APPWRITE_STORAGE_ID=your_storage_id
DATABASE_URL=postgresql://user:password@localhost:5432/nextchat
AUTH_SECRET=your_jwt_secret_key
```

### 4. Run Database Migrations

Initialize the database schema using the following command:

```bash
bunx prisma migrate dev
```

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
