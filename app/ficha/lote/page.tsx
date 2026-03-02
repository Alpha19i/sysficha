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

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function fromDataInicioExtenso(value: string) {
  const match = value.match(/(\d{1,2}) de ([A-Za-zçÇãÃéÉêÊôÔóÓíÍúÚ]+) de (\d{4})/);
  if (!match) return null;

  const dia = match[1].padStart(2, "0");
  const mesNome = match[2].toLowerCase();
  const ano = match[3];

  const meses: Record<string, string> = {
    janeiro: "01",
    fevereiro: "02",
    março: "03",
    marco: "03",
    abril: "04",
    maio: "05",
    junho: "06",
    julho: "07",
    agosto: "08",
    setembro: "09",
    outubro: "10",
    novembro: "11",
    dezembro: "12"
  };

  const mes = meses[mesNome];
  if (!mes) return null;
  return `${ano}-${mes}-${dia}`;
}

function normalizePayloadDates(payloadJson: Record<string, unknown>) {
  const next = { ...payloadJson } as Record<string, unknown>;

  if (typeof next.data_inicio === "string" && next.data_inicio.trim().length > 0) {
    const converted = fromDataInicioExtenso(next.data_inicio);
    if (converted) {
      next.input_data_inicio = converted;
    }
  }

  const inputDataInicioRaw = next.input_data_inicio;
  if (typeof inputDataInicioRaw !== "string" || !isIsoDate(inputDataInicioRaw)) {
    throw new Error("Campo input_data_inicio (data inicial) obrigatorio no JSON.");
  }

  const [ano, mes] = inputDataInicioRaw.slice(0, 10).split("-");

  if (typeof next.input_data_final !== "string" || !isIsoDate(next.input_data_final)) {
    next.input_data_final = `${ano}-12-01`;
  }

  if (
    typeof next.input_data_por_extenso !== "string" ||
    !isIsoDate(next.input_data_por_extenso)
  ) {
    next.input_data_por_extenso = `${ano}-${mes}-01`;
  }

  next.data_atual = `01/${mes}/${ano}`;
  return next;
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
    const payloadJson = normalizePayloadDates(obj.payloadJson as Record<string, unknown>);
    const payloadCpf =
      typeof payloadJson.cpf === "string" || typeof payloadJson.cpf === "number"
        ? normalizeCpf(String(payloadJson.cpf))
        : "";
    const wrapperCpf = normalizeCpf(String(obj.cpf));
    const cpf = payloadCpf || wrapperCpf;

    if (cpf.length !== 11) throw new Error("CPF invalido.");
    payloadJson.cpf = cpf;

    return {
      servidorNome: String(obj.servidorNome).trim(),
      cpf,
      payloadJson
    };
  }

  const payloadJson = normalizePayloadDates(obj);
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
  payloadJson.cpf = cpf;

  return {
    servidorNome: servidorNomeSource.trim(),
    cpf,
    payloadJson
  };
}

async function parseJsonFiles(files: FileList) {
  const parsed: ParsedItem[] = [];
  const errors: ParsedError[] = [];
  const seenCpfs = new Set<string>();

  for (const file of Array.from(files)) {
    const keyBase = file.name;

    try {
      const content = await file.text();
      const json = JSON.parse(content) as unknown;

      if (Array.isArray(json)) {
        json.forEach((item, index) => {
          const key = `${keyBase}#${index + 1}`;
          try {
            const data = toCreatePayload(item);
            if (seenCpfs.has(data.cpf)) {
              throw new Error(`CPF duplicado no lote: ${data.cpf}`);
            }
            seenCpfs.add(data.cpf);
            parsed.push({ key, data });
          } catch (error) {
            errors.push({
              key,
              message: error instanceof Error ? error.message : "Item invalido."
            });
          }
        });
        continue;
      }

      const data = toCreatePayload(json);
      if (seenCpfs.has(data.cpf)) {
        throw new Error(`CPF duplicado no lote: ${data.cpf}`);
      }
      seenCpfs.add(data.cpf);
      parsed.push({ key: keyBase, data });
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
