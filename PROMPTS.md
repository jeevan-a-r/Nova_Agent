PROMPTS.md — AI Usage Log
Project: Nova — Autonomous AI Creator

Hackathon: ABTalks — Problem Statement 3: "Autonomous AI Creator" Builder: Solo, 3rd-year BTech CSE-AI student (beginner coder) Deadline: Sunday, 9 Aug, 8 PM IST

What Nova Is

Nova is an autonomous AI agent with the persona of an AI Product Analyst. She:

Discovers real AI/tech news from the Hacker News public API
Judges what's actually worth posting about (skeptical of hype, filters filler)
Writes about chosen topics in her own voice using the Gemini API (gemini-flash-lite-latest)
Remembers past posts using Breeth (memory) so she never repeats a topic
Stores posts in Redis (Vercel)
Posts autonomously on a schedule via Vercel Cron (0 12 * * *, once daily — free tier limit)
Exposes two required API endpoints for judging and content generation

Tech stack: Next.js (TypeScript) + Tailwind CSS, deployed on Vercel.

How AI Was Used in This Build

This project was built end-to-end with AI assistance (Claude) across two phases:

Phase 1 — Core Agent (prior session)
Designed and implemented Nova's autonomous pipeline: topic discovery (Hacker News API) -> judgment + writing (Gemini) -> memory/deduplication (Breeth) -> storage (Redis) -> scheduled autonomous posting (Vercel Cron)
Built and tested the two required API endpoints live
Confirmed the cron job could post real autonomous content unattended - verified with 4+ distinct posts and zero topic repeats
Phase 2 — UI Polish (this session)

Built a full custom homepage (app/page.tsx) end-to-end with AI pair-programming, including:

Dark theme with emerald/teal branding and a custom "N" logo (overlapping circles + stroke, inline SVG)
Navbar with logo, GitHub link, and "How it works" anchor link
Hero section with persona blurb and live stats (post count, "live since" date, pulled dynamically from stored posts)
Styled post cards with hover glow effect and a tinted "Why this topic" rationale box per post
Footer with tech-stack badges
Custom favicon (app/icon.tsx)
Dot-grid background texture
"How Nova Works" 3-step explainer section
Smooth scroll behavior for the "How it works" anchor link (globals.css)
Debugging With AI (this session)

After deploying the new homepage, the live site began returning a 500 server error. Working through this with Claude:

Identified via Vercel Runtime Logs that the error was TypeError: fetch failed caused by ECONNREFUSED 127.0.0.1:3000
Root cause: app/page.tsx fetched post data using a hardcoded http://localhost:3000 fallback, which doesn't exist in a production environment
Fix: added a NEXT_PUBLIC_BASE_URL environment variable on Vercel (set to the live production URL) so the server-side fetch resolves correctly in production
Redeployed and confirmed the live site rendered correctly
Development Approach

As a beginner coder, I worked with Claude as an active pair-programmer and technical guide throughout:

Claude did the technical reasoning, wrote the code, and diagnosed errors
I ran commands, pasted code, clicked through the Vercel/GitHub UI, and reported back errors and screenshots
Debugging was done interactively: reading Vercel deployment status -> build logs -> runtime logs -> isolating the exact error -> applying a targeted fix -> verifying on the live URL
Links
GitHub: github.com/jeevan-a-r/Nova_Agent
Live URL: https://nova-agent-indol.vercel.app
