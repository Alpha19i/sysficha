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
        page: String(pagination.page),
        limit: String(pagination.limit),
        search
      });

      const res = await fetch(`/api/fichas?${params}`);
      if (!res.ok) throw new Error("Erro ao buscar fichas");

      const data: PaginatedFichas = await res.json();
      setFichas(data.items);
      setPagination((prev) => ({ ...prev, total: data.total }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="panel">
      {/* header */}
      <div className="panel-header">
        <h1 style={{ margin: 0, fontSize: 16 }}>Fichas</h1>

        <Link
          href="/ficha/add"
          className="btn"
          style={{ textDecoration: "none", color: "#000" }}
        >
          Nova Ficha
        </Link>
      </div>

      {/* busca no mesmo padrão do formulário */}
      <div className="line" style={{ alignItems: "end", marginBottom: 12 }}>
        <div className="f3">
          <label>Buscar por nome ou CPF</label>
          <input
            className="input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
        </div>
      </div>

      {/* estados */}
      {error && (
        <p style={{ marginTop: 10, color: "#b00020", fontSize: 12, fontWeight: 600 }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#666" }}>
          Carregando...
        </p>
      ) : fichas.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40, color: "#666" }}>
          Nenhuma ficha encontrada
        </p>
      ) : (
        <>
          {/* tabela padrão do sistema */}
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {fichas.map((ficha) => (
                <tr key={ficha.id}>
                  <td>{ficha.servidorNome || "-"}</td>
                  <td>{ficha.cpf || "-"}</td>
                  <td>
                    {ficha.createdAt
                      ? new Date(ficha.createdAt).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>

                  <td style={{ 
                    // display: "flex", 
                    alignItems: 'space-between',
                    height: "100%",
                    gap: 10
                    // border: 'none'
                  }}>
                    <Link
                      href={`/ficha/${ficha.id}`}
                      className="btn"
                      style={{ 
                        fontSize: 12, 
                        padding: "0 8px", 
                        textDecoration: "none", 
                        color: "#000",
                        marginRight: 10
                      }}
                    >
                      Editar
                    </Link>

                    <button
                      className="btn"
                      style={{ fontSize: 12, padding: "0 8px" }}
                      onClick={() => {
                        console.log("Gerar PDF:", ficha.id);
                      }}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* paginação */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {pagination.page > 1 && (
              <button
                className="btn"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Anterior
              </button>
            )}

            <span style={{ fontWeight: 600 }}>
              Página {pagination.page} de {totalPages || 1}
            </span>

            {pagination.page < totalPages && (
              <button
                className="btn"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
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
