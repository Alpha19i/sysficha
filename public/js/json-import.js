function carregarArquivoJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = function (e) {
    try {
      const dadosJSON = JSON.parse(e.target.result);
      carregarDadosJSON(dadosJSON);
      mostrarSucesso('Dados carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar JSON:', error);
      mostrarErro('Arquivo JSON inválido.');
    }
  };
  
  reader.onerror = function() {
    mostrarErro('Erro ao ler arquivo.');
  };
  
  reader.readAsText(file);
}

function carregarDadosJSON(dados) {
  Object.entries(dados).forEach(([campo, valor]) => {
    state.json[campo] = valor;
    
    if (CONFIG.camposContrato.includes(campo)) {
      atualizarCampoContrato(campo, valor);
    }

    if (CONFIG.camposData.includes(campo)) {
      const elemento = document.getElementById(campo);
      if (elemento) {
        elemento.textContent = valor;
      }
    }

    const input = document.getElementById(campo);
    if (input) {
      if (input.type === "date" && valor) {
        input.value = valor.split('/').reverse().join('-');
      } else {
        input.value = valor;
      }
    }

    if (campo === 'input_data_inicio') {
      const inputDataInicio = document.getElementById('input_data_inicio');
      if (inputDataInicio && valor) {
        inputDataInicio.value = valor;
        atualizarDataInicio(valor);
      }
    }
    
    if (campo === 'input_data_final') {
      const inputDataFinal = document.getElementById('input_data_final');
      if (inputDataFinal && valor) {
        inputDataFinal.value = valor;
        atualizarDataFinal(valor);
      }
    }
    
    if (campo === 'input_data_por_extenso') {
      const inputDataPorExtenso = document.getElementById('input_data_por_extenso');
      if (inputDataPorExtenso && valor) {
        inputDataPorExtenso.value = valor;
        atualizarDataPorExtenso(valor);
      }
    }

    const output = document.getElementById(`out_${campo}`);
    if (output) {
      output.textContent = valor.toUpperCase();
    }
  });
  
  ativarEspelhamento();
}