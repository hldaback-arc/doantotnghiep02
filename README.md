## Viet Interview Pro

AI-assisted interview practice and salary negotiation workspace for Vietnamese users.

### Stack

- Next.js 16 App Router, React 19, TypeScript strict
- Supabase Auth, PostgreSQL, Storage and RLS
- OpenAI Responses API and Realtime API
- Tailwind CSS 4 and custom UI tokens

### Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill rotated values locally. Never commit `.env.local`.

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   OPENAI_API_KEY=...
   ```

3. Start development:

   ```bash
   npm run dev
   ```

### Supabase migrations

Run the SQL files in `supabase/migrations` in filename order in the Supabase SQL Editor or with the Supabase CLI. The migrations create profiles, interview, feedback, salary, storage metadata, JD, notifications, analytics and admin role support.

The migrations are designed to be rerun safely where policies/triggers are recreated. Do not paste secret keys into SQL or commit them.

### Routes

- `/` landing page
- `/login`, `/register`, `/forgot-password` authentication
- `/dashboard`, `/profile`, `/progress`, `/history`, `/notifications`, `/settings`
- `/interview/new`, chat, voice and result routes
- `/salary/new`, salary workspace and roleplay
- `/cv`, `/jd`, and JD extraction
- `/admin` aggregate-only admin view

### Quality gates

```bash
npm run lint
npm run typecheck
npm run build
```

Private operations follow authenticate -> authorize -> validate -> execute -> safe response. Secrets stay server-side, user data is protected by ownership checks and RLS, and async UI flows expose loading/error/empty states.# doantotnghiep02
