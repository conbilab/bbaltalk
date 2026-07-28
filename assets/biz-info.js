// ============================================================
//   빨톡영어 · 사업자 정보 (전자결제 심사 필수)
//   ⭐ 아래 값만 채우면 모든 페이지 푸터에 자동으로 표시됩니다.
//
//   ※ 카드사 심사에서 이 정보가 사업자등록증과 다르면 탈락해요.
//      반드시 등록증에 적힌 그대로 입력해 주세요.
// ============================================================

window.BBALTALK_BIZ = {

  // ▼ 사업자등록증과 100% 동일하게 (심사 기준 1번)
  상호:        '콘텐츠 비즈니스 연구소',
  대표자:      '조재빈',
  사업자등록번호: '731-24-00997',
  주소:        '대전광역시 유성구 테크노5로 43-4(관평동)',
  전화:        '010-9413-0359',          // 휴대폰번호도 유선번호 대체 인정
  // ▲ 여기까지가 심사 필수 5개 항목

  통신판매업신고: '2023-대전유성-1268',
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

    // 값이 비어있는 항목은 표시하지 않습니다.
    // (미입력 자리표시자가 노출되면 심사에서 오히려 감점돼요)
    function row(pairs) {
      var out = pairs
        .filter(function (p) { return p[1] && String(p[1]).trim(); })
        .map(function (p) { return '<span>' + esc(p[0]) + ' : ' + esc(p[1]) + '</span>'; });
      return out.length ? '<p class="bz-row">' + out.join(sep) + '</p>' : '';
    }

    f.innerHTML =
      '<div class="bz-in">' +
        '<div class="bz-links">' +
          '<a href="/terms.html">이용약관</a>' +
          '<a href="/privacy.html"><b>개인정보처리방침</b></a>' +
          '<a href="/refund.html">환불·취소 규정</a>' +
          '<a href="' + esc(B.카카오톡 || '#') + '" target="_blank" rel="noopener">고객센터</a>' +
        '</div>' +
        row([['상호', B.상호], ['대표자', B.대표자], ['사업자등록번호', B.사업자등록번호],
             ['통신판매업신고', B.통신판매업신고]]) +
        row([['사업장 주소', B.주소], ['전화', B.전화], ['이메일', B.이메일]]) +
        row([['개인정보보호책임자', B.개인정보책임자]]) +
        '<p class="bz-note">' + esc(B.상호) +
          '은(는) 수강 신청 및 교습 서비스 제공의 당사자로서 책임을 집니다.</p>' +
        '<p class="bz-copy">© ' + esc(B.서비스명) + ' · ' + esc(B.상호) + '. All rights reserved.</p>' +
      '</div>';

    document.body.appendChild(f);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
