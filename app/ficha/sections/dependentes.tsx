"use client";

import FichaInput from "../components/FichaInput";

export default function DependentesSection() {
  return (
    <>
      <h1>Preenchimento da Ficha</h1>
      <h2>4 - Dependentes</h2>

      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n}>
          <h4>Dependente {n}</h4>

          <div className="line">
            <label className="f2">
              Nome
              <FichaInput id={`dependente_nome${n}`} type="text" />
            </label>

            <label className="f1">
              Tipo
              <FichaInput id={`dependente_tipo${n}`} type="text" />
            </label>

            <label className="f1">
              Data de Nascimento
              <FichaInput id={`dependente_nascimento${n}`} type="date" />
            </label>

            <label className="f1">
              CPF
              <FichaInput id={`dependente_cpf${n}`} type="text" />
            </label>
          </div>
        </div>
      ))}
    </>
  );
}
