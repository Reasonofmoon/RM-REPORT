import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button.jsx'
import { Download, FileText, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { AIFeedbackService, generateDefaultFeedback } from '@/utils/aiService.js'
import { diagnoseLevel } from '@/data/middleSchoolLevelTest.js'
import { getProviderConfig } from '@/utils/aiModels.js'
import '@/styles/report-studio.css'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels
)

function analyzeGradeData(data) {
  const totalScore = data.reduce((sum, item) => sum + item.score, 0)
  const totalMaxScore = data.reduce((sum, item) => sum + item.maxScore, 0)
  const percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 1000) / 10 : 0

  const areaAnalysis = {}
  data.forEach((item) => {
    if (!areaAnalysis[item.area]) areaAnalysis[item.area] = { score: 0, maxScore: 0 }
    areaAnalysis[item.area].score += item.score
    areaAnalysis[item.area].maxScore += item.maxScore
  })

  const areaRows = Object.keys(areaAnalysis).map((area) => {
    const { score, maxScore } = areaAnalysis[area]
    const rate = maxScore > 0 ? (score / maxScore) * 100 : 0
    // 기준 평균(클래스 평균 대용): 목표 70%
    const avgRate = 70
    const avgScore = (maxScore * avgRate) / 100
    return {
      area,
      score,
      maxScore,
      rate,
      avgScore,
      avgRate,
      gap: score - avgScore,
    }
  })

  const sorted = [...areaRows].sort((a, b) => b.rate - a.rate)
  const strongRows = sorted.filter((r) => r.rate >= 70).slice(0, 3)
  const weakRows = [...areaRows].sort((a, b) => a.rate - b.rate).slice(0, 3)

  return {
    totalScore,
    totalMaxScore,
    percentage,
    areaRows,
    strongRows: strongRows.length ? strongRows : sorted.slice(0, 1),
    weakRows,
    strongestArea: sorted[0]?.area || '없음',
    weakestArea: [...areaRows].sort((a, b) => a.rate - b.rate)[0]?.area || '없음',
  }
}

/** 총점 기반 등급 + 상중하 성취도 */
function computeBand(percentage) {
  let grade
  if (percentage >= 90) grade = '1등급'
  else if (percentage >= 80) grade = '2등급'
  else if (percentage >= 70) grade = '3등급'
  else if (percentage >= 60) grade = '4등급'
  else if (percentage >= 50) grade = '5등급'
  else grade = '6등급 이하'

  let achievement
  if (percentage >= 80) achievement = '상'
  else if (percentage >= 60) achievement = '중'
  else achievement = '하'

  return { grade, achievement }
}

function resultLabel(correct) {
  if (correct === 'O') return { text: '정답', cls: 'ok' }
  if (correct === 'P') return { text: '부분', cls: 'half' }
  return { text: '오답', cls: 'miss' }
}

const ReportCard = ({
  studentInfo,
  gradeData,
  apiKey,
  provider = 'openai',
  aiMode = true,
}) => {
  const reportRef = useRef(null)
  const [feedback, setFeedback] = useState(null)
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)
  const providerCfg = getProviderConfig(provider)

  const analysis = useMemo(() => analyzeGradeData(gradeData), [gradeData])
  const levelDiagnosis = useMemo(() => diagnoseLevel(gradeData), [gradeData])
  const band = useMemo(() => computeBand(analysis.percentage), [analysis.percentage])

  const generateAIFeedback = async () => {
    setIsGeneratingFeedback(true)
    setFeedbackError(null)
    try {
      if (aiMode && apiKey && apiKey.trim()) {
        const aiService = new AIFeedbackService(apiKey, provider)
        const aiFeedback = await aiService.generateFeedback(
          studentInfo,
          gradeData,
          analysis,
          levelDiagnosis
        )
        setFeedback(aiFeedback)
      } else {
        setFeedback(generateDefaultFeedback(studentInfo, gradeData, analysis, levelDiagnosis))
      }
    } catch (error) {
      console.error('피드백 생성 오류:', error)
      setFeedbackError(error.message)
      setFeedback(generateDefaultFeedback(studentInfo, gradeData, analysis, levelDiagnosis))
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  useEffect(() => {
    generateAIFeedback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentInfo, gradeData, apiKey, provider, aiMode])

  const downloadPDF = async () => {
    if (!reportRef.current) return
    try {
      const pages = reportRef.current.querySelectorAll('.report-page')
      const pdf = new jsPDF('p', 'mm', 'a4')
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        })
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297))
      }
      const fileName = `${studentInfo.name || '성적표'}_${studentInfo.testDate || new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF 생성 중 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다.')
    }
  }

  const downloadHTML = () => {
    if (!reportRef.current) return
    try {
      const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${studentInfo.name || '학생'} - ${studentInfo.testName || '성적표'}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
  <style>
    body { margin: 0; background: #eef1f4; padding: 24px; font-family: Pretendard, 'Noto Sans KR', sans-serif; }
    ${document.querySelector('style')?.innerHTML || ''}
  </style>
</head>
<body>
  <div class="report-studio">${reportRef.current.outerHTML}</div>
</body>
</html>`
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${studentInfo.name || '성적표'}_${studentInfo.testDate || new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('HTML 다운로드 중 오류:', error)
      alert('HTML 다운로드 중 오류가 발생했습니다.')
    }
  }

  const radarData = {
    labels: analysis.areaRows.map((r) => r.area),
    datasets: [
      {
        label: '학생 달성률',
        data: analysis.areaRows.map((r) => Math.round(r.rate * 10) / 10),
        backgroundColor: 'rgba(35, 107, 107, 0.22)',
        borderColor: '#236b6b',
        borderWidth: 2.2,
        pointBackgroundColor: '#236b6b',
        pointBorderColor: '#fff',
      },
      {
        label: '기준 평균',
        data: analysis.areaRows.map(() => 70),
        backgroundColor: 'rgba(148, 163, 184, 0.12)',
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        borderDash: [4, 3],
        pointRadius: 0,
      },
    ],
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, display: '#94a3b8', backdropColor: 'transparent', font: { size: 10 } },
        grid: { color: '#dbe3ec' },
        angleLines: { color: '#e1e8f0' },
        pointLabels: { color: '#475569', font: { size: 11, weight: '600' } },
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
    },
  }

  const wrongOrPartial = gradeData.filter((g) => g.correct !== 'O')
  const planText =
    feedback?.recommendations?.join(' · ') ||
    '약점 영역 개념 정리 후 유사 문항을 반복 연습하세요.'

  const ReportHeader = ({ subtitle }) => (
    <header className="report-header">
      <div className="report-title">
        <span className="title-mark" />
        <div>
          <p>{subtitle}</p>
          <h2>영어 성적 리포트</h2>
        </div>
      </div>
      <div className="report-brand">
        <span className="logo-placeholder">LOGO</span>
        <div>
          <strong>READMASTER</strong>
          <span>정확한 진단과 다음 학습 계획</span>
        </div>
      </div>
    </header>
  )

  const ReportFooter = () => (
    <footer className="report-footer">
      <span>READMASTER · 중등 영어 레벨테스트</span>
      <span>
        템플릿 스타일: grade-report-studio 기반 · {studentInfo.testDate || ''}
      </span>
    </footer>
  )

  return (
    <div className="report-studio">
      <div className="toolbar no-print">
        <Button onClick={downloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          PDF 파일 다운로드
        </Button>
        <Button onClick={downloadHTML} variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          HTML 파일 다운로드
        </Button>
        <Button
          variant="outline"
          onClick={generateAIFeedback}
          disabled={isGeneratingFeedback}
          className="flex items-center gap-2"
        >
          {isGeneratingFeedback ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          분석 다시 생성
        </Button>
        {feedback?._meta && (
          <span className="ai-meta">
            <Sparkles className="w-3.5 h-3.5" />
            {feedback._meta.modelLabel || providerCfg.modelLabel}
          </span>
        )}
      </div>

      <div ref={reportRef} className="report">
        {/* ===== PAGE 1: 정기 평가 진단 ===== */}
        <section className="report-page">
          <ReportHeader subtitle="정기 평가 진단" />

          <div className="student-band">
            <div>
              <span>학생</span>
              <strong>{studentInfo.name || '-'}</strong>
            </div>
            <div>
              <span>학교/학년</span>
              <strong>
                {studentInfo.school || '중학교'} {studentInfo.grade || levelDiagnosis.recommended}
              </strong>
            </div>
            <div>
              <span>반/그룹</span>
              <strong>{studentInfo.group || '-'}</strong>
            </div>
            <div>
              <span>시험명</span>
              <strong>{studentInfo.testName || '중등 영어 레벨테스트'}</strong>
            </div>
            <div>
              <span>시험일</span>
              <strong>{studentInfo.testDate || '-'}</strong>
            </div>
            <div>
              <span>담당</span>
              <strong>{studentInfo.teacher || '담당 선생님'}</strong>
            </div>
          </div>

          <div className="summary-grid">
            <div className="metric-card score">
              <span>총점</span>
              <strong>
                {analysis.totalScore} / {analysis.totalMaxScore}
              </strong>
            </div>
            <div className="metric-card grade">
              <span>등급</span>
              <strong>{band.grade}</strong>
            </div>
            <div className="metric-card rate">
              <span>성취도 (상·중·하)</span>
              <strong>
                {band.achievement} · {analysis.percentage}%
              </strong>
            </div>
            <div className="metric-card gap">
              <span>추천 학습 레벨</span>
              <strong>{levelDiagnosis.recommended}</strong>
            </div>
          </div>

          <section className="report-section split">
            <div>
              <h3>영역별 성적</h3>
              <table className="report-table score-table">
                <thead>
                  <tr>
                    <th>영역</th>
                    <th>만점</th>
                    <th>학생</th>
                    <th>기준</th>
                    <th>달성률</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.areaRows.map((row) => (
                    <tr key={row.area}>
                      <td>{row.area}</td>
                      <td>{row.maxScore}</td>
                      <td>{row.score}</td>
                      <td>{row.avgScore.toFixed(1)}</td>
                      <td>
                        <span className="mini-bar">
                          <i style={{ width: `${Math.min(100, row.rate)}%` }} />
                        </span>
                        <b>{row.rate.toFixed(1)}%</b>
                        <em>
                          {row.gap >= 0 ? '+' : ''}
                          {row.gap.toFixed(1)}
                        </em>
                      </td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td>합계</td>
                    <td>{analysis.totalMaxScore}</td>
                    <td>{analysis.totalScore}</td>
                    <td>{(analysis.totalMaxScore * 0.7).toFixed(1)}</td>
                    <td>{analysis.percentage}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="analysis-panel">
              <h3>성취 프로파일</h3>
              <div className="chart-box">
                <Radar data={radarData} options={radarOptions} />
              </div>
              <div className="profile-list">
                <p>
                  <b>강점</b>{' '}
                  {analysis.strongRows.map((r) => r.area).join(', ') || analysis.strongestArea}
                </p>
                <p>
                  <b>우선 보완</b>{' '}
                  {analysis.weakRows.map((r) => r.area).join(', ') || analysis.weakestArea}
                </p>
              </div>
            </div>
          </section>

          <section className="report-section">
            <h3>영역별 격차 진단</h3>
            <div className="bar-list">
              {analysis.areaRows.map((row) => (
                <div className="bar-item" key={row.area}>
                  <div>
                    <strong>{row.area}</strong>
                    <span>
                      학생 {row.rate.toFixed(1)}% · 기준 {row.avgRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="bar-track">
                    <i
                      className="student-bar"
                      style={{ width: `${Math.min(100, row.rate).toFixed(1)}%` }}
                    />
                    <i
                      className="avg-marker"
                      style={{ left: `${Math.min(100, row.avgRate).toFixed(1)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section">
            <h3>학년 수준 진단</h3>
            <div className="level-chips">
              {levelDiagnosis.rates.map((r) => (
                <span className="level-chip" key={r.level}>
                  {r.level}
                  <b>{Math.round(r.rate * 100)}%</b>
                  <span>
                    (
                    {r.rate >= 0.8 ? '상' : r.rate >= 0.6 ? '중' : '하'}
                    )
                  </span>
                </span>
              ))}
              <span className="level-chip">
                종합 추천
                <b>{levelDiagnosis.recommended}</b>
                <span>({band.achievement})</span>
              </span>
            </div>
          </section>

          <ReportFooter />
        </section>

        {/* ===== PAGE 2: 세부 피드백 ===== */}
        <section className="report-page">
          <ReportHeader subtitle="세부 피드백" />

          <section className="report-section split top-align">
            <div>
              <h3>오답·부분점수 분석</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>번호</th>
                    <th style={{ width: '18%' }}>유형</th>
                    <th style={{ width: '14%' }}>결과</th>
                    <th style={{ width: '14%' }}>배점</th>
                    <th>메모</th>
                  </tr>
                </thead>
                <tbody>
                  {(wrongOrPartial.length ? wrongOrPartial : gradeData.slice(0, 8)).map((row) => {
                    const pill = resultLabel(row.correct)
                    return (
                      <tr key={row.no}>
                        <td>{row.no}</td>
                        <td>{row.detailArea || row.area}</td>
                        <td>
                          <span className={`result-pill ${pill.cls}`}>{pill.text}</span>
                        </td>
                        <td>
                          {row.score}/{row.maxScore}
                        </td>
                        <td className="left">
                          {row.detail ||
                            `${row.level} · 난이도 ${row.difficulty}${
                              row.correct === 'O' ? ' · 정답' : ''
                            }`}
                        </td>
                      </tr>
                    )
                  })}
                  {!wrongOrPartial.length && (
                    <tr>
                      <td colSpan={5}>전 문항 정답입니다. 오답 기록이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="analysis-panel">
              <h3>문항 요약</h3>
              <div className="profile-list">
                <p>
                  <b>현재</b> {analysis.totalScore}점 ({analysis.percentage}%)
                </p>
                <p>
                  <b>정답</b> {gradeData.filter((g) => g.correct === 'O').length}문항
                </p>
                <p>
                  <b>부분</b> {gradeData.filter((g) => g.correct === 'P').length}문항
                </p>
                <p>
                  <b>오답</b> {gradeData.filter((g) => g.correct === 'X').length}문항
                </p>
                <p>
                  <b>추천 레벨</b> {levelDiagnosis.recommended} · 성취 {band.achievement}
                </p>
              </div>
            </div>
          </section>

          <section className="report-section feedback-grid">
            <div className="feedback-box good">
              <h3>강점</h3>
              {isGeneratingFeedback ? (
                <p>분석 생성 중...</p>
              ) : (
                <p>{feedback?.strengths || '강점 영역을 확인하세요.'}</p>
              )}
            </div>
            <div className="feedback-box warn">
              <h3>보완점</h3>
              {isGeneratingFeedback ? (
                <p>분석 생성 중...</p>
              ) : (
                <p>{feedback?.weaknesses || '보완이 필요한 영역을 확인하세요.'}</p>
              )}
            </div>
          </section>

          <section className="report-section">
            <h3>교사 코멘트</h3>
            <div className="comment-box">
              {isGeneratingFeedback ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {aiMode && apiKey
                    ? `${providerCfg.modelLabel}로 피드백 자동 생성 중...`
                    : '기본 분석을 생성하고 있습니다...'}
                </span>
              ) : (
                <>
                  {feedback?.overallAssessment || '총평이 없습니다.'}
                  {feedback?.motivationalMessage && (
                    <>
                      <br />
                      <br />
                      {feedback.motivationalMessage}
                    </>
                  )}
                  {feedbackError && (
                    <>
                      <br />
                      <br />
                      <span style={{ color: '#b45309', fontSize: 11 }}>
                        AI 오류로 기본 분석 사용: {feedbackError}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="report-section">
            <h3>다음 학습 계획</h3>
            <div className="plan-box">
              {feedback?.recommendations?.length ? (
                <ul>
                  {feedback.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p>{planText}</p>
              )}
              <span className="plan-tag">
                추천 집중 영역:{' '}
                {analysis.weakRows.map((r) => r.area).join(' → ') || analysis.weakestArea}
              </span>
            </div>
          </section>

          <ReportFooter />
        </section>
      </div>
    </div>
  )
}

export default ReportCard
