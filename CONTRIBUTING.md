# Contributing to Studio Admin

Thanks for showing interest in improving **Studio Admin** (repo: `next-shadcn-admin-dashboard`).  
This guide will help you set up your environment and understand how to contribute.

---

## Overview

This project is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI**.  
The goal is to keep the codebase modular, scalable, and easy to extend.

---

## Project Layout

We use a **colocation-based file system**. Each feature keeps its own pages, components, and logic.

```
src
├── app               # Next.js routes (App Router)
│   ├── (auth)        # Auth layouts & screens
│   ├── (main)        # Main dashboard routes
│   │   └── (dashboard)
│   │       ├── crm
│   │       ├── finance
│   │       ├── default
│   │       └── ...
│   └── layout.tsx
├── components        # Shared UI components
├── hooks             # Reusable hooks
├── lib               # Config & utilities
├── styles            # Tailwind / theme setup
└── types             # TypeScript definitions
```

- **External Pages**: Landing pages or other non-dashboard routes → `src/app/(external)/`
- **Auth Screens**: Login, register, and authentication layouts → `src/app/(main)/auth/`
- **Dashboard Screens**: Feature dashboards like CRM, Finance, Analytics → `src/app/(main)/dashboard/`
- **Components**: Reusable UI goes in `src/components/`
- **Hooks**: Custom logic goes in `src/hooks/`
- **Themes**: New presets under `src/styles/presets/`

---

## Guidelines

- Prefer **TypeScript types** over `any`
- Husky pre-commit hooks are enabled - linting and formatting run automatically when you commit, and if there are errors the commit will be blocked until they are fixed.
- Follow **Shadcn UI** style & Tailwind v4 conventions
- Keep accessibility in mind (ARIA, keyboard nav)
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, etc.)
- Avoid unnecessary dependencies — prefer existing utilities where possible

---
