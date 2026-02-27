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
import {
  atualizarCampo
} from "../ficha/core/espelhamento";
import { fichaState } from "../ficha/state/fichaState";

const SECTIONS = [
  PessoaisSection,
  DocumentosSection,
  FuncionaisSection,
  DependentesSection,
  ObservacoesSection
];

type FormSectionMode = "create" | "edit";

interface FormSectionProps {
  mode?: FormSectionMode;
  fichaId?: string;
  initialData?: Record<string, string>;
}

export default function FormSection({
  mode = "create",
  fichaId,
  initialData
}: FormSectionProps) {
  const { indice, next, previous, clear, data, setField } = useFicha();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const SectionComponent = SECTIONS[indice];
  const isLast = indice === SECTIONS.length - 1;

  function configurarDatasIniciais() {
    const hoje = new Date();
    const ano = hoje.getFullYear();

    const mesNumero = String(hoje.getMonth() + 1).padStart(2, "0");
    const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
    const mesCapitalizado =
      mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);

    const dataAtual = `01/${mesNumero}/${ano}`;
    const dataInicio = `${ano}-${mesNumero}-01`;
    const dataFinal = `${ano}-12-31`;
    const dataPorExtenso = `Município de Junco do Maranhão/MA, 01 de ${mesCapitalizado} de ${ano}.`;
    const dataInicioExtenso = `01 de ${mesCapitalizado} de ${ano}`;
    const dataFinalExtenso = `31 de Dezembro de ${ano}`;

    // 🔥 Salva no estado (vai pro banco mesmo sem o usuário mexer)
    atualizarCampo("dataAtual", dataAtual);
    setField("dataAtual", dataAtual);
    atualizarCampo("data_inicio", dataInicioExtenso);
    setField("input_data_inicio", dataInicio);
    atualizarCampo("data_final", dataFinalExtenso);
    setField("input_data_final", dataFinal);
    atualizarCampo("data_por_extenso", dataPorExtenso);
    setField("input_data_por_extenso", dataInicio);

   }

  useEffect(() => {
    if (!data.dataAtual) {
      configurarDatasIniciais();
      console.log(data);
      
    }
  }, []);
  useEffect(() => {
      console.log(data);
  }, [data]);
  
  useEffect(() => {
    if (containerRef.current) {
      restaurarValoresCampos(containerRef.current);
    }
  }, [indice]);

  useEffect(() => {
    if (!initialData) return;

    Object.entries(initialData).forEach(([campo, valor]) => {
      if (typeof valor !== "string") return;
      setField(campo, valor);

      const input = document.getElementById(
        campo
      ) as HTMLInputElement | HTMLTextAreaElement | null;
      if (input) {
        input.value = input.type=='date'? valor.split("/").reverse().join("-") : valor;
      }

      if (campo === "foto") {
        const fotoEl = document.getElementById("fotoPerfil") as HTMLImageElement | null;
        if (fotoEl) {
          fotoEl.src = valor;
        }
      }

      const type = input?.type === "date" ? "date" : undefined;
      atualizarCampo(campo, valor, type);
      fichaState.values[campo] = valor;
    });

    if (containerRef.current) {
      restaurarValoresCampos(containerRef.current);
    }
    
  }, [initialData]);

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

    if (mode === "edit") {
      if (!fichaId) {
        alert("ID da ficha nao encontrado.");
        return;
      }

      try {
        setLoading(true);

        const servidorNome = (data.nome || "").trim();
        const cpf = (data.cpf || "").trim();

        if (!servidorNome || !cpf) {
          alert("Nome e CPF sao obrigatorios para salvar.");
          return;
        }

        const response = await fetch(`/api/fichas/${fichaId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            servidorNome,
            cpf,
            payloadJson: data
          })
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result?.updated) {
          const message =
            typeof result?.message === "string"
              ? result.message
              : "Erro ao salvar ficha.";
          alert(message);
          return;
        }

        alert("Ficha atualizada com sucesso!");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao salvar ficha.";
        alert(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
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
    window.location.reload();
  }

  function mostrarSucesso(msg: string) {
    alert(msg);
  }

  function mostrarErro(msg: string) {
    alert(msg);
  }
  
  function handleAfterLoadJSON(dados: Record<string, string>) {
    if (containerRef.current) {
      restaurarValoresCampos(containerRef.current);
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
            {loading
              ? mode === "edit"
                ? "Salvando..."
                : "Gerando..."
              : isLast
                ? mode === "edit"
                  ? "Salvar Alteracoes"
                  : "Gerar PDF"
                : "Próximo"}
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
                  afterLoad: handleAfterLoadJSON
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
