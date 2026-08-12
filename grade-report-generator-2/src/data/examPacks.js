import {
  TEST_META as middleMeta,
  QUESTIONS as middleQuestions,
} from './middleSchoolLevelTest.js'
import {
  TEST_META as elemMeta,
  QUESTIONS as elemQuestions,
  LEVEL_ORDER as elemLevels,
} from './elementaryReadingLevelTest.js'
import {
  gradeAll as gradeAllCore,
  createEmptyAnswers as createEmptyCore,
  diagnoseLevel as diagnoseCore,
  fillCorrectAnswers as fillCorrectCore,
} from './grading.js'

const MIDDLE_LEVELS = ['중1', '중2', '중3', '중3-고1']

export const EXAM_PACKS = {
  elementary: {
    id: 'elementary',
    tabLabel: '초등 Reading',
    meta: elemMeta,
    questions: elemQuestions,
    levelOrder: elemLevels,
    gradeAll: (answers) => gradeAllCore(elemQuestions, answers),
    createEmptyAnswers: () => createEmptyCore(elemQuestions),
    diagnoseLevel: (gradeData) => diagnoseCore(gradeData, elemLevels),
    fillCorrect: () => fillCorrectCore(elemQuestions),
  },
  middle: {
    id: 'middle',
    tabLabel: '중등 레벨테스트',
    meta: middleMeta,
    questions: middleQuestions,
    levelOrder: MIDDLE_LEVELS,
    gradeAll: (answers) => gradeAllCore(middleQuestions, answers),
    createEmptyAnswers: () => createEmptyCore(middleQuestions),
    diagnoseLevel: (gradeData) => {
      // 중3-고1 → 중3 밴드로 묶지 않고 표기 유지; 추천 시 순서 사용
      const mapped = gradeData.map((g) => ({
        ...g,
        level: g.level.startsWith('중3') ? '중3' : g.level,
      }))
      return diagnoseCore(mapped, ['중1', '중2', '중3'])
    },
    fillCorrect: () => fillCorrectCore(middleQuestions),
  },
}

export const EXAM_ORDER = ['elementary', 'middle']

export function getExamPack(id) {
  return EXAM_PACKS[id] || EXAM_PACKS.middle
}
