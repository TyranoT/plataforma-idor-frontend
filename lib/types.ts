// Tipos compartilhados — espelho EXATO do contrato da API (api/CONTRACT.md +
// /openapi.json de produção). Esta é a ÚNICA fonte de verdade dos tipos do
// frontend. Nomes de campo seguem o backend (vuln_type, owasp_id, max_severity,
// line_start...). Qualquer alinhamento futuro com o backend acontece SÓ aqui.

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

// Citação de um achado para a base de conhecimento (RAG).
export interface FindingSource {
  title: string;
  source_url: string | null;
  doc_type: string; // 'owasp' | 'cwe' | ...
}

export interface Finding {
  id: number;
  vuln_type: string; // 'IDOR' | 'BOLA' | 'BFLA' | ...
  owasp_id: string | null; // 'API1:2023'
  cwe_id: string | null; // 'CWE-639'
  severity: Severity;
  line_start: number | null;
  line_end: number | null;
  code_excerpt: string;
  explanation: string;
  suggested_fix: string | null;
  source_method: SourceMethod;
  confidence: number; // 0.0 a 1.0
  sources: FindingSource[];
}

// GET /audits/{id} e POST /audits — o laudo completo.
export interface AuditResult {
  audit_id: number;
  n_findings: number;
  max_severity: Severity | null;
  findings: Finding[];
}

// GET /audits — linha da lista paginada (tabela do dashboard).
// `language` é string livre: auditorias via GitHub Action podem trazer
// linguagens fora do select da tela web.
export interface AuditListItem {
  id: number;
  source: AuditSource;
  language: string;
  n_findings: number;
  max_severity: Severity | null;
  repo_full_name: string | null;
  created_at: string;
}

// Envelope de GET /audits?limit=&offset=.
export interface AuditList {
  total: number;
  items: AuditListItem[];
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

// POST /auth/login e /auth/register.
export interface CredentialsRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
}

// GET /dashboard/summary.
export interface DashboardSummary {
  total_auditorias: number;
  taxa_idor: number; // 0.0 a 1.0
  criticas: number;
  tempo_medio_ms: number;
  por_linguagem: { language: string; n: number }[];
  por_modelo: { model: string; n: number }[];
  por_severidade: { severity: Severity; n: number }[];
  por_tipo: { vuln_type: string; n: number }[];
  // taxa_falha = fração (0.0–1.0) das auditorias do dia com >=1 finding.
  evolucao: { dia: string; n: number; taxa_falha: number }[];
}
