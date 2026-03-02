import { fichaState } from "../state/fichaState";
import { formatarDataPorExtenso } from "./date";
// import { handleInputMascaras, formatarDataPorExtenso } from "./utils";

// interface HTMLInputOrTextarea extends HTMLInputElement, HTMLTextAreaElement {}
const camposContrato = [
    'nome', 'estado_civil', 'cpf', 'rg', 'endereco', 
    'bairro', 'cargo', 'lotacao', 'numero', 'carga_horaria', 'cidade', 
    'data_inicio', 'data_final', 'data_por_extenso'
]

export function atualizarCampo(id: string, valor: string, type?: string) {
  const outputId = `out_${id}`;
  const output = document.getElementById(outputId)??
  document.getElementById(id);;
  const valorFormatado =
    type === "date" && valor ? valor.split("-").reverse().join("/") : valor.toUpperCase();

  if (output) {
    output.textContent = valorFormatado;
  }

  if (camposContrato.includes(id)) {
    atualizarCampoContrato(id, valor);
    if ( type === "date") console.log(id, valor, camposContrato.includes(id));
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

function atualizarCampoContrato(id: string, valor: string) {
  const isEndereco = id === "numero" || id === "endereco";
  const elementoId = isEndereco ? "c_endereco" : `c_${id}`;
  const elemento = document.getElementById(elementoId);
  // console.log(elementoId,elemento, document.getElementById('c_data_inicio'));
  
  fichaState.values[id] = valor;

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

  if (!['data_inicio', 'data_final', 'data_por_extenso'].includes(id))
    elemento.style.fontWeight = "bold";
}

export function atualizarDataInicio(dataString: string) {
  console.log('aqui', dataString);
  
  const spanDataInicio = document.getElementById("c_data_inicio");
  if (!spanDataInicio) return;

  if (!dataString) {
    const hoje = new Date();
    const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    const ano = hoje.getFullYear();
    spanDataInicio.textContent = `01 de ${mesCapitalizado} de ${ano}`;
    fichaState.values.data_inicio = spanDataInicio.textContent;
    fichaState.values.input_data_inicio = dataString;
    console.log(fichaState.values);
    
    return;
  }

  const dataFormatada = formatarDataPorExtenso(dataString);
  spanDataInicio.textContent = dataFormatada;
  fichaState.values.data_inicio = dataFormatada;
  fichaState.values.input_data_inicio = dataString;
}

export function atualizarDataFinal(dataString: string) {
  const spanDataFinal = document.getElementById("c_data_final");
  if (!spanDataFinal) return;

  if (!dataString) {
    const ano = new Date().getFullYear();
    spanDataFinal.textContent = `31 de Dezembro de ${ano}`;
    fichaState.values.data_final = spanDataFinal.textContent;
    fichaState.values.input_data_final = dataString;
    return;
  }

  const dataFormatada = formatarDataPorExtenso(dataString);
  spanDataFinal.textContent = dataFormatada;
  fichaState.values.data_final = dataFormatada;
  fichaState.values.input_data_final = dataString;
}

export function atualizarDataPorExtenso(dataString: string) {
  const DataPorExtenso = document.getElementById("c_data_por_extenso");
  const DataAtual = document.getElementById("data_atual");
  if (!DataPorExtenso) return;

  if (DataAtual)
    DataAtual.textContent = dataString.split('-').reverse().join('/');
  

  if (!dataString) {
    const hoje = new Date();
    const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    const ano = hoje.getFullYear();
    DataPorExtenso.textContent = `Município de Junco do Maranhão/MA, 01 de ${mesCapitalizado} de ${ano}.`;
    fichaState.values.data_por_extenso = DataPorExtenso.textContent;
    fichaState.values.input_data_por_extenso = dataString;
    return;
  }

  const dataFormatada = formatarDataPorExtenso(dataString);
  DataPorExtenso.textContent = `Município de Junco do Maranhão/MA, ${dataFormatada}.`;
  fichaState.values.data_por_extenso = DataPorExtenso.textContent;
  fichaState.values.input_data_por_extenso = dataString;
}

export function desfazerDataPorExtenso(texto: string): string {
  const match = texto.match(/(\d{1,2}) de ([A-Za-zçÇãÃéÉêÊôÔóÓíÍúÚ]+) de (\d{4})/);
  if (!match) {
    throw new Error("Formato de data inválido");
  }

  const dia = match[1].padStart(2, "0");
  const mesNome = match[2].toLowerCase();
  const ano = match[3];

  const meses: Record<string, string> = {
    janeiro: "01",
    fevereiro: "02",
    março: "03",
    marco: "03",
    abril: "04",
    maio: "05",
    junho: "06",
    julho: "07",
    agosto: "08",
    setembro: "09",
    outubro: "10",
    novembro: "11",
    dezembro: "12",
  };

  const mes = meses[mesNome];

  if (!mes) {
    throw new Error("Mês inválido");
  }
//  console.log( `${ano}-${mes}-${dia}`)
  return `${ano}-${mes}-${dia}`;
}