function limparFormulario() {
  if (!confirm('Tem certeza que deseja limpar todos os dados e recomeçar? Esta ação não pode ser desfeita.')) {
    return;
  }
  
  state.json = {};
  state.indice = 0;
  
  limparTodosOutputs();
  limparCamposContrato();
  limparFoto();
  configurarDatas();
  
  carregarSecao(0);
  
  mostrarSucesso('Formulário limpo com sucesso!');
}

function limparTodosOutputs() {
  const todosOutputs = document.querySelectorAll('[id^="out_"]');
  todosOutputs.forEach(output => {
    if (output.id === 'out_numero') {
      output.textContent = 'S/N';
    } else {
      output.textContent = '';
    }
  });
}

function limparCamposContrato() {
  const camposContrato = ['c_nome', 'c_estado_civil', 'c_cpf', 'c_rg', 'c_endereco', 'c_bairro', 'c_cidade', 'c_cargo', 'c_lotacao', 'c_carga_horaria'];
  
  camposContrato.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = '';
      elemento.style.fontWeight = 'normal';
    }
  });
}

function limparFoto() {
  DOM.fotoPerfil.src = '/avatar.jpg';
}

function handleLimpar() {
  limparFormulario();
}