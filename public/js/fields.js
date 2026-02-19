function atualizarCampo(id) {
  const input = document.getElementById(id);
  if (!input) return;

  handleInputMascaras(input);
  
  const valor = input.value || '';
  
  if (input.type === 'text' || input.tagName === 'TEXTAREA') {
    input.value = valor.toUpperCase();
  }
  
  atualizarOutput(id, input);
  
  if (CONFIG.camposContrato.includes(id)) {
    atualizarCampoContrato(id, input.value);
  }
  
  if (id === 'input_data_inicio') {
    atualizarDataInicio(valor);
  } else if (id === 'input_data_final') {
    atualizarDataFinal(valor);
  } else if (id === 'input_data_por_extenso') {
    atualizarDataPorExtenso(valor);
  }
}

function atualizarOutput(id, input) {
  const output = document.getElementById(`out_${id}`);
  if (!output) return;
  
  const valor = input.value || '';
  const data = input.type === "date" && valor
    ? valor.split('-').reverse().join('/')
    : valor.toUpperCase();
  
  output.textContent = data;
  state.json[id] = input.type === "date" && valor
    ? valor.split('-').reverse().join('/')
    : valor;
}

function atualizarCampoContrato(id, valor) {
  const isEndereco = id === 'numero' || id === 'endereco';
  const elementoId = isEndereco ? 'c_endereco' : `c_${id}`;
  const elemento = document.getElementById(elementoId);
  
  if (!elemento) return;
  
  if (!isEndereco) {
    elemento.textContent = valor;
  } else if (id === 'endereco') {
    const numero = state.json.numero || '';
    elemento.textContent = numero 
      ? `${valor}, Nº: ${numero}`
      : `${valor}, S/N`;
  } else if (id === 'numero') {
    const endereco = state.json.endereco || '';
    elemento.textContent = endereco
      ? `${endereco}, Nº: ${valor}`
      : `Nº: ${valor}`;
  }
  
  elemento.style.fontWeight = 'bold';
}

function atualizarDataInicio(dataString) {
  const spanDataInicio = document.getElementById('data_inicio');
  if (!spanDataInicio) return;
  
  if (!dataString) {
    const hoje = new Date();
    const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    const ano = hoje.getFullYear();
    spanDataInicio.textContent = `01 de ${mesCapitalizado} de ${ano}`;
    state.json.data_inicio = spanDataInicio.textContent;
    return;
  }
  
  const dataFormatada = formatarDataPorExtenso(dataString);
  spanDataInicio.textContent = dataFormatada;
  state.json.data_inicio = dataFormatada;
}

function atualizarDataFinal(dataString) {
  const spanDataFinal = document.getElementById('data_final');
  if (!spanDataFinal) return;
  
  if (!dataString) {
    const ano = new Date().getFullYear();
    spanDataFinal.textContent = `31 de Dezembro de ${ano}`;
    state.json.data_final = spanDataFinal.textContent;
    return;
  }
  
  const dataFormatada = formatarDataPorExtenso(dataString);
  spanDataFinal.textContent = dataFormatada;
  state.json.data_final = dataFormatada;
}

function atualizarDataPorExtenso(dataString) {
  const pDataPorExtenso = document.getElementById('data_por_extenso');
  if (!pDataPorExtenso) return;
  
  if (!dataString) {
    const hoje = new Date();
    const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    const ano = hoje.getFullYear();
    pDataPorExtenso.textContent = `Município de Junco do Maranhão/MA, 01 de ${mesCapitalizado} de ${ano}.`;
    state.json.data_por_extenso = pDataPorExtenso.textContent;
    return;
  }
  
  const dataFormatada = formatarDataPorExtenso(dataString);
  pDataPorExtenso.textContent = `Município de Junco do Maranhão/MA, ${dataFormatada}.`;
  state.json.data_por_extenso = pDataPorExtenso.textContent;
}