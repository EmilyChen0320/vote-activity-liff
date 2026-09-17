# vote-activity-liff

`AGO-460` 投票活動粉絲端 LIFF，採 Vue 3、Vite、Pinia、Vue Router 與 TailwindCSS。

完整開發順序請見 [實作計畫](docs/IMPLEMENTATION_PLAN.md)。

## 專案定位

- 後端 Blade 提供 `/vote/{id}` 頁面外殼。
- 頁面外殼透過 `window.endpoint` 注入 LIFF 與 API 設定。
- 本專案打包後交由後端放入 `public/assets/vote_activities/`。
- 後台管理畫面不在本 repo。

## 指令

```bash
npm install
npm run dev
npm test
npm run build
```

## Runtime config

正式環境由後端注入：

```js
window.endpoint = {
  liffId: '',
  basicId: '',
  lineCrmApiBaseUrl: '',
  voteActivityId: '',
}
```

`is_liff` 不可由外殼注入，必須以活動狀態 API 為單一資料來源。

## 本機預覽

複製 `.env.example` 成 `.env.local` 並填入要測試的活動，即可用真實 API 開發。

若只想檢視各種狀態的畫面（不需後端、不需先湊出對應狀態的活動），
在網址加上 `?mock=` 參數：

| 參數 | 畫面 |
| --- | --- |
| `?mock=ongoing` | 進行中、單選、即時公開 |
| `?mock=multiple` | 進行中、複選上限 2 項 |
| `?mock=private` | 進行中、結果不公開 |
| `?mock=scheduled` | 活動尚未開始 |
| `?mock=ended` | 活動已結束、未投票 |
| `?mock=ended-voted` | 活動已結束、已投票（顯示結果） |
| `?mock=limit` | 已達投票次數上限 |
| `?mock=voted` | 已投過、回訪 |
| `?mock=login` | 需要 LINE 登入 |

再加上 `&screen=vote` 或 `&screen=result` 可直接開到投票頁或結果頁，
不必先從活動首頁點「開始投票」。

預覽模式只在 `npm run dev` 生效，假資料以動態 import 載入，
正式打包後整段連同資料都會被移除，不會進入交給後端的產物。

## 預定實作順序

1. API client 與錯誤模型。
2. 匿名首次載入與條件式 LIFF 登入。
3. Pinia 活動狀態。
4. 活動首頁與投票頁。
5. 完成頁、結果頁與特殊狀態頁。
6. 結果輪詢與完整驗收。
