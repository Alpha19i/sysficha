async function gerarPDFeJSON() {
  const nome = state.json.nome
    ? state.json.nome
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
    : "ficha-servidor";
  
  sincronizarDatasContrato();
  
  try {
    await salvarFichaNoBanco();
    await gerarPDF(nome);
    downloadJSON(state.json, `${nome}.json`);
    mostrarSucesso('PDF, JSON e ficha no banco gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar arquivos:', error);
    const message = error instanceof Error ? error.message : 'Erro ao gerar arquivos. Tente novamente.';
    mostrarErro(message);
  }
}

async function salvarFichaNoBanco() {
  const servidorNome = (state.json.nome || '').trim();
  const cpf = (state.json.cpf || '').trim();

  if (!servidorNome) {
    throw new Error('Nome do servidor nao encontrado para salvar no banco.');
  }

  if (!cpf) {
    throw new Error('CPF nao encontrado para salvar no banco.');
  }

  const response = await fetch('/api/fichas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      servidorNome,
      cpf,
      payloadJson: state.json
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.created) {
    const apiMessage = typeof data?.message === 'string' ? data.message : 'Falha ao salvar ficha no banco.';
    throw new Error(apiMessage);
  }
}

function sincronizarDatasContrato() {
  const inputDataInicio = document.getElementById('input_data_inicio');
  const inputDataFinal = document.getElementById('input_data_final');
  const inputDataPorExtenso = document.getElementById('input_data_por_extenso');
  
  if (inputDataInicio?.value) {
    state.json.input_data_inicio = inputDataInicio.value;
    atualizarDataInicio(inputDataInicio.value);
  }
  
  if (inputDataFinal?.value) {
    state.json.input_data_final = inputDataFinal.value;
    atualizarDataFinal(inputDataFinal.value);
  }
  
  if (inputDataPorExtenso?.value) {
    state.json.input_data_por_extenso = inputDataPorExtenso.value;
    atualizarDataPorExtenso(inputDataPorExtenso.value);
  }

  const cargaHoraria = document.getElementById('c_carga_horaria');
  if (cargaHoraria) {
    state.json.carga_horaria = cargaHoraria.innerText || '';
  }
}

async function gerarPDF(nome) {
  const pagina = document.getElementById('pagina-pdf');
  const hrs = pagina.querySelectorAll('hr');
  const loader = mostrarCarregamento('Gerando PDF...');
  
  try {
    hrs.forEach(hr => hr.style.display = 'none');
    
    const options = {
      ...CONFIG.pdfOptions,
      filename: `${nome}.pdf`
    };
    
    await html2pdf().set(options).from(pagina).save();
    
  } finally {
    hrs.forEach(hr => hr.style.display = '');
    esconderCarregamento(loader);
  }
}

function downloadJSON(objeto, nomeArquivo = "dados-ficha.json") {
  const jsonString = JSON.stringify(objeto, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
