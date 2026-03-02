"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Ficha } from "@/types/ficha";
import LegacyHtmlSection from "@/app/components/legacy-html-section";
import LogoutButton from "@/app/components/logout-button";
import { atualizarCampo } from "@/app/ficha/core/espelhamento";

interface FichaPdfPageProps {
  id: string;
  pdfSections: string[];
}

function normalizeFilename(nome?: string): string {
  if (!nome) return "ficha-servidor";
  return nome
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function formatDateToPtBrIfIso(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value.split("-").reverse().join("/")
    : value;
}

function toStringPayload(payload: Record<string, unknown>) {
  const entries = Object.entries(payload).filter(
    ([, value]) => typeof value === "string"
  ) as Array<[string, string]>;
  return Object.fromEntries(entries);
}

export default function FichaPdfPage({ id, pdfSections }: FichaPdfPageProps) {
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadFicha() {
      try {
        setLoading(true);
        const response = await fetch(`/api/fichas/${id}`, {
          credentials: "include"
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message =
            typeof result?.message === "string"
              ? result.message
              : "Erro ao carregar ficha.";
          throw new Error(message);
        }

        setFicha(result as Ficha);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Erro desconhecido."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFicha();
  }, [id]);

  const payloadData = useMemo(() => {
    if (!ficha?.payloadJson || typeof ficha.payloadJson !== "object") {
      return {};
    }
    return toStringPayload(ficha.payloadJson as Record<string, unknown>);
  }, [ficha]);

  useEffect(() => {
    if (!ficha) return;

    const handle = window.setTimeout(() => {
      Object.entries(payloadData).forEach(([fieldId, rawValue]) => {
        const normalizedValue = formatDateToPtBrIfIso(rawValue);
        const inferredType = /^\d{2}\/\d{2}\/\d{4}$/.test(normalizedValue)
          ? "date"
          : undefined;
        atualizarCampo(fieldId, rawValue, inferredType);
      });

      if (!payloadData.data_atual) {
        const hoje = new Date();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const data_atual = `01/${mes}/${hoje.getFullYear()}`;
        atualizarCampo("data_atual", data_atual);
      }

      const foto = payloadData.foto;
      if (foto) {
        const fotoEl = document.getElementById("fotoPerfil") as HTMLImageElement | null;
        if (fotoEl) {
          fotoEl.src = foto;
        }
      }
    }, 120);

    return () => window.clearTimeout(handle);
  }, [ficha, payloadData]);

  async function handleGeneratePdf() {
    if (!ficha) return;

    const nome = normalizeFilename(
      payloadData.nome || ficha.servidorNome || "ficha-servidor"
    );

    try {
      setGenerating(true);
      const html2pdf = (await import("html2pdf.js")).default;
      const pagina = document.getElementById("pagina-pdf");
      if (!pagina) throw new Error("Container do PDF nao encontrado.");

      const hrs = pagina.querySelectorAll("hr");
      try {
        hrs.forEach((hr) => (hr.style.display = "none"));

        await html2pdf()
          .set({
            margin: 0,
            filename: `${nome}.pdf`,
            image: { type: "jpeg", quality: 0.92 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              logging: false,
              letterRendering: true
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: "portrait"
            }
          })
          .from(pagina)
          .save();
      } finally {
        hrs.forEach((hr) => (hr.style.display = ""));
      }
    } catch (generateError) {
      const message =
        generateError instanceof Error
          ? generateError.message
          : "Erro ao gerar PDF.";
      alert(message);
    } finally {
      setGenerating(false);
    }
  }

  function handleDownloadJson() {
    if (!ficha) return;

    const nome = normalizeFilename(
      payloadData.nome || ficha.servidorNome || "ficha-servidor"
    );

    const jsonString = JSON.stringify(payloadData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${nome}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 980, margin: "40px auto", textAlign: "center" }}>
        Carregando ficha...
      </main>
    );
  }

  if (error || !ficha) {
    return (
      <main style={{ maxWidth: 980, margin: "40px auto" }}>
        <p style={{ color: "#b00020", fontWeight: 600 }}>
          {error ?? "Ficha nao encontrada."}
        </p>
        <Link href="/" className="btn" style={{ textDecoration: "none", color: "#000" }}>
          Voltar
        </Link>
      </main>
    );
  }

  return (
    <main>
      <LogoutButton />
      <div
        style={{
          maxWidth: 980,
          margin: "8px auto 12px",
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          gap: 10
        }}
      >
        <Link href="/" className="btn" style={{ textDecoration: "none", color: "#000" }}>
          Voltar para lista
        </Link>
        <Link
          href={`/ficha/${id}`}
          className="btn"
          style={{ textDecoration: "none", color: "#000" }}
        >
          Editar ficha
        </Link>
        <button
          type="button"
          className="btn"
          onClick={handleGeneratePdf}
          disabled={generating}
        >
          {generating ? "Gerando..." : "Gerar PDF"}
        </button>
        <button type="button" className="btn" onClick={handleDownloadJson}>
          Baixar JSON
        </button>
      </div>

      <div id="pagina-pdf">
        {pdfSections.map((section, index) => (
          <LegacyHtmlSection key={index} html={section} />
        ))}
      </div>
    </main>
  );
}
