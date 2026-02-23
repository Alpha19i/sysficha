"use client";

import { useRef, useEffect, useState } from "react";
import { useFicha } from "@/app/ficha/state/ficha-store";

import PessoaisSection from "@/app/ficha/sections/pessoais";
import DocumentosSection from "@/app/ficha/sections/documentos";
import FuncionaisSection from "@/app/ficha/sections/funcionais";
import DependentesSection from "@/app/ficha/sections/dependentes";
import ObservacoesSection from "@/app/ficha/sections/observacoes";

import { restaurarValoresCampos } from "@/app/ficha/core/restauracao";
import { gerarPDFeJSON } from "@/app/ficha/core/geracao";
import { carregarArquivoJSON } from "../ficha/core/jsonImport";

const SECTIONS = [
  PessoaisSection,
  DocumentosSection,
  FuncionaisSection,
  DependentesSection,
  ObservacoesSection
];

export default function FormSection() {
  const { indice, next, previous, clear, data, setField } = useFicha();

  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const SectionComponent = SECTIONS[indice];
  const isLast = indice === SECTIONS.length - 1;

  useEffect(() => {
    if (containerRef.current) {
      restaurarValoresCampos(containerRef.current);
    }
  }, [indice]);

  function validarCamposAtuais(): boolean {
    const container = containerRef.current;
    if (!container) return true;

    const campos = container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");

    for (const campo of campos) {
      if (!campo.checkValidity()) {
        campo.reportValidity();
        return false;
      }
    }

    return true;
  }

  async function handleProximo() {
    if (!validarCamposAtuais()) return;

    if (!isLast) {
      next();
      return;
    }

    try {
      setLoading(true);
      console.log(data)
      await gerarPDFeJSON({ data, setField });
      alert("PDF, JSON e ficha salvos com sucesso!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao gerar arquivos.";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  function handleAnterior() {
    previous();
  }

  function handleLimpar() {
    if (!confirm("Deseja limpar todos os dados?")) return;
    clear();
    window.location.reload(); // mantém compatibilidade com seu fluxo atual
  }

   function mostrarSucesso(msg: string) {
    alert(msg);
  }

  function mostrarErro(msg: string) {
    alert(msg);
  }

  function atualizarCamposEspeciais(dados: Record<string, string>) {
    if (dados.input_data_inicio) {
      atualizarDataInicio(dados.input_data_inicio);
    }
    if (dados.input_data_final) {
      atualizarDataFinal(dados.input_data_final);
    }
    if (dados.input_data_por_extenso) {
      atualizarDataPorExtenso(dados.input_data_por_extenso);
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
            disabled={indice === 0 || loading}
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={handleProximo}
            disabled={loading}
          >
            {loading ? "Gerando..." : isLast ? "Gerar PDF" : "Próximo"}
          </button>
        </div>

        <div className="line" style={{ marginTop: 20, gap: 10 }}>
          <label className="f2">
            Adicionar backup JSON
            <br />
            <input
              type="file"
              id="inputArquivoJSON"
              className="file"
              accept=".json"
              onChange={(e) =>
                carregarArquivoJSON(e, {
                  setField,
                  onSuccess: mostrarSucesso,
                  onError: mostrarErro,
                  afterLoad: atualizarCamposEspeciais
                })
              }

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