import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import {
  Settings,
  FileText,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
  Eraser,
  Sparkles,
} from 'lucide-react'
import ReportCard from '@/components/ReportCard.jsx'
import {
  TEST_META,
  QUESTIONS,
  createEmptyAnswers,
  gradeAll,
} from '@/data/middleSchoolLevelTest.js'
import {
  AI_PROVIDERS,
  PROVIDER_ORDER,
  getProviderConfig,
  resolveApiKey,
} from '@/utils/aiModels.js'

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function App() {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    testDate: todayISO(),
    testName: TEST_META.name,
    school: '○○중학교',
    grade: '',
    group: '',
    teacher: '담당 선생님',
  })

  const [answers, setAnswers] = useState(() => createEmptyAnswers())
  const [gradeData, setGradeData] = useState(null)
  const [showReport, setShowReport] = useState(false)
  const [tab, setTab] = useState('input')

  const [apiSettings, setApiSettings] = useState(() => {
    const provider = localStorage.getItem('ai_provider') || 'openai'
    // 제공사별 키 저장 (ai_api_key_<provider>), 구버전 단일 키도 호환
    const legacy = localStorage.getItem('ai_api_key') || ''
    const keys = {}
    for (const id of PROVIDER_ORDER) {
      keys[id] =
        localStorage.getItem(`ai_api_key_${id}`) ||
        (id === provider ? legacy : '') ||
        ''
    }
    return {
      provider,
      keys,
      /** AI 모드: 키 있으면 성적표 생성 시 자동 피드백 */
      aiMode: localStorage.getItem('ai_mode') !== 'off',
    }
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const activeProvider = getProviderConfig(apiSettings.provider)
  const activeKey = apiSettings.keys[apiSettings.provider] || ''
  const resolvedKey = resolveApiKey(apiSettings.provider, activeKey)
  const aiReady = apiSettings.aiMode && Boolean(resolvedKey)

  const liveGrade = useMemo(() => gradeAll(answers), [answers])
  const liveTotal = liveGrade.reduce((s, g) => s + g.score, 0)
  const liveMax = liveGrade.reduce((s, g) => s + g.maxScore, 0)
  const answeredCount = QUESTIONS.filter((q) => {
    const a = answers[q.no]
    if (q.type === 'choice') return Boolean(a)
    if (q.type === 'multi') return Array.isArray(a) && a.length > 0
    if (q.type === 'short') return Object.values(a || {}).some((v) => String(v).trim())
    return false
  }).length

  const saveApiSettings = () => {
    localStorage.setItem('ai_provider', apiSettings.provider)
    localStorage.setItem('ai_mode', apiSettings.aiMode ? 'on' : 'off')
    for (const id of PROVIDER_ORDER) {
      const k = apiSettings.keys[id] || ''
      if (k) localStorage.setItem(`ai_api_key_${id}`, k)
      else localStorage.removeItem(`ai_api_key_${id}`)
    }
    // 하위 호환
    localStorage.setItem('ai_api_key', activeKey)
    alert(
      aiReady
        ? `저장됨 · AI 자동 피드백 ON (${activeProvider.modelLabel})`
        : '저장됨 · API 키가 없거나 AI 모드가 꺼져 있으면 기본 분석을 사용합니다.'
    )
  }

  const resetApiSettings = () => {
    const emptyKeys = Object.fromEntries(PROVIDER_ORDER.map((id) => [id, '']))
    setApiSettings({ provider: 'openai', keys: emptyKeys, aiMode: true })
    localStorage.removeItem('ai_api_key')
    localStorage.removeItem('ai_provider')
    localStorage.removeItem('ai_mode')
    for (const id of PROVIDER_ORDER) localStorage.removeItem(`ai_api_key_${id}`)
    alert('API 설정이 초기화되었습니다.')
  }

  const setProviderKey = (value) => {
    setApiSettings((prev) => ({
      ...prev,
      keys: { ...prev.keys, [prev.provider]: value },
    }))
  }

  const setChoice = (no, value) => {
    setAnswers((prev) => ({ ...prev, [no]: value }))
  }

  const toggleMulti = (no, value) => {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[no]) ? [...prev[no]] : []
      const idx = cur.indexOf(value)
      if (idx >= 0) cur.splice(idx, 1)
      else cur.push(value)
      return { ...prev, [no]: cur }
    })
  }

  const setShort = (no, partKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      [no]: { ...prev[no], [partKey]: value },
    }))
  }

  const fillAllCorrect = () => {
    const next = createEmptyAnswers()
    for (const q of QUESTIONS) {
      if (q.type === 'choice') next[q.no] = String(q.answer)
      else if (q.type === 'multi') next[q.no] = [...q.answer]
      else if (q.type === 'short') {
        next[q.no] = Object.fromEntries(
          Object.entries(q.answer).map(([k, list]) => [k, list[0]])
        )
      }
    }
    setAnswers(next)
  }

  const fillSampleMixed = () => {
    fillAllCorrect()
    // 일부 오답 시뮬레이션
    setAnswers((prev) => ({
      ...prev,
      1: '1',
      5: '2',
      8: '3',
      13: '1',
      17: '1',
      19: '2',
      14: { 1: 'guiding', 2: 'visit', 3: 'to open' },
    }))
  }

  const clearAnswers = () => {
    setAnswers(createEmptyAnswers())
    setGradeData(null)
    setShowReport(false)
  }

  const generateReport = () => {
    if (!studentInfo.name.trim()) {
      alert('학생 이름을 입력해주세요.')
      return
    }
    const graded = gradeAll(answers)
    setGradeData(graded)
    setShowReport(true)
    setTab('report')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-indigo-600 tracking-wide mb-1">READMASTER</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            중등 영어 레벨테스트 성적표
          </h1>
          <p className="text-gray-600">
            시험지 20문항 답안을 입력하면 자동 채점·영역 분석·PDF 성적표를 생성합니다
          </p>
          <div className="mt-3 inline-flex items-center gap-3 text-sm bg-white/80 rounded-full px-4 py-1.5 border shadow-sm">
            <span>
              입력 {answeredCount}/{TEST_META.totalQuestions}문항
            </span>
            <span className="text-gray-300">|</span>
            <span>
              예상 점수 {liveTotal}/{liveMax}
            </span>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">
              <FileText className="w-4 h-4" />
              답안 입력
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4" />
              AI 설정
            </TabsTrigger>
            <TabsTrigger value="report">
              <Download className="w-4 h-4" />
              성적표
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Card>
              <CardHeader>
                <CardTitle>학생 정보</CardTitle>
                <CardDescription>성적표에 표시될 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="studentName">학생 이름</Label>
                    <Input
                      id="studentName"
                      placeholder="홍길동"
                      value={studentInfo.name}
                      onChange={(e) =>
                        setStudentInfo({ ...studentInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="school">학교</Label>
                    <Input
                      id="school"
                      placeholder="○○중학교"
                      value={studentInfo.school}
                      onChange={(e) =>
                        setStudentInfo({ ...studentInfo, school: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade">학년</Label>
                    <Input
                      id="grade"
                      placeholder="2학년 (비우면 진단 레벨 표시)"
                      value={studentInfo.grade}
                      onChange={(e) =>
                        setStudentInfo({ ...studentInfo, grade: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="group">반/그룹</Label>
                    <Input
                      id="group"
                      placeholder="A반"
                      value={studentInfo.group}
                      onChange={(e) =>
                        setStudentInfo({ ...studentInfo, group: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher">담당</Label>
                    <Input
                      id="teacher"
                      value={studentInfo.teacher}
                      onChange={(e) =>
                        setStudentInfo({ ...studentInfo, teacher: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="testDate">응시일</Label>
                    <Input
                      id="testDate"
                      type="date"
                      value={studentInfo.testDate}
                      onChange={(e) =>
                        setStudentInfo({ ...studentInfo, testDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="testName">시험명</Label>
                    <Input
                      id="testName"
                      value={studentInfo.testName}
                      onChange={(e) =>
                        setStudentInfo({ ...studentInfo, testName: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>문항별 답안 ({TEST_META.totalQuestions}문항 · 100점)</CardTitle>
                  <CardDescription>
                    객관식은 번호를 선택하고, 서술형(14·15번)은 답을 입력하세요. 2번은 복수 정답입니다.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={fillSampleMixed} className="gap-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    샘플 답안
                  </Button>
                  <Button variant="outline" size="sm" onClick={fillAllCorrect} className="gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    전항 정답
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAnswers} className="gap-1">
                    <Eraser className="w-3.5 h-3.5" />
                    초기화
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {QUESTIONS.map((q) => {
                  const graded = liveGrade.find((g) => g.no === q.no)
                  return (
                    <div
                      key={q.no}
                      className="rounded-lg border bg-gray-50/50 p-4 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold">
                              {q.no}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-white border">
                              {q.level}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-white border">
                              {q.difficulty}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {q.area}
                            </span>
                            <span className="text-xs text-gray-500">{q.maxScore}점</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{q.prompt}</p>
                        </div>
                        {graded && (
                          <div className="text-right text-sm">
                            <div
                              className={
                                graded.correct === 'O'
                                  ? 'text-green-600 font-bold'
                                  : graded.correct === 'P'
                                    ? 'text-amber-600 font-bold'
                                    : graded.score === 0 &&
                                        !(
                                          (q.type === 'choice' && answers[q.no]) ||
                                          (q.type === 'multi' && answers[q.no]?.length) ||
                                          (q.type === 'short' &&
                                            Object.values(answers[q.no] || {}).some(Boolean))
                                        )
                                      ? 'text-gray-400'
                                      : 'text-red-600 font-bold'
                              }
                            >
                              {graded.score}/{graded.maxScore}
                            </div>
                          </div>
                        )}
                      </div>

                      {q.type === 'choice' && (
                        <div className="flex flex-wrap gap-2">
                          {(q.choices || []).map((label, i) => {
                            const val = String(i + 1)
                            const selected = answers[q.no] === val
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setChoice(q.no, val)}
                                className={`min-w-[3rem] h-10 rounded-md border text-sm font-medium transition-colors ${
                                  selected
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white hover:bg-indigo-50 border-gray-300'
                                }`}
                              >
                                {label}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {q.type === 'multi' && (
                        <div>
                          <p className="text-xs text-amber-700 mb-2">복수 선택 (모두 고르세요)</p>
                          <div className="flex flex-wrap gap-2">
                            {(q.choices || []).map((label, i) => {
                              const val = String(i + 1)
                              const selected = (answers[q.no] || []).includes(val)
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => toggleMulti(q.no, val)}
                                  className={`min-w-[3rem] h-10 rounded-md border text-sm font-medium transition-colors ${
                                    selected
                                      ? 'bg-indigo-600 text-white border-indigo-600'
                                      : 'bg-white hover:bg-indigo-50 border-gray-300'
                                  }`}
                                >
                                  {label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {q.type === 'short' && (
                        <div className="grid gap-3 md:grid-cols-3">
                          {q.shortParts.map((label, idx) => {
                            const key = String(idx + 1)
                            return (
                              <div key={key}>
                                <Label className="text-xs text-gray-500">{label}</Label>
                                <Input
                                  placeholder="답 입력"
                                  value={answers[q.no]?.[key] || ''}
                                  onChange={(e) => setShort(q.no, key, e.target.value)}
                                  className="mt-1 bg-white"
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="pt-4 text-center space-y-2">
                  <Button
                    onClick={generateReport}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 min-w-[240px]"
                  >
                    채점 후 성적표 생성
                  </Button>
                  <p className="text-xs text-gray-500">
                    미입력 문항은 오답(0점)으로 처리됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  AI 피드백 설정 (가성비 최신 모델)
                </CardTitle>
                <CardDescription>
                  성적표 생성 시 API 키가 있으면 선택한 모델로 피드백이 자동 생성됩니다. 키가
                  없으면 규칙 기반 기본 분석을 사용합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border bg-indigo-50/60 px-4 py-3">
                  <div>
                    <p className="font-semibold text-indigo-900">AI 모드 자동 피드백</p>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      켜면 성적표 탭 진입 시 바로 피드백을 생성합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setApiSettings((p) => ({ ...p, aiMode: !p.aiMode }))
                    }
                    className={`relative h-8 w-14 rounded-full transition-colors ${
                      apiSettings.aiMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    aria-label="AI 모드 토글"
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                        apiSettings.aiMode ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {PROVIDER_ORDER.map((id) => {
                    const p = AI_PROVIDERS[id]
                    const selected = apiSettings.provider === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setApiSettings((prev) => ({ ...prev, provider: id }))}
                        className={`text-left rounded-xl border p-4 transition-all ${
                          selected
                            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                            : 'border-gray-200 bg-white hover:border-indigo-200'
                        }`}
                      >
                        <div className="text-xs font-semibold text-indigo-600">{p.tier}</div>
                        <div className="font-bold text-gray-900 mt-1">{p.name}</div>
                        <div className="text-sm text-gray-700 mt-1">{p.modelLabel}</div>
                        <div className="text-xs text-gray-500 mt-2">{p.priceHint}</div>
                        <div className="text-[11px] font-mono text-gray-400 mt-2 break-all">
                          model: {p.model}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>선택된 제공사</Label>
                    <Select
                      value={apiSettings.provider}
                      onValueChange={(value) =>
                        setApiSettings({ ...apiSettings, provider: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">
                          OpenAI · GPT-4o mini (가성비)
                        </SelectItem>
                        <SelectItem value="gemini">
                          Gemini · 2.5 Flash (가성비)
                        </SelectItem>
                        <SelectItem value="anthropic">
                          Claude · Haiku 4.5 (가성비)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="apiKey">
                      {activeProvider.name} API 키
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="apiKey"
                        type={showApiKey ? 'text' : 'password'}
                        placeholder={activeProvider.keyPlaceholder}
                        value={activeKey}
                        onChange={(e) => setProviderKey(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      키 발급:{' '}
                      <a
                        className="text-indigo-600 underline"
                        href={activeProvider.keyHelp}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {activeProvider.keyHelp}
                      </a>
                      {' · '}
                      또는 환경변수 <code className="bg-gray-100 px-1 rounded">{activeProvider.envKey}</code>
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-lg p-3 text-sm ${
                    aiReady
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {aiReady ? (
                    <>
                      <strong>자동 피드백 준비됨</strong> — 성적표 생성 시{' '}
                      <strong>{activeProvider.modelLabel}</strong> ({activeProvider.model}) 로
                      바로 생성합니다.
                    </>
                  ) : (
                    <>
                      AI 키가 없거나 AI 모드가 꺼져 있습니다. 성적표는 기본 규칙 분석으로
                      자동 생성됩니다.
                    </>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button onClick={saveApiSettings} className="flex-1">
                    설정 저장
                  </Button>
                  <Button onClick={resetApiSettings} variant="outline" className="flex-1">
                    설정 초기화
                  </Button>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                  <p className="font-semibold mb-1">가성비 모델 (2026 기준)</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>OpenAI</strong>: GPT-4o mini — 품질 대비 가격 균형
                    </li>
                    <li>
                      <strong>Gemini</strong>: 2.5 Flash — 저렴·고속 (실패 시 2.0 Flash 폴백)
                    </li>
                    <li>
                      <strong>Claude</strong>: Haiku 4.5 — Claude 중 최저 단가 티어
                    </li>
                    <li>키는 브라우저 localStorage에만 저장됩니다 (서버로 전송하지 않음).</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            {showReport && gradeData ? (
              <ReportCard
                studentInfo={studentInfo}
                gradeData={gradeData}
                apiKey={resolvedKey}
                provider={apiSettings.provider}
                aiMode={apiSettings.aiMode}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    답안을 입력한 뒤 「채점 후 성적표 생성」을 눌러주세요.
                  </p>
                  <Button onClick={() => setTab('input')}>답안 입력하러 가기</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
