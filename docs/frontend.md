# Frontend Documentation

## Overview

The BitTrust frontend is a production-ready Next.js 16 application built with React 18, TypeScript, and Tailwind CSS. It provides a cyberpunk-themed dashboard for users to view their reputation scores, verify identity, and interact with the BitTrust protocol.

**Key Features:**
- Real-time reputation score visualization
- Identity verification system
- Network detection (mainnet/testnet)
- Responsive design with mobile support
- React Query for data fetching and caching
- Stacks wallet integration (Xverse, Leather, Hiro)
- Dark mode cyberpunk UI

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Architecture                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Next.js    │
│  App Router  │
└──────┬───────┘
       │
       ├─────► Pages Layer
       │       ├─ / (Landing)
       │       ├─ /dashboard (Score overview)
       │       ├─ /profile (Detailed breakdown)
       │       ├─ /leaderboard (Rankings)
       │       ├─ /activity (Transaction history)
       │       ├─ /verification (Identity linking)
       │       ├─ /settings (User preferences)
       │       └─ /support (Help & docs)
       │
       ├─────► Components Layer
       │       ├─ Layout (AppLayout, Sidebar, Header)
       │       ├─ Dashboard (Cards, Charts, Tables)
       │       └─ UI (Radix primitives)
       │
       ├─────► State Management
       │       ├─ React Query (Server state)
       │       ├─ WalletContext (Wallet connection)
       │       └─ Local state (React hooks)
       │
       ├─────► Data Layer
       │       ├─ API Client (Backend REST)
       │       ├─ Contract Calls (Stacks blockchain)
       │       └─ Hooks (useReputationQuery, etc.)
       │
       └─────► External Services
               ├─ Backend API (Reputation scoring)
               ├─ Stacks Connect (Wallet auth)
               └─ Hiro API (Transaction data)
```

---

## Folder Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Landing page
│   │   ├── Providers.tsx             # Client-side provider wrapper
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard page wrapper
│   │   │   └── DashboardContent.tsx  # Main dashboard (client)
│   │   ├── profile/
│   │   │   ├── page.tsx              # Profile page wrapper
│   │   │   └── ProfileContent.tsx    # Profile details (client)
│   │   ├── leaderboard/
│   │   │   ├── page.tsx              # Leaderboard page wrapper
│   │   │   └── LeaderboardContent.tsx # Rankings table (client)
│   │   ├── activity/
│   │   │   └── page.tsx              # Transaction history
│   │   ├── verification/
│   │   │   └── page.tsx              # Identity verification
│   │   ├── settings/
│   │   │   ├── page.tsx              # Settings page wrapper
│   │   │   └── SettingsContent.tsx   # User preferences (client)
│   │   └── support/
│   │       └── page.tsx              # Help & documentation
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # Main app layout wrapper
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   └── Header.tsx            # Top header bar
│   │   ├── dashboard/
│   │   │   ├── ReputationCard.tsx    # Score display card
│   │   │   ├── ScoreChart.tsx        # Historical chart
│   │   │   ├── FactorBreakdown.tsx   # Score factors
│   │   │   ├── LoanStatus.tsx        # Loan eligibility
│   │   │   ├── CreditsCard.tsx       # USDCx balance
│   │   │   └── ActivityTable.tsx     # Recent transactions
│   │   └── ui/                       # Radix UI primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── table.tsx
│   │       └── ...
│   │
│   ├── context/
│   │   └── WalletContext.tsx         # Wallet connection state
│   │
│   ├── hooks/
│   │   ├── useReputationQuery.ts     # Fetch reputation score
│   │   ├── useReputationHistoryQuery.ts # Fetch score history
│   │   ├── useLeaderboardQuery.ts    # Fetch leaderboard
│   │   ├── useVerificationQuery.ts   # Fetch verifications
│   │   ├── useUpdateReputationMutation.ts # Update score
│   │   ├── useContractRead.ts        # Read contract data
│   │   └── use-toast.ts              # Toast notifications
│   │
│   ├── lib/
│   │   ├── api-client.ts             # Backend API wrapper
│   │   ├── api.ts                    # API configuration
│   │   ├── contract-calls.ts         # Stacks contract calls
│   │   ├── contracts.ts              # Contract addresses
│   │   ├── query-keys.ts             # React Query keys
│   │   ├── score-utils.ts            # Score conversion utils
│   │   └── utils.ts                  # General utilities
│   │
│   ├── providers/
│   │   └── QueryProvider.tsx         # React Query provider
│   │
│   └── types/
│       ├── backend.ts                # Backend API types
│       └── contracts.ts              # Contract types
│
├── public/
│   ├── logo.svg                      # BitTrust logo
│   ├── icon.png                      # Favicon
│   └── _redirects                    # Vercel redirects
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env
```

---

## Key Features

### 1. Wallet Integration

**Supported Wallets:**
- Xverse
- Leather
- Hiro Wallet

**Implementation** (`context/WalletContext.tsx`):
```typescript
const { userSession, authenticate, signOut } = useConnect();
const [address, setAddress] = useState<string | null>(null);
const [network, setNetwork] = useState<NetworkMode>("testnet");

// Auto-detect network from wallet
useEffect(() => {
  if (userSession?.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    const detectedNetwork = userData.profile.stxAddress.mainnet 
      ? "mainnet" 
      : "testnet";
    setNetwork(detectedNetwork);
  }
}, [userSession]);
```

**Features:**
- Auto-connect on page load
- Network detection (mainnet/testnet)
- Persistent session
- Sign out functionality

---

### 2. Network Detection

**Display Logic:**
- Green badge: Mainnet
- Amber badge: Testnet
- Shown in sidebar and all API calls

**Implementation** (`components/layout/Sidebar.tsx`):
```typescript
<div className="flex items-center gap-2">
  <div className={`h-2 w-2 rounded-full ${
    network === "mainnet" ? "bg-green-500" : "bg-amber-500"
  }`} />
  <span className="text-xs">
    {network === "mainnet" ? "Mainnet" : "Testnet"}
  </span>
</div>
```

**API Integration:**
All API calls include network parameter:
```typescript
const { data } = useReputationQuery(address, network);
```

---

### 3. React Query Integration

**Setup** (`providers/QueryProvider.tsx`):
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**Query Keys** (`lib/query-keys.ts`):
```typescript
export const queryKeys = {
  reputation: (wallet: string, network: NetworkMode) => 
    ["reputation", wallet, network],
  reputationHistory: (wallet: string, network: NetworkMode) => 
    ["reputation-history", wallet, network],
  leaderboard: (network: NetworkMode, limit: number) => 
    ["leaderboard", network, limit],
  verification: (wallet: string) => 
    ["verification", wallet],
};
```

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

---

### 4. Score Display Conversion

**Backend → Frontend:**
- Backend returns: 0-100 (raw score)
- Frontend displays: 0-1000 (user-facing)

**Implementation** (`lib/score-utils.ts`):
```typescript
export function toDisplayScore(rawScore: number): number {
  return Math.round(rawScore * 10);
}

// Usage
const displayScore = toDisplayScore(reputationScore); // 75 → 750
```

**Used in:**
- Dashboard cards
- Profile page
- Leaderboard
- Activity history

---

### 5. Dynamic Imports (SSR Optimization)

**Problem:** Stacks Connect accesses `window` at module load, causing SSR crashes.

**Solution:** Dynamic imports with `ssr: false`

**Implementation** (`app/layout.tsx`):
```typescript
const Providers = dynamic(() => import("./Providers"), { ssr: false });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Also used for:**
- DashboardContent
- ProfileContent
- SettingsContent

---

## Pages

### Landing Page (`app/page.tsx`)

**Purpose:** Marketing page with hero section and feature highlights.

**Features:**
- Hero section with CTA
- Feature cards
- How it works section
- Connect wallet button

**Key Components:**
```typescript
<Button onClick={handleConnect}>
  Connect Wallet
</Button>
```

---

### Dashboard (`app/dashboard/DashboardContent.tsx`)

**Purpose:** Overview of reputation score and key metrics.

**Components:**
- `ReputationCard`: Score display with tier badge
- `ScoreChart`: Historical score visualization
- `FactorBreakdown`: Score component breakdown
- `LoanStatus`: Loan eligibility tiers
- `CreditsCard`: USDCx balance and credits
- `ActivityTable`: Recent transactions

**Data Flow:**
```typescript
const { data: reputation, isLoading } = useReputationQuery(address, network);

<ReputationCard
  reputationScore={reputation.reputationScore}
  tier={reputation.tier}
  tierLabel={reputation.tierLabel}
  explanation={reputation.explanation}
/>
```

---

### Profile (`app/profile/ProfileContent.tsx`)

**Purpose:** Detailed reputation breakdown and analysis.

**Sections:**
1. **Score Overview**: Current score with tier badge
2. **Factor Breakdown**: Detailed contribution of each factor
3. **Risk Flags**: Warnings for low scores
4. **Reputation Log**: Historical changes with tier transitions
5. **AI vs On-Chain**: Comparison panel
6. **Export**: JSON download button

**Key Features:**
```typescript
// Tier change detection
const tierChanges = history.filter((entry, i) => 
  i > 0 && entry.tier !== history[i - 1].tier
);

// Export functionality
const handleExport = () => {
  const blob = new Blob([JSON.stringify(reputation, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reputation-${address}.json`;
  a.click();
};
```

---

### Leaderboard (`app/leaderboard/LeaderboardContent.tsx`)

**Purpose:** Network-wide reputation rankings.

**Features:**
- Top 50 wallets by score
- Clickable wallet addresses (copy + explorer link)
- Tier badges
- Network filter
- Real-time updates

**Implementation:**
```typescript
const { data: leaderboard } = useLeaderboardQuery(network, 50);

<Table>
  {leaderboard.map((entry, index) => (
    <TableRow key={entry.wallet}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <button onClick={() => copyToClipboard(entry.wallet)}>
          {truncateAddress(entry.wallet)}
        </button>
        <a href={`https://explorer.hiro.so/address/${entry.wallet}`}>
          <ExternalLink />
        </a>
      </TableCell>
      <TableCell>{toDisplayScore(entry.reputationScore)}</TableCell>
      <TableCell><Badge>{entry.tier}</Badge></TableCell>
    </TableRow>
  ))}
</Table>
```

---

### Activity (`app/activity/page.tsx`)

**Purpose:** Transaction history from Hiro API.

**Features:**
- Real-time transaction fetching
- Transaction type badges
- Status indicators (success/failed)
- Timestamp formatting
- Explorer links

**Data Source:**
```typescript
const response = await fetch(
  `${HIRO_API}/extended/v1/address/${address}/transactions?limit=20`
);
const txs = await response.json();
```

---

### Verification (`app/verification/page.tsx`)

**Purpose:** Identity verification to boost reputation.

**Providers:**
- GitHub (+80 display pts)
- BNS Domain (+100 display pts)
- Twitter/X (+40 display pts)
- Discord (+30 display pts)

**Features:**
- Link/unlink functionality
- Progress tracking
- Bonus point display
- Privacy notice

**Implementation:**
```typescript
const handleLink = async (provider: string, handle: string) => {
  await linkVerification.mutateAsync({
    wallet: address,
    provider,
    handle,
  });
  toast({ title: "Identity linked successfully!" });
};

const handleUnlink = async (provider: string) => {
  await unlinkVerification.mutateAsync({
    wallet: address,
    provider,
  });
  toast({ title: "Identity unlinked" });
};
```

---

### Settings (`app/settings/SettingsContent.tsx`)

**Purpose:** User preferences and account management.

**Features:**
- Notification preferences
- Privacy settings
- Theme toggle (future)
- Account deletion

---

### Support (`app/support/page.tsx`)

**Purpose:** Help documentation and FAQs.

**Sections:**
- Getting started guide
- FAQ
- Contact information
- External links

---

## Components

### ReputationCard (`components/dashboard/ReputationCard.tsx`)

**Purpose:** Display current reputation score with visual indicators.

**Features:**
- Large score display (0-1000)
- Tier badge (color-coded)
- Progress bar to 1000
- Points to next tier
- AI explanation
- Refresh button

**Props:**
```typescript
interface ReputationCardProps {
  reputationScore: number;  // 0-100 from backend
  tier: string;             // "A+", "A", "B", "C"
  tierLabel: string;        // "Highly Trusted", etc.
  explanation: string;      // AI-generated text
  onRefresh: () => void;
}
```

---

### ScoreChart (`components/dashboard/ScoreChart.tsx`)

**Purpose:** Visualize reputation score over time.

**Features:**
- Line chart with Recharts
- Dynamic Y-axis domain
- Gradient fill
- Responsive design
- Tooltip with date/score

**Implementation:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <YAxis
      domain={([dataMin, dataMax]: readonly [number, number]): [number, number] => {
        const min = Math.max(0, Math.floor(dataMin / 100) * 100 - 100);
        const max = Math.min(1000, Math.ceil(dataMax / 100) * 100 + 100);
        return [min, max];
      }}
    />
    <Line type="monotone" dataKey="score" stroke="#F7931A" />
  </LineChart>
</ResponsiveContainer>
```

---

### FactorBreakdown (`components/dashboard/FactorBreakdown.tsx`)

**Purpose:** Show contribution of each scoring factor.

**Features:**
- Progress bars for each factor
- Raw values display
- Percentage contribution
- Color-coded bars

**Data Structure:**
```typescript
interface ScoreFactor {
  name: string;              // "WALLET_AGE_STABILITY"
  label: string;             // "Wallet Age & Stability"
  raw: string;               // "730 days"
  contribution: number;      // 18
  max: number;               // 20
  description: string;       // Explanation
}
```

---

### LoanStatus (`components/dashboard/LoanStatus.tsx`)

**Purpose:** Display loan eligibility based on reputation.

**Features:**
- 3-tier loan ladder
- Current tier highlight
- Unlock requirements
- Projected points needed

**Tiers:**
```typescript
const loanTiers = [
  { name: "Basic", minScore: 310, amount: "1,000 USDCx" },
  { name: "Standard", minScore: 610, amount: "5,000 USDCx" },
  { name: "Premium", minScore: 810, amount: "10,000 USDCx" },
];
```

---

### CreditsCard (`components/dashboard/CreditsCard.tsx`)

**Purpose:** Show USDCx balance and credit system.

**Features:**
- USDCx balance display
- Credit count
- Buy credits button
- Projected queries panel
- x402 protocol integration

**Implementation:**
```typescript
const { data: balance } = useContractRead(
  "usdcx-mock",
  "get-balance",
  [address]
);

const credits = Math.floor(balance / 1_000_000); // 1 USDCx = 1 credit
```

---

### ActivityTable (`components/dashboard/ActivityTable.tsx`)

**Purpose:** Display recent on-chain transactions.

**Features:**
- Real-time data from Hiro API
- Transaction type badges
- Status indicators
- Timestamp formatting
- Explorer links

**Data Fetching:**
```typescript
useEffect(() => {
  const fetchActivity = async () => {
    const response = await fetch(
      `${HIRO_API}/extended/v1/address/${address}/transactions?limit=10`
    );
    const data = await response.json();
    setTransactions(data.results);
  };
  fetchActivity();
}, [address, network]);
```

---

## Hooks

### useReputationQuery

**Purpose:** Fetch reputation score from backend.

**Usage:**
```typescript
const { data, isLoading, error, refetch } = useReputationQuery(
  address,
  network
);
```

**Returns:**
```typescript
{
  wallet: string;
  reputationScore: number;  // 0-100
  tier: string;
  tierLabel: string;
  trustLevel: string;
  loanEligibility: boolean;
  explanation: string;
  factors: ScoreFactor[];
  breakdown: ScoreBreakdown;
  metadata: ScoreMetadata;
  lastUpdated: string;
}
```

---

### useReputationHistoryQuery

**Purpose:** Fetch historical reputation scores.

**Usage:**
```typescript
const { data: history } = useReputationHistoryQuery(address, network);
```

**Returns:** Array of reputation snapshots with timestamps.

---

### useLeaderboardQuery

**Purpose:** Fetch network-wide rankings.

**Usage:**
```typescript
const { data: leaderboard } = useLeaderboardQuery(network, 50);
```

**Returns:** Array of top wallets sorted by score.

---

### useUpdateReputationMutation

**Purpose:** Trigger score recalculation.

**Usage:**
```typescript
const updateMutation = useUpdateReputationMutation();

const handleRefresh = () => {
  updateMutation.mutate({ wallet: address, network });
};
```

**Side Effects:**
- Invalidates reputation query cache
- Triggers UI refresh
- Shows toast notification

---

### useVerificationQuery

**Purpose:** Fetch linked identity providers.

**Usage:**
```typescript
const { data: verifications } = useVerificationQuery(address);
```

**Returns:**
```typescript
{
  wallet: string;
  providers: Array<{
    provider: string;
    handle: string;
    verifiedAt: string;
    bonus: number;
  }>;
  totalBonus: number;
}
```

---

## Styling

### Tailwind Configuration

**Theme:**
```javascript
theme: {
  extend: {
    colors: {
      bitcoin: "#F7931A",
      stacks: "#5546FF",
      background: "#0a0f1e",
      card: "#1a1f2e",
    },
    fontFamily: {
      mono: ["JetBrains Mono", "monospace"],
    },
  },
}
```

### Design System

**Color Palette:**
- Background: `#0a0f1e` (dark blue)
- Card: `#1a1f2e` (lighter blue)
- Primary: `#F7931A` (Bitcoin orange)
- Secondary: `#5546FF` (Stacks purple)
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)

**Typography:**
- Headings: `font-bold`
- Body: `font-normal`
- Code: `font-mono`

**Spacing:**
- Container: `max-w-7xl mx-auto px-4`
- Card padding: `p-6`
- Gap: `gap-4` or `gap-6`

---

## Environment Variables

### Required

```bash
NEXT_PUBLIC_API_URL=https://bittrust-backend.onrender.com
```

### Local Development

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## Running the Frontend

### Development

```bash
cd frontend
npm install
npm run dev
```

Server runs on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

---

## Deployment

### Vercel (Recommended)

**Setup:**
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://bittrust-backend.onrender.com
```

**Build Settings:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

---

## Performance Optimization

### Code Splitting

- Dynamic imports for heavy components
- Route-based code splitting (automatic with App Router)
- Lazy loading for charts and tables

### Caching Strategy

- React Query: 5min stale time
- Browser cache: Static assets
- Service worker: Future enhancement

### Bundle Size

- Tree shaking enabled
- Minimal dependencies
- Radix UI (lightweight)
- No heavy animation libraries

---

## Accessibility

### Implemented Features

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast (WCAG AA)
- Screen reader support

### Best Practices

- Use `<button>` for clickable elements
- Add `alt` text to images
- Provide labels for form inputs
- Use proper heading hierarchy
- Test with screen readers

---

## Testing

### Manual Testing Checklist

- [ ] Wallet connection (all 3 wallets)
- [ ] Network detection (mainnet/testnet)
- [ ] Score refresh
- [ ] Identity verification link/unlink
- [ ] Leaderboard loading
- [ ] Activity table fetching
- [ ] Mobile responsive design
- [ ] Error handling
- [ ] Loading states
- [ ] Toast notifications

### Browser Compatibility

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

---

## Troubleshooting

### Common Issues

**Wallet not connecting:**
- Check if wallet extension is installed
- Try refreshing the page
- Clear browser cache

**Score not loading:**
- Verify backend API is running
- Check network parameter
- Inspect browser console for errors

**Hydration errors:**
- Ensure dynamic imports have `ssr: false`
- Check for `window` access in components

**Build errors:**
- Run `npm install` to update dependencies
- Check TypeScript errors with `npx tsc --noEmit`
- Verify environment variables are set

---

## Future Enhancements

### Planned Features

- [ ] OAuth integration for GitHub/Twitter
- [ ] Real-time score updates via WebSocket
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] PWA support
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Email notifications

### Performance Improvements

- [ ] Service worker for offline support
- [ ] Image optimization
- [ ] Font optimization
- [ ] Prefetching for navigation

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Stacks Connect Documentation](https://docs.hiro.so/stacks-connect)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

---

For more details, refer to the inline code documentation or contact the maintainers.
