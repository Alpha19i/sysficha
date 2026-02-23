"use client";

import { useState, useRef, useEffect } from "react";

import PessoaisSection from "@/app/ficha/sections/pessoais";
import DocumentosSection from "@/app/ficha/sections/documentos";
import FuncionaisSection from "@/app/ficha/sections/funcionais";
import DependentesSection from "@/app/ficha/sections/dependentes";
import ObservacoesSection from "@/app/ficha/sections/observacoes";

import { restaurarValoresCampos } from "@/app/ficha/core/restauracao";

const SECTIONS = [
  PessoaisSection,
  DocumentosSection,
  FuncionaisSection,
  DependentesSection,
  ObservacoesSection
];

export default function FormSection() {
  const [indice, setIndice] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const SectionComponent = SECTIONS[indice];
  const isLast = indice === SECTIONS.length - 1;

  // equivalente ao restaurarValoresCampos do legacy
  useEffect(() => {
    if (containerRef.current) {
      restaurarValoresCampos(containerRef.current);
    }
  }, [indice]);

  function handleAnterior() {
    setIndice((prev) => Math.max(prev - 1, 0));
  }

  function handleProximo() {
    if (!isLast) {
      setIndice((prev) => prev + 1);
      return;
    }

    if (typeof window !== "undefined" && window.gerarFicha) {
      window.gerarFicha();
    }
  }

  function handleLimpar() {
    if (confirm("Deseja limpar todos os dados?")) {
      window.location.reload();
    }
  }

  return (
    <>
      <form
        id="formulario"
        onSubmit={(event) => {
          event.preventDefault();
          handleProximo();
        }}
      >
        <div id="form-content" ref={containerRef}>
          <SectionComponent />
        </div>

        <div className="botoes">
          <button
            type="button"
            onClick={handleAnterior}
            disabled={indice === 0}
          >
            Anterior
          </button>

          <button type="button" onClick={handleProximo}>
            {isLast ? "Gerar PDF" : "Próximo"}
          </button>
        </div>

        <div className="line" style={{ marginTop: "20px", gap: "10px" }}>
          <label className="f2">
            Adicionar backup JSON
            <br />
            <input
              type="file"
              id="inputArquivoJSON"
              className="file"
              accept=".json"
            />
          </label>

          <button
            type="button"
            onClick={handleLimpar}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Limpar Tudo
          </button>
        </div>
      </form>
      <hr />
    </>
  );
}