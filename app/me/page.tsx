"use client";

import { FormEvent, useEffect, useState } from "react";
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
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

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

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (form.newPassword !== form.confirmNewPassword) {
      setPasswordError("A confirmacao da nova senha nao confere.");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.changed) {
        setPasswordError(data?.message ?? "Nao foi possivel alterar a senha.");
        return;
      }

      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setPasswordSuccess("Senha alterada com sucesso.");
    } catch {
      setPasswordError("Erro de conexao ao alterar senha.");
    } finally {
      setChangingPassword(false);
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

            <form onSubmit={handlePasswordSubmit} style={{ marginTop: 12, maxWidth: 480 }}>
              <h2 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Alterar Senha</h2>

              <label style={{ display: "block", marginTop: 8, fontWeight: 600 }}>
                Senha atual
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                  }
                  autoComplete="current-password"
                  required
                  className="input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label style={{ display: "block", marginTop: 8, fontWeight: 600 }}>
                Nova senha
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  autoComplete="new-password"
                  required
                  className="input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label style={{ display: "block", marginTop: 8, fontWeight: 600 }}>
                Confirmar nova senha
                <input
                  type="password"
                  value={form.confirmNewPassword}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, confirmNewPassword: event.target.value }))
                  }
                  autoComplete="new-password"
                  required
                  className="input"
                  style={{ marginTop: 4 }}
                />
              </label>

              {passwordError ? (
                <p style={{ marginTop: 10, color: "#b00020", fontSize: 12, fontWeight: 600 }}>
                  {passwordError}
                </p>
              ) : null}

              {passwordSuccess ? (
                <p style={{ marginTop: 10, color: "#1f7a1f", fontSize: 12, fontWeight: 600 }}>
                  {passwordSuccess}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={changingPassword}
                className="btn"
                style={{ marginTop: 12, cursor: changingPassword ? "not-allowed" : "pointer" }}
              >
                {changingPassword ? "Salvando..." : "Alterar senha"}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
