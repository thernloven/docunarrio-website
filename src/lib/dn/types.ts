// Wire types for the DocuNarrio API. Account/Chat/Store v1 are camelCase;
// Store v2 responses are snake_case.

export type Role = "Super" | "Support" | "TenantAdmin" | "TenantRagAdmin" | "TenantRagUser";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountBlockedTime: string | null;
  accountBlockedReason: string | null;
  tenant: { id: string; name: string; description?: string; orgNr?: string } | null;
  role: { name: Role };
};

export const roleName = (r?: string) =>
  r === "TenantAdmin" ? "Admin" : r === "TenantRagAdmin" ? "Analyst" : r === "Super" || r === "Support" ? "Support" : "Member";

export const isAdmin = (u?: User | null) => ["TenantAdmin", "Super", "Support"].includes(u?.role?.name ?? "");

export type StoreDocument = {
  id: string;
  storeId: string;
  fileId: string;
  fileName: string;
  fileDescription: string | null;
  fileVersion: string;
  fileSize: number;
  fileUploadedTime: string;
};

export type Store = {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  documents: StoreDocument[] | null;
};

export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export type ChatPage = {
  rank: number;
  /** Engine relevance, not a 0–1 fraction (≈12 is normal): show rank, never %. */
  score: number;
  docId: string;
  fileName: string;
  pageNum: number;
  pageImageBase64?: string;
};

export type ChatInteraction = {
  id: string;
  createdAt: string;
  userPrompt: string;
  assistantPrompt: string;
  totalTokens: number;
  totalTimeMs: number;
  pages: ChatPage[];
};

export type ChatSession = {
  id: string;
  storeId: string;
  title: string;
  createdAt: string;
  interactions: ChatInteraction[];
};

export type DocStatus = "queued" | "processing" | "ingesting" | "completed" | "error";

export type StoreStatus = {
  store_id: string;
  engine: string;
  model: string;
  pool_factor: number | null;
  documents: Record<
    string,
    {
      filename: string;
      original_filename: string;
      page_count: number;
      pages_done: number;
      vector_count: number;
      status: DocStatus;
      error: string | null;
      indexed_at: string | null;
    }
  >;
};
