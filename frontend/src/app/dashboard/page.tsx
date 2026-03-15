"use client";

import dynamic from "next/dynamic";

const DashboardContent = dynamic(
  () => import("./DashboardContent").then((m) => ({ default: m.DashboardContent })),
  { ssr: false }
);

export default function DashboardPage() {
  return <DashboardContent />;
}
