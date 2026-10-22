/**
 * 채점 로직 스모크 테스트 (초등 33문항 + 중등 20문항)
 */
import { EXAM_PACKS } from '../src/data/examPacks.js'
import { gradeQuestion } from '../src/data/grading.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

for (const [id, pack] of Object.entries(EXAM_PACKS)) {
  const perfect = pack.fillCorrect()
  const perfectGrade = pack.gradeAll(perfect)
  const perfectTotal = Math.round(perfectGrade.reduce((s, g) => s + g.score, 0) * 10) / 10
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

// 초등 Q8 short partial (3점 만점 4빈칸 → 3/4 정답 시 2.3점)
const el = EXAM_PACKS.elementary
assert(el.questions.length === 33, `초등 33문항 기대, 실제 ${el.questions.length}`)
const q8 = el.questions.find((q) => q.no === 8)
const p8 = gradeQuestion(q8, { 1: 'school', 2: 'bus', 3: 'wrong', 4: 'hide' })
assert(p8.correct === 'P', '초등 Q8 부분')
assert(p8.score === 2.3, `초등 Q8 score 2.3 기대, 실제 ${p8.score}`)

// 초등 신규 문항 Q26~33 검증 (AR 5.0 & AR 7.0)
const q26 = el.questions.find((q) => q.no === 26)
assert(gradeQuestion(q26, '②').correct === 'O', '초등 Q26 원문자 ② 정답 처리')
assert(gradeQuestion(q26, '2').correct === 'O', '초등 Q26 숫자 2 정답 처리')

const q29 = el.questions.find((q) => q.no === 29)
const p29 = gradeQuestion(q29, {
  1: 'Exhibition',
  2: 'Paxton',
  3: 'Crystal Palace',
  4: 'inventions',
  5: 'powerful',
  6: 'colonies',
  7: 'empire',
})
assert(p29.correct === 'O' && p29.score === 3, '초등 Q29 AR 5.0 요약 만점 처리')

const q33 = el.questions.find((q) => q.no === 33)
const p33 = gradeQuestion(q33, {
  1: 'Major',
  2: 'Man',
  3: 'Rebellion',
  4: 'comrades',
  5: 'dream',
  6: 'freedom',
  7: 'song',
})
assert(p33.correct === 'O' && p33.score === 3, '초등 Q33 AR 7.0 요약 만점 처리')

console.log('SMOKE OK all packs')
