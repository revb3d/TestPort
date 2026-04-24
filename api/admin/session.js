import { getAdminSession, isAdminEnabled, sendJson } from "../_lib/auth.js";
import { isBlobConfigured } from "../_lib/blob-store.js";

export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  const session = getAdminSession(request);

  return sendJson(response, 200, {
    enabled: session.enabled,
    authenticated: session.authenticated,
    passwordSource: isAdminEnabled() ? "server" : "none",
    storageConfigured: isBlobConfigured(),
  });
}
