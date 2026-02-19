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
    await gerarPDF(nome);
    downloadJSON(state.json, `${nome}.json`);
    mostrarSucesso('PDF e JSON gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar arquivos:', error);
    mostrarErro('Erro ao gerar arquivos. Tente novamente.');
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