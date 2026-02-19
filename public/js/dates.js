function configurarDatas() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
    
  const mesAtual = (hoje.getMonth() + 1).toString().padStart(2, '0');
  DOM.dataAtual.textContent = `01/${mesAtual}/${ano}`;
    
  DOM.dataFinal.textContent = `31 de Dezembro de ${ano}`;
    
  const mesExtenso = hoje.toLocaleDateString("pt-BR", { month: "long" });
  const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    
  DOM.dataPorExtenso.textContent = 
    `Município de Junco do Maranhão/MA, 01 de ${mesCapitalizado} de ${ano}.`;
    
  DOM.dataInicio.textContent = `01 de ${mesCapitalizado} de ${ano}`;
}

function formatarDataPorExtenso(dataString) {
  if (!dataString) return '';
  
  const [ano, mes, dia] = dataString.split('-');
  const data = new Date(ano, mes - 1, dia);
  
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return `${dia} de ${meses[data.getMonth()]} de ${ano}`;
}