/**
 * 공통 채점 유틸 (초등/중등 시험 팩 공유)
 */

export function normalizeChoice(v) {
  return String(v || '')
    .trim()
    .toUpperCase()
    .replace(/[①1]/g, '1')
    .replace(/[②2]/g, '2')
    .replace(/[③3]/g, '3')
    .replace(/[④4]/g, '4')
    .replace(/[⑤5]/g, '5')
    .replace(/^([A-E])$/, (_, c) => c)
}

export function normalizeText(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]+$/g, '')
}

/**
 * @param {object} question
 * @param {*} studentAnswer
 */
export function gradeQuestion(question, studentAnswer) {
  const { type, answer, maxScore } = question

  if (type === 'choice') {
    const sa = normalizeChoice(studentAnswer)
    const expected = normalizeChoice(answer)
    // letter vs number: map A->1 ... E->5 if needed
    const letterToNum = { A: '1', B: '2', C: '3', D: '4', E: '5' }
    const numToLetter = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' }
    const ok =
      sa === expected ||
      letterToNum[sa] === expected ||
      numToLetter[sa] === expected ||
      letterToNum[expected] === sa ||
      numToLetter[expected] === sa
    return { correct: ok ? 'O' : 'X', score: ok ? maxScore : 0 }
  }

  if (type === 'multi') {
    const expected = [...answer].map((x) => normalizeChoice(x)).sort()
    const got = (Array.isArray(studentAnswer) ? studentAnswer : [])
      .map(normalizeChoice)
      .filter(Boolean)
      .sort()
    const ok =
      expected.length === got.length && expected.every((v, i) => v === got[i])
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
    return { correct: ok ? 'O' : 'X', score: ok ? maxScore : 0 }
  }

  if (type === 'short') {
    const keys = Object.keys(answer)
    const partScore = maxScore / keys.length
    let earned = 0
    const misses = []
    for (const k of keys) {
      const expectedList = (Array.isArray(answer[k]) ? answer[k] : [answer[k]]).map(
        normalizeText
      )
      const got = normalizeText(studentAnswer?.[k])
      // keyword mode: if any expected starts with '@kw:' match includes
      let hit = false
      if (got) {
        for (const exp of expectedList) {
          if (exp.startsWith('@kw:')) {
            const kws = exp.slice(4).split('|')
            if (kws.every((kw) => got.includes(kw))) {
              hit = true
              break
            }
          } else if (got === exp || got.includes(exp) || exp.includes(got)) {
            hit = true
            break
          }
        }
      }
      if (hit) earned += partScore
      else misses.push(k)
    }
    earned = Math.round(earned * 10) / 10
    if (earned >= maxScore - 0.05) return { correct: 'O', score: maxScore }
    if (earned <= 0) return { correct: 'X', score: 0 }
    return {
      correct: 'P',
      score: earned,
      detail: `부분 정답 (미흡: ${misses.join(', ')})`,
    }
  }

  return { correct: 'X', score: 0 }
}

export function gradeAll(questions, studentAnswers) {
  return questions.map((q) => {
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

export function createEmptyAnswers(questions) {
  const answers = {}
  for (const q of questions) {
    if (q.type === 'choice') answers[q.no] = ''
    else if (q.type === 'multi') answers[q.no] = []
    else if (q.type === 'short') {
      answers[q.no] = Object.fromEntries(Object.keys(q.answer).map((k) => [k, '']))
    }
  }
  return answers
}

/**
 * 수준 밴드 순서로 70% 미만이면 해당 레벨 추천
 * @param {Array} gradeData
 * @param {string[]} levelOrder
 */
export function diagnoseLevel(gradeData, levelOrder) {
  const byLevel = {}
  for (const item of gradeData) {
    const lv = item.level
    if (!byLevel[lv]) byLevel[lv] = { score: 0, max: 0 }
    byLevel[lv].score += item.score
    byLevel[lv].max += item.maxScore
  }

  const rates = (levelOrder || Object.keys(byLevel)).map((level) => {
    const v = byLevel[level] || { score: 0, max: 0 }
    return {
      level,
      rate: v.max > 0 ? v.score / v.max : 0,
      score: v.score,
      max: v.max,
    }
  })

  let recommended = levelOrder?.[levelOrder.length - 1] || '완료'
  for (const lv of levelOrder || []) {
    const found = rates.find((r) => r.level === lv)
    if (!found || found.rate < 0.7) {
      recommended = lv
      break
    }
  }
  // all passed
  if (levelOrder && rates.every((r) => r.rate >= 0.7)) {
    recommended = `${levelOrder[levelOrder.length - 1]} 이상`
  }

  return { rates, recommended }
}

export function fillCorrectAnswers(questions) {
  const next = createEmptyAnswers(questions)
  for (const q of questions) {
    if (q.type === 'choice') next[q.no] = String(q.answer)
    else if (q.type === 'multi') next[q.no] = [...q.answer]
    else if (q.type === 'short') {
      next[q.no] = Object.fromEntries(
        Object.entries(q.answer).map(([k, list]) => [
          k,
          Array.isArray(list) ? list[0].replace(/^@kw:/, '').split('|')[0] : list,
        ])
      )
    }
  }
  return next
}
