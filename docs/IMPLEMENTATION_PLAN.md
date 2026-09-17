# AGO-460 實作計畫

## 來源

- Jira：AGO-460 前端、AGO-461 後端
- Figma：`UwHs0y2RuFGGFUM3yXQue6`，節點 `3880:9009`
- API 契約：`vote-activity-integration.md`
- LIFF 架構參考：`points-lottery`

## 跨 repo 順序

1. 在 `aitago-admin-frontend-v2` 建立後台 API wrapper、transforms 與單元測試。
2. 實作後台列表與新增／編輯 MVP，產生可供 LIFF 測試的真實活動。
3. 在本 repo 建立 LIFF API client、錯誤模型與啟動狀態機。
4. 實作 LIFF 活動首頁、投票、完成、結果與特殊狀態頁。
5. 回到後台補齊發布後鎖定、複製、中止、成效與 ZIP 匯出。
6. 執行後台、一般瀏覽器及 LINE LIFF 的完整整合驗收。

## LIFF 實作順序

1. 封裝活動狀態、送出投票及結果輪詢三支 API。
2. 首次不帶 token 取得活動；只有 `login_required` 才初始化 LIFF 並重試。
3. 建立 Pinia store，集中管理 activity、items、phase、viewer、result 與送出狀態。
4. 完成共用 Navbar、Banner、Loading 與錯誤畫面。
5. 實作活動首頁。
6. 實作文字、圖片、圖文及開放輸入四種選項。
7. 實作單選、複選上限、必填文字及送出防重複。
8. 實作投票完成與結果畫面，優先使用送出 response 的結果。
9. 實作尚未開始、已結束未參與、已投過及頻率限制畫面。
10. 最後加入至少 5 秒的即時結果輪詢。

## 驗收重點

- 前台不自行用手機時間推導 phase。
- request 不傳 `line_user_id`。
- 匿名活動不觸發 LIFF 登入。
- 四種結果揭露模式皆符合後端矩陣。
- 匿名 `after_vote` 只保證送出成功當次看得到結果。
- HTTP 401、404、422、429 均有明確狀態或可重試提示。
