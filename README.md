# ReadMaster 레벨테스트 · 성적표 스튜디오

초등 Reading Level Test + 중등 영어 레벨테스트를 통합한 **자동 채점 + 성적표(PDF/HTML)** 앱입니다.

## 앱 실행

```bash
cd grade-report-generator-2
npm install
npm run dev
```

- 로컬: http://localhost:5173  
- 저장소: https://github.com/Reasonofmoon/RM-REPORT  
- 배포: Netlify (`netlify.toml` → `grade-report-generator-2`)

## 시험 탭

| 탭 | 문항 | 진단 |
|----|------|------|
| **초등 Reading** | 33문항 · 100점 | 초등1-2 / 3-4 / 5-6 / 중등1-3 (AR 1.5~7.0) |
| **중등 레벨테스트** | 20문항 · 100점 | 중1 / 중2 / 중3 |

## 주요 기능

- 시험별 답안 입력 · 자동 채점 · 정답/부분/오답 표시
- 학년 수준 · 상·중·하 진단
- grade-report-studio 스타일 A4 성적표
- AI 피드백 (OpenAI GPT-4o mini / Gemini 2.5 Flash / Claude Haiku)

## 소스

- `source/` — 원본 시험지 (hwp/hwpx, md, txt)
- `grade-report-generator-2/` — Vite + React 앱
- `.grok/skills/harness/` — harness 메타 스킬
