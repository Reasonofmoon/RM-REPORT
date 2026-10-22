/**
 * 초등 Reading Level Test
 * 원본: source/초등_Reading_Level_Test (hwp)
 * 33문항 · 총점 100점 (일반 문항 3점 × 32 + 25번 종합 요약 4점 = 100점)
 * AR 1.5 ~ AR 7.0 (초등 1-2 ~ 중등 1-3)
 */

export const TEST_META = {
  id: 'elementary-reading-level-test-v2',
  name: '초등 레벨테스트',
  description: 'AR 1.5~7.0 초등·중등 읽기 진단 33문항 (Reading Level Test)',
  totalQuestions: 33,
  totalMaxScore: 100,
  subject: '영어 읽기',
  schoolDefault: '○○초등학교',
}

export const AREA_CATEGORIES = {
  L12: '초등 1–2 (AR 1.5–2.5)',
  L34: '초등 3–4 (AR 2.5–2.9)',
  L56: '초등 5–6 (AR 3.0–5.0)',
  M13: '중등 1–3 (AR 7.0)',
}

export const LEVEL_ORDER = ['초등1-2', '초등3-4', '초등5-6', '중등1-3']

const ABCDE = ['A', 'B', 'C', 'D', 'E']
const ABCD = ['A', 'B', 'C', 'D']
const CIRCLED_5 = ['①', '②', '③', '④', '⑤']

function mc(no, level, area, category, difficulty, prompt, choices, answer, maxScore = 3) {
  return {
    no,
    level,
    area,
    category,
    difficulty,
    maxScore,
    type: 'choice',
    prompt,
    choices,
    answer,
    shortParts: null,
  }
}

function short(no, level, area, category, difficulty, prompt, shortParts, answer, maxScore = 3) {
  return {
    no,
    level,
    area,
    category,
    difficulty,
    maxScore,
    type: 'short',
    prompt,
    choices: null,
    shortParts,
    answer,
  }
}

export const QUESTIONS = [
  // —— AR 1.5~1.9 · 초등1-2 (Pete the Cat: Too Cool for School) ——
  mc(1, '초등1-2', '내용 이해 (Pete · AR 1.5)', AREA_CATEGORIES.L12, '하',
    'Why does Pete talk to his friends and family?', ABCDE, 'B'),
  mc(2, '초등1-2', '내용 이해 (Pete · AR 1.5)', AREA_CATEGORIES.L12, '하',
    'What does Pete do when someone gives him advice?', ABCDE, 'C'),
  mc(3, '초등1-2', '어휘 favorite (AR 1.5)', AREA_CATEGORIES.L12, '하',
    '지문에 나온 favorite 과 의미가 같은 것을 찾으세요.', ABCDE, 'A'),
  mc(4, '초등1-2', '어휘 wear (AR 1.5)', AREA_CATEGORIES.L12, '하',
    '지문에 나온 wear 과 의미가 같은 것을 찾으세요.', ABCDE, 'A'),
  short(5, '초등1-2', '서술 – 등장인물 (AR 1.5)', AREA_CATEGORIES.L12, '하',
    'Pete는 누구의 말을 들었나요? 영어 문장으로 차례대로 써보세요.',
    ['정답 문장'],
    {
      1: [
        'he listens to his mom, marty, bob, cali, his teacher',
        '@kw:mom|teacher',
        '@kw:marty|bob',
      ],
    }),

  // —— AR 2.0-2.5 · 초등1-2 (Froggy Goes to School) ——
  mc(6, '초등1-2', '내용 이해 (Froggy · AR 2.0)', AREA_CATEGORIES.L12, '하',
    'Why did everybody laugh at Froggy on the bus?', ABCD, 'B'),
  mc(7, '초등1-2', '내용 이해 (Froggy · AR 2.0)', AREA_CATEGORIES.L12, '하',
    'Where did Froggy hide on his way to school?', ABCD, 'A'),
  short(8, '초등1-2', '요약 빈칸 (Froggy · AR 2.0)', AREA_CATEGORIES.L12, '하',
    '워드뱅크: bus / hide / school / underwear — 빈칸에 알맞은 단어를 넣으세요.',
    ['(1) school', '(2) bus', '(3) underwear', '(4) hide'],
    {
      1: ['school'],
      2: ['bus'],
      3: ['underwear'],
      4: ['hide'],
    }),

  // —— AR 2.5-2.8 · 초등3-4 (Henry and Mudge) ——
  mc(9, '초등3-4', '내용 이해 (Henry & Mudge · AR 2.5)', AREA_CATEGORIES.L34, '하-중',
    "Why did Mudge usually enjoy Henry's sick days?", ABCD, 'B'),
  mc(10, '초등3-4', '내용 이해 (Henry & Mudge · AR 2.5)', AREA_CATEGORIES.L34, '하-중',
    'How did Mudge act differently when he was actually sick?', ABCD, 'C'),
  mc(11, '초등3-4', '추론 (Henry & Mudge · AR 2.5)', AREA_CATEGORIES.L34, '하-중',
    'What was the main clue that Mudge was not just pretending to be sick?', ABCD, 'A'),
  short(12, '초등3-4', '요약 빈칸 (Henry & Mudge · AR 2.5)', AREA_CATEGORIES.L34, '하-중',
    'WORD BANK: germs / crackers / sick / routine / morning',
    ['(1) routine', '(2) crackers', '(3) germs', '(4) morning', '(5) sick'],
    {
      1: ['routine'],
      2: ['crackers'],
      3: ['germs'],
      4: ['morning'],
      5: ['sick'],
    }),

  // —— AR 2.8-2.9 · 초등3-4 (Mr. Putter and Tabby) ——
  mc(13, '초등3-4', '내용 이해 (Mr. Putter · AR 2.8)', AREA_CATEGORIES.L34, '하-중',
    'Why did Mr. Putter catch a cold?', ABCD, 'B'),
  mc(14, '초등3-4', '내용 이해 (Mr. Putter · AR 2.8)', AREA_CATEGORIES.L34, '하-중',
    'Why did Mrs. Teaberry send her dog, Zeke, to Mr. Putter?', ABCD, 'C'),
  short(15, '초등3-4', '요약 빈칸 (Mr. Putter · AR 2.8)', AREA_CATEGORIES.L34, '하-중',
    'word bank: cold / soup / hat / old / neighbor',
    ['(1) cold', '(2) hat', '(3) old', '(4) neighbor', '(5) soup'],
    {
      1: ['cold'],
      2: ['hat'],
      3: ['old'],
      4: ['neighbor'],
      5: ['soup'],
    }),

  // —— AR 3.0 · 초등5-6 (Dragon Masters) ——
  mc(16, '초등5-6', '내용 이해 (Drake · AR 3.0)', AREA_CATEGORIES.L56, '중',
    'Why was Drake afraid when the soldier arrived?', ABCD, 'B'),
  mc(17, '초등5-6', '내용 이해 (Drake · AR 3.0)', AREA_CATEGORIES.L56, '중',
    'What happened when Drake entered the stone room in the castle?', ABCD, 'C'),
  short(18, '초등5-6', '요약 빈칸 (Drake · AR 3.0)', AREA_CATEGORIES.L56, '중',
    'WORD BANK: soldier / chosen / castle / dragon / fireball',
    ['(1) soldier', '(2) chosen', '(3) castle', '(4) dragon', '(5) fireball'],
    {
      1: ['soldier'],
      2: ['chosen'],
      3: ['castle'],
      4: ['dragon'],
      5: ['fireball'],
    }),

  // —— AR 3.3-3.5 · 초등5-6 (My Weird School) ——
  mc(19, '초등5-6', '내용 이해 (A.J. · AR 3.5)', AREA_CATEGORIES.L56, '중',
    'Why does A.J. think that children do not need to go to school?', ABCDE, 'C'),
  mc(20, '초등5-6', '내용 이해 (A.J. · AR 3.5)', AREA_CATEGORIES.L56, '중',
    'Why does A.J. feel better about going to school at the end of the story?', ABCDE, 'B'),
  short(21, '초등5-6', '요약 빈칸 (A.J. · AR 3.5)', AREA_CATEGORIES.L56, '중',
    'word bank: bonbons / hates / okay / teacher / television',
    ['(1) television', '(2) teacher', '(3) hates', '(4) bonbons', '(5) okay'],
    {
      1: ['television', 'tv'],
      2: ['teacher'],
      3: ['hates'],
      4: ['bonbons', 'bonbon'],
      5: ['okay', 'ok'],
    }),

  // —— AR 3.8-4.3 · 초등5-6 상 (Magic Tree House Merlin Mission) ——
  mc(22, '초등5-6', '내용 이해 (Jack & Annie · AR 4.2)', AREA_CATEGORIES.L56, '상',
    'Why does Annie ignore Jack and swim toward the rocky beach?', ABCDE, 'B'),
  mc(23, '초등5-6', '내용 이해 (Jack & Annie · AR 4.2)', AREA_CATEGORIES.L56, '상',
    "What is Jack's main reason for not wanting to stop and rest?", ABCDE, 'D'),
  mc(24, '초등5-6', '추론 (Jack & Annie · AR 4.2)', AREA_CATEGORIES.L56, '상',
    "How does Jack's behavior change by the end of the passage?", ABCDE, 'C'),
  short(25, '초등5-6', '요약 빈칸 (Jack & Annie · AR 4.2)', AREA_CATEGORIES.L56, '상',
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
    },
    4),

  // —— AR 5.0 · 초등5-6 상 (The Story of the World Vol.4: Victoria's England) ——
  mc(26, '초등5-6', '내용 이해 (Victoria · AR 5.0)', AREA_CATEGORIES.L56, '상',
    'Why did Joseph Paxton ask soldiers to march and stamp under the model glass building?', CIRCLED_5, '2'),
  mc(27, '초등5-6', '핵심 목적 (Victoria · AR 5.0)', AREA_CATEGORIES.L56, '상',
    'What was one important purpose of the Great Exhibition?', CIRCLED_5, '3'),
  mc(28, '초등5-6', '태도 추론 (Victoria · AR 5.0)', AREA_CATEGORIES.L56, '상',
    'Which statement best describes the British attitude toward their empire in the passage?', CIRCLED_5, '3'),
  short(29, '초등5-6', '요약 빈칸 (Victoria · AR 5.0)', AREA_CATEGORIES.L56, '상',
    'Word Bank: Crystal Palace / Exhibition / empire / inventions / colonies / powerful / Paxton',
    [
      '(A) Exhibition',
      '(B) Paxton',
      '(C) Crystal Palace',
      '(D) inventions',
      '(E) powerful',
      '(F) colonies',
      '(G) empire',
    ],
    {
      1: ['exhibition', 'great exhibition'],
      2: ['paxton', 'joseph paxton'],
      3: ['crystal palace'],
      4: ['inventions', 'invention'],
      5: ['powerful'],
      6: ['colonies', 'colony'],
      7: ['empire'],
    }),

  // —— AR 7.0 · 중등1-3 상 (Animal Farm) ——
  mc(30, '중등1-3', '내용 이해 (Animal Farm · AR 7.0)', AREA_CATEGORIES.M13, '상',
    'Why does Old Major call the animals together in the barn?', CIRCLED_5, '2'),
  mc(31, '중등1-3', '원인 파악 (Animal Farm · AR 7.0)', AREA_CATEGORIES.M13, '상',
    'According to Old Major, what is the main cause of the animals’ miserable lives?', CIRCLED_5, '3'),
  mc(32, '중등1-3', '핵심 메시지 (Animal Farm · AR 7.0)', AREA_CATEGORIES.M13, '상',
    'Which statement best describes Old Major’s message to the animals?', CIRCLED_5, '4'),
  short(33, '중등1-3', '요약 빈칸 (Animal Farm · AR 7.0)', AREA_CATEGORIES.M13, '상',
    'Word Bank: dream / Rebellion / Man / freedom / comrades / Major / song',
    [
      '(A) Major',
      '(B) Man',
      '(C) Rebellion',
      '(D) comrades',
      '(E) dream',
      '(F) freedom',
      '(G) song',
    ],
    {
      1: ['major', 'old major'],
      2: ['man', 'humans', 'human beings'],
      3: ['rebellion'],
      4: ['comrades', 'comrade'],
      5: ['dream'],
      6: ['freedom'],
      7: ['song'],
    }),
]
