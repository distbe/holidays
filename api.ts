interface DateResponse<TBody> {
  response: {
    header: {
      resultCode: "00";
      resultMsg: string;
    };
    body: TBody;
  };
}

interface RawDateInfo {
  dateKind: "01" | "02" | "03" | "04"; // 종류 01: 국경일(Holiday) 02: 기념일(Anniversary) 03: 24절기, 04: 잡절
  dateName: string; // 이름
  isHoliday: "Y" | "N"; // 공휴일 여부
  remarks?: string; // 주석
  locdate: number; // 날짜
  seq: number; // 순번
  kst?: string; // only dateKind === "03" 한국표준시간
  sunLongitude?: number; // only dateKind === "03" 태양황경(도)
}

export enum DateKind {
  Holiday = 1,
  Anniversary = 2,
  SolarTerms = 3,
  Sundry = 4,
}

export interface DateInfo {
  date: string; // YYYY-MM-DD
  name: string;
  holiday: boolean;
  remarks: string | null;
  kind: DateKind;
  time: string | null; // HH:mm (only SolarTerms)
  sunLng: number | null; // only SolarTerms
}

interface RawDatesBody {
  items: {
    item: RawDateInfo | RawDateInfo[];
  } | "";
  numOfRows: number;
  pageNo: number;
  totalCount: number;
}

function normalizeName(
  name: string,
  _raw: RawDateInfo,
  index: number,
  array: RawDateInfo[],
) {
  if (name === "1월1일") {
    return "새해";
  }
  if (name === "기독탄신일") {
    return "크리스마스";
  }
  if (name === "대체공휴일" && index > 0) {
    return `${array[index - 1].dateName} (대체공휴일)`;
  }
  return name;
}

function transformDateInfo(
  raw: RawDateInfo,
  index: number,
  array: RawDateInfo[],
): DateInfo {
  return {
    date: `${raw.locdate}`.padStart(8, "0").replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3",
    ),
    name: normalizeName(
      raw.dateName.normalize("NFC").trim(),
      raw,
      index,
      array,
    ),
    holiday: raw.isHoliday === "Y",
    remarks: raw.remarks || null,
    kind: raw.dateKind === "01"
      ? DateKind.Holiday
      : raw.dateKind === "02"
      ? DateKind.Anniversary
      : raw.dateKind === "03"
      ? DateKind.SolarTerms
      : DateKind.Sundry,
    time: raw.kst ? raw.kst.trim().replace(/(\d{2})(\d{2})/, "$1:$2") : null,
    sunLng: raw.sunLongitude || null,
  };
}

/*
getHoliDeInfo	국경일 정보조회
getRestDeInfo	공휴일 정보조회
getAnniversaryInfo	기념일 정보조회
get24DivisionsInfo	24절기 정보조회
getSundryDayInfo	잡절 정보조회
*/
export async function getDateInfos(
  apiKey: string,
  type:
    | "getHoliDeInfo"
    | "getRestDeInfo"
    | "getAnniversaryInfo"
    | "get24DivisionsInfo"
    | "getSundryDayInfo",
  year: number,
): Promise<DateInfo[]> {
  let page = 1;
  let items: RawDateInfo[] = [];
  while (1) {
    const url = new URL(
      `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/${type}`,
    );
    url.searchParams.append("_type", "json");
    url.searchParams.append("solYear", year.toString().padStart(4, "0"));
    url.searchParams.append("ServiceKey", apiKey);
    url.searchParams.append("numOfRows", "100");
    if (page > 1) {
      url.searchParams.append("pageNo", `${page}`);
    }
    try {
      const response = await fetch(url);
      const body = await response.json() as DateResponse<
        RawDatesBody
      >;

      if (!body.response.body.items || body.response.body.totalCount === 0) {
        break;
      }

      items = items.concat(
        Array.isArray(body.response.body.items.item)
          ? body.response.body.items.item
          : [body.response.body.items.item],
      );

      if (items.length >= body.response.body.totalCount) {
        break;
      }

      page++;
    } catch {
      throw new Error("not found");
    }
  }
  return items.map(transformDateInfo);
}
