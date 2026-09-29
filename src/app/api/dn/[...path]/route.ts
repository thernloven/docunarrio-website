import { authed } from "@/lib/dn/server";

// Only the endpoints the web app uses pass through.
const ALLOWED = new Set([
  "sys/account/getaccount",
  "chat/query",
  "store/list",
  "store/get",
  "store/update",
  "store/delete",
  "store/v2/uploadfile",
  "store/v2/store_status",
  "store/v2/delete_doc",
]);

// A chat answer can take a minute to generate.
export const maxDuration = 120;

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (!ALLOWED.has(path)) {
    return Response.json({ title: "NotFound", status: 404, detail: "Unknown endpoint." }, { status: 404 });
  }

  // Uploads are multipart: pass the raw body and its boundary through untouched.
  const contentType = request.headers.get("content-type") ?? "application/json";
  const body = contentType.startsWith("multipart/") ? await request.arrayBuffer() : await request.text();

  const res = await authed(path, { body, contentType });
  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
  });
}
