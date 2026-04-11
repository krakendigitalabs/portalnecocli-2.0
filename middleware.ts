import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDashboardRewritePath,
  getPortalApp,
  PORTAL_APP_HEADER,
  resolvePortalAppFromHost,
} from "@/lib/routing/subdomains";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const host = request.headers.get("host");
  const app = getPortalApp(request.nextUrl.pathname, host);

  requestHeaders.set(PORTAL_APP_HEADER, app);

  const subdomainApp = host ? resolvePortalAppFromHost(host) : "public";
  const rewritePath = getDashboardRewritePath(request.nextUrl.pathname, subdomainApp);

  if (rewritePath) {
    const rewriteUrl = request.nextUrl.clone();

    rewriteUrl.pathname = rewritePath;

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
