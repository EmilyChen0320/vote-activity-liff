# vote-activity-liff — AI Agent 專案規範

## 語言

- 一律使用繁體中文（台灣正體）回覆與寫作。
- 技術術語保留英文原文。

## 「init」的專案約定

- 使用者說「先 init」時，只代表初始化專案上下文。
- 先讀本檔、README、package.json、目錄結構、Jira、Figma、API 文件與參考專案。
- 完成檢查後先提出 plan，等待使用者確認。
- 不得因「init」直接建立檔案、安裝依賴或修改程式碼。
- 只有使用者明確要求「建立專案骨架」或「開始實作」才可寫入檔案。

## 專案範圍

- 本 repo 只負責投票活動粉絲端 LIFF。
- 後台管理功能位於 aitago-admin-frontend-v2。
- 後端 API 與 Blade 頁面外殼位於 line-crm。

## 投票活動鐵則

- 第一次呼叫活動狀態 API 不得攜帶 token。
- 只有收到 `viewer.reason = login_required` 才執行 `liff.init` 與登入。
- 前台畫面只能依 `phase`、`viewer.can_vote`、`viewer.reason` 分流，不可用手機時間自行推導。
- 投票 request 不得夾帶 `line_user_id`。
- 投票成功後直接使用該次 response 的 `result`。
- 結果輪詢間隔不得短於 5 秒。

## Commit

- 格式：`type(scope): AGO-460 繁體中文描述`。
- type 限定 `feat`、`fix`、`refactor`、`style`、`perf`、`test`、`chore`、`docs`、`ci`。
- 禁止 emoji、英文描述與 `Co-Authored-By`。
