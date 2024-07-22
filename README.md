## 🛒 프로젝트 소개
요고조고는 1인 가구를 위해 소량의 식재료를 카테고리별로 나누어 간편하게 구매할 수 있는 서비스입니다.

## 👀 기획
* 유저플로우 : [유저플로우](https://www.figma.com/board/rAjdEnXhkceeGiWmBm2FnG/User-Flow?node-id=0-1&t=ENewWJmsqGneInvO-0)
* 와이어프레임 : [와이어프레임](https://www.figma.com/design/sY5rLPTr8rlWPFlExylhBn/%EC%BB%A4%EB%A8%B8%EC%8A%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0-1&t=fcgLdLh3ab3ayakU-0)

## ⚙️ 개발환경
* 인원 : 1인
* 개발 기간 : 2024. 06 ~ 
* 기술 스택
  * 언어 및 프레임워크 : TypeScript, React, Vite
  * 상태 관리 : Context API, TanStack Query
  * 스타일링 : Tailwind CSS, shadcn/ui
  * 디자인 : Figma
  * 백엔드 및 데이터베이스 : Firebase

## 📁 폴더 구조
```
📦 YogoJogo
├──📁 src
│   ├──📁 assets                    # 아이콘, 이미지 등 정적 파일 저장
│   ├──📁 components                # 재사용 가능한 UI 컴포넌트 관리
│   ├──📁 context                   # Context API를 활용한 전역 상태 파일 관리
│   ├──📁 hooks                     # 커스텀 훅을 정의하여 관리
│   ├──📁 pages                     # 각 페이지별 라우팅 컴포넌트 저장
│   │   ├──📁 Admin
│   │   ├──📁 Common
│   │   └──📁 User
│   ├──📁 router                    # 인증에 따른 접근 제한 설정, 라우터 설정 관리
│   ├──📁 utils                     # 재사용되는 유틸리티 함수 관리
│   │   └──📃 firebase.ts
│   ├──📁 services                  # API 연동, 비동기 작업, Firebase 관련 함수를 관리
│   ├──📁 interfaces                # TypeScript 인터페이스 관리
│   └──📁 types                     # TypeScript 타입 관리
```


## ✨ 기능 소개 및 시연
* 로그인 및 회원가입
* 메인 및 카테고리 정렬
* 장바구니
* 주문 및 결제
* 마이페이지
* 관리자 페이지

## ✍🏻 트러블 슈팅
