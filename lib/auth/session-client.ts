"use client";

export async function syncServerSession(idToken: string) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("No fue posible crear la sesión del servidor.");
  }
}

export async function clearServerSession() {
  const response = await fetch("/api/auth/session", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No fue posible cerrar la sesión del servidor.");
  }
}
