// ============================================================
//  빨톡영어 · 토스페이먼츠 카드결제 엔진
//  (이 파일은 고치실 필요 없어요. 키·가격은 toss-config.js 에 있습니다)
//
//  페이지에 아래 3줄만 넣으면 동작합니다:
//    <script src="https://js.tosspayments.com/v2/standard"></script>
//    <script src="/assets/toss-config.js"></script>
//    <script src="/assets/toss-pay.js"></script>
//
//  사용법:
//    openPaySheet('travel')            // 해당 수업 결제창(시트) 열기
//    payWithCard(429000, '수업명')      // 금액 지정해 바로 결제
//    <button data-pay-amount="429000" data-pay-name="수업명">결제</button>
//    <button data-pay-open="1on1">카드로 결제하기</button>
// ============================================================

(function () {
  'use strict';

  function won(n) {
    try { return '₩' + Number(n).toLocaleString('ko-KR'); }
    catch (e) { return '₩' + n; }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  // 주문번호(고유값) 생성 — 결제마다 반드시 달라야 합니다.
  function makeOrderId() {
    return 'bbaltalk_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  // ---------- 결제창 띄우기 ----------
  async function payWithCard(amount, orderName) {
    var clientKey = window.TOSS_CLIENT_KEY;

    if (!clientKey || String(clientKey).indexOf('여기에') !== -1) {
      alert('토스 클라이언트 키가 아직 설정되지 않았어요.\n\nassets/toss-config.js 파일의\nwindow.TOSS_CLIENT_KEY 값을 실제 키로 바꿔주세요.');
      return;
    }
    if (typeof TossPayments === 'undefined') {
      alert('결제 모듈을 불러오는 중이에요. 잠시 후 다시 눌러주세요.');
      return;
    }

    amount = Number(amount);
    if (!amount || amount < 100) { alert('결제 금액이 올바르지 않습니다.'); return; }

    try {
      var tossPayments = TossPayments(clientKey);
      var payment = tossPayments.payment({ customerKey: 'ANONYMOUS' }); // 비회원 결제

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: amount },
        orderId: makeOrderId(),
        orderName: (orderName || '빨톡영어 수업').slice(0, 100),
        successUrl: window.location.origin + '/success.html',
        failUrl: window.location.origin + '/fail.html',
      });
    } catch (e) {
      // 사용자가 결제창을 그냥 닫은 경우는 에러가 아님
      var code = e && e.code;
      if (code === 'USER_CANCEL' || code === 'PAY_PROCESS_CANCELED') return;
      console.error('[결제 시작 오류]', e);
      alert('결제를 시작하지 못했어요.\n' + ((e && e.message) ? e.message : e));
    }
  }

  // ---------- 수업별 결제 시트(모달) ----------
  var SHEET_ID = 'bbtPaySheet';

  function injectStyle() {
    if (document.getElementById('bbtPayStyle')) return;
    var css = ''
      + '#' + SHEET_ID + '{position:fixed;inset:0;z-index:99999;display:none}'
      + '#' + SHEET_ID + '.on{display:block}'
      + '#' + SHEET_ID + ' .bbt-dim{position:absolute;inset:0;background:rgba(0,0,0,.5)}'
      + '#' + SHEET_ID + ' .bbt-panel{position:absolute;left:0;right:0;bottom:0;background:#fff;'
      + 'border-radius:20px 20px 0 0;max-height:88vh;overflow-y:auto;-webkit-overflow-scrolling:touch;'
      + 'padding:8px 18px 28px;animation:bbtUp .25s ease;max-width:560px;margin:0 auto;'
      + 'font-family:Pretendard,system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}'
      + '@keyframes bbtUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}'
      + '#' + SHEET_ID + ' .bbt-grip{width:44px;height:5px;border-radius:9px;background:#e2e5e9;margin:8px auto 14px}'
      + '#' + SHEET_ID + ' .bbt-h{font-size:18px;font-weight:800;color:#1a1a1a;margin:0 0 3px;line-height:1.35}'
      + '#' + SHEET_ID + ' .bbt-s{font-size:13px;color:#8a8f96;margin:0 0 16px}'
      + '#' + SHEET_ID + ' .bbt-g{font-size:12px;font-weight:800;color:#e63535;background:#fff3f3;'
      + 'display:inline-block;padding:4px 11px;border-radius:20px;margin:16px 0 9px}'
      + '#' + SHEET_ID + ' .bbt-i{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;'
      + 'border:1.5px solid #eceff2;background:#fff;border-radius:14px;padding:14px 15px;margin-bottom:9px;'
      + 'cursor:pointer;text-align:left;font-family:inherit;transition:.15s}'
      + '#' + SHEET_ID + ' .bbt-i:hover{border-color:#e63535;background:#fffafa}'
      + '#' + SHEET_ID + ' .bbt-i:active{transform:scale(.99)}'
      + '#' + SHEET_ID + ' .bbt-n{font-size:14.5px;font-weight:700;color:#1a1a1a;display:block;margin-bottom:2px}'
      + '#' + SHEET_ID + ' .bbt-was{font-size:12px;color:#b9bec4;text-decoration:line-through;margin-right:6px}'
      + '#' + SHEET_ID + ' .bbt-bd{font-size:11px;font-weight:800;color:#e63535}'
      + '#' + SHEET_ID + ' .bbt-p{font-size:17px;font-weight:800;color:#e63535;white-space:nowrap}'
      + '#' + SHEET_ID + ' .bbt-p small{display:block;font-size:11px;color:#b0b5bb;font-weight:600;text-align:right;margin-top:1px}'
      + '#' + SHEET_ID + ' .bbt-x{position:absolute;top:14px;right:16px;border:0;background:#f3f4f6;width:32px;height:32px;'
      + 'border-radius:50%;font-size:19px;line-height:1;color:#7a7f86;cursor:pointer}'
      + '#' + SHEET_ID + ' .bbt-note{font-size:12px;color:#a0a5ab;line-height:1.65;margin-top:16px;text-align:center}'
      + '#' + SHEET_ID + ' .bbt-note a{color:#e63535;font-weight:700;text-decoration:none}';
    var st = document.createElement('style');
    st.id = 'bbtPayStyle';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function closePaySheet() {
    var el = document.getElementById(SHEET_ID);
    if (el) el.classList.remove('on');
    document.body.style.overflow = '';
  }

  function openPaySheet(classKey) {
    var cat = window.BBALTALK_CATALOG || {};
    var cls = cat[classKey];
    if (!cls) {
      // 수업 정보가 없으면 전체 결제 페이지로 이동
      window.location.href = '/checkout.html';
      return;
    }
    // 정원 마감된 수업은 결제 대신 안내
    if (cls.soldOut) {
      alert(cls.title + '은(는) 현재 정원이 마감되어 결제하실 수 없어요.\n\n대기 신청을 해주시면 자리가 나는 대로 안내드립니다.');
      return;
    }

    injectStyle();

    var el = document.getElementById(SHEET_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = SHEET_ID;
      el.innerHTML = '<div class="bbt-dim"></div><div class="bbt-panel"></div>';
      document.body.appendChild(el);
      el.querySelector('.bbt-dim').addEventListener('click', closePaySheet);
    }

    var html = '<button class="bbt-x" type="button" aria-label="닫기">&times;</button>'
             + '<div class="bbt-grip"></div>'
             + '<p class="bbt-h">' + esc(cls.title) + '</p>'
             + '<p class="bbt-s">' + esc(cls.sub || '') + ' · 결제하실 패키지를 선택하세요</p>';

    var lastGroup = null;
    (cls.items || []).forEach(function (it) {
      if (it.group && it.group !== lastGroup) {
        html += '<div class="bbt-g">' + esc(it.group) + '</div>';
        lastGroup = it.group;
      }
      var perMonth = '';
      html += '<button class="bbt-i" type="button" data-pay-amount="' + it.price + '"'
            + ' data-pay-name="' + esc(cls.title.replace(/^\S+\s*/, '') + ' · ' + it.name) + '">'
            +   '<span>'
            +     '<span class="bbt-n">' + esc(it.name) + '</span>'
            +     (it.was ? '<span class="bbt-was">' + won(it.was) + '</span>' : '')
            +     (it.badge ? '<span class="bbt-bd">' + esc(it.badge) + ' 할인</span>' : '')
            +   '</span>'
            +   '<span class="bbt-p">' + won(it.price) + perMonth + '</span>'
            + '</button>';
    });

    html += '<p class="bbt-note">카드결제는 토스페이먼츠로 안전하게 처리됩니다.<br>'
          + '계좌이체를 원하시면 <a href="https://open.kakao.com/o/spBZLsU" target="_blank" rel="noopener">카카오톡 1:1 상담</a>으로 문의해 주세요.</p>';

    var panel = el.querySelector('.bbt-panel');
    panel.innerHTML = html;
    panel.scrollTop = 0;
    panel.querySelector('.bbt-x').addEventListener('click', closePaySheet);

    el.classList.add('on');
    document.body.style.overflow = 'hidden';
  }

  // ---------- 전역 노출 ----------
  window.payWithCard = payWithCard;
  window.openPaySheet = openPaySheet;
  window.closePaySheet = closePaySheet;

  // ---------- 자동 연결 (data 속성) ----------
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;

    var opener = t.closest('[data-pay-open]');
    if (opener) {
      ev.preventDefault();
      openPaySheet(opener.getAttribute('data-pay-open'));
      return;
    }

    var btn = t.closest('[data-pay-amount]');
    if (btn) {
      ev.preventDefault();
      payWithCard(btn.getAttribute('data-pay-amount'),
                  btn.getAttribute('data-pay-name') || (btn.textContent || '').trim());
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePaySheet();
  });
})();
