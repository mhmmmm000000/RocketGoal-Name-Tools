import { NextResponse } from "next/server";

// Read from multiple possible env var names so users don't have to rename
const OAUTH_CLIENT_ID =
  process.env.OAUTH_CLIENT_ID ||
  process.env.CLIENT_ID ||
  process.env.GITHUB_CLIENT_ID ||
  process.env.GH_CLIENT_ID ||
  "";
const OAUTH_REDIRECT_URI =
  process.env.OAUTH_REDIRECT_URI ||
  process.env.REDIRECT_URI ||
  process.env.GITHUB_REDIRECT_URI ||
  process.env.GH_REDIRECT_URI ||
  "";

export async function GET() {
  if (!OAUTH_CLIENT_ID) {
    return NextResponse.json(
      {
        error: "OAuth not configured.",
        hint: "Add an env var in Netlify with your GitHub OAuth Client ID. Accepted names: OAUTH_CLIENT_ID, CLIENT_ID, GITHUB_CLIENT_ID, or GH_CLIENT_ID",
        debug: {
          hasClientId: false,
          hasRedirectUri: !!OAUTH_REDIRECT_URI,
        },
      },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: "read:user public_repo",
    state: Math.random().toString(36).substring(7),
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
