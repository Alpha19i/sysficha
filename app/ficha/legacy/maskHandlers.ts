import { aplicarMascara } from "./maskEngine";
// import { validarCPF, validarPIS } from "./validators";

export function aplicarMascaraPorElemento(
  el: HTMLInputElement,
  isBlur = false
) {
  if (el.matches('[id="cpf"], [id^="dependente_cpf"]')) {
    aplicarMascara(el, "cpf", isBlur);
  }

  else if (el.matches('[id="ctps"]')) {
    const apenasNumeros = el.value.replace(/\D/g, "");

    if (apenasNumeros.length > 7) {
      aplicarMascara(el, "cpf", isBlur);
    } else {
      el.value = apenasNumeros.slice(0, 11);
    }
  }

  else if (el.matches('[id="pis_pasep"]')) {
    aplicarMascara(el, "pis", isBlur);
  }

  else if (el.matches('[id="cep"]')) {
    aplicarMascara(el, "cep", isBlur);
  }

  else if (el.matches('[id^="telefone"], [id^="celular"]')) {
    aplicarMascara(el, "celular", isBlur);
  }
}