import { DateInfo, getDateInfos } from "../api.ts";

const API_KEY = Deno.env.get("API_KEY") ?? "";

if (!API_KEY) {
  console.error("API_KEY is not set");
  Deno.exit(1);
}

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
    for (const date of await getDateInfos(API_KEY, type, year)) {
      dates.set(JSON.stringify(date), date);
    }
  }

  const sorted = Array.from(dates.values()).sort((a, b) => {
    return a.date.localeCompare(b.date);
  });

  Deno.writeFile(
    `./public/${year}.json`,
    new TextEncoder().encode(JSON.stringify(sorted, null, 2)),
  );
  console.log(`Generated ${year}.json`);
}

const year = new Date().getFullYear();

try {
  await generateDateFile(year);
  await generateDateFile(year + 1);
} catch (e) {
  console.error(e);
  Deno.exit(1);
}
