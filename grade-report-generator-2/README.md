# 중등 영어 레벨테스트 성적표 생성기

`grade-report-generator` 기반으로, **중등 영어 레벨테스트 20문항** 정답지를 내장한 채점·분석 앱입니다.

## 기능

- 시험지 20문항 답안 입력 (객관식 / 복수정답 / 서술형 14·15번)
- 자동 채점 (총점 100점, 문항당 5점)
- 영역·난이도·수준(중1/중2/중3) 분석 차트
- 추천 학습 레벨 진단
- **AI 자동 피드백** (가성비 최신 모델)
  - OpenAI: `gpt-4o-mini`
  - Gemini: `gemini-2.5-flash` (폴백: 2.0 Flash)
  - Claude: `claude-haiku-4-5` (폴백: 3.5 Haiku)
- PDF · HTML 성적표 다운로드

## 실행

```bash
cd grade-report-generator-2
npm install
npm run dev
```

브라우저에서 http://localhost:5173 을 엽니다.

## 정답 데이터

`src/data/middleSchoolLevelTest.js` 에 원본 시험지(`source/중등_레벨테스트`) 정답지가 들어 있습니다.

| 번호 | 정답 | 영역 |
|:---:|------|------|
| 1 | 3 | be동사 |
| 2 | 3, 5 | 일반동사 (복수) |
| 3 | 3 | 현재진행·미래 |
| … | … | … |
| 14 | guiding / visiting / to open | 동명사 |
| 15 | When I was taking a shower / Because he broke the window | 접속사 |
| 20 | 2 | 독해 순서 |

## 빠른 확인

1. 학생 이름 입력
2. **샘플 답안** 또는 **전항 정답** 클릭
3. **채점 후 성적표 생성**
4. PDF 다운로드

## 빌드

```bash
npm run build
npm run preview
```
