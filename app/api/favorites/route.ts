import { NextRequest, NextResponse } from "next/server";
import { addFavorite, getCustomerFavorites, removeFavorite } from "@/data/favoriteService";
import { getServerAuthSession } from "@/lib/auth/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const favorites = await getCustomerFavorites(session.user.uid);
    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.error("Error GET favorites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { businessId } = await request.json();
    if (!businessId) {
      return NextResponse.json({ error: "Falta businessId" }, { status: 400 });
    }

    const favorite = await addFavorite(session.user.uid, businessId);
    return NextResponse.json({ favorite });
  } catch (error: any) {
    console.error("Error POST favorites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json({ error: "Falta businessId" }, { status: 400 });
    }

    await removeFavorite(session.user.uid, businessId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error DELETE favorites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
