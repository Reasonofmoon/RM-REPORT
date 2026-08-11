/**
 * 중등 영어 레벨테스트 (원본: source/중등_레벨테스트)
 * - 객관식: type 'choice' | 'multi' (복수 정답)
 * - 서술형: type 'short' (부분 점수)
 * 총점 100점 (문항당 기본 5점, 서술형은 배분)
 */

export const TEST_META = {
  id: 'middle-school-level-test-v1',
  name: '중등 영어 레벨테스트',
  description: '중1~중3 문법·독해 진단 20문항',
  totalQuestions: 20,
  totalMaxScore: 100,
}

/** 영역 카테고리 (리포트 레이더 차트용 축) */
export const AREA_CATEGORIES = {
  문법_기초: '문법 (기초)',
  문법_중급: '문법 (중급)',
  문법_고급: '문법 (고급)',
  독해: '독해',
}

/**
 * @typedef {Object} Question
 * @property {number} no
 * @property {string} level - 중1 | 중2 | 중3 | 중3-고1
 * @property {string} area - 세부 영역 라벨
 * @property {string} category - 리포트 집계 카테고리
 * @property {'하'|'중'|'상'} difficulty
 * @property {number} maxScore
 * @property {'choice'|'multi'|'short'} type
 * @property {string} prompt - 문제 요약
 * @property {string[]|null} choices - 보기 (choice/multi)
 * @property {string|string[]|Object} answer - 정답
 * @property {string[]|null} shortParts - short 문항 부분 라벨
 */

export const QUESTIONS = [
  {
    no: 1,
    level: '중1',
    area: 'be동사 현재·과거 시제',
    category: AREA_CATEGORIES.문법_기초,
    difficulty: '하',
    maxScore: 5,
    type: 'choice',
    prompt: '다음 중 대화가 어색한 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '3',
  },
  {
    no: 2,
    level: '중1',
    area: '일반동사 현재 시제',
    category: AREA_CATEGORIES.문법_기초,
    difficulty: '하',
    maxScore: 5,
    type: 'multi',
    prompt: '표의 내용과 일치하지 않는 것을 모두 고르세요. (복수 정답)',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: ['3', '5'],
  },
  {
    no: 3,
    level: '중1',
    area: '현재진행형, 미래시제',
    category: AREA_CATEGORIES.문법_기초,
    difficulty: '중',
    maxScore: 5,
    type: 'choice',
    prompt: '어법상 알맞은 문장끼리 바르게 짝지어진 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '3',
  },
  {
    no: 4,
    level: '중1',
    area: '현재진행형, 미래시제',
    category: AREA_CATEGORIES.문법_기초,
    difficulty: '중',
    maxScore: 5,
    type: 'choice',
    prompt: '어법상 알맞은 문장끼리 바르게 짝지어진 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '2',
  },
  {
    no: 5,
    level: '중1',
    area: '관사 a, an, the',
    category: AREA_CATEGORIES.문법_기초,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 6,
    level: '중1',
    area: '형용사, 부사',
    category: AREA_CATEGORIES.문법_기초,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '두 단어의 관계가 나머지와 다른 하나를 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '1',
  },
  {
    no: 7,
    level: '중2',
    area: '문장의 형식 (2~5형식)',
    category: AREA_CATEGORIES.문법_중급,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '어법상 알맞지 않은 문장을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 8,
    level: '중2',
    area: '문장의 형식 (2~5형식)',
    category: AREA_CATEGORIES.문법_중급,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '어법상 알맞지 않은 문장을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '1',
  },
  {
    no: 9,
    level: '중2',
    area: '수동태',
    category: AREA_CATEGORIES.문법_중급,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '어법상 알맞은 문장끼리 바르게 짝지어진 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 10,
    level: '중3',
    area: '과거완료, 과거시제',
    category: AREA_CATEGORIES.문법_고급,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '미나의 여행 일정표를 보고 알맞지 않은 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 11,
    level: '중3',
    area: 'to부정사',
    category: AREA_CATEGORIES.문법_고급,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '어법상 알맞은 것끼리 바르게 짝지어진 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 12,
    level: '중3',
    area: '분사',
    category: AREA_CATEGORIES.문법_고급,
    difficulty: '중',
    maxScore: 5,
    type: 'choice',
    prompt: '우리말과 일치하도록 빈칸에 알맞은 말을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 13,
    level: '중3',
    area: '관계대명사',
    category: AREA_CATEGORIES.문법_고급,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '어법상 알맞은 것끼리 바르게 짝지어진 것을 고르세요.',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '3',
  },
  {
    no: 14,
    level: '중2',
    area: '동명사',
    category: AREA_CATEGORIES.문법_중급,
    difficulty: '중',
    maxScore: 5,
    type: 'short',
    prompt: '메모를 보고 주어진 단어로 Rachel을 묘사하는 문장을 완성하세요.',
    choices: null,
    shortParts: [
      '(1) guide → guiding',
      '(2) visit → visiting',
      '(3) open → to open',
    ],
    answer: {
      1: ['guiding'],
      2: ['visiting'],
      3: ['to open', 'toopen'],
    },
  },
  {
    no: 15,
    level: '중2',
    area: '접속사 서술형',
    category: AREA_CATEGORIES.문법_중급,
    difficulty: '중',
    maxScore: 5,
    type: 'short',
    prompt: 'when / because를 사용해 문장을 완성하세요.',
    choices: null,
    shortParts: [
      '(1) When I was taking a shower',
      '(2) Because he broke the window',
    ],
    answer: {
      1: [
        'when i was taking a shower',
        'when i was taking a shower.',
      ],
      2: [
        'because he broke the window',
        'because he broke the window.',
      ],
    },
  },
  {
    no: 16,
    level: '중3-고1',
    area: '독해 – 내용일치',
    category: AREA_CATEGORIES.독해,
    difficulty: '중',
    maxScore: 5,
    type: 'choice',
    prompt: 'Golden Raspberry Awards 글의 내용과 일치하지 않는 것은?',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 17,
    level: '중3',
    area: '독해 – 연결어',
    category: AREA_CATEGORIES.독해,
    difficulty: '하',
    maxScore: 5,
    type: 'choice',
    prompt: '빈칸에 들어갈 말로 가장 적절한 것을 고르세요.',
    choices: ['①', '②', '③'],
    answer: '3',
  },
  {
    no: 18,
    level: '중3-고1',
    area: '독해 – 글쓴이의 주장',
    category: AREA_CATEGORIES.독해,
    difficulty: '중',
    maxScore: 5,
    type: 'choice',
    prompt: '글에서 필자가 주장하는 바로 가장 적절한 것은?',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '4',
  },
  {
    no: 19,
    level: '중3-고1',
    area: '독해 – 주제',
    category: AREA_CATEGORIES.독해,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '글의 주제로 가장 적절한 것은?',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '5',
  },
  {
    no: 20,
    level: '중3-고1',
    area: '독해 – 글의 순서',
    category: AREA_CATEGORIES.독해,
    difficulty: '상',
    maxScore: 5,
    type: 'choice',
    prompt: '주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?',
    choices: ['①', '②', '③', '④', '⑤'],
    answer: '2',
  },
]

/** 빈 학생 답안 템플릿 */
export function createEmptyAnswers() {
  const answers = {}
  for (const q of QUESTIONS) {
    if (q.type === 'choice') {
      answers[q.no] = ''
    } else if (q.type === 'multi') {
      answers[q.no] = []
    } else if (q.type === 'short') {
      answers[q.no] = Object.fromEntries(
        Object.keys(q.answer).map((k) => [k, ''])
      )
    }
  }
  return answers
}

function normalizeText(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]+$/g, '')
}

/**
 * 단일 문항 채점
 * @returns {{ correct: 'O'|'X'|'P', score: number, detail?: string }}
 */
export function gradeQuestion(question, studentAnswer) {
  const { type, answer, maxScore } = question

  if (type === 'choice') {
    const sa = String(studentAnswer || '').replace(/[①②③④⑤]/g, '').trim()
    const ok = sa === String(answer)
    return {
      correct: ok ? 'O' : 'X',
      score: ok ? maxScore : 0,
    }
  }

  if (type === 'multi') {
    const expected = [...answer].map(String).sort()
    const got = (Array.isArray(studentAnswer) ? studentAnswer : [])
      .map((x) => String(x).replace(/[①②③④⑤]/g, '').trim())
      .filter(Boolean)
      .sort()
    const ok =
      expected.length === got.length &&
      expected.every((v, i) => v === got[i])
    // 부분점수: 교집합 / 정답 개수
    if (!ok && got.length > 0) {
      const setE = new Set(expected)
      const setG = new Set(got)
      const inter = [...setE].filter((x) => setG.has(x)).length
      const extra = [...setG].filter((x) => !setE.has(x)).length
      const partial = Math.max(0, (inter - extra) / expected.length)
      const score = Math.round(maxScore * partial * 10) / 10
      if (score > 0 && score < maxScore) {
        return { correct: 'P', score, detail: `부분 정답 (${inter}/${expected.length})` }
      }
    }
    return {
      correct: ok ? 'O' : 'X',
      score: ok ? maxScore : 0,
    }
  }

  if (type === 'short') {
    const keys = Object.keys(answer)
    const partScore = maxScore / keys.length
    let earned = 0
    const misses = []
    for (const k of keys) {
      const expectedList = answer[k].map(normalizeText)
      const got = normalizeText(studentAnswer?.[k])
      if (got && expectedList.includes(got)) {
        earned += partScore
      } else {
        misses.push(k)
      }
    }
    earned = Math.round(earned * 10) / 10
    if (earned >= maxScore) return { correct: 'O', score: maxScore }
    if (earned <= 0) return { correct: 'X', score: 0 }
    return {
      correct: 'P',
      score: earned,
      detail: `부분 정답 (미흡: ${misses.join(', ')})`,
    }
  }

  return { correct: 'X', score: 0 }
}

/**
 * 전체 채점 → ReportCard용 gradeData 배열
 */
export function gradeAll(studentAnswers) {
  return QUESTIONS.map((q) => {
    const result = gradeQuestion(q, studentAnswers[q.no])
    return {
      no: q.no,
      correct: result.correct,
      score: result.score,
      maxScore: q.maxScore,
      area: q.category,
      detailArea: q.area,
      difficulty: q.difficulty,
      level: q.level,
      prompt: q.prompt,
      detail: result.detail || '',
    }
  })
}

/** 레벨 진단 (득점 구간 기반 간이 추천) */
export function diagnoseLevel(gradeData) {
  const byLevel = {}
  for (const item of gradeData) {
    const lv = item.level.startsWith('중3') ? '중3' : item.level
    if (!byLevel[lv]) byLevel[lv] = { score: 0, max: 0 }
    byLevel[lv].score += item.score
    byLevel[lv].max += item.maxScore
  }

  const rates = Object.entries(byLevel).map(([level, v]) => ({
    level,
    rate: v.max > 0 ? v.score / v.max : 0,
    score: v.score,
    max: v.max,
  }))

  // 중1→중2→중3 순으로, 70% 미만이면 해당 레벨 추천
  const order = ['중1', '중2', '중3']
  let recommended = '고1 준비'
  for (const lv of order) {
    const found = rates.find((r) => r.level === lv)
    if (!found || found.rate < 0.7) {
      recommended = lv
      break
    }
  }

  return { rates, recommended }
}
