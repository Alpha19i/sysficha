async function carregarSecao(indice) {
  try {
    const res = await fetch(CONFIG.secoes[indice]);
    
    if (!res.ok) {
      throw new Error(`Erro ao carregar seção: ${res.status}`);
    }
    
    const html = await res.text();
    DOM.formContent.innerHTML = html;

    restaurarValoresCampos();
    ativarEspelhamento();
    atualizarBotoes(indice);
    
  } catch (error) {
    console.error('Erro ao carregar seção:', error);
    mostrarErro('Erro ao carregar formulário. Tente recarregar a página.');
  }
}

function restaurarValoresCampos() {
  const campos = DOM.formContent.querySelectorAll("input, select, textarea");

  campos.forEach((input) => {
    const outputId = input.id === 'carga_horaria' 
      ? `c_${input.id}` 
      : `out_${input.id}`;
    
    const output = document.getElementById(outputId);
    
    if (output?.textContent) {
      if (input.type === "date" && output.textContent) {
        input.value = output.textContent.split('/').reverse().join('-');
      } else {
        input.value = output.textContent.toUpperCase();
      }
    }
  });
}

function ativarEspelhamento() {
  const inputs = DOM.formContent.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    const oldHandler = state.listeners.get(input);
    if (oldHandler) {
      input.removeEventListener("input", oldHandler);
    }

    const handler = (e) => atualizarCampo(e.target.id);
    state.listeners.set(input, handler);
    input.addEventListener("input", handler);
  });
}

function atualizarBotoes(indice) {
  DOM.btnAnterior.disabled = indice === 0;
  DOM.btnProximo.textContent = indice === CONFIG.secoes.length - 1 
    ? "Gerar PDF" 
    : "Próximo";
}