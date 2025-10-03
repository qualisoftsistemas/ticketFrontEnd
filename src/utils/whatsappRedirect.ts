function validateNumber(telefone: string): string {
  let numero = telefone.replace(/\D/g, "");

  if (!numero.startsWith("55")) {
    numero = "55" + numero;
  }

  return numero;
}

export const whatsappRedirect = (telefone: string): void => {
  const numeroValidado = validateNumber(telefone);

  const url = `https://wa.me/${numeroValidado}`;

  window.open(url, "_blank");
};
