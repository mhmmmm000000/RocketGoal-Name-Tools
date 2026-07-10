'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Github,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Zap,
  ChevronRight,
  AlertTriangle,
  Eye,
  Terminal,
  RefreshCw,
  Star,
  UserPlus,
  Shield,
} from "lucide-react";

const GITHUB_USER = "mhmmmm000000";
const GITHUB_REPO = "rocketgoal-name-tools";

type Style = "ocean" | "sunset" | "cyber" | "ice" | "royal" | "inferno" | "matrix" | "candy" | "void" | "gold" | "mint" | "rose" | "electric" | "plasma" | "toxic" | "blood" | "sky" | "bronze" | "arctic" | "acid";

const STYLES: Record<Style, { name: string; colors: string[]; desc: string }> = {
  ocean:    { name: "Ocean",    colors: ["#4A90E2", "#00B8D4", "#4CAF50", "#81D4FA"], desc: "Blue-teal-green" },
  sunset:   { name: "Sunset",   colors: ["#FF6B6B", "#FFA500", "#FFD93D", "#FF6B9D"], desc: "Warm orange-pink" },
  cyber:    { name: "Cyber",    colors: ["#00FFFF", "#FF00FF", "#00FF00", "#FFFF00"], desc: "Neon arcade" },
  ice:      { name: "Ice",      colors: ["#A8E6FF", "#7CFFCB", "#B5DEFF", "#E0F7FF"], desc: "Cool pastels" },
  royal:    { name: "Royal",    colors: ["#9D00FF", "#C77DFF", "#5E17EB", "#A517F2"], desc: "Deep purple" },
  inferno:  { name: "Inferno",  colors: ["#FF0040", "#FF4500", "#FFA500", "#FFD700"], desc: "Hot fire" },
  matrix:   { name: "Matrix",   colors: ["#00FF41", "#008F11", "#00FF41", "#39FF14"], desc: "Green code" },
  candy:    { name: "Candy",    colors: ["#FFB3D9", "#C9B3FF", "#B3FFEC", "#FFE5B3"], desc: "Soft pastel" },
  void:     { name: "Void",     colors: ["#7B2CBF", "#3C096C", "#5A189A", "#9D4EDD"], desc: "Dark purple" },
  gold:     { name: "Gold",     colors: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520"], desc: "Premium gold" },
  mint:     { name: "Mint",     colors: ["#00FFA3", "#00D9B0", "#5EEAD4", "#14F2C9"], desc: "Cool mint" },
  rose:     { name: "Rose",     colors: ["#FF0080", "#FF4DA6", "#FF80BF", "#FFB3D9"], desc: "Hot pink" },
  electric: { name: "Electric", colors: ["#0080FF", "#00D4FF", "#80FF00", "#FFFF00"], desc: "Electric blue" },
  plasma:   { name: "Plasma",   colors: ["#FF00FF", "#8000FF", "#FF0080", "#FF8000"], desc: "Plasma burn" },
  toxic:    { name: "Toxic",    colors: ["#ADFF2F", "#7FFF00", "#00FF00", "#32CD32"], desc: "Acid green" },
  blood:    { name: "Blood",    colors: ["#8B0000", "#DC143C", "#FF0000", "#FF6347"], desc: "Deep red" },
  sky:      { name: "Sky",      colors: ["#87CEEB", "#ADD8E6", "#B0E0E6", "#E0FFFF"], desc: "Sky blues" },
  bronze:   { name: "Bronze",   colors: ["#CD7F32", "#B87333", "#A0522D", "#8B4513"], desc: "Bronze tones" },
  arctic:   { name: "Arctic",   colors: ["#E0FFFF", "#B0FFFA", "#80F0FF", "#40E0FF"], desc: "Arctic ice" },
  acid:     { name: "Acid",     colors: ["#CCFF00", "#A8FF00", "#80FF00", "#54FF00"], desc: "Acid yellow" },
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (hash.includes("token=")) {
    const token = hash.split("token=")[1].split("&")[0];
    sessionStorage.setItem("rgnt_token", token);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    return token;
  }
  return sessionStorage.getItem("rgnt_token");
}

interface Preview {
  name: string;
  colors: string[];
  curve: boolean;
  includeSubTo: boolean;
  includeUrl: boolean;
  youtubeHandle: string;
}

function NamePreview({ preview, locked }: { preview: Preview | null; locked: boolean }) {
  if (!preview) {
    return (
      <div className="aspect-video rounded-2xl border border-white/10 flex items-center justify-center bg-white/[0.02]">
        <p className="text-white/30 text-sm">Preview appears here</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
      {locked && (
        <div className="absolute inset-0 backdrop-blur-md bg-black/30 z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5 text-white/50" />
            </div>
            <p className="text-xs text-white/50">Unlock to copy</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6">
        {preview.includeSubTo && (
          <div className="text-red-400 font-black text-xs tracking-[0.3em] uppercase">SUB TO</div>
        )}
        <div
          className="text-4xl md:text-5xl font-black tracking-wider"
          style={{
            background: `linear-gradient(90deg, ${preview.colors.join(", ")})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 24px rgba(34,211,238,0.3))",
            transform: preview.curve ? "perspective(400px) rotateX(12deg)" : "none",
          }}
        >
          {preview.name}
        </div>
        {preview.includeUrl && preview.youtubeHandle && (
          <div className="text-white/40 text-[10px] font-mono">youtube.com/@{preview.youtubeHandle}</div>
        )}
        <div className="text-white/20 text-[9px] font-mono mt-1">github.com/{GITHUB_USER}</div>
      </div>
    </div>
  );
}

function GatePopup({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState<"intro" | "follow" | "star" | "verify">("intro");

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setStep("intro"), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/[0.06] backdrop-blur-2xl border-white/10 max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 border border-white/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-cyan-300" />
            </div>
            {step === "intro" && "Unlock the generator"}
            {step === "follow" && "Step 1 of 2 — Follow"}
            {step === "star" && "Step 2 of 2 — Star"}
            {step === "verify" && "Verifying..."}
          </DialogTitle>
          <DialogDescription className="text-white/50">
            {step === "intro" && "Two quick actions on GitHub unlock everything."}
            {step === "follow" && `Follow @${GITHUB_USER} on GitHub.`}
            {step === "star" && `Star the ${GITHUB_REPO} repo.`}
            {step === "verify" && "Checking your GitHub..."}
          </DialogDescription>
        </DialogHeader>

        {step === "intro" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <UserPlus className="w-4 h-4 text-cyan-300 flex-shrink-0" />
              <div>
                <div className="text-white/90 text-sm font-medium">Follow @{GITHUB_USER}</div>
                <div className="text-xs text-white/40">One click on GitHub</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <Star className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <div>
                <div className="text-white/90 text-sm font-medium">Star {GITHUB_REPO}</div>
                <div className="text-xs text-white/40">One click on GitHub</div>
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 text-white border-0 rounded-xl"
              onClick={() => setStep("follow")}
            >
              Start <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <p className="text-[10px] text-white/30 text-center pt-1">
              <Shield className="w-2.5 h-2.5 inline mr-1" />
              We only request read:user + public_repo. No token stored server-side.
            </p>
          </div>
        )}

        {step === "follow" && (
          <div className="space-y-3">
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                <div>
                  <div className="font-medium text-white/90 text-sm">Open @{GITHUB_USER}</div>
                  <div className="text-xs text-white/40">Click Follow on GitHub</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30" />
            </a>
            <Button className="w-full rounded-xl" variant="outline" onClick={() => setStep("star")}>
              I followed — next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {step === "star" && (
          <div className="space-y-3">
            <a
              href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:border-yellow-400/30 hover:bg-yellow-400/5 transition"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-300" />
                <div>
                  <div className="font-medium text-white/90 text-sm">Open {GITHUB_REPO}</div>
                  <div className="text-xs text-white/40">Click Star (top-right)</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30" />
            </a>
            <Button
              className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 text-white border-0 rounded-xl"
              onClick={() => setStep("verify")}
            >
              Verify with GitHub <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-3 text-center py-4">
            <RefreshCw className="w-8 h-8 text-cyan-300 mx-auto animate-spin" />
            <p className="text-sm text-white/50">Redirecting to GitHub...</p>
            <Button className="w-full rounded-xl" variant="outline" onClick={() => { window.location.href = "/api/auth/github"; }}>
              Click if not redirected
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function NameGenerator({ unlocked, accessToken, onNeedUnlock }: {
  unlocked: boolean;
  accessToken: string | null;
  onNeedUnlock: () => void;
}) {
  const [name, setName] = useState("LITE");
  const [style, setStyle] = useState<Style>("ocean");
  const [curve, setCurve] = useState(true);
  const [includeSubTo, setIncludeSubTo] = useState(true);
  const [includeUrl, setIncludeUrl] = useState(true);
  const [youtubeHandle, setYoutubeHandle] = useState("ninjagoadventure");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shame, setShame] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, style, curve, includeSubTo, includeUrl, youtubeHandle }),
        });
        const data = await res.json();
        if (data.preview) {
          setPreview(data.preview);
        }
      } catch {}
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [name, style, curve, includeSubTo, includeUrl, youtubeHandle]);

  const handleCopyOrUnlock = async () => {
    if (!unlocked || !accessToken) {
      onNeedUnlock();
      return;
    }

    setLoading(true);
    setShame(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, style, curve, includeSubTo, includeUrl, youtubeHandle,
          accessToken,
        }),
      });
      const data = await res.json();

      if (data.error === "verification_required") {
        onNeedUnlock();
        return;
      }

      if (data.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      if (data.verified === false) {
        setShame(true);
        setScript(data.script);
        toast({
          title: "Verification failed",
          description: "You un-followed or un-starred. Name will be set to IM A LOSER UNFOLLOWED.",
          variant: "destructive",
        });
        return;
      }

      setScript(data.script);
      toast({ title: "Script ready", description: "Copy and paste into your browser console." });
    } catch {
      toast({ title: "Error", description: "Failed to generate", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 space-y-5">
          <div>
            <Label htmlFor="name" className="text-xs uppercase tracking-wider text-white/40">Your name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 12).replace(/[<>]/g, ""))}
              placeholder="LITE"
              className="mt-1.5 bg-white/[0.04] border-white/10 font-mono text-lg rounded-xl"
            />
            <p className="text-[10px] text-white/30 mt-1">{name.length}/12 chars</p>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-white/40">Style</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-1.5 max-h-56 overflow-y-auto pr-1">
              {(Object.keys(STYLES) as Style[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`group relative p-2.5 rounded-2xl border transition text-left ${
                    style === s
                      ? "border-cyan-400/40 bg-cyan-400/5"
                      : "border-white/5 hover:border-white/15 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex gap-0.5 mb-1.5">
                    {STYLES[s].colors.map((c, i) => (
                      <div key={`${s}-${i}`} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="text-[11px] font-medium text-white/80">{STYLES[s].name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="curve" className="text-sm text-white/90">Curve</Label>
                <p className="text-[10px] text-white/40">Smile arc rotation</p>
              </div>
              <Switch id="curve" checked={curve} onCheckedChange={setCurve} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="subto" className="text-sm text-white/90">SUB TO header</Label>
                <p className="text-[10px] text-white/40">Red text above name</p>
              </div>
              <Switch id="subto" checked={includeSubTo} onCheckedChange={setIncludeSubTo} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="url" className="text-sm text-white/90">YouTube link</Label>
                <p className="text-[10px] text-white/40">Below name in gray</p>
              </div>
              <Switch id="url" checked={includeUrl} onCheckedChange={setIncludeUrl} />
            </div>
            {includeUrl && (
              <div>
                <Label htmlFor="yt" className="text-xs text-white/40">YouTube @handle</Label>
                <Input
                  id="yt"
                  value={youtubeHandle}
                  onChange={(e) => setYoutubeHandle(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, ""))}
                  placeholder="yourchannel"
                  className="mt-1.5 bg-white/[0.04] border-white/10 font-mono text-sm rounded-xl"
                />
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 text-white border-0 font-medium rounded-xl"
            onClick={handleCopyOrUnlock}
            disabled={loading || !name}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : unlocked ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Script
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Unlock to Generate
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              Live preview
            </Label>
            {!unlocked && (
              <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">
                <Lock className="w-2.5 h-2.5 mr-1" />
                Locked
              </Badge>
            )}
          </div>
          <NamePreview preview={preview} locked={!unlocked} />
        </div>

        {shame && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-300">
              You un-followed or un-starred. The script will set your name to <span className="font-mono font-bold">IM A LOSER UNFOLLOWED</span> in-game. Re-follow and re-star to fix.
            </div>
          </div>
        )}

        {script && unlocked && !shame && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Terminal className="w-3 h-3" />
                Your script
              </Label>
              <Button size="sm" variant="outline" onClick={copyScript} className="h-7 text-xs rounded-lg border-white/10">
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="bg-black/40 rounded-xl p-3 text-[10px] font-mono overflow-x-auto max-h-56 overflow-y-auto border border-white/5 text-white/50">
              {script.slice(0, 500)}...
            </pre>
            <p className="text-[10px] text-white/30 mt-2">
              Script is encrypted — only works once pasted into your console.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepsSection() {
  const steps = [
    { n: 1, title: "Generate your script", desc: "Use the generator above. Copy the encrypted script." },
    { n: 2, title: "Open rocketgoal.io", desc: "Log in to your account. Stay on the main menu — don't click Play yet." },
    { n: 3, title: "Open browser console", desc: "Press F12 (or right-click → Inspect). Click the Console tab." },
    { n: 4, title: "Paste the script", desc: "Paste your encrypted script and press Enter. You'll see 'Hook installed'." },
    { n: 5, title: "Change your name", desc: "Click the name input in the game, type anything, submit it. The script intercepts and replaces." },
    { n: 6, title: "Refresh the page", desc: "Press F5. Your new name is now live on the server." },
    { n: 7, title: "Score a goal", desc: "Join a match. When you score, your curved gradient banner appears." },
  ];

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white/90">How to use it</h2>
        <p className="text-sm text-white/40 mt-1">Seven steps, two minutes total</p>
      </div>
      <div className="space-y-2.5">
        {steps.map((step) => (
          <div
            key={step.n}
            className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-mono text-cyan-300">
              {step.n}
            </div>
            <div>
              <div className="font-medium text-white/90 text-sm">{step.title}</div>
              <div className="text-xs text-white/40 mt-0.5">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read URL params safely (no useSearchParams to avoid SSG issues)
    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");

    if (auth === "success") {
      const token = getToken();
      if (token) {
        setAccessToken(token);
        setUnlocked(true);
        toast({ title: "Unlocked", description: "Generator is ready." });
      }
    } else if (auth === "incomplete") {
      const reason = params.get("reason") || "both";
      const msgs: Record<string, string> = {
        follow: "You need to follow @mhmmmm000000 first",
        star: "You need to star the repo first",
        both: "You need to follow AND star to unlock",
      };
      setAuthError(msgs[reason] || "Verification incomplete");
      toast({ title: "Not yet", description: msgs[reason], variant: "destructive" });
    } else if (auth === "error" || auth === "token_error") {
      setAuthError("Authentication failed. Try again.");
      toast({ title: "Auth failed", description: "Try again", variant: "destructive" });
    } else {
      // Check for stored token from previous session
      const token = getToken();
      if (token) {
        setAccessToken(token);
        setUnlocked(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 z-40 backdrop-blur-2xl bg-black/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-400 shadow-lg shadow-cyan-400/20" />
            <span className="font-mono text-sm text-white/80">{GITHUB_REPO}</span>
          </div>
          <div className="flex items-center gap-2">
            {unlocked && (
              <Badge variant="outline" className="border-emerald-400/30 text-emerald-300 text-[10px]">
                <Check className="w-2.5 h-2.5 mr-1" /> Unlocked
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="text-white/50 hover:text-white/90 hover:bg-white/5 rounded-lg" asChild>
              <a href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-white/10 text-white/50 text-[10px] font-mono">
                v2.0
              </Badge>
              <span className="text-[10px] text-white/30 font-mono">rocketgoal.io</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Custom name tools for{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                rocketgoal.io
              </span>
            </h1>
            <p className="text-white/50 mt-3 text-sm md:text-base max-w-lg">
              Style your in-game name with colors, curves, and promo text. Works in live matches — everyone sees it.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <Button
                size="sm"
                onClick={() => setGateOpen(true)}
                className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 text-white border-0 rounded-lg"
              >
                {mounted && unlocked ? "Generator ready — scroll down" : "Unlock generator"}
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
              <Button size="sm" variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 rounded-lg" asChild>
                <a href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3.5 h-3.5 mr-1.5" /> Source
                </a>
              </Button>
            </div>
            {authError && (
              <p className="text-xs text-red-400 mt-3">{authError}</p>
            )}
          </div>
        </section>

        {/* Generator */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <NameGenerator
            unlocked={unlocked}
            accessToken={accessToken}
            onNeedUnlock={() => setGateOpen(true)}
          />
        </section>

        {/* Steps */}
        <StepsSection />

        {/* Note */}
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <p className="text-[11px] text-white/40 leading-relaxed">
              <span className="text-white/70 font-medium">Note:</span> This tool uses rich-text injection via the rocketgoal.io nickname field. The developers could patch this at any time. Use at your own risk. Not affiliated with rocketgoal.io or PocketHaven. Made by{" "}
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                @{GITHUB_USER}
              </a>.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-[11px] text-white/30 font-mono">
          <span>{GITHUB_USER}/{GITHUB_REPO}</span>
          <span>encrypted · verified · open-source</span>
        </div>
      </footer>

      <GatePopup
        open={gateOpen}
        onOpenChange={setGateOpen}
      />
    </div>
  );
}
