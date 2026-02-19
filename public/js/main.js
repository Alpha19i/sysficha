DOM.btnProximo.addEventListener("click", handleProximo);
DOM.btnAnterior.addEventListener("click", handleAnterior);
DOM.btnLimpar.addEventListener("click", handleLimpar);
DOM.inputJSON.addEventListener("change", carregarArquivoJSON);
document.addEventListener("change", handleFotoChange);
// document.addEventListener("input", handleInputMascaras);
document.addEventListener("blur", handleBlurValidacao, true);

configurarDatas();
carregarSecao(state.indice);