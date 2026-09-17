import { readFile, writeFile } from 'node:fs/promises'

const indexPath = new URL('../dist/index.html', import.meta.url)
const endpoint = {
  liffId: '2006298318-pWB0BqkM',
  basicId: '',
  oaName: '請世界吃桌',
  lineCrmApiBaseUrl: 'https://feature-line-crm.aitago.tw',
  voteActivityId: '01m2ppns11png1jk9t1em2zqkt',
  enableLiff: true,
}

const html = await readFile(indexPath, 'utf8')
const marker = 'window.endpoint = window.endpoint ?? {'

if (!html.includes(marker)) {
  throw new Error('找不到 window.endpoint 注入位置')
}

const injectedHtml = html.replace(
  /window\.endpoint = window\.endpoint \?\? \{[\s\S]*?\n\s*\}/,
  `window.endpoint = ${JSON.stringify(endpoint, null, 2)}`,
)

await writeFile(indexPath, injectedHtml)
