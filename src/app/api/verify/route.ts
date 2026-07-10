import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REQUIRED_USER = "mhmmmm000000";
const REQUIRED_REPO = "rocketgoal-name-tools";

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json(
        { ok: false, reason: "no_token", message: "No access token provided" },
        { status: 400 }
      );
    }

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
      return NextResponse.json({
        ok: true,
        message: "Verified! Generator unlocked.",
      });
    }

    let reason = "both";
    let message = "You need to follow AND star to unlock";
    if (!isFollowing && hasStarred) {
      reason = "follow";
      message = `You haven't followed @${REQUIRED_USER} yet`;
    } else if (isFollowing && !hasStarred) {
      reason = "star";
      message = `You haven't starred the repo yet`;
    }

    return NextResponse.json({
      ok: false,
      reason,
      message,
      debug: { isFollowing, hasStarred },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, reason: "error", message: "Verification failed: " + (e as Error).message },
      { status: 500 }
    );
  }
}
