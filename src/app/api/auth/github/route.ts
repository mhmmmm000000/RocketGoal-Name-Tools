import { NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || "";

export async function GET() {
  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      { error: "GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:user public_repo",
    state: Math.random().toString(36).substring(7),
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
