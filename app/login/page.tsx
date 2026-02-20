"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginState = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginState>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.logged) {
        setError(data?.message ?? "Falha no login");
        return;
      }

      router.replace("/");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f3f3",
        padding: "24px 12px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 980,
          marginInline: "auto",
          padding: 12,
          background: "#f3f3f3",
          borderBottom: "2px solid #000"
        }}
      >
        <h1 style={{ margin: "0 0 12px 0", fontSize: 16, textAlign: "center" }}>Acesso ao Sistema</h1>

        <label style={{ display: "block", marginTop: 8, fontWeight: 600 }}>
          Usuário
          <input
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            autoComplete="username"
            required
            style={{
              width: "100%",
              padding: 6,
              marginTop: 4,
              height: 32,
              border: "1px solid #777"
            }}
          />
        </label>

        <label style={{ display: "block", marginTop: 8, fontWeight: 600 }}>
          Senha
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              padding: 6,
              marginTop: 4,
              height: 32,
              border: "1px solid #777"
            }}
          />
        </label>

        {error ? (
          <p style={{ marginTop: 10, color: "#b00020", fontSize: 12, fontWeight: 600 }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            border: "1px solid #777",
            background: "#fff"
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
