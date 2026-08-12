/**
 * 초등 Reading Level Test
 * 원본: source/초등_Reading_Level_Test (hwp)
 * 25문항 · 총점 100점 (문항당 4점)
 */

export const TEST_META = {
  id: 'elementary-reading-level-test-v1',
  name: '초등 레벨테스트',
  description: 'AR 1.5~4.3 초등 읽기 진단 25문항 (Reading Level Test)',
  totalQuestions: 25,
  totalMaxScore: 100,
  subject: '영어 읽기',
  schoolDefault: '○○초등학교',
}

export const AREA_CATEGORIES = {
  L12: '초등 1–2 (AR 1.5–2.5)',
  L34: '초등 3–4 (AR 2.5–2.9)',
  L56: '초등 5–6 (AR 3.0–4.3)',
}

export const LEVEL_ORDER = ['초등1-2', '초등3-4', '초등5-6']

const ABCDE = ['A', 'B', 'C', 'D', 'E']
const ABCD = ['A', 'B', 'C', 'D']

function mc(no, level, area, category, difficulty, prompt, choices, answer) {
  return {
    no,
    level,
    area,
    category,
    difficulty,
    maxScore: 4,
    type: 'choice',
    prompt,
    choices,
    answer,
    shortParts: null,
  }
}

function short(no, level, area, category, difficulty, prompt, shortParts, answer) {
  return {
    no,
    level,
    area,
    category,
    difficulty,
    maxScore: 4,
    type: 'short',
    prompt,
    choices: null,
    shortParts,
    answer,
  }
}

export const QUESTIONS = [
  // —— AR 1.5~1.9 · 초등1-2 ——
  mc(1, '초등1-2', '내용 이해 (Pete)', AREA_CATEGORIES.L12, '하',
    'Why does Pete talk to his friends and family?', ABCDE, 'B'),
  mc(2, '초등1-2', '내용 이해 (Pete)', AREA_CATEGORIES.L12, '하',
    'What does Pete do when someone gives him advice?', ABCDE, 'C'),
  mc(3, '초등1-2', '어휘 favorite', AREA_CATEGORIES.L12, '하',
    '지문에 나온 favorite 과 의미가 같은 것을 찾으세요.', ABCDE, 'A'),
  mc(4, '초등1-2', '어휘 wear', AREA_CATEGORIES.L12, '하',
    '지문에 나온 wear 과 의미가 같은 것을 찾으세요.', ABCDE, 'A'),
  short(5, '초등1-2', '서술 – 등장인물', AREA_CATEGORIES.L12, '하',
    'Pete는 누구의 말을 들었나요? 영어 문장으로 쓰세요.',
    ['정답 문장'],
    {
      1: [
        'he listens to his mom, marty, bob, cali, his teacher',
        '@kw:mom|teacher',
        '@kw:marty|bob',
      ],
    }),

  // —— AR 2.0-2.5 · 초등1-2 ——
  mc(6, '초등1-2', '내용 이해 (Froggy)', AREA_CATEGORIES.L12, '하',
    'Why did everybody laugh at Froggy on the bus?', ABCD, 'B'),
  mc(7, '초등1-2', '내용 이해 (Froggy)', AREA_CATEGORIES.L12, '하',
    "Where did Froggy hide on his way to school?", ABCD, 'A'),
  short(8, '초등1-2', '요약 빈칸 (Froggy)', AREA_CATEGORIES.L12, '하',
    '워드뱅크: bus / hide / school / underwear — 빈칸에 알맞은 단어를 넣으세요.',
    ['(1) school', '(2) bus', '(3) underwear', '(4) hide'],
    {
      1: ['school'],
      2: ['bus'],
      3: ['underwear'],
      4: ['hide'],
    }),

  // —— AR 2.5-2.8 · 초등3-4 ——
  mc(9, '초등3-4', '내용 이해 (Henry & Mudge)', AREA_CATEGORIES.L34, '중',
    "Why did Mudge usually enjoy Henry's sick days?", ABCD, 'B'),
  mc(10, '초등3-4', '내용 이해 (Henry & Mudge)', AREA_CATEGORIES.L34, '중',
    'How did Mudge act differently when he was actually sick?', ABCD, 'C'),
  mc(11, '초등3-4', '추론 (Henry & Mudge)', AREA_CATEGORIES.L34, '중',
    'What was the main clue that Mudge was not just pretending to be sick?', ABCD, 'A'),
  short(12, '초등3-4', '요약 빈칸 (Henry & Mudge)', AREA_CATEGORIES.L34, '중',
    'WORD BANK: germs / crackers / sick / routine / morning',
    ['(1) routine', '(2) crackers', '(3) germs', '(4) morning', '(5) sick'],
    {
      1: ['routine'],
      2: ['crackers'],
      3: ['germs'],
      4: ['morning'],
      5: ['sick'],
    }),

  // —— AR 2.8-2.9 · 초등3-4 ——
  mc(13, '초등3-4', '내용 이해 (Mr. Putter)', AREA_CATEGORIES.L34, '중',
    'Why did Mr. Putter catch a cold?', ABCD, 'B'),
  mc(14, '초등3-4', '내용 이해 (Mr. Putter)', AREA_CATEGORIES.L34, '중',
    'Why did Mrs. Teaberry send her dog, Zeke, to Mr. Putter?', ABCD, 'C'),
  short(15, '초등3-4', '요약 빈칸 (Mr. Putter)', AREA_CATEGORIES.L34, '중',
    'word bank: cold / soup / hat / old / neighbor',
    ['(1) cold', '(2) hat', '(3) old', '(4) neighbor', '(5) soup'],
    {
      1: ['cold'],
      2: ['hat'],
      3: ['old'],
      4: ['neighbor'],
      5: ['soup'],
    }),

  // —— AR 3.0 · 초등5-6 ——
  mc(16, '초등5-6', '내용 이해 (Drake)', AREA_CATEGORIES.L56, '중',
    'Why was Drake afraid when the soldier arrived?', ABCD, 'B'),
  mc(17, '초등5-6', '내용 이해 (Drake)', AREA_CATEGORIES.L56, '중',
    'What happened when Drake entered the stone room in the castle?', ABCD, 'C'),
  short(18, '초등5-6', '요약 빈칸 (Drake)', AREA_CATEGORIES.L56, '중',
    'WORD BANK: soldier / chosen / castle / dragon / fireball',
    ['(1) soldier', '(2) chosen', '(3) castle', '(4) dragon', '(5) fireball'],
    {
      1: ['soldier'],
      2: ['chosen'],
      3: ['castle'],
      4: ['dragon'],
      5: ['fireball'],
    }),

  // —— AR 3.3-3.5 · 초등5-6 ——
  mc(19, '초등5-6', '내용 이해 (A.J.)', AREA_CATEGORIES.L56, '중',
    'Why does A.J. think that children do not need to go to school?', ABCDE, 'C'),
  mc(20, '초등5-6', '내용 이해 (A.J.)', AREA_CATEGORIES.L56, '중',
    'Why does A.J. feel better about going to school at the end of the story?', ABCDE, 'B'),
  short(21, '초등5-6', '요약 빈칸 (A.J.)', AREA_CATEGORIES.L56, '중',
    'word bank: bonbons / hates / okay / teacher / television',
    ['(1) television', '(2) teacher', '(3) hates', '(4) bonbons', '(5) okay'],
    {
      1: ['television', 'tv'],
      2: ['teacher'],
      3: ['hates'],
      4: ['bonbons', 'bonbon'],
      5: ['okay', 'ok'],
    }),

  // —— AR 3.8-4.3 · 초등5-6 상 ——
  mc(22, '초등5-6', '내용 이해 (Jack & Annie)', AREA_CATEGORIES.L56, '상',
    'Why does Annie ignore Jack and swim toward the rocky beach?', ABCDE, 'B'),
  mc(23, '초등5-6', '내용 이해 (Jack & Annie)', AREA_CATEGORIES.L56, '상',
    "What is Jack's main reason for not wanting to stop and rest?", ABCDE, 'D'),
  mc(24, '초등5-6', '추론 (Jack & Annie)', AREA_CATEGORIES.L56, '상',
    "How does Jack's behavior change by the end of the passage?", ABCDE, 'C'),
  short(25, '초등5-6', '요약 빈칸 (Jack & Annie)', AREA_CATEGORIES.L56, '상',
    'Word Bank: cave / hurry / play / poem / seals / selky / sleep',
    [
      '(1) cave',
      '(2) poem',
      '(3) selky',
      '(4) seals',
      '(5) play',
      '(6) hurry',
      '(7) sleep',
    ],
    {
      1: ['cave'],
      2: ['poem'],
      3: ['selky'],
      4: ['seals', 'seal'],
      5: ['play'],
      6: ['hurry'],
      7: ['sleep'],
    }),
]
