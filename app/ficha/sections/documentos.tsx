"use client";

import FichaInput from "../components/FichaInput";
import FichaSelect from "../components/FichaSelect";
import { onlyNumbers } from "../utils/onlyNumbers";

export default function DocumentosSection() {
  return (
    <>
      <h1>Preenchimento da Ficha</h1>
      <h2>2 - Documentos</h2>

      <div className="line">
        <label className="f1">
          CPF
          <FichaInput id="cpf" required maxLength={14} type="text" />
        </label>

        <label className="f1">
          PIS/PASEP
          <FichaInput id="pis_pasep" maxLength={14} type="text" />
        </label>

        <label className="f2">
          Escolaridade
          <FichaSelect id="escolaridade" required>
            <option value="">Selecione</option>
            <option value="FUNDAMENTAL INCOMPLETO">Fundamental Incompleto</option>
            <option value="FUNDAMENTAL COMPLETO">Fundamental Completo</option>
            <option value="MÉDIO INCOMPLETO">Médio Incompleto</option>
            <option value="MÉDIO COMPLETO">Médio Completo</option>
            <option value="TÉCNICO">Técnico</option>
            <option value="SUPERIOR INCOMPLETO">Superior Incompleto</option>
            <option value="SUPERIOR COMPLETO">Superior Completo</option>
            <option value="PÓS GRADUACAO">Pós-Graduação</option>
            <option value="MESTRADO">Mestrado</option>
            <option value="DOUTORADO">Doutorado</option>
          </FichaSelect>
        </label>
      </div>

      <div className="line">
        <label className="f2">
          RG
          <FichaInput id="rg" required type="text" onKeyPress={onlyNumbers} />
        </label>

        <label className="f1">
          Data de Emissão (RG)
          <FichaInput id="rg_data_emissao" required type="date" />
        </label>

        <label className="f1">
          Órgão Expedidor (RG)
          <FichaInput id="rg_orgao_exp" required type="text" />
        </label>

        <label className="f1">
          UF (RG)
          <FichaSelect id="rg_uf" required>
            <option value="">Selecione</option>
            <option value="MA">MA - Maranhão</option>
            <option value="PA">PA - Pará</option>
            <option value="PI">PI - Piauí</option>
            <option value="CE">CE - Ceará</option>
            <option value="TO">TO - Tocantins</option>
            <option value="BA">BA - Bahia</option>
            <option value="GO">GO - Goiás</option>
            <option value="DF">DF - Distrito Federal</option>
            <option value="SP">SP - São Paulo</option>
            <option value="RJ">RJ - Rio de Janeiro</option>
            <option value="MG">MG - Minas Gerais</option>
            <option value="RS">RS - Rio Grande do Sul</option>
            <option value="SC">SC - Santa Catarina</option>
          </FichaSelect>
        </label>
      </div>

      <div className="line">
        <label className="f2">
          CTPS
          <FichaInput id="ctps" required type="text" />
        </label>

        <label className="f1">
          Série (CTPS)
          <FichaInput id="ctps_serie" type="text" />
        </label>

        <label className="f1">
          Data de Emissão (CTPS)
          <FichaInput id="ctps_data_emissao" type="date" />
        </label>

        <label className="f1">
          UF (CTPS)
          <FichaSelect id="ctps_uf">
            <option value="">Selecione</option>
            <option value="MA">MA - Maranhão</option>
            <option value="PA">PA - Pará</option>
            <option value="PI">PI - Piauí</option>
            <option value="CE">CE - Ceará</option>
            <option value="TO">TO - Tocantins</option>
            <option value="BA">BA - Bahia</option>
            <option value="GO">GO - Goiás</option>
            <option value="DF">DF - Distrito Federal</option>
            <option value="SP">SP - São Paulo</option>
            <option value="RJ">RJ - Rio de Janeiro</option>
            <option value="MG">MG - Minas Gerais</option>
            <option value="RS">RS - Rio Grande do Sul</option>
            <option value="SC">SC - Santa Catarina</option>
          </FichaSelect>
        </label>
      </div>

      <div className="line">
        <label className="f1">
          Título de Eleitor
          <FichaInput id="titulo_eleitor" required type="text" onKeyPress={onlyNumbers} />
        </label>

        <label className="f1">
          Zona
          <FichaInput id="titulo_zona" required maxLength={3} type="text" onKeyPress={onlyNumbers} />
        </label>

        <label className="f1">
          Seção
          <FichaInput id="titulo_secao" required maxLength={4} type="text" onKeyPress={onlyNumbers} />
        </label>

        <label className="f1">
          Data de Emissão (Título)
          <FichaInput id="titulo_data_emissao" required type="date" />
        </label>

        <label className="f1">
          UF (Título)
          <FichaSelect id="titulo_uf" required>
            <option value="">Selecione</option>
            <option value="MA">MA - Maranhão</option>
            <option value="PA">PA - Pará</option>
            <option value="PI">PI - Piauí</option>
            <option value="CE">CE - Ceará</option>
            <option value="TO">TO - Tocantins</option>
            <option value="BA">BA - Bahia</option>
            <option value="GO">GO - Goiás</option>
            <option value="DF">DF - Distrito Federal</option>
            <option value="SP">SP - São Paulo</option>
            <option value="RJ">RJ - Rio de Janeiro</option>
            <option value="MG">MG - Minas Gerais</option>
            <option value="RS">RS - Rio Grande do Sul</option>
            <option value="SC">SC - Santa Catarina</option>
          </FichaSelect>
        </label>
      </div>

      <div className="line">
        <label className="f1">
          Banco / Agência
          <FichaInput id="banco_agencia" required type="text" />
        </label>

        <label className="f1">
          Conta com DV
          <FichaInput id="conta_dv" required type="text" />
        </label>

        <label className="f1">
          Sindicato
          <FichaInput id="sindicato" type="text" />
        </label>

        <label className="f2">
          Pensão Alimentícia / Judicial
          <FichaInput id="pensao" type="text" />
        </label>
      </div>
    </>
  );
}