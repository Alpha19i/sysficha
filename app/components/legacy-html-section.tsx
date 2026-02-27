"use client";

import { useEffect, useRef } from "react";
import { restaurarValoresCampos } from "@/app/ficha/core/restauracao";
// import { fichaState } from "@/app/ficha/state/fichaState";

export default function LegacyHtmlSection({ html }: { html: string }) {
  const 
  ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    restaurarValoresCampos(ref.current);

    // const el = ref.current.querySelector("#dataAtual");
    // console.log(el);
    
    // if (el) {
    //   el.textContent = fichaState.values.dataAtual || "";
    // }
  }, []);
  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}