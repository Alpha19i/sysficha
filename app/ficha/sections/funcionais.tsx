"use client";

import FichaInput from "../components/FichaInput";
import FichaSelect from "../components/FichaSelect";

export default function FuncionaisSection() {
  return (
    <>
      <h1>Preenchimento da Ficha</h1>
      <h2>3 - Dados Funcionais</h2>

      <label>
        Cargo / Função *
        <FichaInput id="cargo" required type="text" />
      </label>

      <label>
        Data da Portaria
        <FichaInput id="data_portaria" type="date" />
      </label>

      <label>
        Data da Posse
        <FichaInput id="data_posse" type="date" />
      </label>

      <label>
        Lotação *
        <FichaInput id="lotacao" required type="text" />
      </label>

      <label>
        Último Local de Trabalho
        <FichaInput id="ultimo_local_trabalho" type="text" />
      </label>

      <label>
        Carga Horária *
        <FichaSelect id="carga_horaria" required>
          <option value="">Selecione</option>
          <option value="20">20 horas</option>
          <option value="30">30 horas</option>
          <option value="40">40 horas</option>
        </FichaSelect>
      </label>

      <h3>Datas do Contrato (opcional - editar se necessário)</h3>

      <div className="line">
        <label className="f1">
          Data de Início
          <FichaInput id="input_data_inicio" type="date" />
        </label>

        <label className="f1">
          Data Final
          <FichaInput id="input_data_final" type="date" />
        </label>

        <label className="f1">
          Data do Contrato
          <FichaInput id="input_data_por_extenso" type="date" />
        </label>
      </div>
    </>
  );
}
