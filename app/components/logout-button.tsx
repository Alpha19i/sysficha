"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "12px auto 0 auto",
        padding: "0 10px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        style={{
          padding: "8px 16px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          border: "none",
          borderRadius: 4, 
          background: "#dc3545",
          color: "white"
        }}
      >
        {loading ? "Saindo..." : "Logout"}
      </button>
    </div>
  );
}
