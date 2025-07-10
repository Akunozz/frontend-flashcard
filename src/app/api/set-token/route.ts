import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, { httpOnly: false, path: "/", maxAge: 60 * 60 * 24 * 1 }); // 1 dia
  return response;
}
