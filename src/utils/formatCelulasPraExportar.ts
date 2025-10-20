import React from "react";

export const extractTextFromRender = (rendered: unknown): string => {
  if (typeof rendered === "string" || typeof rendered === "number") {
    return String(rendered);
  }
  if (React.isValidElement(rendered)) {
    if (
      rendered.props &&
      typeof rendered.props === "object" &&
      "label" in rendered.props
    ) {
      return String(rendered.props.label);
    }
  }
  if (rendered === null || rendered === undefined) return "—";
  return JSON.stringify(rendered);
};

// Garante formatação para valores simples, datas, etc.
export const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") {
    // Se for objeto, tenta extrair propriedades comuns
    if ("nome" in value) return String(value.nome);
    if ("label" in value) return String(value.label);
    return JSON.stringify(value);
  }
  if (value instanceof Date) return value.toLocaleDateString("pt-BR");
  return String(value);
};
