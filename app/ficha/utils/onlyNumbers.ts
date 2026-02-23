export function onlyNumbers(e: React.KeyboardEvent<HTMLInputElement>) {
  const char = e.key;
  if (!/[0-9]/.test(char)) e.preventDefault();
}