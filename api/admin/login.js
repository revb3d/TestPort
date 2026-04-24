import {
  createSessionCookie,
  getAdminSession,
  sendJson,
  verifyAdminPassword,
} from "../_lib/auth.js";
import { isBlobConfigured } from "../_lib/blob-store.js";

function readPassword(request) {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body)?.password ?? "";
    } catch {
      return "";
    }
  }

  if (request.body && typeof request.body === "object") {
    return request.body.password ?? "";
  }

  return "";
}

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

  const password = readPassword(request);

  if (!verifyAdminPassword(password)) {
    return sendJson(response, 401, {
      enabled: true,
      authenticated: false,
      error: "Incorrect password.",
      storageConfigured: isBlobConfigured(),
    });
  }

  response.setHeader("Set-Cookie", createSessionCookie(request));

  return sendJson(response, 200, {
    enabled: true,
    authenticated: true,
    storageConfigured: isBlobConfigured(),
  });
}
