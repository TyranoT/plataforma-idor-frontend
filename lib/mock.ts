import type {
  AuditListItem,
  AuditResult,
  CreateAuditRequest,
  DashboardSummary,
  Finding,
  Paginated,
} from "./types";

const VULN_PY = `from fastapi import APIRouter, Depends
from .auth import current_user

router = APIRouter()

@router.get("/faturas/{fatura_id}")
def get_fatura(fatura_id: int, user = Depends(current_user)):
    # busca a fatura direto pelo id da URL...
    fatura = db.faturas.get(fatura_id)
    # ...e devolve sem checar se ela pertence ao usuário logado
    return fatura

@router.delete("/faturas/{fatura_id}")
def delete_fatura(fatura_id: int, user = Depends(current_user)):
    db.faturas.delete(fatura_id)
    return {"ok": True}
`;

function findings(auditId: number): Finding[] {
  return [
    {
      id: auditId * 10 + 1,
      audit_id: auditId,
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
      created_at: new Date().toISOString(),
      sources: [
        {
          chunk_id: 3,
          title: "OWASP API Security Top 10 (2023) — API1: Broken Object Level Authorization",
          source_url:
            "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
          doc_type: "owasp",
          excerpt:
            "APIs tendem a expor endpoints que recebem o id de um objeto. Sem uma checagem de autorização em nível de objeto, um atacante pode acessar recursos de outros usuários trocando o identificador.",
        },
        {
          chunk_id: 7,
          title: "CWE-639: Authorization Bypass Through User-Controlled Key",
          source_url: "https://cwe.mitre.org/data/definitions/639.html",
          doc_type: "cwe",
          excerpt:
            "O sistema usa uma chave controlada pelo usuário para acessar um registro, mas não verifica se o usuário tem permissão sobre aquele registro específico.",
        },
      ],
    },
    {
      id: auditId * 10 + 2,
      audit_id: auditId,
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
      created_at: new Date().toISOString(),
      sources: [
        {
          chunk_id: 3,
          title: "OWASP API Security Top 10 (2023) — API1: Broken Object Level Authorization",
          source_url:
            "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
          doc_type: "owasp",
          excerpt:
            "A autorização em nível de objeto deve ser validada em TODA função que acessa uma fonte de dados usando um id vindo do cliente — inclusive operações de escrita e exclusão.",
        },
      ],
    },
  ];
}

function buildAudit(id: number): AuditResult {
  return {
    id,
    source: "web_paste",
    language: "python",
    code_input: VULN_PY,
    model_used: "gpt-5-mini",
    repo_full_name: null,
    commit_sha: null,
    pr_number: null,
    n_findings: 2,
    max_severity: "critica",
    status: "concluida",
    created_at: new Date().toISOString(),
    findings: findings(id),
  };
}

const delay = <T>(value: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export function mockCreateAudit(req: CreateAuditRequest): Promise<AuditResult> {
  const audit = buildAudit(101);
  return delay({ ...audit, language: req.language, code_input: req.code, source: req.source }, 900);
}

export function mockGetAudit(id: number): Promise<AuditResult> {
  return delay(buildAudit(id), 400);
}

export function mockListAudits(
  page: number,
  pageSize: number,
): Promise<Paginated<AuditListItem>> {
  const items: AuditListItem[] = [
    { id: 101, source: "web_paste", language: "python", n_findings: 2, max_severity: "critica", status: "concluida", repo_full_name: null, created_at: "2026-06-10T14:02:00Z" },
    { id: 100, source: "github_action", language: "javascript", n_findings: 1, max_severity: "alta", status: "concluida", repo_full_name: "unipe/api-faturas", created_at: "2026-06-09T18:20:00Z" },
    { id: 99, source: "github_action", language: "typescript", n_findings: 0, max_severity: null, status: "concluida", repo_full_name: "unipe/checkout", created_at: "2026-06-09T11:05:00Z" },
    { id: 98, source: "web_paste", language: "java", n_findings: 1, max_severity: "media", status: "concluida", repo_full_name: null, created_at: "2026-06-08T09:41:00Z" },
    { id: 97, source: "web_paste", language: "go", n_findings: 3, max_severity: "critica", status: "concluida", repo_full_name: null, created_at: "2026-06-07T16:13:00Z" },
    { id: 96, source: "github_action", language: "php", n_findings: 2, max_severity: "alta", status: "concluida", repo_full_name: "unipe/legacy-portal", created_at: "2026-06-06T20:55:00Z" },
  ];
  const start = (page - 1) * pageSize;
  return delay({
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    page_size: pageSize,
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
      { date: "2026-06-04", total: 18, falhas: 11 },
      { date: "2026-06-05", total: 22, falhas: 14 },
      { date: "2026-06-06", total: 25, falhas: 13 },
      { date: "2026-06-07", total: 19, falhas: 12 },
      { date: "2026-06-08", total: 28, falhas: 18 },
      { date: "2026-06-09", total: 30, falhas: 16 },
    ],
  });
}
