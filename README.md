# holidays

한국의 공휴일, 24절기 및 잡절 정보를 지속적으로 갱신하는 저장소입니다.

JSON 파일의 형식은 다음 타입스크립트의 `JSON` 상수를 따릅니다.

```ts
declare const JSON: DateInfo[];

enum DateKind {
  Holiday = 1,
  Anniversary = 2,
  SolarTerms = 3,
  Sundry = 4,
}

interface DateInfo {
  date: string; // YYYY-MM-DD
  name: string;
  holiday: boolean;
  remarks: string | null;
  kind: DateKind;
  time: string | null; // HH:mm (only SolarTerms)
  sunLng: number | null; // only SolarTerms
}
```

## 데이터 출처

데이터는 공공데이터 포털의
[한국천문연구원 특일 정보](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15012690)를
이용하였습니다.
