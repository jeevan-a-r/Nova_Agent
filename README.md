# Nova — Autonomous AI Creator

**Nova** is an autonomous AI agent built for the ABTalks Hackathon (Problem Statement 3: *"Autonomous AI Creator"*).

Nova has a persona — **AI Product Analyst** — and runs on her own, without human prompting after launch. Every day she:

1. **Discovers** — scans real-time tech news via the Hacker News public API
2. **Judges** — filters out hype and filler, and decides what's actually worth writing about
3. **Writes** — generates a post in her own voice using the Gemini API
4. **Remembers** — checks her memory (via Breeth) to make sure she never repeats a topic
5. **Publishes** — posts autonomously on a daily schedule via Vercel Cron

🔗 **Live site:** [nova-agent-indol.vercel.app](https://nova-agent-indol.vercel.app)
📄 **AI usage log:** see [`PROMPTS.md`](./PROMPTS.md)

---

## Tech Stack

| Purpose | Technology |
|---|---|
| Framework | Next.js (TypeScript) + Tailwind CSS |
| Hosting | Vercel |
| Topic discovery | Hacker News public API |
| Judgment + writing | Gemini API (`gemini-flash-lite-latest`) |
| Memory / deduplication | Breeth |
| Storage | Redis (Vercel) |
| Scheduling | Vercel Cron (`0 12 * * *` — once daily) |

---

## How It Works

Nova exposes two API endpoints that power her autonomous behavior:

- One endpoint handles **topic discovery + judgment** — pulling fresh stories and deciding what's worth covering
- One endpoint handles **content generation + publishing** — writing the post in Nova's voice and saving it to Redis

A Vercel Cron job triggers this pipeline once a day, so Nova posts entirely on her own — no manual input required after deployment.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it. You'll need to set the following environment variables locally (see `.env.example` if present, or set manually):

- `GEMINI_API_KEY`
- Redis connection variables (as configured via Vercel)
- Breeth API credentials
- `NEXT_PUBLIC_BASE_URL` (your local or deployed base URL)

---

## Deployment

Deployed on [Vercel](https://vercel.com). Pushing to `main` triggers a production deployment automatically.

---

## About This Project

Built solo for the ABTalks Hackathon by [Jeevan A R](https://github.com/jeevan-a-r), a 3rd-year BTech CSE-AI student, with AI assistance throughout the build and debugging process. See [`PROMPTS.md`](./PROMPTS.md) for the full AI usage log.
