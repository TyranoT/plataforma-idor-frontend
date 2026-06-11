import type {
  AuditList,
  AuditListItem,
  AuditResult,
  DashboardSummary,
  Finding,
  TokenResponse,
} from "./types";

function findings(auditId: number): Finding[] {
  return [
    {
      id: auditId * 10 + 1,
      vuln_type: "IDOR",
      owasp_id: "API1:2023",
      cwe_id: "CWE-639",
      severity: "critica",
      line_start: 9,
      line_end: 9,
      code_excerpt: "    fatura = db.faturas.get(fatura_id)",
      explanation:
        "O endpoint busca a fatura diretamente pelo `fatura_id` recebido na URL e a retorna sem nunca comparar `fatura.user_id` com o usuário autenticado. Qualquer usuário logado pode ler faturas de terceiros apenas trocando o id (Broken Object Level Authorization).",
      suggested_fix:
        "Após buscar a fatura, verifique a posse antes de retornar:\n\n    fatura = db.faturas.get(fatura_id)\n    if fatura is None or fatura.user_id != user.id:\n        raise HTTPException(status_code=404)\n    return fatura",
      source_method: "ambos",
      confidence: 0.94,
      sources: [
        {
          title: "OWASP API Security Top 10 (2023) — API1: Broken Object Level Authorization",
          source_url:
            "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
          doc_type: "owasp",
        },
        {
          title: "CWE-639: Authorization Bypass Through User-Controlled Key",
          source_url: "https://cwe.mitre.org/data/definitions/639.html",
          doc_type: "cwe",
        },
      ],
    },
    {
      id: auditId * 10 + 2,
      vuln_type: "BOLA",
      owasp_id: "API1:2023",
      cwe_id: "CWE-639",
      severity: "alta",
      line_start: 14,
      line_end: 16,
      code_excerpt:
        '    db.faturas.delete(fatura_id)\n    return {"ok": True}',
      explanation:
        "O `delete` apaga a fatura pelo id sem verificar posse. Além de leitura indevida, há exclusão destrutiva de recursos de outros usuários.",
      suggested_fix:
        "Carregue o objeto, valide `fatura.user_id == user.id` e só então exclua; caso contrário responda 404.",
      source_method: "llm_rag",
      confidence: 0.88,
      sources: [
        {
          title: "OWASP API Security Top 10 (2023) — API1: Broken Object Level Authorization",
          source_url:
            "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
          doc_type: "owasp",
        },
      ],
    },
  ];
}

function buildAudit(id: number): AuditResult {
  return {
    audit_id: id,
    n_findings: 2,
    max_severity: "critica",
    findings: findings(id),
  };
}

const delay = <T>(value: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// JWT NÃO-assinado só para destravar a sessão em modo demo/mock. Tem exp
// real, então passa pela checagem otimista do proxy e do AuthGuard.
export function mockLogin(): Promise<TokenResponse> {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "demo",
      name: "Sessão de demonstração",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  );
  return delay({ access_token: `${header}.${payload}.demo` }, 300);
}

export function mockCreateAudit(): Promise<AuditResult> {
  return delay(buildAudit(101), 900);
}

export function mockGetAudit(id: number): Promise<AuditResult> {
  return delay(buildAudit(id), 400);
}

export function mockListAudits(
  limit: number,
  offset: number,
): Promise<AuditList> {
  const items: AuditListItem[] = [
    { id: 101, source: "web_paste", language: "python", n_findings: 2, max_severity: "critica", repo_full_name: null, created_at: "2026-06-10T14:02:00Z" },
    { id: 100, source: "github_action", language: "javascript", n_findings: 1, max_severity: "alta", repo_full_name: "unipe/api-faturas", created_at: "2026-06-09T18:20:00Z" },
    { id: 99, source: "github_action", language: "typescript", n_findings: 0, max_severity: null, repo_full_name: "unipe/checkout", created_at: "2026-06-09T11:05:00Z" },
    { id: 98, source: "web_paste", language: "java", n_findings: 1, max_severity: "media", repo_full_name: null, created_at: "2026-06-08T09:41:00Z" },
    { id: 97, source: "web_paste", language: "go", n_findings: 3, max_severity: "critica", repo_full_name: null, created_at: "2026-06-07T16:13:00Z" },
    { id: 96, source: "github_action", language: "php", n_findings: 2, max_severity: "alta", repo_full_name: "unipe/legacy-portal", created_at: "2026-06-06T20:55:00Z" },
  ];
  return delay({
    items: items.slice(offset, offset + limit),
    total: items.length,
  });
}

export function mockDashboardSummary(): Promise<DashboardSummary> {
  return delay({
    total_auditorias: 142,
    taxa_idor: 0.61,
    criticas: 37,
    tempo_medio_ms: 4200,
    por_linguagem: [
      { language: "python", n: 58 },
      { language: "javascript", n: 41 },
      { language: "typescript", n: 22 },
      { language: "java", n: 11 },
      { language: "go", n: 6 },
      { language: "php", n: 4 },
    ],
    por_modelo: [
      { model: "gpt-5-mini", n: 64 },
      { model: "gpt-5.5", n: 38 },
      { model: "claude-sonnet", n: 25 },
      { model: "gemini-pro", n: 15 },
    ],
    por_severidade: [
      { severity: "critica", n: 37 },
      { severity: "alta", n: 49 },
      { severity: "media", n: 31 },
      { severity: "baixa", n: 18 },
    ],
    por_tipo: [
      { vuln_type: "IDOR", n: 62 },
      { vuln_type: "BOLA", n: 44 },
      { vuln_type: "BFLA", n: 19 },
      { vuln_type: "Mass Assignment", n: 9 },
    ],
    evolucao: [
      { dia: "2026-06-04", n: 18, taxa_falha: 0.61 },
      { dia: "2026-06-05", n: 22, taxa_falha: 0.64 },
      { dia: "2026-06-06", n: 25, taxa_falha: 0.52 },
      { dia: "2026-06-07", n: 19, taxa_falha: 0.63 },
      { dia: "2026-06-08", n: 28, taxa_falha: 0.64 },
      { dia: "2026-06-09", n: 30, taxa_falha: 0.53 },
    ],
  });
}
