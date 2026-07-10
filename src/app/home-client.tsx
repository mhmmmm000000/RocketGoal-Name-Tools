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
  Gamepad2,
} from "lucide-react";

const GITHUB_USER = "mhmmmm000000";
const GITHUB_REPO = "RocketGoal-Name-Tools";

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

const SUB_TO_COLORS = [
  { key: "red",     hex: "#FF1744", label: "Red" },
  { key: "orange",  hex: "#FF6B00", label: "Orange" },
  { key: "yellow",  hex: "#FFD700", label: "Yellow" },
  { key: "green",   hex: "#00FF00", label: "Green" },
  { key: "cyan",    hex: "#00FFFF", label: "Cyan" },
  { key: "blue",    hex: "#2196F3", label: "Blue" },
  { key: "purple",  hex: "#9D00FF", label: "Purple" },
  { key: "pink",    hex: "#FF0080", label: "Pink" },
  { key: "white",   hex: "#FFFFFF", label: "White" },
];

const URL_COLORS = [
  { key: "gray",    hex: "#9E9E9E", label: "Gray" },
  { key: "white",   hex: "#FFFFFF", label: "White" },
  { key: "cyan",    hex: "#00B8D4", label: "Cyan" },
  { key: "yellow",  hex: "#FFD700", label: "Yellow" },
  { key: "green",   hex: "#4CAF50", label: "Green" },
  { key: "blue",    hex: "#4A90E2", label: "Blue" },
];

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
  curveDirection: "smile" | "frown";
  size: "small" | "medium" | "big";
  includeTrophy: boolean;
  includeSubTo: boolean;
  subToColor: string;
  includeUrl: boolean;
  urlColor: string;
  youtubeHandle: string;
  promoMode: boolean;
}

const SIZE_MAP = {
  small: "text-2xl md:text-3xl",
  medium: "text-4xl md:text-5xl",
  big: "text-6xl md:text-7xl",
};

function NamePreview({ preview, locked }: { preview: Preview | null; locked: boolean }) {
  if (!preview) {
    return (
      <div className="aspect-video rounded-2xl border border-white/10 flex items-center justify-center bg-white/[0.02]">
        <p className="text-white/30 text-sm">Preview appears here</p>
      </div>
    );
  }

  // Render each letter individually with its own solid color
  // This matches how the actual game renders it (per-letter TextMeshPro colors)
  // and avoids the "invisible text" bug from CSS gradient clipping
  const letters = preview.name.split("");
  const subToHex = SUB_TO_COLORS.find(c => c.key === preview.subToColor)?.hex || "#FF1744";
  const urlHex = URL_COLORS.find(c => c.key === preview.urlColor)?.hex || "#9E9E9E";
  const sizeClass = SIZE_MAP[preview.size] || SIZE_MAP.medium;

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
          <div className="font-black text-xs tracking-[0.3em] uppercase" style={{ color: subToHex }}>SUB TO</div>
        )}
        <div
          className={`font-black tracking-wider ${sizeClass}`}
          style={{
            filter: "drop-shadow(0 0 24px rgba(34,211,238,0.2))",
            transform: preview.curve ? `perspective(400px) rotateX(${preview.curveDirection === "frown" ? -12 : 12}deg)` : "none",
          }}
        >
          {preview.includeTrophy && <span className="mr-1">🏆</span>}
          {letters.map((char, i) => (
            <span key={i} style={{ color: preview.includeTrophy ? "#FFD700" : preview.colors[i % preview.colors.length] }}>
              {char}
            </span>
          ))}
        </div>
        {preview.includeUrl && preview.youtubeHandle && (
          <div className="text-[10px] font-mono" style={{ color: urlHex }}>youtube.com/@{preview.youtubeHandle}</div>
        )}
        {preview.promoMode ? (
          <div className="text-cyan-400 text-sm font-bold font-mono mt-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            rocketgoal-name-toolss.netlify.app
          </div>
        ) : (
          <div className="text-white/20 text-[9px] font-mono mt-1">rocketgoal-name-toolss.netlify.app</div>
        )}
      </div>
    </div>
  );
}

function GatePopup({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/[0.06] backdrop-blur-2xl border-white/10 max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 border border-white/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-cyan-300" />
            </div>
            Unlock the generator
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Step 1: Connect your GitHub account. Then you&apos;ll see the follow + star steps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 text-white border-0 rounded-xl"
            onClick={() => { window.location.href = "/api/auth/github"; }}
          >
            <Github className="w-4 h-4 mr-2" />
            Connect with GitHub
          </Button>

          <div className="text-[10px] text-white/40 text-center pt-2 pb-1">
            After connecting, you&apos;ll see:
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 opacity-60">
            <UserPlus className="w-4 h-4 text-cyan-300 flex-shrink-0" />
            <div>
              <div className="text-white/80 text-sm font-medium">Step 2: Follow @{GITHUB_USER}</div>
              <div className="text-xs text-white/30">Opens GitHub profile</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 opacity-60">
            <Star className="w-4 h-4 text-yellow-300 flex-shrink-0" />
            <div>
              <div className="text-white/80 text-sm font-medium">Step 3: Star the repo</div>
              <div className="text-xs text-white/30">Then click &quot;verify now&quot;</div>
            </div>
          </div>

          <p className="text-[10px] text-white/30 text-center pt-1">
            <Shield className="w-2.5 h-2.5 inline mr-1" />
            We only request read:user + public_repo. No token stored server-side.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ColorPicker({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { key: string; hex: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition ${
            value === opt.key
              ? "border-cyan-400/40 bg-cyan-400/5 text-white"
              : "border-white/10 text-white/50 hover:border-white/20"
          }`}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: opt.hex }} />
          {opt.label}
        </button>
      ))}
    </div>
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
  const [curveDirection, setCurveDirection] = useState<"smile" | "frown">("smile");
  const [size, setSize] = useState<"small" | "medium" | "big">("medium");
  const [includeTrophy, setIncludeTrophy] = useState(false);
  const [includeSubTo, setIncludeSubTo] = useState(true);
  const [subToColor, setSubToColor] = useState("red");
  const [includeUrl, setIncludeUrl] = useState(true);
  const [urlColor, setUrlColor] = useState("gray");
  const [youtubeHandle, setYoutubeHandle] = useState("ninjagoadventure");
  const [promoMode, setPromoMode] = useState(false);

  // Promo presets — one click sets everything for maximum attention
  const PROMO_PRESETS = [
    { label: "WANT THIS?", name: "WANT THIS?", style: "cyber" as Style, desc: "Neon curiosity hook", trophy: false },
    { label: "GET THIS NAME", name: "GET THIS NAME", style: "inferno" as Style, desc: "Hot fire, direct CTA", trophy: false },
    { label: "HOW?", name: "HOW?", style: "plasma" as Style, desc: "Shortest, most intriguing", trophy: false },
    { label: "🏆 COPY ME", name: "COPY ME", style: "gold" as Style, desc: "Trophy + gold, premium", trophy: true },
    { label: "MY NAME?", name: "MY NAME?", style: "electric" as Style, desc: "Electric blue, question format", trophy: false },
  ];

  const applyPromo = (preset: typeof PROMO_PRESETS[0]) => {
    setPromoMode(true);
    setName(preset.name);
    setStyle(preset.style);
    setCurve(true);
    setCurveDirection("smile");
    setSize("big");
    setIncludeTrophy(preset.trophy);
    setIncludeSubTo(false);
    setIncludeUrl(false);
    toast({ title: "Promo mode on!", description: `Name set to "${preset.name}" — watermark URL is your site link` });
  };
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
          body: JSON.stringify({ name, style, curve, curveDirection, size, includeTrophy, includeSubTo, subToColor, includeUrl, urlColor, youtubeHandle, promoMode }),
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
  }, [name, style, curve, curveDirection, size, includeTrophy, includeSubTo, subToColor, includeUrl, urlColor, youtubeHandle, promoMode]);

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
          name, style, curve, curveDirection, size, includeTrophy, includeSubTo, subToColor, includeUrl, urlColor, youtubeHandle, promoMode,
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

          {/* Promo Mode — quick presets for promoting the site */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-400/5 to-fuchsia-400/5 border border-cyan-400/15 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-cyan-300 font-medium flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Promo Mode
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">One-click presets to promote the site in matches</p>
              </div>
              {promoMode && (
                <button
                  onClick={() => setPromoMode(false)}
                  className="text-[10px] text-white/40 hover:text-white/70 underline"
                >
                  clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROMO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPromo(preset)}
                  className="p-2.5 rounded-xl border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition text-left group"
                >
                  <div className="flex gap-0.5 mb-1">
                    {STYLES[preset.style].colors.map((c, i) => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="text-[11px] font-bold text-white/90 group-hover:text-white">{preset.label}</div>
                  <div className="text-[9px] text-white/30">{preset.desc}</div>
                </button>
              ))}
            </div>
            {promoMode && (
              <p className="text-[10px] text-cyan-300/70 mt-2 text-center">
                ✓ Promo mode active — the watermark below your name shows your site URL: <span className="font-mono">rocketgoal-name-toolss.netlify.app</span>
              </p>
            )}
          </div>

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

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="curve" className="text-sm text-white/90">Curve</Label>
                <p className="text-[10px] text-white/40">Smile or frown arc rotation</p>
              </div>
              <Switch id="curve" checked={curve} onCheckedChange={setCurve} />
            </div>
            {curve && (
              <div className="pl-3 border-l border-white/10">
                <Label className="text-xs uppercase tracking-wider text-white/40">Curve direction</Label>
                <div className="flex gap-2 mt-1.5">
                  <button
                    onClick={() => setCurveDirection("smile")}
                    className={`flex-1 p-2 rounded-lg border text-xs transition ${curveDirection === "smile" ? "border-cyan-400/40 bg-cyan-400/5 text-white" : "border-white/10 text-white/50"}`}
                  >
                    Smile ⌣
                  </button>
                  <button
                    onClick={() => setCurveDirection("frown")}
                    className={`flex-1 p-2 rounded-lg border text-xs transition ${curveDirection === "frown" ? "border-cyan-400/40 bg-cyan-400/5 text-white" : "border-white/10 text-white/50"}`}
                  >
                    Frown ⌢
                  </button>
                </div>
              </div>
            )}

            {/* Size selector */}
            <div>
              <Label className="text-xs uppercase tracking-wider text-white/40">Name size</Label>
              <div className="flex gap-2 mt-1.5">
                <button
                  onClick={() => setSize("small")}
                  className={`flex-1 p-2 rounded-lg border text-xs transition ${size === "small" ? "border-cyan-400/40 bg-cyan-400/5 text-white" : "border-white/10 text-white/50"}`}
                >
                  Small
                </button>
                <button
                  onClick={() => setSize("medium")}
                  className={`flex-1 p-2 rounded-lg border text-xs transition ${size === "medium" ? "border-cyan-400/40 bg-cyan-400/5 text-white" : "border-white/10 text-white/50"}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setSize("big")}
                  className={`flex-1 p-2 rounded-lg border text-xs transition ${size === "big" ? "border-cyan-400/40 bg-cyan-400/5 text-white" : "border-white/10 text-white/50"}`}
                >
                  Big
                </button>
              </div>
            </div>

            {/* Trophy toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trophy" className="text-sm text-white/90 flex items-center gap-1.5">
                  <span>🏆</span> Trophy icon
                </Label>
                <p className="text-[10px] text-white/40">Adds a trophy before your name + makes text gold</p>
              </div>
              <Switch id="trophy" checked={includeTrophy} onCheckedChange={setIncludeTrophy} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="subto" className="text-sm text-white/90">SUB TO header</Label>
                <p className="text-[10px] text-white/40">Text above name</p>
              </div>
              <Switch id="subto" checked={includeSubTo} onCheckedChange={setIncludeSubTo} />
            </div>
            {includeSubTo && (
              <div className="pl-3 border-l border-white/10">
                <Label className="text-xs uppercase tracking-wider text-white/40">SUB TO color</Label>
                <ColorPicker value={subToColor} onChange={setSubToColor} options={SUB_TO_COLORS} />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="url" className="text-sm text-white/90">YouTube link</Label>
                <p className="text-[10px] text-white/40">Below name</p>
              </div>
              <Switch id="url" checked={includeUrl} onCheckedChange={setIncludeUrl} />
            </div>
            {includeUrl && (
              <div className="pl-3 border-l border-white/10 space-y-3">
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
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/40">URL color</Label>
                  <ColorPicker value={urlColor} onChange={setUrlColor} options={URL_COLORS} />
                </div>
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
              You un-followed or un-starred. The script will set your name to <span className="font-mono font-bold">IM A LOSER UNFOLLOWED</span> in-game. Re-follow and re-star, then click verify again.
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
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyScript} className="h-7 text-xs rounded-lg border-white/10">
                  {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <pre className="bg-black/40 rounded-xl p-3 text-[10px] font-mono overflow-x-auto max-h-56 overflow-y-auto border border-white/5 text-white/50">
              {script.slice(0, 500)}...
            </pre>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 text-white border-0 rounded-lg"
                asChild
              >
                <a href="https://rocketgoal.io" target="_blank" rel="noopener noreferrer">
                  <Gamepad2 className="w-3.5 h-3.5 mr-1.5" />
                  Open rocketgoal.io
                </a>
              </Button>
              <p className="text-[10px] text-white/30 text-center">
                After opening, press F12 → Console tab → paste script → Enter → change name → refresh
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepsSection() {
  const steps = [
    { n: 1, title: "Generate your script", desc: "Use the generator above. Copy the encrypted script." },
    { n: 2, title: "Open rocketgoal.io", desc: "Click the 'Open rocketgoal.io' button, or visit it manually. Log in." },
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

const RECOVERY_SCRIPT = `// Recovery script — auto-resets your name to "player"
// NO NEED TO CHANGE YOUR NAME IN THE GAME. Just paste this, wait 10 seconds, refresh.
// It grabs your auth token from the game's background requests and resets the name for you.

const _origFetch = window.fetch;
let _token = null;
let _done = false;
let _attempts = 0;

window.fetch = function(url, opts = {}) {
  // Step 1: steal the auth token from ANY request the game makes
  if (!_token && opts && opts.headers) {
    try {
      const h = opts.headers;
      const auth = h.Authorization || h.authorization || (h.get && h.get('Authorization'));
      if (auth && auth.startsWith('Bearer ')) {
        _token = auth.slice(7);
        console.log('%c\\u2713 Found auth token!', 'color:#00ff00;font-weight:bold');
        tryReset();
      }
    } catch(e) {}
  }
  return _origFetch.apply(this, arguments);
};

async function tryReset() {
  if (_done || !_token) return;
  _attempts++;
  if (_attempts > 5) {
    console.log('%c\\u2717 Could not reset — try refreshing and pasting again', 'color:#ff0000;font-weight:bold');
    return;
  }

  const nicknameUrl = 'https://us-central1-rocketball-23c12.cloudfunctions.net/v0304_player/nickname';

  // Try multiple body formats the game might use
  const bodies = [
    'nickname=player',
    JSON.stringify({ nickname: 'player' }),
    JSON.stringify({ Nickname: 'player' }),
  ];

  for (const body of bodies) {
    try {
      const isJson = body.startsWith('{');
      const res = await fetch(nicknameUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + _token,
          'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded',
          'Accept': '*/*',
        },
        body: body,
      });
      const text = await res.text();
      console.log(\`Attempt (\${isJson ? 'JSON' : 'form'}): \${res.status} — \${text.slice(0, 100)}\`);
      if (res.ok && (text === 'true' || text.includes('true'))) {
        _done = true;
        console.log('%c\\u2713\\u2713\\u2713 NAME RESET TO "player"!', 'color:#00ff00;font-weight:bold;font-size:16px');
        console.log('%c\\u2192 Refresh the page (F5) now — your name is clean', 'color:#00b8d4;font-weight:bold;font-size:14px');
        console.log('%c\\u2192 After refresh, your name will show as "player"', 'color:#fff');
        return;
      }
    } catch(e) {
      console.log('Error:', e.message);
    }
  }

  // If all formats failed, retry in 2 seconds (token might need to refresh)
  if (!_done) {
    console.log('%c\\u21bb Retrying in 2s...', 'color:#ffaa00');
    setTimeout(tryReset, 2000);
  }
}

console.log('%c\\u{1F527} Recovery script installed', 'color:#ffaa00;font-size:14px;font-weight:bold');
console.log('%c\\u2192 You do NOT need to change your name', 'color:#fff;font-weight:bold');
console.log('%c\\u2192 Just wait 5-10 seconds for the auto-reset...', 'color:#fff');
console.log('%c\\u2192 The script will grab your token from background requests', 'color:#888');

// Also try to find token from existing IndexedDB/localStorage (Firebase stores it there)
(async function checkStoredToken() {
  try {
    // Firebase usually stores auth in IndexedDB — try localStorage first as fallback
    for (const key of Object.keys(localStorage)) {
      const val = localStorage.getItem(key);
      if (val && val.includes && val.includes('"stsTokenManager"')) {
        const parsed = JSON.parse(val);
        const token = parsed?.stsTokenManager?.accessToken;
        if (token) {
          _token = token;
          console.log('%c\\u2713 Found stored Firebase token!', 'color:#00ff00;font-weight:bold');
          tryReset();
          return;
        }
      }
    }
  } catch(e) {}
})();`;

function RecoverySection() {
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);

  const copyRecovery = () => {
    navigator.clipboard.writeText(RECOVERY_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.03] backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Name bugged or invisible?</h2>
            <p className="text-xs text-white/50">Reset your name to &quot;player&quot; instantly</p>
          </div>
        </div>

        <p className="text-xs text-white/60 mb-4 leading-relaxed">
          If your name is invisible, broken, or you can&apos;t change it back, this script will <span className="text-amber-300 font-medium">automatically reset it to &quot;player&quot;</span> — no need to touch the name box. It grabs your auth token from the game&apos;s background requests and resets the name for you.
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-black border-0 rounded-lg"
            onClick={copyRecovery}
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            {copied ? "Copied!" : "Copy recovery script"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 text-white/60 hover:bg-white/5 rounded-lg"
            onClick={() => setShowScript(!showScript)}
          >
            {showScript ? "Hide" : "View"} script
          </Button>
        </div>

        {showScript && (
          <pre className="mt-4 bg-black/40 rounded-xl p-3 text-[10px] font-mono overflow-x-auto max-h-48 overflow-y-auto border border-white/5 text-white/50">
            {RECOVERY_SCRIPT}
          </pre>
        )}

        <div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/5">
          <p className="text-[10px] text-white/40 leading-relaxed">
            <span className="text-amber-300 font-medium">How to use:</span> Open rocketgoal.io → F12 → Console → paste this → press Enter. <span className="text-white/70">Do NOT touch the name box.</span> Just wait 5-10 seconds — you&apos;ll see green &quot;NAME RESET&quot; messages. Then refresh (F5). Your name is now &quot;player&quot; — clean and visible.
          </p>
        </div>
      </div>
    </section>
  );
}



export function HomeClient() {
  const [unlocked, setUnlocked] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string>("");
  const [gateOpen, setGateOpen] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");

    if (auth === "success") {
      const token = getToken();
      if (token) {
        setAccessToken(token);
        setUnlocked(true);
        toast({ title: "Unlocked", description: "Generator is ready." });
      }
    } else if (auth === "pending") {
      const token = getToken();
      if (token) {
        setPendingToken(token);
        toast({ title: "One more step", description: "Follow + star on GitHub, then click verify." });
      }
    } else if (auth === "incomplete") {
      const token = getToken();
      if (token) {
        setPendingToken(token);
      } else {
        setAuthError("Verification incomplete — try again");
      }
    } else if (auth === "error" || auth === "token_error" || auth === "not_configured") {
      setAuthError("Authentication failed. Try again.");
      toast({ title: "Auth failed", description: "Try again", variant: "destructive" });
    } else {
      const token = getToken();
      if (token) {
        setAccessToken(token);
        setUnlocked(true);
      }
    }
  }, []);

  const handleVerify = async () => {
    if (!pendingToken) return;
    setVerifying(true);
    setVerifyError("");
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: pendingToken }),
      });
      const data = await res.json();
      if (data.ok) {
        setAccessToken(pendingToken);
        setUnlocked(true);
        setPendingToken(null);
        window.history.replaceState(null, "", window.location.pathname);
        toast({ title: "Unlocked!", description: "Thanks for the follow + star." });
      } else {
        setVerifyError(data.message || "Verification failed");
        toast({ title: "Not yet", description: data.message, variant: "destructive" });
      }
    } catch {
      setVerifyError("Network error. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleCancelPending = () => {
    setPendingToken(null);
    setVerifyError("");
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div className="min-h-screen flex flex-col">
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
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-white/10 text-white/50 text-[10px] font-mono">
                v3.0
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

        {pendingToken && !unlocked && (
          <section className="max-w-2xl mx-auto px-4 pb-12">
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.03] backdrop-blur-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Almost there!</h2>
                  <p className="text-xs text-white/50">Complete these 2 steps on GitHub, then verify</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <a
                  href={`https://github.com/${GITHUB_USER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-mono text-cyan-300">1</div>
                    <div>
                      <div className="font-medium text-white/90 text-sm">Follow @{GITHUB_USER}</div>
                      <div className="text-xs text-white/40">Opens GitHub profile in new tab</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-cyan-300" />
                </a>

                <a
                  href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:border-yellow-400/30 hover:bg-yellow-400/5 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-mono text-yellow-300">2</div>
                    <div>
                      <div className="font-medium text-white/90 text-sm">Star the repo</div>
                      <div className="text-xs text-white/40">Click the Star button (top-right of repo page)</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-yellow-300" />
                </a>
              </div>

              {verifyError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                  {verifyError}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 text-white border-0 rounded-xl"
                  onClick={handleVerify}
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      I did both — verify now
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 text-white/50 hover:bg-white/5 rounded-xl"
                  onClick={handleCancelPending}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-[10px] text-white/30 mt-3 text-center">
                Tip: After clicking the links above, come back to this tab and click &quot;verify now&quot;.
                Sometimes GitHub takes a few seconds to register the follow/star.
              </p>
            </div>
          </section>
        )}

        <section className="max-w-6xl mx-auto px-4 pb-12">
          <NameGenerator
            unlocked={unlocked}
            accessToken={accessToken}
            onNeedUnlock={() => setGateOpen(true)}
          />
        </section>

        <StepsSection />

        <RecoverySection />

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
