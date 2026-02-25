"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Ficha } from "@/types/ficha";
import FormSection from "@/app/components/form-section";
import LegacyHtmlSection from "@/app/components/legacy-html-section";
import LogoutButton from "@/app/components/logout-button";
import { FichaProvider } from "@/app/ficha/state/ficha-store";

interface EditFichaPageProps {
  id: string;
  pdfSections: string[];
}

function toStringPayload(payload: Record<string, unknown>) {
  const entries = Object.entries(payload).filter(
    ([, value]) => typeof value === "string"
  ) as Array<[string, string]>;

  return Object.fromEntries(entries);
}

export default function EditFichaPage({ id, pdfSections }: EditFichaPageProps) {
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const initialData = useMemo(() => {
    if (!ficha?.payloadJson || typeof ficha.payloadJson !== "object") {
      return {};
    }
    return toStringPayload(ficha.payloadJson as Record<string, unknown>);
  }, [ficha]);

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
    <FichaProvider>
      <main>
        <LogoutButton />
        <div style={{ maxWidth: 980, margin: "8px auto 0", padding: "0 10px" }}>
          <Link href="/" className="btn" style={{ textDecoration: "none", color: "#000" }}>
            Voltar para lista
          </Link>
        </div>
        <FormSection mode="edit" fichaId={id} initialData={initialData} />

        <div id="pagina-pdf">
          {pdfSections.map((section, index) => (
            <LegacyHtmlSection key={index} html={section} />
          ))}
        </div>
      </main>
    </FichaProvider>
  );
}
