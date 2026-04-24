import { assertAdmin, sendJson } from "./_lib/auth.js";
import { loadPortfolioConfig, savePortfolioConfig } from "./_lib/blob-store.js";

function readConfig(request) {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body)?.config ?? null;
    } catch {
      return null;
    }
  }

  if (request.body && typeof request.body === "object") {
    return request.body.config ?? null;
  }

  return null;
}

export default async function handler(request, response) {
  if (request.method === "GET") {
    try {
      const result = await loadPortfolioConfig();

      if (!result.config) {
        return sendJson(response, result.configured ? 404 : 200, {
          config: null,
          storage: result.configured ? "remote" : "unconfigured",
        });
      }

      return sendJson(response, 200, {
        config: result.config,
        storage: "remote",
      });
    } catch (error) {
      return sendJson(response, 500, {
        error: error.message || "Unable to load portfolio.",
      });
    }
  }

  if (request.method === "PUT") {
    if (!assertAdmin(request)) {
      return sendJson(response, 401, {
        error: "Admin authentication required.",
      });
    }

    const config = readConfig(request);

    if (!config || typeof config !== "object" || Array.isArray(config)) {
      return sendJson(response, 400, {
        error: "A valid portfolio config is required.",
      });
    }

    try {
      const blob = await savePortfolioConfig(config);
      return sendJson(response, 200, {
        ok: true,
        storage: "remote",
        url: blob.url,
      });
    } catch (error) {
      const statusCode = error.code === "BLOB_NOT_CONFIGURED"
        ? 503
        : error.code === "CONFIG_TOO_LARGE"
          ? 413
          : 500;

      return sendJson(response, statusCode, {
        error: error.message || "Unable to save portfolio.",
      });
    }
  }

  response.setHeader("Allow", "GET, PUT");
  return sendJson(response, 405, { error: "Method not allowed." });
}
