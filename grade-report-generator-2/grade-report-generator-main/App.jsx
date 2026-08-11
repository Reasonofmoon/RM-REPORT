import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Plus, Trash2, Settings, FileText, Download, Eye, EyeOff } from 'lucide-react'
import ReportCard from './components/ReportCard.jsx'

function App() {
  // 기존 상태들
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    testDate: '',
    testName: ''
  })

  const [gradeData, setGradeData] = useState([
    { no: 1, correct: 'O', score: 2, maxScore: 2, area: '논리적 사고력', difficulty: '중' }
  ])

  const [showReport, setShowReport] = useState(false)

  // AI API 관련 상태 추가
  const [apiSettings, setApiSettings] = useState({
    apiKey: localStorage.getItem('ai_api_key') || '',
    provider: localStorage.getItem('ai_provider') || 'openai'
  })

  const [showApiKey, setShowApiKey] = useState(false)

  // API 설정 저장
  const saveApiSettings = () => {
    localStorage.setItem('ai_api_key', apiSettings.apiKey)
    localStorage.setItem('ai_provider', apiSettings.provider)
    alert('API 설정이 저장되었습니다.')
  }

  // API 설정 초기화
  const resetApiSettings = () => {
    setApiSettings({ apiKey: '', provider: 'openai' })
    localStorage.removeItem('ai_api_key')
    localStorage.removeItem('ai_provider')
    alert('API 설정이 초기화되었습니다.')
  }

  const addGradeRow = () => {
    const newRow = {
      no: gradeData.length + 1,
      correct: 'O',
      score: 0,
      maxScore: 1,
      area: '논리적 사고력',
      difficulty: '중'
    }
    setGradeData([...gradeData, newRow])
  }

  const removeGradeRow = (index) => {
    if (gradeData.length > 1) {
      const newData = gradeData.filter((_, i) => i !== index)
      const reindexedData = newData.map((item, i) => ({ ...item, no: i + 1 }))
      setGradeData(reindexedData)
    }
  }

  const updateGradeRow = (index, field, value) => {
    const newData = [...gradeData]
    newData[index] = { ...newData[index], [field]: value }
    setGradeData(newData)
  }

  const generateReport = () => {
    if (!studentInfo.name) {
      alert('학생 이름을 입력해주세요.')
      return
    }
    setShowReport(true)
  }

  const areas = ['논리적 사고력', '창의적 사고력', '비판적 사고력', '의사소통 능력', '문제해결 능력']
  const difficulties = ['상', '중', '하']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">성적표 생성기</h1>
          <p className="text-gray-600">성적 데이터를 입력하고 전문적인 성적표를 생성하세요</p>
        </div>

        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              성적 입력
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              AI 설정
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              성적표 생성
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Card>
              <CardHeader>
                <CardTitle>학생 정보</CardTitle>
                <CardDescription>성적표에 표시될 학생 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="studentName">학생 이름</Label>
                    <Input
                      id="studentName"
                      placeholder="홍길동"
                      value={studentInfo.name}
                      onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="testDate">응시일</Label>
                    <Input
                      id="testDate"
                      type="date"
                      value={studentInfo.testDate}
                      onChange={(e) => setStudentInfo({...studentInfo, testDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="testName">시험명</Label>
                    <Input
                      id="testName"
                      placeholder="파스칼 논술 시험"
                      value={studentInfo.testName}
                      onChange={(e) => setStudentInfo({...studentInfo, testName: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>성적 데이터</CardTitle>
                  <CardDescription>각 문항별 성적 정보를 입력하세요</CardDescription>
                </div>
                <Button onClick={addGradeRow} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  문항 추가
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">번호</th>
                        <th className="text-left p-2">정답여부</th>
                        <th className="text-left p-2">득점</th>
                        <th className="text-left p-2">만점</th>
                        <th className="text-left p-2">영역</th>
                        <th className="text-left p-2">난이도</th>
                        <th className="text-left p-2">삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{row.no}</td>
                          <td className="p-2">
                            <Button
                              variant={row.correct === 'O' ? 'default' : 'destructive'}
                              size="sm"
                              onClick={() => updateGradeRow(index, 'correct', row.correct === 'O' ? 'X' : 'O')}
                            >
                              {row.correct}
                            </Button>
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min="0"
                              value={row.score}
                              onChange={(e) => updateGradeRow(index, 'score', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min="1"
                              value={row.maxScore}
                              onChange={(e) => updateGradeRow(index, 'maxScore', parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                          </td>
                          <td className="p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentIndex = areas.indexOf(row.area)
                                const nextIndex = (currentIndex + 1) % areas.length
                                updateGradeRow(index, 'area', areas[nextIndex])
                              }}
                            >
                              {row.area}
                            </Button>
                          </td>
                          <td className="p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentIndex = difficulties.indexOf(row.difficulty)
                                const nextIndex = (currentIndex + 1) % difficulties.length
                                updateGradeRow(index, 'difficulty', difficulties[nextIndex])
                              }}
                            >
                              {row.difficulty}
                            </Button>
                          </td>
                          <td className="p-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeGradeRow(index)}
                              disabled={gradeData.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 text-center">
                  <Button onClick={generateReport} size="lg" className="bg-purple-600 hover:bg-purple-700">
                    성적표 생성하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>AI 피드백 설정</CardTitle>
                <CardDescription>
                  개인화된 성적 피드백을 받기 위해 AI API 키를 설정하세요. 
                  API 키가 없으면 기본 분석을 제공합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">AI 제공업체</Label>
                    <Select 
                      value={apiSettings.provider} 
                      onValueChange={(value) => setApiSettings({...apiSettings, provider: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="AI 제공업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI (GPT-3.5/GPT-4)</SelectItem>
                        <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="apiKey">API 키</Label>
                    <div className="flex gap-2">
                      <Input
                        id="apiKey"
                        type={showApiKey ? "text" : "password"}
                        placeholder={apiSettings.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                        value={apiSettings.apiKey}
                        onChange={(e) => setApiSettings({...apiSettings, apiKey: e.target.value})}
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
                    <p className="text-sm text-gray-500 mt-1">
                      {apiSettings.provider === 'openai' 
                        ? 'OpenAI API 키를 입력하세요 (https://platform.openai.com/api-keys)'
                        : 'Anthropic API 키를 입력하세요 (https://console.anthropic.com/)'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={saveApiSettings} className="flex-1">
                    설정 저장
                  </Button>
                  <Button onClick={resetApiSettings} variant="outline" className="flex-1">
                    설정 초기화
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 사용 팁</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• API 키는 브라우저에 안전하게 저장됩니다</li>
                    <li>• OpenAI GPT-3.5-turbo 모델을 사용합니다 (저렴하고 빠름)</li>
                    <li>• API 키 없이도 기본 분석 기능을 사용할 수 있습니다</li>
                    <li>• 개인화된 피드백을 위해서는 API 키 설정을 권장합니다</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            {showReport ? (
              <ReportCard 
                studentInfo={studentInfo} 
                gradeData={gradeData}
                apiKey={apiSettings.apiKey}
                provider={apiSettings.provider}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">성적 데이터를 입력한 후 성적표를 생성해주세요.</p>
                  <Button onClick={() => document.querySelector('[value="input"]').click()}>
                    성적 입력하러 가기
                  </Button>
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

