export default {
  common: {
    loading: "로딩 중...",
    readMore: "더 보기",
    copySuccess: "복사됨",
    applyNow: "지금 신청하기",
    stayTuned: "곧 공개됩니다",
    eventEnded: "이벤트 종료",
    connectWallet: "지갑 연결",
  },
  nav: {
    events: "이벤트",
    news: "뉴스",
    projects: "프로젝트",
    activities: "활동",
    consensus: "합의 대회",
    rankings: "순위",
    explore: "탐색",
    redpacket: "red packet",
    card: "card",
    profile: "profile",
    tokens: "토큰"
  },
  home: {
    slogan: "$HSK 스테이킹",
    description: "$HSK를 스테이킹하여 $HSK 획득",
    buttonJoin: {
      text: "스테이킹",
      link: "https://www.hskhodlium.xyz/"
    },
    buttonReview: {
      text: "모든 프로젝트",
      link: "/projects"
    },
    events: [
      {
        id: 1,
        title: "해커톤 타이이",
        description: "HashKey Chain 첫 번째 서울 해커톤",
        link: "https://lu.ma/va084lwn",
        date: "2025-03-28"
      },
      {
        id: 2,
        title: "HashKey Chain 밋업 - 타이페이",
        description: "타이페이에서 HashKey Chain의 미래에 대해 논의하세요",
        link: "https://lu.ma/3z9rzm6v",
        date: "2025-04-01"
      }
    ]
  },
  events: {
    title: "이벤트",
    current: "현재 이벤트",
    upcoming: "예정된 이벤트",
    past: "지난 이벤트",
    comingSoon: "곧 공개"
  },
  news: {
    title: "뉴스 센터",
    notFound: "기사를 찾을 수 없습니다",
    backToNews: "뉴스로 돌아가기",
    readMore: "더 읽기"
  },
  projects: {
    title: "프로젝트",
    loading: "로딩 중...",
    copySuccess: "복사됨",
    points: "포인트",
    extraPoints: "추가 포인트",
    verifiedWallet: "인증된 지갑",
    verifiedProject: "인증된 프로젝트",
    interactionReward: "상호작용 보상",
    searchPlaceholder: "프로젝트 검색...",
    foundResults: "{{count}}개의 프로젝트 발견",
    noResults: "프로젝트를 찾을 수 없습니다",
  },
  partners: {
    title: "파트너",
    collaborators: "협력사",
    mediaPartners: "미디어 파트너",
    interested: "파트너십에 관심이 있으신가요?",
    description: "파트너십에 관심이 있으시다면 연락해 주세요!",
    apply: "파트너십 신청"
  },
  redpacket: {
    title: "레드 패킷",
    claim: {
      button: "받기",
      processing: "처리 중...",
      success: "성공적으로 받았습니다",
      connect: "세부 정보를 보려면 지갑을 연결하세요"
    },
    share: {
      button: "공유",
      title: "레드 패킷을 보냈습니다",
      claimed: "받음",
      totalValue: "총 가치",
      remaining: "남음",
      remainingCount: "{{remaining}} / {{total}} 남음",
      from: "보낸 사람",
      saveImage: "이미지 저장",
      close: "닫기",
      scanQR: "스캔하여 받기",
      creatorInfo: "총 가치 {{totalAmount}}{{unit}}, {{remaining}}{{count}} 남음",
      remainingStatus: "{{count}}/{{total}} 남음",
      noRemaining: "더 이상 패킷이 없습니다",
    },
    details: {
      title: "세부 정보",
      totalAmount: "총액",
      progress: "진행 상황",
      myClaim: "내가 받은 것",
      claimRecords: "받기 기록",
      noRecords: "기록 없음",
      creatorInfo: "생성자 정보",
      creator: "생성자",
      remainingAmount: "남은 금액",
      loading: "로딩 중...",
      luckiest: "최고 행운",
      refundStatus: "환불 상태",
    },
    unit: "HSK",
    count: "패킷",
    create: {
      title: "레드 패킷 보내기",
      form: {
        message: "메시지",
        messagePlaceholder: "부와 번영을 위한 최고의 소망",
        amount: "금액",
        amountPlaceholder: "총액 입력",
        count: "개수",
        countPlaceholder: "패킷 수 입력",
        submit: "보내기",
        processing: "처리 중...",
        success: "성공적으로 보냈습니다"
      },
      validation: {
        messageRequired: "메시지가 필요합니다",
        amountRequired: "금액이 필요합니다",
        amountMin: "금액은 0보다 커야 합니다",
        countRequired: "개수가 필요합니다",
        countMin: "개수는 0보다 커야 합니다",
        countInteger: "개수는 정수여야 합니다"
      },
      connect: "레드 패킷을 보내려면 지갑을 연결하세요",
      preview: "레드 패킷 미리보기",
      success: {
        title: "성공적으로 생성되었습니다!",
        amount: "금액",
        count: "개수",
        message: "메시지",
        view: "레드 패킷 보기"
      }
    },
    history: {
      title: "레드 패킷 기록",
      created: "보낸 것",
      received: "받은 것",
      empty: "기록 없음",
      loading: "로딩 중...",
      connect: "기록을 보려면 지갑을 연결하세요",
      amount: "금액",
      count: "개수",
      date: "날짜",
      status: {
        active: "활성",
        completed: "완료됨"
      }
    },
    refund: {
      button: "환불",
      processing: "환불 처리 중...",
      success: "환불 성공"
    },
    status: {
      refunded: "레드 패킷이 환불되었습니다",
    }
  }
} 