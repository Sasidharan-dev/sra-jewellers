import { goldRateSnapshot } from "@/data/goldRates";
import { getGoldRateOverride } from "@/lib/server/db";
export async function GET() {
  const override = await getGoldRateOverride();
  if (override) return Response.json(override);
  if (process.env.GOLD_RATE_API_URL) {
    try {
      const response = await fetch(process.env.GOLD_RATE_API_URL, { signal: AbortSignal.timeout(5000), cache: "no-store" });
      if (response.ok) return Response.json(await response.json());
    } catch { /* Return the safe fallback below when the provider is unavailable. */ }
  }
  try {
    const sourceUrl = process.env.GOLD_RATE_SOURCE_URL || "https://www.goodreturns.in/gold-rates/coimbatore.html";
    const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(7000), cache: "no-store", headers: { "User-Agent": "SRA-Jewellers/1.0" } });
    if (response.ok) {
      const html = await response.text();
      const readRate = (purity: string) => {
        const match = html.match(new RegExp(`id=["']${purity}-price["'][^>]*>\\s*(?:&#x20b9;|₹)\\s*([\\d,]+)`, "i"));
        return match ? Number(match[1].replace(/,/g, "")) : undefined;
      };
      const rates = (["24K", "22K", "18K"] as const).map((purity) => ({ purity, ratePerGram: readRate(purity) })).filter((rate): rate is { purity: typeof rate.purity; ratePerGram: number } => typeof rate.ratePerGram === "number");
      if (rates.length === 3) return Response.json({ city: "Coimbatore", updatedAt: new Date().toISOString(), rates, source: sourceUrl });
    }
  } catch { /* Use the last configured fallback when the source is unavailable. */ }
  return Response.json({ ...goldRateSnapshot, updatedAt: new Date().toISOString() });
}
