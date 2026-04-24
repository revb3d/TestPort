import { list, put } from "@vercel/blob";

const CONFIG_PATHNAME = "portfolio/config.json";
const MAX_CONFIG_BYTES = 4_500_000;

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function loadPortfolioConfig() {
  if (!isBlobConfigured()) {
    return { configured: false, config: null };
  }

  const { blobs } = await list({
    prefix: CONFIG_PATHNAME,
    limit: 10,
  });

  const exactMatch = blobs.find((blob) => blob.pathname === CONFIG_PATHNAME);
  const latestBlob = exactMatch
    ?? [...blobs].sort((left, right) => new Date(right.uploadedAt) - new Date(left.uploadedAt))[0];

  if (!latestBlob) {
    return { configured: true, config: null };
  }

  const response = await fetch(latestBlob.url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to read saved portfolio (${response.status}).`);
  }

  return {
    configured: true,
    config: await response.json(),
  };
}

export async function savePortfolioConfig(config) {
  if (!isBlobConfigured()) {
    const error = new Error("BLOB_READ_WRITE_TOKEN is not configured.");
    error.code = "BLOB_NOT_CONFIGURED";
    throw error;
  }

  const json = JSON.stringify(config);

  if (Buffer.byteLength(json, "utf8") > MAX_CONFIG_BYTES) {
    const error = new Error("This portfolio is too large to save to the backend.");
    error.code = "CONFIG_TOO_LARGE";
    throw error;
  }

  return put(CONFIG_PATHNAME, json, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}
