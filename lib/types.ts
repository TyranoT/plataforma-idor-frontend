// Tipos compartilhados — espelho EXATO do schema SQL / endpoints do blueprint.
// Esta é a ÚNICA fonte de verdade dos tipos do frontend. Nomes de campo seguem
// as colunas do Postgres (vuln_type, owasp_id, max_severity, line_start...).
// Qualquer alinhamento futuro com o backend (Deyvid) acontece SÓ aqui.

export type Severity = "baixa" | "media" | "alta" | "critica";

export type Language =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "go"
  | "php"
  | "ruby"
  | "csharp";

export type AuditSource = "web_paste" | "github_action";

export type SourceMethod = "sast" | "llm_rag" | "ambos";

export type AuditStatus = "pendente" | "concluida" | "erro";

export type DocType = "owasp" | "cwe" | "guideline" | "paper";

// finding_sources -> kb_chunks -> kb_documents. É a citação que aparece no laudo.
export interface FindingSource {
  chunk_id: number;
  title: string;
  source_url: string | null;
  doc_type: DocType;
  excerpt: string;
}

// Tabela `findings` (+ sources resolvidos a partir de finding_sources).
export interface Finding {
  id: number;
  audit_id: number;
  vuln_type: string; // 'IDOR' | 'BOLA' | 'BFLA' | ...
  owasp_id: string | null; // 'API1:2023'
  cwe_id: string | null; // 'CWE-639'
  severity: Severity;
  line_start: number | null;
  line_end: number | null;
  code_excerpt: string | null;
  explanation: string;
  suggested_fix: string | null;
  source_method: SourceMethod;
  confidence: number | null; // 0.0 a 1.0
  sources: FindingSource[];
  created_at: string;
}

// GET /audits/{id} e POST /audits — o laudo completo.
export interface AuditResult {
  id: number;
  source: AuditSource;
  language: Language;
  code_input: string;
  model_used: string;
  repo_full_name: string | null;
  commit_sha: string | null;
  pr_number: number | null;
  n_findings: number;
  max_severity: Severity | null;
  status: AuditStatus;
  created_at: string;
  findings: Finding[];
}

// GET /audits — linha da lista paginada (tabela do dashboard).
export interface AuditListItem {
  id: number;
  source: AuditSource;
  language: Language;
  n_findings: number;
  max_severity: Severity | null;
  status: AuditStatus;
  repo_full_name: string | null;
  created_at: string;
}

// Corpo do POST /audits.
export interface CreateAuditRequest {
  language: Language;
  code: string;
  source: AuditSource;
  repo_full_name?: string | null;
  commit_sha?: string | null;
  pr_number?: number | null;
}

// GET /dashboard/summary — campos derivados dos exemplos SQL do blueprint.
// A confirmar com o backend; isolado aqui de propósito.
export interface DashboardSummary {
  total_auditorias: number;
  taxa_idor: number; // 0.0 a 1.0
  criticas: number;
  tempo_medio_ms: number | null;
  por_linguagem: { language: Language; n: number }[];
  por_modelo: { model: string; n: number }[];
  por_severidade: { severity: Severity; n: number }[];
  por_tipo: { vuln_type: string; n: number }[];
  evolucao: { date: string; total: number; falhas: number }[];
}

// Resposta paginada genérica para GET /audits.
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
