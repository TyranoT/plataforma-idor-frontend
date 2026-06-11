import { API_URL, USE_MOCKS } from "./config";
import { clearToken, getToken } from "./auth";
import type {
  AuditListItem,
  AuditResult,
  CreateAuditRequest,
  DashboardSummary,
  Paginated,
} from "./types";
import {
  mockCreateAudit,
  mockDashboardSummary,
  mockGetAudit,
  mockListAudits,
} from "./mock";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401) {
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
      detail = body.detail ?? body.message ?? detail;
    } catch {
      /* corpo não-JSON */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  audits: {
    // POST /audits — cria e roda uma auditoria, devolve o laudo.
    create(req: CreateAuditRequest): Promise<AuditResult> {
      if (USE_MOCKS) return mockCreateAudit(req);
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
    // GET /audits — lista paginada para o dashboard.
    list(page = 1, pageSize = 20): Promise<Paginated<AuditListItem>> {
      if (USE_MOCKS) return mockListAudits(page, pageSize);
      return request<Paginated<AuditListItem>>(
        `/audits?page=${page}&page_size=${pageSize}`,
      );
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
