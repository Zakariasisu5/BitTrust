"use client";

import dynamic from "next/dynamic";

const DashboardContent = dynamic(
  () => import("./DashboardContent"),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 text-center text-sm text-slate-500 font-mono">
        Initializing dashboard…
      </div>
    ),
  }
);

export default function DashboardPage() {
  return <DashboardContent />;
}
