interface DOMElements {
  dataAtual: HTMLElement | null;
  dataFinal: HTMLElement | null;
  dataPorExtenso: HTMLElement | null;
  dataInicio: HTMLElement | null;
}

// Exemplo de objeto DOM
const DOM: DOMElements = {
  dataAtual: document.getElementById("data-atual"),
  dataFinal: document.getElementById("data-final"),
  dataPorExtenso: document.getElementById("data-por-extenso"),
  dataInicio: document.getElementById("data-inicio"),
};

/**
 * Configura datas padrão no formulário/ficha
 */
export function configurarDatas(): void {
  const hoje = new Date();
  const ano = hoje.getFullYear();

  const mesAtual = (hoje.getMonth() + 1).toString().padStart(2, "0");
  if (DOM.dataAtual) DOM.dataAtual.textContent = `01/${mesAtual}/${ano}`;

  if (DOM.dataFinal) DOM.dataFinal.textContent = `31 de Dezembro de ${ano}`;

  const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
  const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);

  if (DOM.dataPorExtenso)
    DOM.dataPorExtenso.textContent = `Município de Junco do Maranhão/MA, 01 de ${mesCapitalizado} de ${ano}.`;

  if (DOM.dataInicio) DOM.dataInicio.textContent = `01 de ${mesCapitalizado} de ${ano}`;
}

/**
 * Recebe uma data no formato YYYY-MM-DD e retorna por extenso em português
 */
export function formatarDataPorExtenso(dataString: string): string {
  if (!dataString) return "";

  const [ano, mes, dia] = dataString.split("-");
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  return `${dia} de ${meses[data.getMonth()]} de ${ano}`;
}