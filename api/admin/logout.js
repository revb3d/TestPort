import { clearSessionCookie, getAdminSession, sendJson } from "../_lib/auth.js";
import { isBlobConfigured } from "../_lib/blob-store.js";

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  if (!getAdminSession(request).enabled) {
    return sendJson(response, 200, {
      enabled: false,
      authenticated: true,
      storageConfigured: isBlobConfigured(),
    });
  }

  response.setHeader("Set-Cookie", clearSessionCookie(request));

  return sendJson(response, 200, {
    enabled: true,
    authenticated: false,
    storageConfigured: isBlobConfigured(),
  });
}
