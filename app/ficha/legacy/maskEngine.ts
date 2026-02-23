import { validarCPF, validarPIS } from "./validators";

const MASCARAS = {
  cpf: {
    aplicar: (valor: string) => valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14),
    validar: validarCPF,
    tamanhoCompleto: 14
  },

  celular: {
    aplicar: (valor: string) => valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .slice(0, 14)
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2"),
    validar: null,
    tamanhoCompleto: 15
  },

  pis: {
    aplicar: (valor: string) => valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{5})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{5})\.(\d{2})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14),
    validar: validarPIS,
    tamanhoCompleto: 14
  },

  cep: {
    aplicar: (valor: string) => valor
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1-$2")
      .slice(0, 10),
    validar: null,
    tamanhoCompleto: 10
  }
};

export function aplicarMascara(
  input: HTMLInputElement,
  tipo: keyof typeof MASCARAS,
  isBlur = false
) {
  const mascara = MASCARAS[tipo];
  if (!mascara) return;

  input.value = mascara.aplicar(input.value);

  if (!isBlur) return;

  if (mascara.validar && input.value) {
    const valido = mascara.validar(input.value);
    const tamanhoCorreto = input.value.length === mascara.tamanhoCompleto;

    if (!valido && tamanhoCorreto) {
      input.setCustomValidity(`${tipo.toUpperCase()} inválido`);
      input.reportValidity();
    } else {
      input.setCustomValidity("");
    }
  }
}