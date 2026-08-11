# ReadMaster 중등 레벨테스트 · 성적표 생성기

중등 영어 레벨테스트 정답지를 내장한 **자동 채점 + 성적표(PDF/HTML)** 앱입니다.

## 앱 실행

```bash
cd grade-report-generator-2
npm install
npm run dev
```

- 로컬: http://localhost:5173  
- 배포: Netlify (`netlify.toml` → `grade-report-generator-2`)

## 주요 기능

- 20문항 답안 입력 · 자동 채점 (100점)
- 정답/부분/오답 표시
- 학년 수준 · 상·중·하 진단
- grade-report-studio 스타일 A4 성적표
- AI 피드백 (OpenAI GPT-4o mini / Gemini 2.5 Flash / Claude Haiku)

## 소스

- `source/` — 원본 시험지 (hwpx, md, txt)
- `grade-report-generator-2/` — Vite + React 앱
- `.grok/skills/harness/` — harness 메타 스킬
