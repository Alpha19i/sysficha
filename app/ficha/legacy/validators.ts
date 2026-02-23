export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }

  let resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10), 10)) return false;

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.substring(10, 11), 10);
}

export function validarPIS(pis: string): boolean {
  const multiplicadorBase = "3298765432";
  const numeroPIS = pis.replace(/\D/g, '');

  const pisInvalidos = [
    "00000000000", "11111111111", "22222222222", "33333333333",
    "44444444444", "55555555555", "66666666666", "77777777777",
    "88888888888", "99999999999"
  ];

  if (numeroPIS.length !== 11 || pisInvalidos.includes(numeroPIS)) {
    return false;
  }

  let total = 0;

  for (let i = 0; i < 10; i++) {
    const multiplicando = parseInt(numeroPIS.substring(i, i + 1), 10);
    const multiplicador = parseInt(multiplicadorBase.substring(i, i + 1), 10);
    total += multiplicando * multiplicador;
  }

  let resto = 11 - (total % 11);
  resto = (resto === 10 || resto === 11) ? 0 : resto;

  const digito = parseInt(numeroPIS.charAt(10), 10);

  return resto === digito;
}