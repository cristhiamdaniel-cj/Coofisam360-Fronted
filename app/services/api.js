const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
const DEFAULT_TIMEOUT = 20000;

function withQuery(url, params) {
  if (!params) return url;
  const u = new URL(
    url,
    typeof window !== "undefined" ? window.location.origin : "http://localhost"
  );
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
  });
  return u.toString();
}

async function request(method, path, { params, body, headers } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const base = BASE_URL || (typeof window !== "undefined" ? "" : "");
  const url = withQuery(base + path, params);
  const h = { "Content-Type": "application/json", ...(headers || {}) };
  try {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("authToken");
      if (token) {
        h.Authorization = `Token ${token}`;
      }
    }
  } catch (_) {}
  // Detectar FormData para multipart: no establecer Content-Type manualmente
  const isFormData = (typeof FormData !== 'undefined') && body instanceof FormData;
  if (isFormData) {
    try { delete h["Content-Type"]; } catch(_) {}
  }

  const res = await fetch(url, {
    method,
    headers: h,
    signal: controller.signal,
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : isFormData
        ? body
        : body != null
        ? JSON.stringify(body)
        : undefined,
  });
  clearTimeout(timer);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  let data;
  if (isJson) {
    try {
      data = await res.json();
    } catch (_) {
      data = undefined;
    }
  } else if (contentType.includes("text")) {
    data = await res.text();
  }
  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) || res.statusText || "API error";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { status: res.status, data };
}

const api = {
  get: (path, { params } = {}) => request("GET", path, { params }),
  post: (path, body, options = {}) => request("POST", path, { body, ...(options || {}) }),
  put: (path, body, options = {}) => request("PUT", path, { body, ...(options || {}) }),
  delete: (path, options) => {
    if (options && (options.params || options.body || options.headers)) {
      return request("DELETE", path, options);
    }
    if (options && typeof options === "object") {
      return request("DELETE", path, { params: options });
    }
    return request("DELETE", path);
  },
};

export default api;
