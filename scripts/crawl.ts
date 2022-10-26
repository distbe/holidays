import { DateInfo, getDateInfos } from "../api.ts";

const apiKey = Deno.env.get("API_KEY") ?? "";
if (Deno.args.length === 0) {
  console.log("Usage: crawl.ts <year>");
  Deno.exit(1);
}
const year = +Deno.args[0];

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
