# BitTrust - Project Context & Rules

## 1. Project Info
BitTrust is a **decentralized reputation protocol** built on Stacks (Bitcoin L2). It allows wallets and AI agents to verify trust before interacting in the Bitcoin ecosystem. 
- **Core Problem:** AI agents and DeFi protocols need a way to evaluate counterparty risk without over-collateralization.
- **Solution:** An on-chain credit score derived from wallet behavior (tx history, smart contract execution success, loan repayment, DeFi participation).
- **Key Innovation:** x402 Protocol Integration (HTTP 402 Payment Required) allowing machine-to-machine paid API access for score retrieval.

## 2. Clean Frontend Code Rules
- **TypeScript First:** Always write strongly-typed TypeScript code. Avoid `any` types.
- **Modularity:** Keep functions and components pure and small.
- **State Management:** Use local state where appropriate, and lift state up only when necessary. Prefer hooks for complex logic.
- **Readability:** Prioritize readability and self-documenting variable/function names over clever shorthand.

## 3. File Structure & Componentization
- **No Monolithic Files:** Never write an entire view or complex logic in a single file. 
- **Separation of Concerns:** 
  - UI Components go in `src/components/ui/` (especially shadcn components).
  - Feature components go in `src/components/`.
  - Reusable logic goes in `src/hooks/`.
  - Utility functions go in `src/lib/`.
- **Next.js App Router:** Follow standard Next.js App Router conventions (`app/page.tsx`, `app/layout.tsx`).

## 4. UI Library
- Use **shadcn/ui** for all base components (Buttons, Cards, Inputs, Dialogs, etc.).
- Build your UI by combining these customizable, accessible components rather than writing custom CSS or using other UI libraries.

## 5. Design Rules & Direction
### Product Feel
- **Theme:** “Bitcoin-native credit bureau for AI agents” – serious, data-heavy, slightly sci‑fi but not flashy.
- **Tone:** Institutional (credit score, risk), but with agentic/automation hints.
- **Visual Metaphor:** Credit score dashboard + observability tool (Datadog/Grafana vibes). Make it feel like a **monitoring tool**.

### Color Palette
- **Backgrounds:** `#020617` (main app), `#020817` / `#050816` (card backgrounds).
- **Primary Accent (actions, main score chip):** Bitcoin amber `#F7931A` (hover/dark: `#C56F11`).
- **Secondary Accent:** `#5546FF` or `#5B3EE4`.
- **Semantic:** Success `#10B981`, Warning `#FACC15`, Danger `#EF4444`.
- **Text:** Muted text `#9CA3AF`, main text `#E5E7EB`.
- **Charts:** Score line amber (`#FBBF24`).
- **Style:** Cards should be high contrast but matte (no glassmorphism, no excessive gradients).

### Typography & Layout
- **Font:** Inter, Satoshi, or similar clean sans, 14–15px base.
- **Headings:** H1: 28–32px (page titles), H2: 20–22px (section titles inside dashboard).
- **Layout:** Max width 1200–1280px content area, centered. 3–4 column grid at desktop, single column on mobile.

### Component Style System (Tailwind)
- **Cards:** `rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm`
- **Primary button:** `bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium rounded-lg`
- **Secondary button:** `bg-slate-800 hover:bg-slate-700 text-slate-100`
- **Badges:** `rounded-full px-2.5 py-0.5 text-xs uppercase`
- **Inputs:** `bg-slate-900 border border-slate-700 focus:border-amber-500`

### UX Principles & Micro-UX
- Single primary action per view (e.g., "Connect wallet" on Home, "Refresh score" on Dashboard).
- Data > decoration. Avoid big illustrations on the dashboard.
- Make risk immediately obvious with colors and labels.
- **Transitions:** 150–200ms ease-out for hover/focus.
- **Loading:** Use Skeletons for cards and charts, not spinners.
- **Empty States:** Short and actionable (e.g., “No reputation yet. Start using DeFi protocols to build your score.”).
- **Copy:** Concrete, no hype.