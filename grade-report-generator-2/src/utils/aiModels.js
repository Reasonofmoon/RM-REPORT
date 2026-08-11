/**
 * 가성비 중심 최신 모델 설정 (2026 기준 조사)
 *
 * 선택 기준:
 * - OpenAI: GPT-4o mini — 품질 대비 가격 균형이 가장 좋음
 * - Gemini: 2.5 Flash — 저렴 + 1M 컨텍스트, 피드백 생성에 충분
 * - Claude: Haiku 4.5 계열 — Anthropic 예산 티어, 짧은 피드백에 적합
 *
 * 참고: 가격은 변동될 수 있으므로 UI에는 "가성비 추천"으로만 표기한다.
 */

export const AI_PROVIDERS = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    brand: 'GPT',
    /** 채팅 Completions API 모델 ID */
    model: 'gpt-4o-mini',
    modelLabel: 'GPT-4o mini',
    tier: '가성비 추천',
    priceHint: '입력 ~$0.15 / 출력 ~$0.60 per 1M tokens',
    baseURL: 'https://api.openai.com/v1/chat/completions',
    keyPlaceholder: 'sk-...',
    keyHelp: 'https://platform.openai.com/api-keys',
    envKey: 'VITE_OPENAI_API_KEY',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    brand: 'Gemini',
    model: 'gemini-2.5-flash',
    /** 구버전 계정/리전 대비 폴백 */
    fallbackModels: ['gemini-2.0-flash', 'gemini-1.5-flash'],
    modelLabel: 'Gemini 2.5 Flash',
    tier: '가성비 추천',
    priceHint: 'Flash 계열 — 저렴·고속',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    keyPlaceholder: 'AIza...',
    keyHelp: 'https://aistudio.google.com/apikey',
    envKey: 'VITE_GEMINI_API_KEY',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    brand: 'Claude',
    /** 예산 티어 Haiku (Sonnet 대비 대폭 저렴) */
    model: 'claude-haiku-4-5',
    fallbackModels: ['claude-3-5-haiku-latest', 'claude-3-5-haiku-20241022'],
    modelLabel: 'Claude Haiku 4.5',
    tier: '가성비 추천',
    priceHint: 'Haiku 계열 — Claude 중 최저 단가',
    baseURL: 'https://api.anthropic.com/v1/messages',
    keyPlaceholder: 'sk-ant-...',
    keyHelp: 'https://console.anthropic.com/',
    envKey: 'VITE_ANTHROPIC_API_KEY',
  },
}

export const PROVIDER_ORDER = ['openai', 'gemini', 'anthropic']

export function getProviderConfig(providerId) {
  return AI_PROVIDERS[providerId] || AI_PROVIDERS.openai
}

/** localStorage / env 에서 API 키 해석 */
export function resolveApiKey(providerId, storedKey = '') {
  if (storedKey && storedKey.trim()) return storedKey.trim()
  const cfg = getProviderConfig(providerId)
  try {
    const fromEnv = import.meta.env?.[cfg.envKey]
    if (fromEnv && String(fromEnv).trim()) return String(fromEnv).trim()
  } catch {
    /* ignore */
  }
  return ''
}

export function listProviderOptions() {
  return PROVIDER_ORDER.map((id) => {
    const p = AI_PROVIDERS[id]
    return {
      value: id,
      label: `${p.name} · ${p.modelLabel}`,
      description: `${p.tier} — ${p.priceHint}`,
    }
  })
}
