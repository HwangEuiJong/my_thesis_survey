# AI 챗봇 직무역량진단 시스템
경희대학교 경영학과 박사학위논문 연구 — 황의종

## 배포 방법 (단계별 가이드)

### 1단계: GitHub 저장소 만들기

1. https://github.com 접속 → 로그인 (없으면 무료 가입)
2. 우측 상단 `+` 버튼 → `New repository` 클릭
3. Repository name: `hrd-chatbot-survey` 입력
4. `Private` 선택 (API 키 보안을 위해)
5. `Create repository` 클릭

### 2단계: 파일 업로드

GitHub 저장소에서 `Add file` → `Upload files` 클릭 후
이 폴더의 파일들을 모두 업로드:
- `api/chat.js`
- `public/index.html`
- `vercel.json`
- `package.json`

(api 폴더, public 폴더 구조 그대로 유지)

### 3단계: Vercel 배포

1. https://vercel.com 접속 → GitHub으로 로그인 (무료)
2. `Add New Project` 클릭
3. GitHub 저장소 `hrd-chatbot-survey` 선택
4. `Deploy` 클릭 (설정 변경 없이 그대로)
5. 배포 완료 후 URL 생성됨 (예: https://hrd-chatbot-survey.vercel.app)

### 4단계: API 키 등록 (핵심!)

1. Vercel 대시보드 → 프로젝트 선택
2. `Settings` → `Environment Variables`
3. 아래와 같이 입력:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-...` (본인의 OpenAI API 키)
   - Environment: `Production` 체크
4. `Save` 클릭
5. `Deployments` → 최신 배포 오른쪽 `...` → `Redeploy` 클릭

### 5단계: 설문 링크 연결

`public/index.html` 파일에서
`YOUR_SURVEY_LINK_HERE` 부분을 Google Forms 링크로 교체 후
GitHub에 다시 업로드하면 Vercel이 자동으로 재배포됩니다.

### 6단계: 응답자에게 URL 공유

배포된 URL (예: https://hrd-chatbot-survey.vercel.app) 을
응답자에게 공유하면 됩니다.
응답자는 API 키 입력 없이 바로 체험 시작 가능합니다.

---

## 비용 안내

- Vercel: 무료 (월 100GB 대역폭)
- OpenAI API: gpt-4o-mini 기준
  - 응답자 150명 × 대화당 약 2,000 토큰
  - 예상 총 비용: 약 $8~12 (약 1만 원)

## 문의

경희대학교 경영학과 박사과정 황의종
edutreekr@daum.net
