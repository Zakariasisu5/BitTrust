"use client";

import dynamic from "next/dynamic";

const ProfileContent = dynamic(
  () => import("./ProfileContent").then((m) => ({ default: m.ProfileContent })),
  { ssr: false }
);

export default function ProfilePage() {
  return <ProfileContent />;
}
