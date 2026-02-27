"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";

type CreatePayload = {
  servidorNome: string;
  cpf: string;
  payloadJson: Record<string, unknown>;
};

type ParsedItem = {
  key: string;
  data: CreatePayload;
};

type ParsedError = {
  key: string;
  message: string;
};

type SaveResult = {
  key: string;
  ok: boolean;
  message: string;
};

function normalizeCpf(raw: string) {
  return raw.replace(/\D/g, "");
}

function toCreatePayload(raw: unknown): CreatePayload {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("JSON deve ser um objeto.");
  }

  const obj = raw as Record<string, unknown>;

  const hasCreateShape =
    typeof obj.servidorNome === "string" &&
    typeof obj.cpf === "string" &&
    typeof obj.payloadJson === "object" &&
    obj.payloadJson !== null &&
    !Array.isArray(obj.payloadJson);

  if (hasCreateShape) {
    const cpf = normalizeCpf(String(obj.cpf));
    if (cpf.length !== 11) throw new Error("CPF invalido.");
    return {
      servidorNome: String(obj.servidorNome).trim(),
      cpf,
      payloadJson: obj.payloadJson as Record<string, unknown>
    };
  }

  const payloadJson = obj;
  const servidorNomeSource = payloadJson.nome ?? payloadJson.servidorNome;
  const cpfSource = payloadJson.cpf;

  if (typeof servidorNomeSource !== "string" || servidorNomeSource.trim().length === 0) {
    throw new Error("Campo nome/servidorNome nao encontrado no JSON.");
  }

  if (typeof cpfSource !== "string" && typeof cpfSource !== "number") {
    throw new Error("Campo cpf nao encontrado no JSON.");
  }

  const cpf = normalizeCpf(String(cpfSource));
  if (cpf.length !== 11) {
    throw new Error("CPF invalido.");
  }

  return {
    servidorNome: servidorNomeSource.trim(),
    cpf,
    payloadJson
  };
}

async function parseJsonFiles(files: FileList) {
  const parsed: ParsedItem[] = [];
  const errors: ParsedError[] = [];

  for (const file of Array.from(files)) {
    const keyBase = file.name;

    try {
      const content = await file.text();
      const json = JSON.parse(content) as unknown;

      if (Array.isArray(json)) {
        json.forEach((item, index) => {
          const key = `${keyBase}#${index + 1}`;
          try {
            parsed.push({ key, data: toCreatePayload(item) });
          } catch (error) {
            errors.push({
              key,
              message: error instanceof Error ? error.message : "Item invalido."
            });
          }
        });
        continue;
      }

      parsed.push({ key: keyBase, data: toCreatePayload(json) });
    } catch (error) {
      errors.push({
        key: keyBase,
        message: error instanceof Error ? error.message : "Falha ao ler arquivo."
      });
    }
  }

  return { parsed, errors };
}

export default function FichaLotePage() {
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [errors, setErrors] = useState<ParsedError[]>([]);
  const [results, setResults] = useState<SaveResult[]>([]);
  const [loading, setLoading] = useState(false);

  const summary = useMemo(() => {
    const success = results.filter((item) => item.ok).length;
    const failed = results.filter((item) => !item.ok).length;
    return { success, failed };
  }, [results]);

  async function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      setItems([]);
      setErrors([]);
      setResults([]);
      return;
    }

    const parsed = await parseJsonFiles(fileList);
    setItems(parsed.parsed);
    setErrors(parsed.errors);
    setResults([]);
  }

  async function handleUpload() {
    if (items.length === 0) return;

    setLoading(true);
    const nextResults: SaveResult[] = [];

    for (const item of items) {
      try {
        const response = await fetch("/api/fichas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(item.data)
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.created) {
          nextResults.push({
            key: item.key,
            ok: false,
            message: data?.message ?? "Falha ao criar ficha."
          });
          continue;
        }

        nextResults.push({
          key: item.key,
          ok: true,
          message: "Ficha criada com sucesso."
        });
      } catch {
        nextResults.push({
          key: item.key,
          ok: false,
          message: "Erro de conexao."
        });
      }
    }

    setResults(nextResults);
    setLoading(false);
  }

  return (
    <main style={{ padding: "12px 10px" }}>
      <div className="panel">
        <div className="panel-header">
          <h1 style={{ margin: 0, fontSize: 16 }}>Importacao em Lote (JSON)</h1>
          <Link href="/" className="btn" style={{ textDecoration: "none", color: "#000" }}>
            Voltar
          </Link>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
              Arquivos JSON
            </label>
            <input className="input" type="file" accept=".json,application/json" multiple onChange={handleFilesChange} />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="btn" type="button" disabled={loading || items.length === 0} onClick={handleUpload}>
              {loading ? "Enviando..." : "Enviar lote"}
            </button>
            <span>
              {items.length} item(ns) valido(s), {errors.length} com erro de leitura/validacao.
            </span>
          </div>
        </div>

        {errors.length > 0 ? (
          <div style={{ marginTop: 12 }}>
            <h2 style={{ fontSize: 13, margin: "0 0 6px 0" }}>Erros de arquivo</h2>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {errors.map((item) => (
                <li key={item.key}>
                  <strong>{item.key}:</strong> {item.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {results.length > 0 ? (
          <div style={{ marginTop: 12 }}>
            <h2 style={{ fontSize: 13, margin: "0 0 6px 0" }}>Resultado do envio</h2>
            <p style={{ margin: "0 0 8px 0" }}>
              Sucesso: {summary.success} | Falha: {summary.failed}
            </p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {results.map((item) => (
                <li key={item.key} style={{ color: item.ok ? "#0a7b34" : "#b00020" }}>
                  <strong>{item.key}:</strong> {item.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </main>
  );
}
