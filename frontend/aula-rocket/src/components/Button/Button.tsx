// ============================================================
// Aula: o que é um COMPONENTE?
// ------------------------------------------------------------
// A grosso modo: uma FUNÇÃO que recebe PROPS e retorna JSX/TSX.
// As props são os parâmetros dessa função.
// A interface abaixo é o "contrato" TypeScript desse botão.
// ============================================================

import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ children, variant = "primary", ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}
