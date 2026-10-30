# 성적표 스튜디오 카탈로그 (A4 · 8페이지)

성적표 출력 스튜디오(grade-report-studio-reasonofmoon.netlify.app)와 이 저장소의 레벨테스트 성적표 스튜디오를 함께 소개하는 카탈로그입니다.

- `Grade Report Studio Catalog.dc.html` : 카탈로그 원본 (doc-page / image-slot 컴포넌트, Industry 디자인 시스템 `_ds/`)
- `Grade Report Studio Catalog.pdf` : 인쇄·배포용 PDF (GIF는 대표 프레임으로 출력)
- `assets-report/` : 화면 캡처, GIF 2종(양식 전환 · 레벨테스트 채점 흐름), 스튜디오 QR

레벨테스트 스튜디오 화면은 로컬 실행(`npm run dev`)으로 샘플 답안을 넣어 캡처했고, 학원명은 `DEMO ACADEMY`로 바꿔 찍었습니다. 학생 정보는 예시입니다.

## 미리보기

```bash
cd docs/catalog
python -m http.server 8099
# http://localhost:8099/Grade%20Report%20Studio%20Catalog.dc.html
```
