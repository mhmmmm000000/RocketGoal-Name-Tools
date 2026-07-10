import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    env: {
      hasClientId: !!(
        process.env.OAUTH_CLIENT_ID ||
        process.env.CLIENT_ID ||
        process.env.GITHUB_CLIENT_ID ||
        process.env.GH_CLIENT_ID
      ),
      hasClientSecret: !!(
        process.env.OAUTH_CLIENT_SECRET ||
        process.env.CLIENT_SECRET ||
        process.env.GITHUB_CLIENT_SECRET ||
        process.env.GH_CLIENT_SECRET
      ),
      hasRedirectUri: !!(
        process.env.OAUTH_REDIRECT_URI ||
        process.env.REDIRECT_URI ||
        process.env.GITHUB_REDIRECT_URI ||
        process.env.GH_REDIRECT_URI
      ),
      // Show which names are set (without revealing values)
      clientIdVar: process.env.OAUTH_CLIENT_ID ? "OAUTH_CLIENT_ID"
        : process.env.CLIENT_ID ? "CLIENT_ID"
        : process.env.GITHUB_CLIENT_ID ? "GITHUB_CLIENT_ID"
        : process.env.GH_CLIENT_ID ? "GH_CLIENT_ID"
        : null,
      redirectUriValue: process.env.OAUTH_REDIRECT_URI ||
        process.env.REDIRECT_URI ||
        process.env.GITHUB_REDIRECT_URI ||
        process.env.GH_REDIRECT_URI ||
        null,
    },
  });
}
