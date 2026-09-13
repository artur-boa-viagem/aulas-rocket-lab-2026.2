// ============================================================
// Aula: Introdução a TypeScript + React
// ------------------------------------------------------------
// Por que TypeScript?
// - O JS puro deixa passar erros bobos (ex: somar texto com número).
// - A interface diz EXATAMENTE qual formato um objeto deve ter.
// - Se fugir do formato, o VSCode + `tsc` avisam ANTES de rodar.
// ============================================================

export interface Game {
  id: string;
  title: string;
  coverUrl: string;
  synopsis: string;
}

export interface Review {
  id: string;
  gameId: string;
  userName: string;
  text: string;
  rating: number; // 1 a 5
  timesFinished: number; // "Zerei {x} vezes"
}
