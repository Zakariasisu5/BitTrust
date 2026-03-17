"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardContent = dynamic(
  () => import("./LeaderboardContent").then((m) => m.LeaderboardContent),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6 pb-10">
        <Skeleton className="h-10 w-64 bg-slate-800" />
        <Skeleton className="h-[400px] w-full rounded-xl bg-slate-800" />
      </div>
    ),
  }
);

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
