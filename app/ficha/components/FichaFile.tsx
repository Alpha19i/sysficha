"use client";
import { useFicha } from "../state/ficha-store";
import { atualizarCampo } from "../core/espelhamento";

interface Props {
  id: string;
  accept?: string;
}

export default function FichaFile({ id, accept }: Props) {
  const { setField } = useFicha();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && id === "foto") {
      alert("Por favor, selecione uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setField(id, result); // atualiza state
      atualizarCampo(id, result, "file"); // espelhamento
      if (id === "foto") {
        const fotoEl = document.getElementById("fotoPerfil") as HTMLImageElement;
        if (fotoEl) fotoEl.src = result;
      }
    };
    reader.readAsDataURL(file);
  }

  return <input className="file" type="file" accept={accept} onChange={handleChange} />;
}