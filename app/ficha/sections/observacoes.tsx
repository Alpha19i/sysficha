"use client";

import { useFicha } from "../state/ficha-store";
import { atualizarCampo } from "../core/espelhamento";

export default function ObservacoesSection() {
  const { data, setField } = useFicha();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const valor = e.target.value.toUpperCase(); // manter maiúsculo
    setField("observacoes", valor);             // atualiza state
    atualizarCampo("observacoes", valor, "text"); // espelha no DOM
  }

  return (
    <>
      <h1>Preenchimento da Ficha</h1>
      <h2>5 - Observações e Assinaturas</h2>

      <label>
        Observações
        <textarea
          id="observacoes"
          rows={10}
          placeholder="Digite observações relevantes..."
          value={data.observacoes || ""}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </label>
    </>
  );
}