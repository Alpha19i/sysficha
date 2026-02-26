"use client";

import FichaInput from "../components/FichaInput";
import FichaSelect from "../components/FichaSelect";
import FichaFile from "../components/FichaFile";
import { onlyNumbers } from "../utils/onlyNumbers";

export default function PessoaisSection() {
  return (
    <>
      <h1>Preenchimento da Ficha</h1>
      <h2>1 - Dados Pessoais</h2>

      <div className="line">
        <label className="f2">
          Foto do Servidor
          <br />
          <FichaFile id="foto" accept="image/*" />
        </label>

        <label className="f1">
          Matrícula
          <FichaInput id="matricula" type="text" />
        </label>

        <label className="f2">
          Nome do(a) Servidor(a)
          <FichaInput id="nome" required type="text" />
        </label>
      </div>

      <div className="line">
        <label className="f1">
          Data de Nascimento
          <FichaInput id="nascimento" required type="date" />
        </label>

        <label className="f1">
          Sexo
          <br />
          <FichaSelect id="sexo" required>
            <option value="">Selecione</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="OUTRO">Outro</option>
          </FichaSelect>
        </label>

        <label className="f1">
          Estado Civil
          <br />
          <FichaSelect id="estado_civil" required>
            <option value="">Selecione</option>
            <option value="SOLTEIRO(A)">Solteiro(a)</option>
            <option value="CASADO(A)">Casado(a)</option>
            <option value="DIVORCIADO(A)">Divorciado(a)</option>
            <option value="VIÚVO(A)">Viúvo(a)</option>
            <option value="UNIÃO ESTÁVEL">União Estável</option>
          </FichaSelect>
        </label>
      </div>

      <div className="line">
        <label className="f2">
          Naturalidade
          <FichaInput id="naturalidade" required type="text" />
        </label>

        <label className="f05">
          UF (Estado)
          <FichaSelect id="uf" required>
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
          Nome da Mãe
          <FichaInput id="mae" type="text" />
        </label>

        <label className="f2">
          Nome do Pai
          <FichaInput id="pai" type="text" />
        </label>
      </div>

      <div className="line">
        <label className="f4">
          Endereço
          <FichaInput id="endereco" required type="text" />
        </label>

        <label className="f05">
          Número
          <FichaInput
            id="numero"
            value="S/N"
            type="text"
            maxLength={3}
            inputMode="numeric"
            onKeyPress={onlyNumbers}
          />
        </label>
      </div>

      <div className="line">
        <label className="f1">
          Complemento
          <FichaInput id="complemento" type="text" />
        </label>

        <label className="f1">
          Bairro
          <FichaInput id="bairro" required type="text" />
        </label>
      </div>

      <div className="line">
        <label className="f3">
          Cidade
          <FichaInput id="cidade" required type="text" />
        </label>

        <label className="f1">
          CEP
          <FichaInput
            id="cep"
            required
            type="text"
            maxLength={10}
            inputMode="numeric"
          />
        </label>
      </div>

      <div className="line">
        <label className="f1">
          Telefone Fixo
          <FichaInput id="telefone_fixo" type="text" maxLength={14} />
        </label>

        <label className="f1">
          Celular
          <FichaInput id="celular" required type="tel" maxLength={15} />
        </label>

        <label className="f2">
          Email
          <FichaInput id="email" type="email" />
        </label>
      </div>
    </>
  );
}