import mockCover from '../assets/images/result-banner-default.webp'

const activity = {
  name: '請世界吃桌-雪梨站菜品票選',
  description:
    '節目由隋棠、藍正龍、浩子、陳隨意與美食 YouTuber 千千五位主持人組成「辦桌台灣隊」，' +
    '在總舖師林明燦（阿燦師）、蔡瑞成（大頭師）、洪俊男（阿男師）指導下接受廚藝與辦桌訓練，' +
    '並前往澳洲雪梨歌劇院，為你心中的表現最佳者投下一票',
  cover_image: mockCover,
  result_cover_image: '',
  completion_message: '感謝您的參與！',
  vote_mode: 'single',
  max_selections: null,
  vote_frequency: 'unlimited',
  result_visibility: 'realtime',
  is_liff: false,
  start_at: '2026-10-01T02:00:00.000000Z',
  end_at: '2026-10-31T16:00:00.000000Z',
}

const items = [
  { id: 'a', type: 'image_text', title: '雪梨站-龍王赴宴聚寶盆', subtitle: '首站雪梨場人氣第一菜品', image: '', sort: 1 },
  { id: 'b', type: 'text', title: '雪梨站-臺灣櫻花蝦米糕', subtitle: '首站雪梨場人氣第二', image: '', sort: 2 },
  { id: 'c', type: 'text', title: '沙茶蜜香雞', subtitle: '', image: '', sort: 3 },
  { id: 'd', type: 'open_text', title: '想說些什麼？', subtitle: '請謹慎留言，避免不當言論', required: false, sort: 4 },
]

const result = {
  total_votes: 3204,
  items: [
    { id: 'a', title: '雪梨站-龍王赴宴聚寶盆', type: 'image_text', image: '', sort: 1, votes: 1540, percentage: 48.07, rank: 1 },
    { id: 'b', title: '雪梨站-臺灣櫻花蝦米糕', type: 'text', image: '', sort: 2, votes: 1024, percentage: 31.96, rank: 2 },
    { id: 'c', title: '沙茶蜜香雞', type: 'text', image: '', sort: 3, votes: 640, percentage: 19.97, rank: 3 },
  ],
}

const viewer = (extra = {}) => ({
  authenticated: false,
  can_vote: false,
  reason: null,
  has_voted: false,
  voted_count: 0,
  next_votable_at: null,
  ...extra,
})

const scenarios = {
  ongoing: { activity, items, phase: 'ongoing', viewer: viewer({ can_vote: true }), result },
  multiple: {
    activity: { ...activity, vote_mode: 'multiple', max_selections: 2 },
    items,
    phase: 'ongoing',
    viewer: viewer({ can_vote: true }),
    result,
  },
  private: {
    activity: { ...activity, result_visibility: 'private' },
    items,
    phase: 'ongoing',
    viewer: viewer({ can_vote: true }),
  },
  scheduled: { activity, items, phase: 'scheduled', viewer: viewer({ reason: 'not_started' }) },
  ended: { activity, items, phase: 'ended', viewer: viewer({ reason: 'ended' }) },
  'ended-voted': {
    activity,
    items,
    phase: 'ended',
    viewer: viewer({ reason: 'ended', has_voted: true, voted_count: 1 }),
    result,
  },
  limit: {
    activity: { ...activity, vote_frequency: 'daily_once' },
    items,
    phase: 'ongoing',
    viewer: viewer({
      reason: 'frequency_limit_reached',
      has_voted: true,
      voted_count: 1,
      next_votable_at: '2026-10-02T16:00:00.000000Z',
    }),
  },
  'limit-once': {
    activity: { ...activity, vote_frequency: 'once_per_activity' },
    items,
    phase: 'ongoing',
    viewer: viewer({ can_vote: true }),
    result,
  },
  'limit-daily': {
    activity: { ...activity, vote_frequency: 'daily_once' },
    items,
    phase: 'ongoing',
    viewer: viewer({ can_vote: true }),
    result,
  },
  'limit-custom': {
    activity: { ...activity, vote_frequency: 'custom', frequency_limit: 3 },
    items,
    phase: 'ongoing',
    viewer: viewer({ can_vote: true }),
    result,
  },
  voted: {
    activity,
    items,
    phase: 'ongoing',
    viewer: viewer({ has_voted: true, voted_count: 1 }),
    result,
    // 預覽用：實際情況下這份資料來自本機記錄
    votedItemTitles: ['雪梨站-龍王赴宴聚寶盆'],
  },
  login: {
    activity: { ...activity, is_liff: true },
    items,
    phase: 'ongoing',
    viewer: viewer({ reason: 'login_required' }),
  },
}

export const getDevMockScenario = () => {
  // node 測試環境沒有 import.meta.env，用 optional chaining 避免存取錯誤
  if (!import.meta.env?.DEV || typeof window === 'undefined') {
    return ''
  }
  return new URLSearchParams(window.location.search).get('mock') ?? ''
}

/**
 * 取得假資料回應
 * @param {string} path - API 路徑（'' 為活動狀態、'/vote' 為送出投票、'/result' 為結果輪詢）
 * @returns {Object|null} 對應的假資料，未啟用時為 null
 */
/**
 * 取得假資料回應
 * @param {string} name - 情境名稱
 * @param {string} path - API 路徑（'' 活動狀態、'/vote' 送出投票、'/result' 結果輪詢）
 * @returns {Object|null} 對應的假資料，情境不存在時為 null
 */
export const getDevMockResponse = (name, path = '') => {
  const scenario = scenarios[name]
  if (!scenario) {
    return null
  }

  if (path === '/vote') {
    return { message: '投票成功', result: scenario.result ?? result }
  }

  if (path === '/result') {
    const disclosed = Boolean(scenario.result)
    return { phase: scenario.phase, disclosed, result: disclosed ? scenario.result : null }
  }

  return scenario
}

export const DEV_MOCK_SCENARIOS = Object.keys(scenarios)
