import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/config";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

type CreateSessionPayload = {
  idToken?: string;
};

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 });
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );

    return NextResponse.json({
      status: 200,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CreateSessionPayload;
  const idToken = payload.idToken?.trim();

  if (!idToken) {
    return NextResponse.json(
      { error: "Missing idToken", status: 400 },
      { status: 400 },
    );
  }

  try {
    await getFirebaseAdminAuth().verifyIdToken(idToken, true);
    const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(
      idToken,
      {
        expiresIn: SESSION_MAX_AGE_MS,
      },
    );

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
  } catch {
    return NextResponse.json(
      { error: "Unauthorized", status: 401 },
      { status: 401 },
    );
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
