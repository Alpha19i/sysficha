"use client";
import { useFicha } from "../state/ficha-store";
import { atualizarCampo } from "../core/espelhamento";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
}

export default function FichaSelect({ id, children, ...props }: Props) {
  const { data, setField } = useFicha();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setField(id, value);
    atualizarCampo(id, value, "select"); // espelhamento
  }

  return (
    <select {...props} id={id} value={data[id] ?? ""} onChange={handleChange}>
      {children}
    </select>
  );
}