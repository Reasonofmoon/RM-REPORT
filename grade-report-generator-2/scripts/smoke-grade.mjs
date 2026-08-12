/**
 * 채점 로직 스모크 테스트 (초등 + 중등)
 */
import { EXAM_PACKS } from '../src/data/examPacks.js'
import { gradeQuestion } from '../src/data/grading.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

for (const [id, pack] of Object.entries(EXAM_PACKS)) {
  const perfect = pack.fillCorrect()
  const perfectGrade = pack.gradeAll(perfect)
  const perfectTotal = perfectGrade.reduce((s, g) => s + g.score, 0)
  assert(
    perfectTotal === pack.meta.totalMaxScore,
    `[${id}] 전항 정답 ${pack.meta.totalMaxScore} 기대, 실제 ${perfectTotal}`
  )
  assert(
    perfectGrade.every((g) => g.correct === 'O'),
    `[${id}] 전항 정답이면 모두 O`
  )

  const empty = pack.gradeAll(pack.createEmptyAnswers())
  const emptyTotal = empty.reduce((s, g) => s + g.score, 0)
  assert(emptyTotal === 0, `[${id}] 빈 답안 0점 기대, 실제 ${emptyTotal}`)

  const diag = pack.diagnoseLevel(perfectGrade)
  assert(diag.recommended, `[${id}] 추천 레벨 존재`)
  console.log(`[${id}] OK total=${perfectTotal} recommend=${diag.recommended} n=${pack.questions.length}`)
}

// 중등 Q2 multi partial
const mid = EXAM_PACKS.middle
const q2 = mid.questions.find((q) => q.no === 2)
const partial = gradeQuestion(q2, ['3'])
assert(partial.correct === 'P', '중등 Q2 부분')

// 초등 Q8 short partial
const el = EXAM_PACKS.elementary
const q8 = el.questions.find((q) => q.no === 8)
const p8 = gradeQuestion(q8, { 1: 'school', 2: 'bus', 3: 'wrong', 4: 'hide' })
assert(p8.correct === 'P', '초등 Q8 부분')
assert(p8.score === 3, `초등 Q8 score 3 기대, 실제 ${p8.score}`)

console.log('SMOKE OK all packs')
