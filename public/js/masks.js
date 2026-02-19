const MASCARAS = {
  cpf: {
    aplicar: (valor) => valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14),
    validar: validarCPF,
    tamanhoCompleto: 14
  },
  
  celular: {
    aplicar: (valor) => valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .slice(0, 14)
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2'),
    validar: null,
    tamanhoCompleto: 15
  },
  
  pis: {
    aplicar: (valor) => valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{5})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{5})\.(\d{2})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14),
    validar: validarPIS,
    tamanhoCompleto: 14
  },
  
  cep: {
    aplicar: (valor) => valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .slice(0, 10),
    validar: null,
    tamanhoCompleto: 10
  }
};

function aplicarMascara(input, tipo) {
  const mascara = MASCARAS[tipo];
  if (!mascara) return;
  
  const valorAnterior = input.value;
  input.value = mascara.aplicar(input.value);
  
  if (mascara.validar && input.value) {
    const valido = mascara.validar(input.value);
    const tamanhoCorreto = input.value.length === mascara.tamanhoCompleto;
    
    if (!valido && tamanhoCorreto) {
      input.setCustomValidity(`${tipo.toUpperCase()} inválido`);
    } else {
      input.setCustomValidity('');
    }
  }
  
  return valorAnterior !== input.value;
}

function handleInputMascaras(el) {
  // const el = event.target;
  
  if (el.matches('[id="cpf"], [id^="dependente_cpf"]')) {
    aplicarMascara(el, 'cpf');
  }

  else if (el.matches('[id="ctps"]')) {
    const apenasNumeros = el.value.replace(/\D/g, '');
    if (apenasNumeros.length > 7) {
      aplicarMascara(el, 'cpf');
    } else {
      el.value = apenasNumeros.slice(0, 11);
    }
  }
  
  else if (el.matches('[id="pis_pasep"]')) {
    aplicarMascara(el, 'pis');
  }
  
  else if (el.matches('[id="cep"]')) {
    aplicarMascara(el, 'cep');
  }
  
  else if (el.matches('[id^="telefone"], [id^="celular"]')) {
    aplicarMascara(el, 'celular');
  }
}

function handleBlurValidacao(event) {
  const el = event.target;
  
  if (el.matches('[id="cpf"], [id^="dependente_cpf"], [id="ctps"]')) {
    if (el.value && el.value.length === 14 && !validarCPF(el.value)) {
      el.reportValidity();
    }
  }
  
  else if (el.matches('[id="pis_pasep"]')) {
    if (el.value && el.value.length === 14 && !validarPIS(el.value)) {
      el.reportValidity();
    }
  }
}