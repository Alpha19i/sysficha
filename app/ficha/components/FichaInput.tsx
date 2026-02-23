"use client";

import { InputHTMLAttributes } from "react";
import { aplicarMascaraPorElemento } from "../legacy/maskHandlers";
import { atualizarCampo } from "../core/espelhamento";
import { useFicha } from "../state/ficha-store";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export default function FichaInput({ id, type = "text", ...props }: Props) {
  const { setField } = useFicha();
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;

    aplicarMascaraPorElemento(el);

    if (type === "text") {
      el.value = el.value.toUpperCase();
    }
    setField(id, el.value);
    atualizarCampo(id, el.value, type);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const el = e.target;
    aplicarMascaraPorElemento(el, true);
  }

  return (
    <input
      id={id}
      type={type}
      onChange={handleInput}
      onBlur={handleBlur}
      {...props}
    />
  );
}