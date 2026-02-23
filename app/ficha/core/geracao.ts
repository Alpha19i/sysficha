import html2pdf from "html2pdf.js";
import { formatarDataPorExtenso } from "./date";

type FichaData = Record<string, string>;

interface GerarDeps {
  data: FichaData;
  setField: (id: string, value: string) => void;
}

export async function gerarPDFeJSON({ data, setField }: GerarDeps): Promise<void> {
  const nome = normalizarNomeArquivo(data.nome);

  sincronizarDatasContrato(data, setField);

  try {
    await salvarFichaNoBanco(data);
    await gerarPDF(nome);
    downloadJSON(data, `${nome}.json`);
  } catch (error) {
    console.error("Erro ao gerar arquivos:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao gerar arquivos. Tente novamente.";
    throw new Error(message);
  }
}

async function salvarFichaNoBanco(data: FichaData): Promise<void> {
  const servidorNome = (data.nome || "").trim();
  const cpf = (data.cpf || "").trim();

  if (!servidorNome) {
    throw new Error("Nome do servidor nao encontrado para salvar no banco.");
  }

  if (!cpf) {
    throw new Error("CPF nao encontrado para salvar no banco.");
  }

  const response = await fetch("/api/fichas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      servidorNome,
      cpf,
      payloadJson: data
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result?.created) {
    const apiMessage =
      typeof result?.message === "string"
        ? result.message
        : "Falha ao salvar ficha no banco.";
    throw new Error(apiMessage);
  }
}

function sincronizarDatasContrato(
  data: FichaData,
  setField: (id: string, value: string) => void
): void {
  const inputDataInicio = document.getElementById(
    "input_data_inicio"
  ) as HTMLInputElement | null;

  const inputDataFinal = document.getElementById(
    "input_data_final"
  ) as HTMLInputElement | null;

  const inputDataPorExtenso = document.getElementById(
    "input_data_por_extenso"
  ) as HTMLInputElement | null;

  if (inputDataInicio?.value) {
    setField("input_data_inicio", inputDataInicio.value);
    setField("data_inicio", formatarDataPorExtenso(inputDataInicio.value));
  }

  if (inputDataFinal?.value) {
    setField("input_data_final", inputDataFinal.value);
    setField("data_final", formatarDataPorExtenso(inputDataFinal.value));
  }

  if (inputDataPorExtenso?.value) {
    const texto = `Município de Junco do Maranhão/MA, ${formatarDataPorExtenso(
      inputDataPorExtenso.value
    )}.`;
    setField("data_por_extenso", texto);
  }

  const cargaHoraria = document.getElementById("c_carga_horaria");
  if (cargaHoraria) {
    setField("carga_horaria", cargaHoraria.textContent || "");
  }
}

interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: {
      type?: "jpeg" | "png" | "webp";
      quality?: number;
    };
    enableLinks?: boolean;
    html2canvas?: object;
    jsPDF?: {
      unit?: string;
      format?: string | [number, number];
      orientation?: "portrait" | "landscape";
    };
  }

const pdfOptions: Html2PdfOptions= {
    margin: 0,
    image: { type: 'jpeg', quality: 0.92 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: "mm", 
      format: "a4", 
      orientation: "portrait",
      // compress: true
    },
    // pagebreak: { 
    //   mode: ['avoid-all', 'css'],
    //   before: '.pdf-page-break'
    // }
  }

async function gerarPDF(nome: string): Promise<void> {
  const pagina = document.getElementById("pagina-pdf");
  if (!pagina) throw new Error("Container do PDF não encontrado.");

  const hrs = pagina.querySelectorAll("hr");

  try {
    hrs.forEach((hr) => (hr.style.display = "none"));

    const options = {
      ...pdfOptions,
      filename: `${nome}.pdf`
    };

    await html2pdf()
      .set(options)
      .from(pagina)
      .save();
  } finally {
    hrs.forEach((hr) => (hr.style.display = ""));
  }
}

function downloadJSON(objeto: unknown, nomeArquivo: string): void {
  const jsonString = JSON.stringify(objeto, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  a.click();

  URL.revokeObjectURL(url);
}

function normalizarNomeArquivo(nome?: string): string {
  if (!nome) return "ficha-servidor";

  return nome
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}