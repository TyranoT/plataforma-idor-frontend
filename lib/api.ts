import { API_URL, USE_MOCKS } from "./config";
import { clearToken, getToken } from "./auth";
import type {
  AuditList,
  AuditResult,
  CreateAuditRequest,
  CredentialsRequest,
  DashboardSummary,
  TokenResponse,
} from "./types";
import {
  mockCreateAudit,
  mockDashboardSummary,
  mockGetAudit,
  mockListAudits,
  mockLogin,
} from "./mock";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  // Rotas públicas (/auth/*): 401 significa "credenciais inválidas",
  // não "sessão expirada" — não derruba a sessão nem redireciona.
  public?: boolean;
}

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const { public: isPublic, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("Content-Type", "application/json");
  if (!isPublic) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });

  if (res.status === 401 && !isPublic) {
    clearToken();
    if (typeof window !== "undefined" && location.pathname !== "/login") {
      const next = encodeURIComponent(location.pathname + location.search);
      location.href = `/login?next=${next}`;
    }
    throw new ApiError(401, "Sessão expirada. Faça login novamente.");
  }

  if (!res.ok) {
    let detail = `Erro ${res.status}`;
    try {
      const body = (await res.json()) as { detail?: string; message?: string };
      if (typeof body.detail === "string") detail = body.detail;
      else if (typeof body.message === "string") detail = body.message;
    } catch {
      /* corpo não-JSON */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  auth: {
    // POST /auth/login — valida email+senha e devolve um JWT.
    login(credentials: CredentialsRequest): Promise<TokenResponse> {
      if (USE_MOCKS) return mockLogin();
      return request<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        public: true,
      });
    },
    // POST /auth/register — cria usuário (email único) e devolve um JWT.
    register(credentials: CredentialsRequest): Promise<TokenResponse> {
      if (USE_MOCKS) return mockLogin();
      return request<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
        public: true,
      });
    },
  },
  audits: {
    // POST /audits — cria e roda uma auditoria, devolve o laudo.
    create(req: CreateAuditRequest): Promise<AuditResult> {
      if (USE_MOCKS) return mockCreateAudit();
      return request<AuditResult>("/audits", {
        method: "POST",
        body: JSON.stringify(req),
      });
    },
    // GET /audits/{id} — laudo completo.
    get(id: number | string): Promise<AuditResult> {
      if (USE_MOCKS) return mockGetAudit(Number(id));
      return request<AuditResult>(`/audits/${id}`);
    },
    // GET /audits?limit=&offset= — lista paginada (mais recentes primeiro).
    list(limit = 20, offset = 0): Promise<AuditList> {
      if (USE_MOCKS) return mockListAudits(limit, offset);
      return request<AuditList>(`/audits?limit=${limit}&offset=${offset}`);
    },
  },
  dashboard: {
    // GET /dashboard/summary — métricas agregadas.
    summary(): Promise<DashboardSummary> {
      if (USE_MOCKS) return mockDashboardSummary();
      return request<DashboardSummary>("/dashboard/summary");
    },
  },
};

// Fetcher para SWR: a chave é a função do cliente já tipada.
export const swrFetcher = <T>(fn: () => Promise<T>): Promise<T> => fn();
