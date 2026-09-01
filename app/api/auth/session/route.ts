import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/config";
import {
  getFirebaseAdminAuth,
  getFirebaseAdminDiagnostics,
  hasFirebaseAdminConfig,
} from "@/lib/firebase/admin";

const RECENT_SIGN_IN_WINDOW_MS = 1000 * 60 * 5;

type CreateSessionPayload = {
  idToken?: string;
};

export async function GET() {
  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      {
        error: "Firebase Admin configuration is missing",
        status: 500,
        diagnostics:
          process.env.NODE_ENV === "production" ? undefined : getFirebaseAdminDiagnostics(),
      },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 });
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);

    return NextResponse.json({
      status: 200,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email ?? null,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unauthorized", status: 401, details: errorMessage }, { status: 401 });
  }
}

export async function POST(request: Request) {
  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      {
        error: "Firebase Admin configuration is missing",
        status: 500,
        diagnostics:
          process.env.NODE_ENV === "production" ? undefined : getFirebaseAdminDiagnostics(),
      },
      { status: 500 },
    );
  }

  let payload: CreateSessionPayload;

  try {
    payload = (await request.json()) as CreateSessionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload", status: 400 }, { status: 400 });
  }

  const idToken = payload.idToken?.trim();

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken", status: 400 }, { status: 400 });
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken, true);

    if (
      typeof decodedToken.auth_time === "number" &&
      Date.now() - decodedToken.auth_time * 1000 > RECENT_SIGN_IN_WINDOW_MS
    ) {
      return NextResponse.json({ error: "Recent sign-in required", status: 401 }, { status: 401 });
    }

    const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Session API] POST failed:", errorMessage);
    return NextResponse.json({ error: "Unauthorized", status: 401, details: errorMessage }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
