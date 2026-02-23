import { fichaState } from "../state/fichaState";
import { formatarDataPorExtenso } from "./date";
// import { handleInputMascaras, formatarDataPorExtenso } from "./utils";

// interface HTMLInputOrTextarea extends HTMLInputElement, HTMLTextAreaElement {}
const camposContrato = [
    'nome', 'estado_civil', 'cpf', 'rg', 'endereco', 
    'bairro', 'cargo', 'lotacao', 'numero', 'carga_horaria', 'cidade'
]

export function atualizarCampo(id: string, valor: string, type?: string) {
  const outputId = `out_${id}`;
  console.log(id);
  
  
  const output = document.getElementById(outputId);

  let valorFormatado = valor;

  if (type === "date" && valor) {
    valorFormatado = valor.split("-").reverse().join("/");
  } else {
    valorFormatado = valor.toUpperCase();
  }

  if (output) {
    output.textContent = valorFormatado;
  }

  if (camposContrato.includes(id)) {
    atualizarCampoContrato(id, valor);
  }

  switch (id) {
    case "input_data_inicio":
      atualizarDataInicio(valor);
      break;
    case "input_data_final":
      atualizarDataFinal(valor);
      break;
    case "input_data_por_extenso":
      atualizarDataPorExtenso(valor);
      break;
  }

  fichaState.values[id] = valorFormatado;
}

/**
 * Atualiza o valor de um input/textarea no DOM e no state, aplicando máscaras e formatações.
 */
export function atualizarCampoInput(id: string) {
  const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  if (!input) return;

  handleInputMascaras(input);

  const valor = input.value || "";

  if (input.type === "text" || input.tagName === "TEXTAREA") {
    input.value = valor.toUpperCase();
  }

  atualizarOutput(id, input);

  if (CONFIG.camposContrato.includes(id)) {
    atualizarCampoContrato(id, input.value);
  }

  switch (id) {
    case "input_data_inicio":
      atualizarDataInicio(valor);
      break;
    case "input_data_final":
      atualizarDataFinal(valor);
      break;
    case "input_data_por_extenso":
      atualizarDataPorExtenso(valor);
      break;
  }
}

function atualizarOutput(id: string, input: HTMLInputElement | HTMLTextAreaElement) {
  const output = document.getElementById(`out_${id}`);
  if (!output) return;

  const valor = input.value || "";
  const data = input.type === "date" && valor
    ? valor.split("-").reverse().join("/")
    : valor.toUpperCase();

  output.textContent = data;
  fichaState.values[id] = input.type === "date" && valor
    ? valor.split("-").reverse().join("/")
    : valor;
}

function atualizarCampoContrato(id: string, valor: string) {
  const isEndereco = id === "numero" || id === "endereco";
  const elementoId = isEndereco ? "c_endereco" : `c_${id}`;
  const elemento = document.getElementById(elementoId);

  if (!elemento) return;

  if (!isEndereco) {
    elemento.textContent = valor;
  } else if (id === "endereco") {
    const numero = fichaState.values.numero || "";
    elemento.textContent = numero ? `${valor}, Nº: ${numero}` : `${valor}, S/N`;
  } else if (id === "numero") {
    const endereco = fichaState.values.endereco || "";
    elemento.textContent = endereco ? `${endereco}, Nº: ${valor}` : `Nº: ${valor}`;
  }

  elemento.style.fontWeight = "bold";
}

function atualizarDataInicio(dataString: string) {
  const spanDataInicio = document.getElementById("data_inicio");
  if (!spanDataInicio) return;

  if (!dataString) {
    const hoje = new Date();
    const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    const ano = hoje.getFullYear();
    spanDataInicio.textContent = `01 de ${mesCapitalizado} de ${ano}`;
    fichaState.values.data_inicio = spanDataInicio.textContent;
    return;
  }

  const dataFormatada = formatarDataPorExtenso(dataString);
  spanDataInicio.textContent = dataFormatada;
  fichaState.values.data_inicio = dataFormatada;
}

function atualizarDataFinal(dataString: string) {
  const spanDataFinal = document.getElementById("data_final");
  if (!spanDataFinal) return;

  if (!dataString) {
    const ano = new Date().getFullYear();
    spanDataFinal.textContent = `31 de Dezembro de ${ano}`;
    fichaState.values.data_final = spanDataFinal.textContent;
    return;
  }

  const dataFormatada = formatarDataPorExtenso(dataString);
  spanDataFinal.textContent = dataFormatada;
  fichaState.values.data_final = dataFormatada;
}

function atualizarDataPorExtenso(dataString: string) {
  const pDataPorExtenso = document.getElementById("data_por_extenso");
  if (!pDataPorExtenso) return;

  if (!dataString) {
    const hoje = new Date();
    const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    const ano = hoje.getFullYear();
    pDataPorExtenso.textContent = `Município de Junco do Maranhão/MA, 01 de ${mesCapitalizado} de ${ano}.`;
    fichaState.values.data_por_extenso = pDataPorExtenso.textContent;
    return;
  }

  const dataFormatada = formatarDataPorExtenso(dataString);
  pDataPorExtenso.textContent = `Município de Junco do Maranhão/MA, ${dataFormatada}.`;
  fichaState.values.data_por_extenso = pDataPorExtenso.textContent;
}