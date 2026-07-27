// ============================================================
//   빨톡영어 · 사업자 정보 (전자결제 심사 필수)
//   ⭐ 아래 값만 채우면 모든 페이지 푸터에 자동으로 표시됩니다.
//
//   ※ 카드사 심사에서 이 정보가 사업자등록증과 다르면 탈락해요.
//      반드시 등록증에 적힌 그대로 입력해 주세요.
// ============================================================

window.BBALTALK_BIZ = {

  상호:        '피스웍스',              // 사업자등록증의 상호 그대로
  대표자:      '조재빈',
  사업자등록번호: '731-24-00997',
  통신판매업신고: '제0000-지역-00000호',  // ⬅️ 채워주세요 (없으면 국민카드 심사 제외)
  주소:        '사업장 주소를 입력해 주세요',  // ⬅️ 채워주세요 (등록증 주소)
  전화:        '000-0000-0000',          // ⬅️ 채워주세요 (유선·휴대폰·대표번호 모두 가능)
  이메일:      'paigraphy@gmail.com',
  개인정보책임자: '조재빈',

  서비스명:    '빨톡영어',
  카카오톡:    'https://open.kakao.com/o/spBZLsU',
};

// ============================================================
//   아래는 건드리지 않으셔도 됩니다 (푸터 자동 생성)
// ============================================================
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function render() {
    if (document.getElementById('bbtBizFooter')) return;
    var B = window.BBALTALK_BIZ || {};

    var css = ''
      + '#bbtBizFooter{background:#1a1c1f;color:#8b9199;padding:34px 20px 40px;'
      + 'font-family:Pretendard,system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;'
      + 'font-size:12.5px;line-height:1.85;position:relative;z-index:1}'
      + '#bbtBizFooter .bz-in{max-width:860px;margin:0 auto}'
      + '#bbtBizFooter .bz-links{display:flex;flex-wrap:wrap;gap:8px 18px;margin-bottom:16px;'
      + 'padding-bottom:15px;border-bottom:1px solid #2b2f34}'
      + '#bbtBizFooter .bz-links a{color:#e4e7ea;text-decoration:none;font-weight:700;font-size:13px}'
      + '#bbtBizFooter .bz-links a:hover{color:#ff6b6b}'
      + '#bbtBizFooter .bz-row{margin:0}'
      + '#bbtBizFooter .bz-row span{white-space:nowrap}'
      + '#bbtBizFooter .bz-sep{color:#41464c;margin:0 7px}'
      + '#bbtBizFooter .bz-copy{margin-top:14px;color:#5f656c;font-size:11.5px}'
      + '#bbtBizFooter .bz-note{margin-top:10px;color:#5f656c;font-size:11.5px}'
      + '@media(max-width:600px){#bbtBizFooter .bz-sep{display:none}'
      + '#bbtBizFooter .bz-row span{display:block;white-space:normal}}';

    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    var f = document.createElement('footer');
    f.id = 'bbtBizFooter';

    var sep = '<b class="bz-sep">|</b>';
    f.innerHTML =
      '<div class="bz-in">' +
        '<div class="bz-links">' +
          '<a href="/terms.html">이용약관</a>' +
          '<a href="/privacy.html"><b>개인정보처리방침</b></a>' +
          '<a href="/refund.html">환불·취소 규정</a>' +
          '<a href="' + esc(B.카카오톡 || '#') + '" target="_blank" rel="noopener">고객센터</a>' +
        '</div>' +
        '<p class="bz-row">' +
          '<span>상호 : ' + esc(B.상호) + '</span>' + sep +
          '<span>대표자 : ' + esc(B.대표자) + '</span>' + sep +
          '<span>사업자등록번호 : ' + esc(B.사업자등록번호) + '</span>' + sep +
          '<span>통신판매업신고 : ' + esc(B.통신판매업신고) + '</span>' +
        '</p>' +
        '<p class="bz-row">' +
          '<span>주소 : ' + esc(B.주소) + '</span>' + sep +
          '<span>전화 : ' + esc(B.전화) + '</span>' + sep +
          '<span>이메일 : ' + esc(B.이메일) + '</span>' +
        '</p>' +
        '<p class="bz-row"><span>개인정보보호책임자 : ' + esc(B.개인정보책임자) + '</span></p>' +
        '<p class="bz-note">결제는 토스페이먼츠를 통해 안전하게 처리되며, ' + esc(B.상호) +
          '은(는) 수강 신청 및 교습 서비스 제공의 당사자로서 책임을 집니다.</p>' +
        '<p class="bz-copy">© ' + esc(B.서비스명) + '. All rights reserved.</p>' +
      '</div>';

    document.body.appendChild(f);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
