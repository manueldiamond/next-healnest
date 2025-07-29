"use client"

import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";

export default function NewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadProfile = useAuthStore(s=>s.loadUserProfile)
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  return (
    <div className="min-h-screen ">
      {children}
    </div>
  );
} 