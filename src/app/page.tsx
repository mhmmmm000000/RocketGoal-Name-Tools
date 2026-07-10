import { HomeClient } from "./home-client";

// Force dynamic rendering — prevents SSG/prerender crashes during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function Page() {
  return <HomeClient />;
}
