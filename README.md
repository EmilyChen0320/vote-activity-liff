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

## 預定實作順序

1. API client 與錯誤模型。
2. 匿名首次載入與條件式 LIFF 登入。
3. Pinia 活動狀態。
4. 活動首頁與投票頁。
5. 完成頁、結果頁與特殊狀態頁。
6. 結果輪詢與完整驗收。
