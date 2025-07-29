# 🚀 Codely

**Codely** is a powerful AI-powered SaaS platform that empowers users to build full-fledged web applications simply by writing prompts. Whether you're a developer, startup founder, or non-technical creator — Codely transforms your ideas into live, production-ready applications in seconds.

Built on cutting-edge technologies like OpenAI, tRPC, and secure cloud sandboxes, Codely automates everything from UI generation to backend logic, authentication, and deployment.

---

## 📸 Demo

🌐 Live Site: [https://codely-psi.vercel.app](https://codely-psi.vercel.app)



---

## ✨ Features

- ⚡ **Prompt-based Generation**  
  Instantly generate custom web apps just by describing what you want.

- 🔐 **Authentication & Payments via Clerk**  
  Secure login/signup and integrated payment workflows for SaaS monetization.

- 🤖 **AI Integration with OpenAI APIs**  
  GPT-powered backend to understand and convert user prompts into code and logic.

- 📦 **Cloud Sandboxes using E2B**  
  Secure, isolated development environments to run and preview generated apps safely.

- 🔁 **Background Jobs and AI Agents with Inngest**  
  Asynchronous background processing and task scheduling for smooth UX.

- ⚙️ **Type-Safe API Layer with tRPC & TanStack Query**  
  End-to-end typesafety between backend and frontend.

- 🛠️ **Docker-based Sandbox Template Generator**  
  Dynamically generate new Dockerized environments on the fly.

- 🧬 **Modern ORM + Cloud Database**  
  Prisma ORM with Neon DB (PostgreSQL) ensures scalable, reliable data handling.

- 🌗 **Dark & Light Theme Support**  
  Auto-adapts to user preference with seamless theme transitions.

---

## 🧑‍💻 Tech Stack

| Category           | Technology Stack                                |
|------------------- |-------------------------------------------------|
| **Frontend**       | Next.js 15, Tailwind CSS v4                     |
| **Backend**        | tRPC, TanStack Query, Inngest                   |
| **AI Integration** | OpenAI APIs                                     |
| **Authentication** | Clerk                                           |
| **Payment**        | Clerk Billing                                   |
| **Sandboxing**     | E2B (Ephemeral cloud dev environments)          |
| **Database**       | Prisma ORM, Neon DB (PostgreSQL)                |
| **Containerization** | Docker                                        |
| **Deployment**     | Vercel                                          |

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yashutandon/codely.git
cd codely

### 2. Install dependencies

```bash
npm install
# or
yarn install

### 3. Create environment variables
Create a .env file in the root directory and add the following:

# Database
DATABASE_URL=your_neon_db_url

# Clerk
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_frontend_api

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Inngest
INGGEST_API_KEY=your_inngest_key

# E2B
E2B_API_KEY=your_e2b_key

### 4. Set up the database

```bash

npx prisma generate
npx prisma migrate dev --name init


### 5. Run the development server

```bash

npm run dev
# or
yarn dev

Open http://localhost:3000 in your browser.