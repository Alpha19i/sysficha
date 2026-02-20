"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PaginatedFichas } from "@/types/api";
import type { Ficha } from "@/types/ficha";

export default function FichaList() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFichas();
  }, [pagination.page, search]);

  async function fetchFichas() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: search
      });

      const res = await fetch(`/api/fichas?${params}`);
      if (!res.ok) {
        throw new Error("Failed to fetch fichas");
      }

      const data: PaginatedFichas = await res.json();
      setFichas(data.items);
      setPagination((prev) => ({ ...prev, total: data.total }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div
      style={{
        maxWidth: 980,
        marginInline: "auto",
        padding: 12,
        background: "#f3f3f3"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <h1 style={{ margin: "0 0 12px 0", fontSize: 16 }}>Fichas</h1>
        <Link
          href="/ficha/add"
          style={{
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "1px solid #777",
            background: "#fff",
            textDecoration: "none",
            color: "#000"
          }}
        >
          Nova Ficha
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou CPF..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        style={{
          width: "100%",
          padding: 6,
          marginBottom: 12,
          marginTop: 0,
          height: 32,
          border: "1px solid #777"
        }}
      />

      {error ? (
        <p style={{ marginTop: 10, color: "#b00020", fontSize: 12, fontWeight: 600 }}>{error}</p>
      ) : null}

      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#666" }}>Carregando...</p>
      ) : fichas.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40, color: "#666" }}>Nenhuma ficha encontrada</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 12,
              marginTop: 12,
              border: "1px solid #777"
            }}
          >
            <thead>
              <tr style={{ background: "#f3f3f3", borderBottom: "1px solid #777" }}>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600, borderRight: "1px solid #777" }}>
                  Nome
                </th>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600, borderRight: "1px solid #777" }}>
                  CPF
                </th>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600, borderRight: "1px solid #777" }}>
                  Data de Criação
                </th>
                <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fichas.map((ficha) => (
                  <tr key={ficha.id} style={{ borderBottom: "1px solid #777" }}>
                  <td style={{ padding: 8, borderRight: "1px solid #777" }}>{ficha.servidorNome || "-"}</td>
                  <td style={{ padding: 8, borderRight: "1px solid #777" }}>{ficha.cpf || "-"}</td>
                  <td style={{ padding: 8, borderRight: "1px solid #777" }}>
                    {ficha.createdAt ? new Date(ficha.createdAt).toLocaleDateString("pt-BR") : "-"}
                  </td>
                  <td style={{ padding: 8, display: "flex", gap: 8 }}>
                    <Link
                      href={`/ficha/${ficha.id}`}
                      style={{
                          padding: "4px 8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        border: "1px solid #777",
                        background: "#fff",
                        textDecoration: "none",
                        color: "#000",
                        fontSize: 12
                    }}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        // TODO: Implement Button and /ficha/${ficha.id}}
                        console.log("Generate PDF for ficha:", ficha.id);
                      }}
                      style={{
                        padding: "4px 8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        border: "1px solid #777",
                        background: "#fff"
                      }}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginTop: 12
            }}
          >
            {pagination.page > 1 && (
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                style={{
                  padding: "8px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: "1px solid #777",
                  background: "#fff"
                }}
              >
                Anterior
              </button>
            )}
            <span style={{ fontWeight: 600 }}>
              Página {pagination.page} de {totalPages}
            </span>
            {pagination.page < totalPages && (
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                style={{
                  padding: "8px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: "1px solid #777",
                  background: "#fff"
                }}
              >
                Próxima
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
