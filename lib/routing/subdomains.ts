export type PortalApp = "public" | "admin" | "business";

export const PORTAL_APP_HEADER = "x-portal-app";

const DASHBOARD_BASE_PATHS = {
  admin: "/admin",
  business: "/merchant",
} as const;

const SUBDOMAIN_LABELS = {
  admin: "admin",
  business: "negocio",
} as const;

const PUBLIC_PATH_PREFIXES = ["/ingresar", "/unauthorized", "/forbidden"];

function normalizeHostname(hostname: string) {
  return hostname.trim().toLowerCase();
}

function removePort(hostname: string) {
  return hostname.replace(/:\d+$/, "");
}

function extractPort(hostname: string) {
  const match = hostname.match(/:(\d+)$/);

  return match ? match[1] : null;
}

export function resolvePortalAppFromHost(host: string): PortalApp {
  const normalizedHost = removePort(normalizeHostname(host));

  if (normalizedHost === "admin.localhost" || normalizedHost.startsWith("admin.")) {
    return "admin";
  }

  if (normalizedHost === "negocio.localhost" || normalizedHost.startsWith("negocio.")) {
    return "business";
  }

  return "public";
}

export function resolvePortalAppFromPath(pathname: string): PortalApp {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "admin";
  }

  if (pathname === "/merchant" || pathname.startsWith("/merchant/")) {
    return "business";
  }

  return "public";
}

export function isPublicPortalPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

export function getPortalApp(pathname: string, host?: string | null): PortalApp {
  if (isPublicPortalPath(pathname)) {
    return "public";
  }

  const appFromHost = host ? resolvePortalAppFromHost(host) : "public";

  if (appFromHost !== "public") {
    return appFromHost;
  }

  return resolvePortalAppFromPath(pathname);
}

export function getDashboardRewritePath(pathname: string, app: PortalApp) {
  if (app === "public" || isPublicPortalPath(pathname)) {
    return null;
  }

  const basePath =
    app === "admin"
      ? DASHBOARD_BASE_PATHS.admin
      : app === "business"
        ? DASHBOARD_BASE_PATHS.business
        : null;

  if (!basePath) {
    return null;
  }

  if (pathname === basePath || pathname.startsWith(`${basePath}/`)) {
    return null;
  }

  if (pathname === "/") {
    return basePath;
  }

  return `${basePath}${pathname}`;
}

type PortalUrlOptions = {
  host?: string | null;
  protocol?: string | null;
};

function removeKnownPrefix(hostname: string) {
  if (hostname === "localhost") {
    return "localhost";
  }

  const segments = hostname.split(".");

  if (segments[0] === "www" || segments[0] === "admin" || segments[0] === "negocio") {
    return segments.slice(1).join(".");
  }

  return hostname;
}

function resolveTargetHost(app: PortalApp, host?: string | null) {
  if (!host) {
    return null;
  }

  const normalizedHost = normalizeHostname(host);
  const port = extractPort(normalizedHost);
  const hostWithoutPort = removePort(normalizedHost);
  const baseHost = removeKnownPrefix(hostWithoutPort);
  const portSuffix = port ? `:${port}` : "";

  if (app === "public") {
    return `${baseHost}${portSuffix}`;
  }

  if (baseHost === "localhost") {
    return `${SUBDOMAIN_LABELS[app]}.localhost${portSuffix}`;
  }

  return `${SUBDOMAIN_LABELS[app]}.${baseHost}${portSuffix}`;
}

export function getDashboardHomePath(app: Exclude<PortalApp, "public">) {
  return DASHBOARD_BASE_PATHS[app];
}

export function buildPortalUrl(app: PortalApp, pathname: string, options: PortalUrlOptions = {}) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const targetHost = resolveTargetHost(app, options.host);

  if (!targetHost) {
    if (app === "public") {
      return normalizedPath;
    }

    if (normalizedPath === "/") {
      return getDashboardHomePath(app);
    }

    return `${getDashboardHomePath(app)}${normalizedPath}`;
  }

  const protocol = options.protocol ?? (targetHost.includes("localhost") ? "http" : "https");

  return `${protocol}://${targetHost}${normalizedPath}`;
}
