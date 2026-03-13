# BitTrust - AI Agent Guidelines

As an AI Agent working on the BitTrust frontend, adhere to the following core guidelines and rules.

## 1. Project Info
BitTrust is a decentralized reputation oracle for AI agents and wallets on Stacks (Bitcoin L2). It computes an on-chain credit score based on wallet activity to facilitate trustless machine-to-machine interactions, monetized via the x402 protocol (micro-payments for API queries).

## 2. Frontend Code Rules
- Write clean, maintainable, and strongly-typed React code using TypeScript.
- Follow functional programming paradigms where applicable.
- Ensure all components are strictly typed using TypeScript interfaces/types.
- Never leave commented-out code or excessive console logs in the final implementation.

## 3. File Structure & Component Rules
- **Do not write monolithic files.** Break down views into modular components.
- Expected Folder Structure:
  - `src/app/`: Next.js App Router pages and layouts.
  - `src/components/ui/`: Primitive UI components (shadcn/ui).
  - `src/components/`: Feature-specific and layout components.
  - `src/lib/`: Utility functions (e.g., `utils.ts` for Tailwind merge).
  - `src/hooks/`: Custom React hooks.
- **Componentization:** If a file exceeds 150-200 lines, extract logic or sub-components into their own files.

## 4. UI Library
- Use **shadcn/ui** for standard components (Buttons, Cards, Modals, Forms).
- You will need to install and configure shadcn/ui and its dependencies. Do not rely on generic custom Tailwind HTML unless a shadcn component is completely unsuitable.

## 5. Design Rules & Directives
- **Theme:** Institutional, monitoring tool, "Bitcoin-native credit bureau". Dark mode primarily.
- **Color Palette:**
  - App Background: `#020617`
  - Cards: `#020817` or `#050816`
  - Accents: Amber (`#F7931A`), Purple (`#5546FF`)
  - Text: Main (`#E5E7EB`), Muted (`#9CA3AF`)
- **Typography:** Inter or Satoshi (base 14-15px).
- **Layouts:** Use max-width containers (1200-1280px) and responsive grids.

### Pre-defined Tailwind Styles
- **Cards:** `rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm`
- **Primary Buttons:** `bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium rounded-lg`
- **Secondary Buttons:** `bg-slate-800 hover:bg-slate-700 text-slate-100`

### UX Considerations
- Fast transitions (`duration-150` or `duration-200` `ease-out`).
- Skeleton loaders over spinners.
- Concrete, no-hype copy.
- Visually highlight risks (red/yellow/green) so users and agents can assess in one glance.