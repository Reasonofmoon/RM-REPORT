// AI 피드백 생성 서비스
export class AIFeedbackService {
  constructor(apiKey, provider = 'openai') {
    this.apiKey = apiKey;
    this.provider = provider;
    this.baseURL = this.getBaseURL(provider);
  }

  getBaseURL(provider) {
    switch (provider) {
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'anthropic':
        return 'https://api.anthropic.com/v1/messages';
      default:
        return 'https://api.openai.com/v1/chat/completions';
    }
  }

  // 성적 데이터를 분석하여 AI 피드백 생성
  async generateFeedback(studentInfo, gradeData, analysis) {
    if (!this.apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    const prompt = this.createPrompt(studentInfo, gradeData, analysis);

    try {
      const response = await this.callAI(prompt);
      return this.parseFeedback(response);
    } catch (error) {
      console.error('AI 피드백 생성 오류:', error);
      throw new Error('AI 피드백 생성 중 오류가 발생했습니다: ' + error.message);
    }
  }

  // 프롬프트 생성
  createPrompt(studentInfo, gradeData, analysis) {
    const gradeDataSummary = gradeData.map(item => 
      `문항 ${item.no}: ${item.correct === 'O' ? '정답' : '오답'} (${item.score}/${item.maxScore}점, ${item.area}, 난이도: ${item.difficulty})`
    ).join('\n');

    return `다음 학생의 성적 데이터를 분석하여 개인화된 학습 피드백을 제공해주세요.

**학생 정보:**
- 이름: ${studentInfo.name}
- 시험명: ${studentInfo.testName}
- 응시일: ${studentInfo.testDate}

**성적 데이터:**
${gradeDataSummary}

**분석 결과:**
- 총점: ${analysis.totalScore}/${analysis.totalMaxScore}점 (${analysis.percentage}%)
- 가장 강한 영역: ${analysis.strongestArea}
- 보완이 필요한 영역: ${analysis.weakestArea}

다음 형식으로 피드백을 제공해주세요:

{
  "overallAssessment": "전체적인 성과 평가 (2-3문장)",
  "strengths": "강점 분석 (구체적인 설명)",
  "weaknesses": "약점 분석 (구체적인 설명)",
  "recommendations": [
    "구체적인 학습 제언 1",
    "구체적인 학습 제언 2",
    "구체적인 학습 제언 3"
  ],
  "motivationalMessage": "격려 메시지 (1-2문장)"
}

응답은 반드시 유효한 JSON 형식으로만 제공해주세요.`;
  }

  // AI API 호출
  async callAI(prompt) {
    const headers = {
      'Content-Type': 'application/json',
    };

    let body;

    if (this.provider === 'openai') {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      body = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 교육 전문가입니다. 학생의 성적 데이터를 분석하여 개인화된 학습 피드백을 제공합니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };
    } else if (this.provider === 'anthropic') {
      headers['x-api-key'] = this.apiKey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      };
    }

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API 호출 실패: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  // AI 응답 파싱
  parseFeedback(response) {
    let content;

    if (this.provider === 'openai') {
      content = response.choices?.[0]?.message?.content;
    } else if (this.provider === 'anthropic') {
      content = response.content?.[0]?.text;
    }

    if (!content) {
      throw new Error('AI 응답에서 내용을 찾을 수 없습니다.');
    }

    try {
      // JSON 응답 파싱
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      // 파싱 실패 시 기본 응답 반환
      return {
        overallAssessment: content.substring(0, 200) + '...',
        strengths: '분석 중 오류가 발생했습니다.',
        weaknesses: '분석 중 오류가 발생했습니다.',
        recommendations: [
          '기본 개념 복습을 권장합니다.',
          '약한 영역에 대한 추가 학습이 필요합니다.',
          '꾸준한 연습을 통해 실력을 향상시키세요.'
        ],
        motivationalMessage: '꾸준한 노력으로 더 나은 결과를 얻을 수 있습니다!'
      };
    }
  }
}

// 기본 피드백 생성 (API 키가 없을 때)
export function generateDefaultFeedback(studentInfo, gradeData, analysis) {
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return '매우 우수';
    if (percentage >= 80) return '우수';
    if (percentage >= 70) return '양호';
    if (percentage >= 60) return '보통';
    return '노력 필요';
  };

  const performanceLevel = getPerformanceLevel(analysis.percentage);

  return {
    overallAssessment: `전체 ${analysis.totalMaxScore}점 만점에서 ${analysis.totalScore}점(${analysis.percentage}%)을 획득하여 ${performanceLevel}한 성과를 보였습니다. ${analysis.strongestArea} 영역에서 특히 강점을 보였으며, 전반적으로 성실한 학습 태도가 돋보입니다.`,
    
    strengths: `${analysis.strongestArea} 영역에서 가장 뛰어난 성과를 보였습니다. 이는 해당 영역에 대한 이해도가 높고 문제 해결 능력이 우수함을 의미합니다. 이러한 강점을 바탕으로 다른 영역의 학습에도 자신감을 가지고 접근할 수 있을 것입니다.`,
    
    weaknesses: `${analysis.weakestArea} 영역에서 상대적으로 낮은 성과를 보였습니다. 이 영역에 대한 기본 개념 정리와 추가적인 학습이 필요합니다. 하지만 이는 충분히 개선 가능한 부분이므로 체계적인 학습 계획을 통해 향상시킬 수 있습니다.`,
    
    recommendations: [
      `${analysis.weakestArea} 영역의 기본 개념을 다시 정리하고 관련 문제를 반복 연습하세요.`,
      `${analysis.strongestArea} 영역의 우수한 학습 방법을 다른 영역에도 적용해보세요.`,
      '오답 문항을 다시 풀어보며 실수 패턴을 분석하고 개선하세요.',
      '꾸준한 복습을 통해 학습한 내용을 장기 기억으로 전환하세요.'
    ],
    
    motivationalMessage: '현재의 성과를 바탕으로 꾸준히 노력한다면 더욱 향상된 결과를 얻을 수 있을 것입니다. 자신감을 가지고 학습에 임하세요!'
  };
}

