import { NextRequest, NextResponse } from "next/server";

interface GenerateBody {
  name: string;
  style: string;
  curve: boolean;
  curveDirection?: "smile" | "frown";
  size?: "small" | "medium" | "big";
  includeSubTo: boolean;
  subToColor?: string;
  includeUrl: boolean;
  urlColor?: string;
  youtubeHandle?: string;
  accessToken?: string;
}

const REQUIRED_USER = "mhmmmm000000";
const REQUIRED_REPO = "RocketGoal-Name-Tools";

const SHAME_PAYLOAD = "<size=80><b><color=#FF0000>I</color><color=#FF0000>M</color><color=#FF0000> </color><color=#FF0000>A</color><color=#FF0000> </color><color=#FF0000>L</color><color=#FF0000>O</color><color=#FF0000>S</color><color=#FF0000>E</color><color=#FF0000>R</color><color=#FF0000> </color><color=#FF0000>U</color><color=#FF0000>N</color><color=#FF0000>F</color><color=#FF0000>O</color><color=#FF0000>L</color><color=#FF0000>L</color><color=#FF0000>O</color><color=#FF0000>W</color><color=#FF0000>E</color><color=#FF0000>D</color></b></size>";

const STYLE_COLORS: Record<string, string[]> = {
  ocean:    ["#4A90E2", "#00B8D4", "#4CAF50", "#81D4FA"],
  sunset:   ["#FF6B6B", "#FFA500", "#FFD93D", "#FF6B9D"],
  cyber:    ["#00FFFF", "#FF00FF", "#00FF00", "#FFFF00"],
  ice:      ["#A8E6FF", "#7CFFCB", "#B5DEFF", "#E0F7FF"],
  royal:    ["#9D00FF", "#C77DFF", "#5E17EB", "#A517F2"],
  inferno:  ["#FF0040", "#FF4500", "#FFA500", "#FFD700"],
  matrix:   ["#00FF41", "#008F11", "#00FF41", "#39FF14"],
  candy:    ["#FFB3D9", "#C9B3FF", "#B3FFEC", "#FFE5B3"],
  void:     ["#7B2CBF", "#3C096C", "#5A189A", "#9D4EDD"],
  gold:     ["#FFD700", "#FFA500", "#FF8C00", "#DAA520"],
  mint:     ["#00FFA3", "#00D9B0", "#5EEAD4", "#14F2C9"],
  rose:     ["#FF0080", "#FF4DA6", "#FF80BF", "#FFB3D9"],
  electric: ["#0080FF", "#00D4FF", "#80FF00", "#FFFF00"],
  plasma:   ["#FF00FF", "#8000FF", "#FF0080", "#FF8000"],
  toxic:    ["#ADFF2F", "#7FFF00", "#00FF00", "#32CD32"],
  blood:    ["#8B0000", "#DC143C", "#FF0000", "#FF6347"],
  sky:      ["#87CEEB", "#ADD8E6", "#B0E0E6", "#E0FFFF"],
  bronze:   ["#CD7F32", "#B87333", "#A0522D", "#8B4513"],
  arctic:   ["#E0FFFF", "#B0FFFA", "#80F0FF", "#40E0FF"],
  acid:     ["#CCFF00", "#A8FF00", "#80FF00", "#54FF00"],
};

const SUB_TO_COLORS: Record<string, string> = {
  red: "#FF1744",
  orange: "#FF6B00",
  yellow: "#FFD700",
  green: "#00FF00",
  cyan: "#00FFFF",
  blue: "#2196F3",
  purple: "#9D00FF",
  pink: "#FF0080",
  white: "#FFFFFF",
};

const URL_COLORS: Record<string, string> = {
  gray: "#9E9E9E",
  white: "#FFFFFF",
  cyan: "#00B8D4",
  yellow: "#FFD700",
  green: "#4CAF50",
  blue: "#4A90E2",
};

const SIZE_VALUES: Record<string, number> = {
  small: 60,
  medium: 100,
  big: 150,
};

function escapeName(name: string): string {
  return name.replace(/[<>]/g, "");
}

function buildCurvedColoredName(name: string, colors: string[], direction: "smile" | "frown" = "smile"): string {
  const chars = name.split("");
  const n = chars.length;
  if (n === 0) return "";
  if (n === 1) return `<color=${colors[0]}>${chars[0]}</color>`;

  const maxRotate = 15;
  const maxVoffset = 12;
  const voffsetSign = direction === "frown" ? -1 : 1;

  return chars.map((char, i) => {
    const t = (i / (n - 1)) * 2 - 1;
    const rotate = Math.round(t * maxRotate);
    const voffset = Math.round(Math.abs(t) * maxVoffset) * voffsetSign;
    const color = colors[i % colors.length];
    return `<rotate=${rotate}><voffset=${voffset}><color=${color}>${char}</color></voffset></rotate>`;
  }).join("");
}

function buildFlatColoredName(name: string, colors: string[]): string {
  return name.split("").map((char, i) => `<color=${colors[i % colors.length]}>${char}</color>`).join("");
}

function buildTargetName(body: GenerateBody, isShame: boolean): string {
  if (isShame) return SHAME_PAYLOAD;

  const cleanName = escapeName(body.name.toUpperCase());
  if (!cleanName) throw new Error("Name is required");
  const colors = STYLE_COLORS[body.style] || STYLE_COLORS.ocean;
  const sizeVal = SIZE_VALUES[body.size || "medium"] || 100;

  const namePart = body.curve
    ? `<size=${sizeVal}><b>${buildCurvedColoredName(cleanName, colors, body.curveDirection || "smile")}</b></size>`
    : `<size=${sizeVal}><b>${buildFlatColoredName(cleanName, colors)}</b></size>`;

  const parts: string[] = [];
  if (body.includeSubTo) {
    const subColor = SUB_TO_COLORS[body.subToColor || "red"] || SUB_TO_COLORS.red;
    parts.push(`<size=40><color=${subColor}><b>SUB TO</b></color>`);
  }
  parts.push(namePart);
  if (body.includeUrl && body.youtubeHandle) {
    const handle = body.youtubeHandle.replace(/[<>]/g, "");
    const urlColor = URL_COLORS[body.urlColor || "gray"] || URL_COLORS.gray;
    parts.push(`<size=25><color=${urlColor}><b>youtube.com/@${handle}</b></color>`);
  }
  parts.push(`<size=18><color=#666666>github.com/${REQUIRED_USER}</color>`);
  return parts.join(" ");
}

function obfuscate(script: string): string {
  const key = "rgnt-v1-" + Math.random().toString(36).slice(2, 10);
  let xored = "";
  for (let i = 0; i < script.length; i++) {
    xored += String.fromCharCode(script.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  const b64 = Buffer.from(xored, "binary").toString("base64");
  return JSON.stringify({ k: key, d: b64 });
}

function buildScript(targetName: string): string {
  const inner = `const TARGET_NAME = ${JSON.stringify(targetName)};
const _origFetch = window.fetch;
let _captured = false;
let _done = false;

window.fetch = function(url, opts = {}) {
  if (!_done && typeof url === 'string' && url.includes('/nickname') && opts.body && !_captured) {
    _captured = true;
    try {
      const bodyClone = opts.body.slice ? opts.body.slice(0, opts.body.size, opts.body.type) : opts.body;
      Promise.resolve(typeof bodyClone.text === 'function' ? bodyClone.text() : String(bodyClone))
        .then(text => {
          const newBody = text.includes('=')
            ? text.split('=')[0] + '=' + encodeURIComponent(TARGET_NAME)
            : TARGET_NAME;
          return fetch(url, { method: opts.method, headers: opts.headers, body: newBody });
        })
        .then(r => r.text())
        .then(t => {
          console.log('%c\\u2713 Set!', 'color:#00ff00;font-weight:bold;font-size:14px');
          console.log('%c\\u2192 Refresh (F5) to see your new name', 'color:#00b8d4');
          console.log('%c\\u2192 Score a goal to see the curved gradient banner', 'color:#ff00ff');
          console.log('%c\\u2192 github.com/${REQUIRED_USER}', 'color:#666');
          _done = true;
        })
        .catch(e => console.log('Error:', e));
    } catch(e) { console.log('Setup error:', e); }
  }
  return _origFetch.apply(this, arguments);
};

console.log('%c\\u{1F680} Hook installed', 'color:#00b8d4;font-size:14px;font-weight:bold');
console.log('%c\\u2192 Now change your name in the game UI to trigger it', 'color:#fff');`;

  const payload = obfuscate(inner);
  return `// rocketgoal-name-tools | github.com/${REQUIRED_USER} | Do not redistribute
// Encrypted payload — verified via GitHub follow+star
(function(){
  var p=${payload};
  var k=p.k, d=p.d;
  var b64=atob(d);
  var xored="";
  for(var i=0;i<b64.length;i++){xored+=String.fromCharCode(b64.charCodeAt(i)^k.charCodeAt(i%k.length));}
  try{ (0,eval)(xored); }catch(e){ console.log('Payload error:', e); }
})();`;
}

async function verifyAccess(accessToken: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const [followRes, starRes] = await Promise.all([
      fetch(`https://api.github.com/user/following/${REQUIRED_USER}`, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
      }),
      fetch(`https://api.github.com/user/starred/${REQUIRED_USER}/${REQUIRED_REPO}`, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
      }),
    ]);
    const isFollowing = followRes.status === 204;
    const hasStarred = starRes.status === 204;
    if (isFollowing && hasStarred) return { ok: true };
    if (!isFollowing && !hasStarred) return { ok: false, reason: "both" };
    if (!isFollowing) return { ok: false, reason: "follow" };
    return { ok: false, reason: "star" };
  } catch {
    return { ok: false, reason: "api_error" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateBody;
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (body.name.length > 12) {
      return NextResponse.json({ error: "Name must be 12 characters or less" }, { status: 400 });
    }
    let isShame = false;
    let verifyReason = "";
    if (body.accessToken) {
      const verify = await verifyAccess(body.accessToken);
      if (!verify.ok) {
        isShame = true;
        verifyReason = verify.reason || "unknown";
      }
    } else {
      return NextResponse.json({
        error: "verification_required",
        message: "GitHub verification required to generate script",
      }, { status: 403 });
    }
    const targetName = buildTargetName(body, isShame);
    const script = buildScript(targetName);
    return NextResponse.json({
      script,
      targetName,
      verified: !isShame,
      shameReason: isShame ? verifyReason : null,
      style: body.style,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// Preview endpoint — no verification needed
export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateBody;
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (body.name.length > 12) {
      return NextResponse.json({ error: "Name must be 12 characters or less" }, { status: 400 });
    }
    const colors = STYLE_COLORS[body.style] || STYLE_COLORS.ocean;
    const cleanName = escapeName(body.name.toUpperCase());
    // Use distinct colors per letter to avoid key collision warnings
    const distinctColors = Array.from(new Set(colors));
    while (distinctColors.length < cleanName.length) {
      distinctColors.push(...colors);
    }
    const nameHtml = body.curve
      ? buildCurvedColoredName(cleanName, distinctColors.slice(0, cleanName.length), body.curveDirection)
      : buildFlatColoredName(cleanName, distinctColors.slice(0, cleanName.length));
    return NextResponse.json({
      preview: {
        name: cleanName,
        colors: distinctColors.slice(0, Math.max(4, cleanName.length)),
        html: nameHtml,
        curve: body.curve,
        curveDirection: body.curveDirection || "smile",
        size: body.size || "medium",
        includeSubTo: body.includeSubTo,
        subToColor: body.subToColor || "red",
        includeUrl: body.includeUrl,
        urlColor: body.urlColor || "gray",
        youtubeHandle: body.youtubeHandle,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
