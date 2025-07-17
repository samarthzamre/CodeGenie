# 🧠 CodeGenie – AI Website Code Generator

**CodeGenie** is an AI-powered code generation platform where users simply enter a prompt, and the system auto-generates frontend code with a live preview – all in real-time using OpenAI + Convex + Sandpack.

🔗 **Live Demo:** (https://code-genie-kappa.vercel.app/)

---

## 🚀 Features

- 🧠 AI-generated code from natural language prompts
- 💻 Live code preview using [Sandpack](https://sandpack.codesandbox.io/)
- 🪄 One-click deployable frontend components
- 🧩 Workspace history with persistent sessions
- 🔐 Authentication and personalized workspace
- ⚙️ Fully modular Next.js 13+ (App Router) project with Convex backend

---

## 🔧 Built With

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Convex-2D3748?style=for-the-badge&logoColor=white" />
  <img src="https://img.shields.io/badge/Sandpack-F5A623?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
</p>

---

## 📁 Project Structure

```bash
samarthzamre-codegenie/
├── README.md
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── app/
│   ├── ConvexClientProvider.jsx
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   ├── provider.jsx
│   ├── (main)/
│   │   ├── pricing/
│   │   │   └── page.jsx
│   │   └── workspace/
│   │       └── [id]/
│   │           └── page.jsx
│   └── api/
│       ├── ai-chat/
│       │   └── route.jsx
│       └── gen-ai-code/
│           └── route.jsx
├── components/
│   └── custom/
│       ├── AppSideBar.jsx
│       ├── ChatView.jsx
│       ├── CodeView.jsx
│       ├── Header.jsx
│       ├── Hero.jsx
│       ├── PricingModel.jsx
│       ├── SandpackPreviewClient.jsx
│       ├── SideBarFooter.jsx
│       ├── SignInDialog.jsx
│       └── WorkspaceHistory.jsx
├── configs/
│   └── AIModel.jsx
├── context/
│   ├── ActionContext.jsx
│   ├── MessagesContext.jsx
│   ├── SidebarContext.jsx
│   └── UserDetailContext.jsx
├── convex/
│   ├── schema.js
│   ├── users.js
│   ├── workspace.js
│   └── _generated/
│       ├── api.d.ts
│       ├── api.js
│       ├── dataModel.d.ts
│       ├── server.d.ts
│       └── server.js
└── data/
    ├── Colors.jsx
    ├── Lookup.jsx
    └── Prompt.jsx
⚙️ Getting Started
1. Clone the Repository
git clone https://github.com/samarthzamre/samarthzamre-codegenie.git
cd samarthzamre-codegenie
2. Install Dependencies
npm install
3. Set Up Environment Variables
Create a .env.local file and add:
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
4. Run the Development Server
npm run dev
📌 Learnings
Using Convex as a serverless backend with Next.js
Integrating Gemini Free API (by Google) for natural language code generation
Handling live preview rendering using Sandpack
Managing UI state and logic with React Context API
Structuring scalable applications with the Next.js 13 App Router
🧑‍💻 Author
Samarth Vidhyadas Zamre
