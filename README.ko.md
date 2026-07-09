# Azure Communication Services 실무 가이드

📘 **문서 사이트:** <https://yeongseon.github.io/azure-communication-services-practical-guide/>

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

Azure Communication Services — SMS, 음성, 이메일, 채팅, 영상 통화 및 Teams 상호 운용을 위한 포괄적인 가이드입니다.

## 주요 내용

| 섹션 | 설명 | 상태 |
|---|---|---|
| [시작하기 (Start Here)](https://yeongseon.github.io/azure-communication-services-practical-guide/) | 개요, 학습 경로, 저장소 맵 및 가이드 사용법 | 종합 |
| [플랫폼 (Platform)](https://yeongseon.github.io/azure-communication-services-practical-guide/platform/) | ACS의 작동 방식, 리소스 유형, 메시징 채널, 네트워킹, 인증, 이벤트 및 보안 | 종합 |
| [베스트 프랙티스 (Best Practices)](https://yeongseon.github.io/azure-communication-services-practical-guide/best-practices/) | 프로덕션 기준선, 보안, 네트워킹, 안정성, 스케일링, 비용 및 안티패턴 | 종합 |
| [SDK 가이드 (SDK Guides)](https://yeongseon.github.io/azure-communication-services-practical-guide/sdk-guides/) | Python, JavaScript, Java 및 .NET용 단계별 튜토리얼과 레시피 | 종합 |
| [운영 (Operations)](https://yeongseon.github.io/azure-communication-services-practical-guide/operations/) | 프로비저닝, 모니터링, 배포, 상태 복구, 보안 및 비용 최적화 | 종합 |
| [트러블슈팅 (Troubleshooting)](https://yeongseon.github.io/azure-communication-services-practical-guide/troubleshooting/) | 의사 결정 트리, 증거 맵, 초기 10분 점검, 플레이북, 방법론 및 KQL 팩 | 종합 |
| [참조 (Reference)](https://yeongseon.github.io/azure-communication-services-practical-guide/reference/) | CLI 치트시트, 플랫폼 제한, KQL 쿼리 및 SDK 참조 | 종합 |
| [시각화 (Visualization)](https://yeongseon.github.io/azure-communication-services-practical-guide/visualization/) | 지식 그래프, 트러블슈팅 맵 및 학습 경로 시각화 | 게시됨 |
| [메타 (Meta)](https://yeongseon.github.io/azure-communication-services-practical-guide/meta/taxonomy/) | 저장소 분류 및 콘텐츠 모델 | 게시됨 |

**상태 범례**: **랩 검증됨** = 종합 콘텐츠 + 재현 가능한 랩으로 검증 · **종합** = 전체 섹션, MSLearn 검증됨, 프로덕션 준비 완료 · **게시됨** = 핵심 콘텐츠는 준비됨, 계속 확장 중 · **진행 중** = 부분 콘텐츠, 활발히 개발 중 · **계획됨** = 자리표시자, 콘텐츠 미시작

## SDK 커버리지

- **Python** — SMS, 이메일, 채팅, 콜 자동화, 모니터링, IaC 및 레시피
- **JavaScript** — SMS, 이메일, 채팅, 영상 통화, 모니터링, IaC 및 UI 레시피
- **Java** — SMS, 이메일, 채팅, 콜 자동화, 모니터링, IaC 및 프로덕션 레시피
- **.NET** — SMS, 이메일, 채팅, 음성 통화 (Windows), 모니터링, IaC 및 프로덕션 레시피

각 SDK 트랙에는 튜토리얼 경로와 함께 관리 ID, Event Grid 웹훅, 전화번호 관리 및 이메일 첨부에 초점을 맞춘 레시피가 포함됩니다. 통화 및 Teams 상호 운용 기능은 SDK 플랫폼별로 다릅니다.

## 빠른 시작

```bash
# 저장소 복제
git clone https://github.com/yeongseon/azure-communication-services-practical-guide.git
cd azure-communication-services-practical-guide

# 가상 환경 생성 및 활성화
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# MkDocs 의존성 설치
pip install -r requirements-docs.txt

# 로컬 문서 서버 시작
mkdocs serve
```

로컬에서 `http://127.0.0.1:8000`에 접속하여 문서를 확인하세요.

## 저장소 구조

- `docs/` — 플랫폼 가이드, SDK 튜토리얼, 운영 지침, 트러블슈팅 콘텐츠 및 시각화를 위한 MkDocs 소스
- `.github/workflows/docs.yml` — GitHub Pages 배포 워크플로
- `mkdocs.yml` — 사이트 구성, 테마 설정 및 전역 네비게이션

이 저장소는 SDK 중심 문서 저장소입니다. SDK 코드 예제는 `docs/sdk-guides/` 아래 튜토리얼에 인라인으로 포함되어 있으며, 별도의 `apps/` 디렉터리는 없습니다.

## 중점 영역

- **메시징** — SMS 전송, 옵트아웃 처리, 처리량 및 관찰 가능성
- **이메일** — 도메인 확인, 전달 문제 해결, 스팸 필터링 및 첨부 파일
- **채팅** — 스레드 관리, 메시지 전달, 알림 및 실시간 메시징 패턴
- **음성 및 영상** — 통화 품질, 통화 끊김, 진단 및 운영 기준선
- **Teams 상호 운용** — 참여 흐름, 권한, 상호 운용 패턴 및 장애 격리

## 기여하기

기여는 언제나 환영합니다. 자세한 내용은 [기여 가이드](https://yeongseon.github.io/azure-communication-services-practical-guide/contributing/)를 참조하세요:

- 저장소 구조 및 콘텐츠 조직
- 문서 템플릿 및 작성 표준
- CLI 명령 스타일 및 PII 규칙
- 로컬 개발 환경 및 빌드 검증
- 풀 리퀘스트 프로세스

## 관련 프로젝트

| 저장소 | 설명 |
|---|---|
| [azure-virtual-machine-practical-guide](https://github.com/yeongseon/azure-virtual-machine-practical-guide) | Azure Virtual Machines 실무 가이드 |
| [azure-networking-practical-guide](https://github.com/yeongseon/azure-networking-practical-guide) | Azure Networking 실무 가이드 |
| [azure-storage-practical-guide](https://github.com/yeongseon/azure-storage-practical-guide) | Azure Storage 실무 가이드 |
| [azure-app-service-practical-guide](https://github.com/yeongseon/azure-app-service-practical-guide) | Azure App Service 실무 가이드 |
| [azure-functions-practical-guide](https://github.com/yeongseon/azure-functions-practical-guide) | Azure Functions 실무 가이드 |
| [azure-communication-services-practical-guide](https://github.com/yeongseon/azure-communication-services-practical-guide) | Azure Communication Services 실무 가이드 |
| [azure-container-apps-practical-guide](https://github.com/yeongseon/azure-container-apps-practical-guide) | Azure Container Apps 실무 가이드 |
| [azure-kubernetes-service-practical-guide](https://github.com/yeongseon/azure-kubernetes-service-practical-guide) | Azure Kubernetes Service (AKS) 실무 가이드 |
| [azure-architecture-practical-guide](https://github.com/yeongseon/azure-architecture-practical-guide) | Azure Architecture 실무 가이드 |
| [azure-monitoring-practical-guide](https://github.com/yeongseon/azure-monitoring-practical-guide) | Azure Monitoring 실무 가이드 |

## 면책 조항

이 프로젝트는 독립적인 커뮤니티 프로젝트입니다. Microsoft와 제휴하거나 보증을 받지 않았습니다. Azure 및 Azure Communication Services는 Microsoft Corporation의 상표입니다.

## 라이선스

[MIT](LICENSE)
