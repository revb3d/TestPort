import crypto from "node:crypto";

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_SCOPE = "portfolio-admin";
const SESSION_TTL = 60 * 60 * 24 * 7;

function getCookieHeader(request) {
  return request.headers.cookie ?? "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || process.env.VITE_ADMIN_PASSWORD?.trim() || "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword();
}

function parseCookies(request) {
  return getCookieHeader(request)
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((cookies, chunk) => {
      const [name, ...rest] = chunk.split("=");
      cookies[name] = decodeURIComponent(rest.join("="));
      return cookies;
    }, {});
}

function createSignature() {
  return crypto.createHmac("sha256", getSessionSecret()).update(SESSION_SCOPE).digest("hex");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isSecureRequest(request) {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const host = request.headers.host ?? "";
  return forwardedProto === "https" || (!host.includes("localhost") && !host.startsWith("127.0.0.1"));
}

function serializeCookie(name, value, maxAge, request) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (isSecureRequest(request)) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function setNoStore(response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");
}

export function sendJson(response, statusCode, payload) {
  setNoStore(response);
  response.status(statusCode).json(payload);
}

export function isAdminEnabled() {
  return Boolean(getAdminPassword());
}

export function getAdminSession(request) {
  if (!isAdminEnabled()) {
    return { enabled: false, authenticated: true };
  }

  const cookies = parseCookies(request);
  const cookieValue = cookies[SESSION_COOKIE];

  if (!cookieValue) {
    return { enabled: true, authenticated: false };
  }

  return {
    enabled: true,
    authenticated: safeEqual(cookieValue, createSignature()),
  };
}

export function assertAdmin(request) {
  return getAdminSession(request).authenticated;
}

export function verifyAdminPassword(input) {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return true;
  }

  return safeEqual(String(input ?? ""), adminPassword);
}

export function createSessionCookie(request) {
  return serializeCookie(SESSION_COOKIE, createSignature(), SESSION_TTL, request);
}

export function clearSessionCookie(request) {
  return serializeCookie(SESSION_COOKIE, "", 0, request);
}
