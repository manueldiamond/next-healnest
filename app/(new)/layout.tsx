"use client"

import { useAuthStore } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import path from "node:path";
import { useEffect } from "react";

export default function NewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadProfile = useAuthStore(s => s.loadUserProfile);

  const path = usePathname()
  const router = useRouter()
  useEffect(() => {
  (async () => {
    const result = await loadProfile();
    if (!result) {
      router.replace("/auth");
    }
    // else: do nothing, proceed
  })();

  }, [loadProfile]);
 return (
    <div className="min-h-screen ">
      {children}
    </div>
  );
} 