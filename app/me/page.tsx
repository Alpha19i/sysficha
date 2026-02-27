"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PublicUser } from "@/types/user";

type MeResponse = {
  authenticated: boolean;
  user?: PublicUser;
  message?: string;
};

export default function MePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    fetchMe();
  }, []);

  async function fetchMe() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/me", {
        credentials: "include"
      });
      const data: MeResponse = await response.json().catch(() => ({} as MeResponse));

      if (!response.ok || !data.authenticated || !data.user) {
        setError(data.message ?? "Nao foi possivel carregar os dados do usuario.");
        return;
      }

      setUser(data.user);
    } catch {
      setError("Erro de conexao ao buscar dados do usuario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "12px 10px" }}>
      <div className="panel">
        <div className="panel-header">
          <h1 style={{ margin: 0, fontSize: 16 }}>Meu Perfil</h1>
          <Link href="/" className="btn" style={{ textDecoration: "none", color: "#000" }}>
            Voltar
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#666" }}>Carregando...</p>
        ) : null}

        {error ? (
          <p style={{ marginTop: 10, color: "#b00020", fontSize: 12, fontWeight: 600 }}>{error}</p>
        ) : null}

        {!loading && !error && user ? (
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>ID:</strong> {user.id}
            </div>
            <div>
              <strong>Usuario:</strong> {user.username}
            </div>
            <div>
              <strong>Perfil:</strong> {user.role}
            </div>
            <div>
              <strong>Ativo:</strong> {user.active ? "Sim" : "Nao"}
            </div>
            <div>
              <strong>Criado em:</strong>{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleString("pt-BR") : "-"}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
