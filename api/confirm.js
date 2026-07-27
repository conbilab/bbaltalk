// ============================================================
//  토스페이먼츠 "결제 승인(confirm)" 서버 함수
//  - 위치: /api/confirm  (Vercel 서버리스 함수)
//  - 역할: 결제창에서 카드 인증이 끝나면, 이 서버가 토스에
//          "이 결제 진짜 승인해줘" 라고 최종 요청을 보냅니다.
//  - 중요: 시크릿 키(비밀 키)는 절대 코드에 적지 않고,
//          Vercel 환경변수 TOSS_SECRET_KEY 에서 읽어옵니다.
// ============================================================

module.exports = async (req, res) => {
  // 이 함수는 POST 요청만 받습니다.
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'POST 요청만 허용됩니다.' });
    return;
  }

  // 성공 페이지가 보내준 결제 정보 꺼내기
  // (Vercel이 JSON 본문을 자동으로 객체로 바꿔주지만, 혹시 문자열이면 직접 파싱)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const { paymentKey, orderId, amount } = body || {};

  if (!paymentKey || !orderId || amount == null) {
    res.status(400).json({ message: '결제 정보가 부족합니다. (paymentKey / orderId / amount)' });
    return;
  }

  // 환경변수에서 시크릿 키 읽기
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({
      message: '서버에 TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다. Vercel 설정에서 추가해주세요.',
    });
    return;
  }

  // 토스 인증 헤더 만들기: "시크릿키:" 를 Base64 로 인코딩 (비밀번호 자리는 비움)
  const auth = Buffer.from(secretKey + ':').toString('base64');

  try {
    // 토스에 최종 승인 요청
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey: paymentKey,
        orderId: orderId,
        amount: Number(amount),
      }),
    });

    const data = await tossRes.json();

    // 토스가 준 상태코드(200이면 승인 성공)를 그대로 전달
    res.status(tossRes.status).json(data);
  } catch (err) {
    res.status(500).json({ message: '결제 승인 중 서버 오류가 발생했습니다.', detail: String(err) });
  }
};
