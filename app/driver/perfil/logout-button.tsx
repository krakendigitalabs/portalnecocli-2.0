"use client";

import { LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFirebaseApp } from "@/lib/firebase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const app = getFirebaseApp();
      if (!app) {
        setLoading(false);
        return;
      }
      const auth = getAuth(app);
      await signOut(auth);

      // Call our internal api to clear the cookie session
      await fetch("/api/auth/session", { method: "DELETE" });

      router.push("/conductores");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 font-bold py-3 rounded-2xl hover:bg-red-500/20 transition-colors mt-6 border border-red-500/20"
    >
      <LogOut className="w-5 h-5" />
      {loading ? "Cerrando Sesión..." : "Cerrar Sesión"}
    </button>
  );
}
