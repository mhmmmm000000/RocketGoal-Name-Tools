import { NextResponse } from "next/server";

// Read from multiple possible env var names so users don't have to rename
const OAUTH_CLIENT_ID =
  process.env.OAUTH_CLIENT_ID ||
  process.env.CLIENT_ID ||
  process.env.GITHUB_CLIENT_ID ||
  process.env.GH_CLIENT_ID ||
  "";
const OAUTH_CLIENT_SECRET =
  process.env.OAUTH_CLIENT_SECRET ||
  process.env.CLIENT_SECRET ||
  process.env.GITHUB_CLIENT_SECRET ||
  process.env.GH_CLIENT_SECRET ||
  "";
const OAUTH_REDIRECT_URI =
  process.env.OAUTH_REDIRECT_URI ||
  process.env.REDIRECT_URI ||
  process.env.GITHUB_REDIRECT_URI ||
  process.env.GH_REDIRECT_URI ||
  "";
const REQUIRED_USER = "mhmmmm000000";
const REQUIRED_REPO = "rocketgoal-name-tools";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?auth=error", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?auth=no_code", request.url));
  }

  // Debug: if secrets aren't set, redirect with helpful error
  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET) {
    console.error("Missing OAuth env vars", {
      hasClientId: !!OAUTH_CLIENT_ID,
      hasClientSecret: !!OAUTH_CLIENT_SECRET,
      hasRedirectUri: !!OAUTH_REDIRECT_URI,
    });
    return NextResponse.redirect(new URL("/?auth=not_configured", request.url));
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: OAUTH_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(new URL("/?auth=token_error", request.url));
    }

    const accessToken = tokenData.access_token;

    // Check follow status
    const followRes = await fetch(`https://api.github.com/user/following/${REQUIRED_USER}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const isFollowing = followRes.status === 204;

    // Check star status
    const starRes = await fetch(`https://api.github.com/user/starred/${REQUIRED_USER}/${REQUIRED_REPO}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const hasStarred = starRes.status === 204;

    if (isFollowing && hasStarred) {
      const unlockUrl = new URL("/?auth=success", request.url);
      unlockUrl.hash = `token=${accessToken}`;
      return NextResponse.redirect(unlockUrl);
    } else {
      const reason = !isFollowing && !hasStarred
        ? "follow_and_star"
        : !isFollowing ? "follow" : "star";
      return NextResponse.redirect(new URL(`/?auth=incomplete&reason=${reason}`, request.url));
    }
  } catch (e) {
    console.error("OAuth callback error:", e);
    return NextResponse.redirect(new URL("/?auth=error", request.url));
  }
}
