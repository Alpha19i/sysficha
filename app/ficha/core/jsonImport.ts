export type FichaData = Record<string, string>;

interface ImportDeps {
  setField: (id: string, value: string) => void;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
  afterLoad?: (data: FichaData) => void;
}

export function carregarArquivoJSON(
  event: React.ChangeEvent<HTMLInputElement>,
  deps: ImportDeps
) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const dados = JSON.parse(reader.result as string) as FichaData;
      carregarDadosJSON(dados, deps);
      deps.onSuccess?.("Dados carregados com sucesso!");
    } catch (error) {
      console.error(error);
      deps.onError?.("Arquivo JSON inválido.");
    }
  };

  reader.onerror = () => {
    deps.onError?.("Erro ao ler arquivo.");
  };

  reader.readAsText(file);
}

function carregarDadosJSON(dados: FichaData, deps: ImportDeps) {
  Object.entries(dados).forEach(([campo, valor]) => {
    if (typeof valor !== "string") return;
    deps.setField(campo, valor);
  });

  deps.afterLoad?.(dados);
}