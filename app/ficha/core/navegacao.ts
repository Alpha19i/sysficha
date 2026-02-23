import { fichaState } from "../state/fichaState";

export function proximaSecao(total: number) {
  if (fichaState.indice < total - 1) {
    fichaState.indice++;
  }
}

export function secaoAnterior() {
  if (fichaState.indice > 0) {
    fichaState.indice--;
  }
}

export function textoBotaoProximo(total: number) {
  return fichaState.indice === total - 1
    ? "Gerar PDF"
    : "Próximo";
}

export function podeVoltar() {
  return fichaState.indice > 0;
}