"use client";

import dynamic from "next/dynamic";

const SettingsContent = dynamic(
  () => import("./SettingsContent").then((m) => ({ default: m.SettingsContent })),
  { ssr: false }
);

export default function SettingsPage() {
  return <SettingsContent />;
}
