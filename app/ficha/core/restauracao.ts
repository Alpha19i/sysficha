import { fichaState } from "../state/fichaState";

export function restaurarValoresCampos(container: HTMLElement) {
  const campos = container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input, select, textarea"
  );

  campos.forEach((input) => {
    const saved = fichaState.values[input.id];
    if (!saved) return;

    if (input.type === "date") {
      input.value = saved.includes("/") ? saved.split("/").reverse().join("-") : saved;
    } else {
      input.value = saved.toUpperCase();
    }
  });
}
