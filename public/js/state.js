const state = {
  indice: 0,
  json: {},
  listeners: new WeakMap()
};

const DOM = {
  formContent: document.getElementById("form-content"),
  btnAnterior: document.getElementById("btnAnterior"),
  btnProximo: document.getElementById("btnProximo"),
  btnLimpar: document.getElementById("btnLimpar"),
  fotoPerfil: document.getElementById("fotoPerfil"),
  dataAtual: document.getElementById("dataAtual"),
  dataFinal: document.getElementById("data_final"),
  dataPorExtenso: document.getElementById("data_por_extenso"),
  dataInicio: document.getElementById("data_inicio"),
  inputJSON: document.getElementById("inputArquivoJSON")
};