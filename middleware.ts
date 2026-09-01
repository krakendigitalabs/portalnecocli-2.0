import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDashboardRewritePath,
  getPortalApp,
  PORTAL_APP_HEADER,
  resolvePortalAppFromHost,
} from "@/lib/routing/subdomains";

// Preparación para Fase 5: Validación de tokens de sesión Firebase en el Edge
async function verifyFirebaseToken(token: string) {
  try {
    const JWKS = createRemoteJWKSet(
      new URL(
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
      ),
    );
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return payload;
  } catch (error) {
    return null;
  }
}

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
