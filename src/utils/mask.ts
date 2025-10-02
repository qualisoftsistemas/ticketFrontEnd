// utils/mask.ts
export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, "") // só dígitos
    .slice(0, 11) // máx 11 números
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskCNPJ = (value: string): string => {
  return value
    .replace(/\D/g, "") // só dígitos
    .slice(0, 14) // máx 14 números
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};
