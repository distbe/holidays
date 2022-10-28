import { DateInfo, getDateInfos } from "../api.ts";

async function generateDateFile(year: number) {
  const dates = new Map<string, DateInfo>();
  const types = [
    "getHoliDeInfo",
    "getRestDeInfo",
    "getAnniversaryInfo",
    "get24DivisionsInfo",
    "getSundryDayInfo",
  ] as const;

  for (const type of types) {
    for (const date of await getDateInfos(apiKey, type, year)) {
      dates.set(JSON.stringify(date), date);
    }
  }

  const sorted = Array.from(dates.values()).sort((a, b) => {
    return a.date.localeCompare(b.date);
  });

  Deno.writeFile(
    `${year}.json`,
    new TextEncoder().encode(JSON.stringify(sorted, null, 2)),
  );
  console.log(`Generated ${year}.json`);
}

const apiKey = Deno.env.get("API_KEY") ?? "";

const year = new Date().getFullYear();

await generateDateFile(year);
await generateDateFile(year + 1);
