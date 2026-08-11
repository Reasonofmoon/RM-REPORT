/**
 * 채점 로직 스모크 테스트 (브라우저 없이)
 */
import {
  QUESTIONS,
  createEmptyAnswers,
  gradeAll,
  gradeQuestion,
  diagnoseLevel,
} from '../src/data/middleSchoolLevelTest.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

// 전항 정답
const perfect = createEmptyAnswers()
for (const q of QUESTIONS) {
  if (q.type === 'choice') perfect[q.no] = String(q.answer)
  else if (q.type === 'multi') perfect[q.no] = [...q.answer]
  else if (q.type === 'short') {
    perfect[q.no] = Object.fromEntries(
      Object.entries(q.answer).map(([k, list]) => [k, list[0]])
    )
  }
}
const perfectGrade = gradeAll(perfect)
const perfectTotal = perfectGrade.reduce((s, g) => s + g.score, 0)
assert(perfectTotal === 100, `전항 정답 총점 100 기대, 실제 ${perfectTotal}`)
assert(perfectGrade.every((g) => g.correct === 'O'), '전항 정답이면 모두 O')

// 빈 답안
const empty = gradeAll(createEmptyAnswers())
const emptyTotal = empty.reduce((s, g) => s + g.score, 0)
assert(emptyTotal === 0, `빈 답안 0점 기대, 실제 ${emptyTotal}`)

// Q2 부분 점수
const q2 = QUESTIONS.find((q) => q.no === 2)
const partial = gradeQuestion(q2, ['3'])
assert(partial.correct === 'P', 'Q2 하나만 맞으면 부분')
assert(partial.score > 0 && partial.score < 5, `Q2 부분 점수 기대, 실제 ${partial.score}`)

// Q14 부분
const q14 = QUESTIONS.find((q) => q.no === 14)
const p14 = gradeQuestion(q14, { 1: 'guiding', 2: 'wrong', 3: 'to open' })
assert(p14.correct === 'P', 'Q14 부분')
assert(Math.abs(p14.score - (10 / 3)) < 0.2 || Math.abs(p14.score - 3.3) < 0.2 || Math.abs(p14.score - 3.33) < 0.2, `Q14 score ~3.3 got ${p14.score}`)

const diag = diagnoseLevel(perfectGrade)
assert(diag.recommended, '추천 레벨 존재')

console.log('SMOKE OK')
console.log('  perfect total:', perfectTotal)
console.log('  Q2 partial:', partial)
console.log('  Q14 partial:', p14)
console.log('  recommend:', diag.recommended)
console.log('  questions:', QUESTIONS.length)
