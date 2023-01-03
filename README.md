# holidays

한국의 공휴일, 24절기 및 잡절 정보를 지속적으로 갱신하는 저장소입니다. **선거일**이나 **대체공휴일**이 가끔 추가될 때 있습니다. **매주 월요일 오전 0시**에 새로운 정보가 있으면 업데이트 됩니다.

다음 형식의 URL을 이용해 데이터를 받아올 수 있습니다.

1. **Github Hosting** : `https://holidays.dist.be/{year}.json`
   - (예)
     [https://holidays.dist.be/2022.json](https://holidays.dist.be/2022.json)
1. **jsDelivr** :
   `https://cdn.jsdelivr.net/gh/distbe/holidays@gh-pages/{year}.json`
   - (예)
     [https://cdn.jsdelivr.net/gh/distbe/holidays@gh-pages/2022.json](https://cdn.jsdelivr.net/gh/distbe/holidays@gh-pages/2022.json)
1. **Statically** :
   `https://cdn.statically.io/gh/distbe/holidays/main/public/{year}.json`
   - (예)
     [https://cdn.statically.io/gh/distbe/holidays/main/public/2022.json](https://cdn.statically.io/gh/distbe/holidays/main/public/2022.json)


## 데이터 형식

JSON 파일의 형식은 다음 타입스크립트의 `JSON` 상수를 따릅니다.

```ts
declare const JSON: DateInfo[];

enum DateKind {
  Holiday = 1, // 공휴일 - (예) 설날, 대통령선거일, 추석 (대체공휴일) ..
  Anniversary = 2, // 기념일 - (예) 스승의 날, 국군의 날 ..
  SolarTerms = 3, // 24절기 - (예) 입춘, 경칩 ..
  Sundry = 4, // 잡절 - (예) 정월대보름, 초복, 중복 ..
}

interface DateInfo {
  date: string; // YYYY-MM-DD
  name: string; // 이름
  holiday: boolean; // 공휴일 여부
  remarks: string | null;
  kind: DateKind;
  time: string | null; // HH:mm (only SolarTerms)
  sunLng: number | null; // only SolarTerms
}
```

## 활용중인 프로젝트

- [NPM @kokr/date](https://www.npmjs.com/package/@kokr/date): Javascript나, Typescript에서 활용하기 쉽게 패키지로 만들었습니다. 패키지 업데이트 없이도 항상 최신 정보의 날짜 데이터를 사용할 수 있습니다.

## 데이터 출처

데이터는 공공데이터 포털의
[한국천문연구원 특일 정보](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15012690)를
이용하였습니다.
