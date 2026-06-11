import type { Language, Severity } from "./types";

// URL pública do motor no Railway. Só NEXT_PUBLIC_* chega ao browser.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

// Sem API configurada (ou flag ligada) -> cliente devolve mocks tipados.
// Assim o frontend funciona 100% antes do backend subir.
export const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS === "true" || API_URL === "";

// Estilo por severidade — ÚNICA fonte de cor de severidade no app.
// critica/alta vermelho, media âmbar, baixa cinza (regra do projeto).
export interface SeverityStyle {
  label: string;
  badge: string; // classes do badge (bg + text + border)
  dot: string; // cor sólida p/ gráficos / pontos
  rank: number; // ordenação de severidade
}

export const severityStyles: Record<Severity, SeverityStyle> = {
  critica: {
    label: "Crítica",
    badge: "bg-red-100 text-red-800 border-red-300",
    dot: "#b91c1c", // red-700
    rank: 4,
  },
  alta: {
    label: "Alta",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "#ef4444", // red-500
    rank: 3,
  },
  media: {
    label: "Média",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "#f59e0b", // amber-500
    rank: 2,
  },
  baixa: {
    label: "Baixa",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-300",
    dot: "#71717a", // zinc-500
    rank: 1,
  },
};

export function severityStyle(severity: Severity | null): SeverityStyle {
  return severity ? severityStyles[severity] : severityStyles.baixa;
}

// Linguagens suportadas (rótulo + id do Monaco).
export const LANGUAGES: { value: Language; label: string; monaco: string }[] = [
  { value: "python", label: "Python", monaco: "python" },
  { value: "javascript", label: "JavaScript", monaco: "javascript" },
  { value: "typescript", label: "TypeScript", monaco: "typescript" },
  { value: "java", label: "Java", monaco: "java" },
  { value: "go", label: "Go", monaco: "go" },
  { value: "php", label: "PHP", monaco: "php" },
  { value: "ruby", label: "Ruby", monaco: "ruby" },
  { value: "csharp", label: "C#", monaco: "csharp" },
];

export function monacoLanguage(language: Language): string {
  return LANGUAGES.find((l) => l.value === language)?.monaco ?? "plaintext";
}

export function languageLabel(language: Language): string {
  return LANGUAGES.find((l) => l.value === language)?.label ?? language;
}
