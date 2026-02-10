@Figma [여기에 피그마 파일 링크 붙여넣기]

Next.js 14+ (App Router)를 사용하여 'IT 인사이트 및 컨퍼런스 종합 플랫폼' 신규 프로젝트를 생성해줘. 

### 1. 기술 스택 (Tech Stack)
- Framework: Next.js (App Router)
- Language: TypeScript
- Design Reference: 연결된 Figma 디자인 시스템 및 레이아웃 참조
- Styling: Tailwind CSS (Figma의 Color, Typography를 tailwind.config.ts에 반영)
- Components: Shadcn UI (필요한 컴포넌트 자동 설치 및 설정)
- Icons: Lucide React
- State Management: TanStack Query (React Query)

### 2. 핵심 기능 및 디자인 요청
- **Figma Sync**: 피그마 디자인 파일의 'Design System' 페이지나 스타일 가이드를 분석해서 전역 스타일을 잡아줘.
- **Main Dashboard**: IT 뉴스 피드와 컨퍼런스 일정이 조화롭게 배치된 메인 페이지를 구현해줘.
- **Conference List**: 피그마의 'Conference_Card' 컴포넌트를 참조하여 리스트 및 필터링(FE, BE, AI 등) 기능을 구현해줘.
- **Responsive**: 피그마에 정의된 모바일/데스크탑 브레이크포인트를 준수해줘.

### 3. 프로젝트 구조 (Architecture)
- /app: 페이지 및 라우팅
- /components: Figma 기반의 재사용 가능한 UI 컴포넌트
- /lib & /hooks: API 연동 및 데이터 페칭 로직
- /types: Figma 데이터 구조를 반영한 TypeScript 인터페이스

### 4. 실행 지시사항
1. 프로젝트 기본 구조를 생성한다.
2. `tailwind.config.ts`에 피그마의 메인 컬러와 폰트 시스템을 적용한다.
3. Shadcn UI 초기 설정을 진행한다.
4. 더미 데이터를 활용해 피그마 디자인과 가장 유사한 메인 화면 코드를 작성한다.