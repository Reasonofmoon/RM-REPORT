import React, { useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js'
import { Doughnut, Bar, Radar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button.jsx'
import { Download, FileText, Loader2 } from 'lucide-react'
import { AIFeedbackService, generateDefaultFeedback } from '../utils/aiService.js'

// Chart.js 등록
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

const ReportCard = ({ studentInfo, gradeData, apiKey, provider = 'openai' }) => {
  const reportRef = useRef(null)
  const [feedback, setFeedback] = useState(null)
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)

  // 성적 데이터 분석 함수
  const analyzeGradeData = (data) => {
    const totalScore = data.reduce((sum, item) => sum + item.score, 0)
    const totalMaxScore = data.reduce((sum, item) => sum + item.maxScore, 0)
    const percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

    // 영역별 분석
    const areaAnalysis = {}
    data.forEach(item => {
      if (!areaAnalysis[item.area]) {
        areaAnalysis[item.area] = { score: 0, maxScore: 0 }
      }
      areaAnalysis[item.area].score += item.score
      areaAnalysis[item.area].maxScore += item.maxScore
    })

    const areaPercentages = Object.keys(areaAnalysis).map(area => ({
      area,
      percentage: areaAnalysis[area].maxScore > 0 ? 
        Math.round((areaAnalysis[area].score / areaAnalysis[area].maxScore) * 100) : 0
    }))

    // 난이도별 분석
    const difficultyAnalysis = {}
    data.forEach(item => {
      if (!difficultyAnalysis[item.difficulty]) {
        difficultyAnalysis[item.difficulty] = { score: 0, maxScore: 0 }
      }
      difficultyAnalysis[item.difficulty].score += item.score
      difficultyAnalysis[item.difficulty].maxScore += item.maxScore
    })

    const difficultyPercentages = Object.keys(difficultyAnalysis).map(difficulty => ({
      difficulty,
      percentage: difficultyAnalysis[difficulty].maxScore > 0 ? 
        Math.round((difficultyAnalysis[difficulty].score / difficultyAnalysis[difficulty].maxScore) * 100) : 0
    }))

    // 최고/최저 영역 찾기
    const sortedAreas = areaPercentages.sort((a, b) => b.percentage - a.percentage)
    const strongestArea = sortedAreas[0]?.area || '없음'
    const weakestArea = sortedAreas[sortedAreas.length - 1]?.area || '없음'

    return {
      totalScore,
      totalMaxScore,
      percentage,
      areaPercentages,
      difficultyPercentages,
      strongestArea,
      weakestArea
    }
  }

  const analysis = analyzeGradeData(gradeData)

  // AI 피드백 생성 함수
  const generateAIFeedback = async () => {
    setIsGeneratingFeedback(true)
    setFeedbackError(null)

    try {
      if (apiKey && apiKey.trim()) {
        const aiService = new AIFeedbackService(apiKey, provider)
        const aiFeedback = await aiService.generateFeedback(studentInfo, gradeData, analysis)
        setFeedback(aiFeedback)
      } else {
        // API 키가 없으면 기본 피드백 사용
        const defaultFeedback = generateDefaultFeedback(studentInfo, gradeData, analysis)
        setFeedback(defaultFeedback)
      }
    } catch (error) {
      console.error('피드백 생성 오류:', error)
      setFeedbackError(error.message)
      // 오류 발생 시 기본 피드백으로 대체
      const defaultFeedback = generateDefaultFeedback(studentInfo, gradeData, analysis)
      setFeedback(defaultFeedback)
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  // 컴포넌트 마운트 시 피드백 생성
  useEffect(() => {
    generateAIFeedback()
  }, [studentInfo, gradeData, apiKey, provider])

  // PDF 다운로드 함수
  const downloadPDF = async () => {
    if (!reportRef.current) return

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `${studentInfo.name || '성적표'}_${studentInfo.testDate || new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF 생성 중 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다.')
    }
  }

  // HTML 다운로드 함수
  const downloadHTML = () => {
    if (!reportRef.current) return

    try {
      const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${studentInfo.name || '학생'} - ${studentInfo.testName || '성적표'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
    <style>
        body { font-family: 'Noto Sans KR', sans-serif; }
        @media print {
            body { background-color: white; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    ${reportRef.current.outerHTML}
    <script>
        // 차트 재생성 스크립트가 여기에 들어갈 수 있습니다
    </script>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const fileName = `${studentInfo.name || '성적표'}_${studentInfo.testDate || new Date().toISOString().split('T')[0]}.html`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('HTML 다운로드 중 오류:', error)
      alert('HTML 다운로드 중 오류가 발생했습니다.')
    }
  }

  // 게이지 차트 데이터
  const gaugeData = {
    datasets: [{
      data: [analysis.percentage, 100 - analysis.percentage],
      backgroundColor: ['#3F51B5', '#E8EAF6'],
      borderColor: ['#FFFFFF'],
      borderWidth: 2,
      circumference: 180,
      rotation: 270,
    }]
  }

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      datalabels: { display: false }
    }
  }

  // 레이더 차트 데이터
  const radarData = {
    labels: analysis.areaPercentages.map(item => item.area),
    datasets: [{
      label: '득점률',
      data: analysis.areaPercentages.map(item => item.percentage),
      backgroundColor: 'rgba(63, 81, 181, 0.2)',
      borderColor: '#3F51B5',
      borderWidth: 2,
      pointBackgroundColor: '#3F51B5',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3F51B5'
    }]
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: { display: false },
      datalabels: { display: false }
    }
  }

  // 막대 차트 데이터 (난이도별)
  const difficultyOrder = ['하', '중', '상']
  const sortedDifficultyData = difficultyOrder.map(level => {
    const found = analysis.difficultyPercentages.find(item => item.difficulty === level)
    return found ? found.percentage : 0
  })

  const barData = {
    labels: difficultyOrder,
    datasets: [{
      label: '난이도별 득점률',
      data: sortedDifficultyData,
      backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
      borderRadius: 4,
      barPercentage: 0.6
    }]
  }

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        beginAtZero: true, 
        max: 100, 
        grid: { display: false }, 
        ticks: { display: false } 
      },
      y: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: { 
        callbacks: { 
          label: (context) => `득점률: ${context.formattedValue}%` 
        } 
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => value + '%',
        color: '#333',
        font: { weight: 'bold' }
      }
    }
  }

  return (
    <div>
      {/* 다운로드 버튼들 */}
      <div className="flex justify-center gap-4 mb-6 no-print">
        <Button onClick={downloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          PDF 다운로드
        </Button>
        <Button onClick={downloadHTML} variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          HTML 다운로드
        </Button>
      </div>

      <div ref={reportRef} className="max-w-6xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* 헤더 */}
        <header className="bg-gradient-to-r from-indigo-800 to-blue-700 text-white p-8">
          <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif tracking-wider">Comprehensive Analysis Report</h1>
            <p className="text-lg text-indigo-200 mt-1">{studentInfo.testName} 결과</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">{studentInfo.name}</p>
            <p className="text-sm text-indigo-300">응시일: {studentInfo.testDate}</p>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 컬럼 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* 종합 점수 게이지 */}
          <div className="bg-white rounded-lg p-6 shadow-md border text-center">
            <h3 className="font-bold text-lg text-gray-600 mb-2">종합 점수</h3>
            <div className="relative h-48">
              <Doughnut data={gaugeData} options={gaugeOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-800">{analysis.totalScore}점</div>
                  <div className="text-sm text-gray-500">({analysis.percentage}%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* 핵심 요약 */}
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <h3 className="font-bold text-lg text-gray-600 mb-4">핵심 요약</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">예상 등위</p>
                  <p className="font-bold text-lg">상위 {Math.max(5, Math.min(95, 100 - analysis.percentage))}%</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">가장 강한 역량</p>
                  <p className="font-bold text-lg">{analysis.strongestArea}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">보완이 필요한 역량</p>
                  <p className="font-bold text-lg">{analysis.weakestArea}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 난이도별 득점률 */}
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <h3 className="font-bold text-lg text-gray-600 mb-4">난이도별 득점률</h3>
            <div className="h-48">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 역량 균형 분석 */}
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <h3 className="font-bold text-lg text-gray-600 mb-4 text-center">역량 균형 분석</h3>
            <div className="h-80">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* 종합 분석 및 학습 제언 */}
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <h3 className="font-bold text-lg text-gray-600 mb-4">종합 분석 및 학습 제언</h3>
            
            {isGeneratingFeedback ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-gray-600">AI가 개인화된 피드백을 생성하고 있습니다...</span>
              </div>
            ) : feedback ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-md text-indigo-700 mb-2">■ 총평 (Overall Assessment)</h4>
                  <p className="text-sm leading-relaxed">
                    {feedback.overallAssessment}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-md text-green-700 mb-2">■ 강점 분석 (Strengths)</h4>
                  <p className="text-sm leading-relaxed">
                    {feedback.strengths}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-md text-red-700 mb-2">■ 보완점 (Areas for Improvement)</h4>
                  <p className="text-sm leading-relaxed">
                    {feedback.weaknesses}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-md text-amber-700 mb-3">■ 학습 제언 (Actionable Recommendations)</h4>
                  <ul className="space-y-3">
                    {feedback.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-amber-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm leading-relaxed">
                          {recommendation}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-md text-blue-700 mb-2">■ 격려 메시지 (Motivational Message)</h4>
                  <p className="text-sm leading-relaxed font-medium text-blue-600">
                    {feedback.motivationalMessage}
                  </p>
                </div>
                
                {feedbackError && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>참고:</strong> AI 피드백 생성 중 오류가 발생하여 기본 분석을 제공합니다. ({feedbackError})
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                피드백을 생성할 수 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-400 p-4 bg-gray-50 border-t">
        GRADE REPORT GENERATOR &copy; 2025. This report is intended for educational purposes only.
      </footer>
      </div>
    </div>
  )
}

export default ReportCard

