async function handleProximo() {
  if (!validarCamposAtuais()) return;

  if (state.indice < CONFIG.secoes.length - 1) {
    state.indice++;
    await carregarSecao(state.indice);
  } else {
    await gerarPDFeJSON();
  }
}

async function handleAnterior() {
  if (state.indice > 0) {
    state.indice--;
    await carregarSecao(state.indice);
  }
}

function validarCamposAtuais() {
  const campos = DOM.formContent.querySelectorAll("input, select, textarea");
  
  for (const campo of campos) {
    if (!campo.checkValidity()) {
      campo.reportValidity();
      return false;
    }
  }
  
  return true;
}