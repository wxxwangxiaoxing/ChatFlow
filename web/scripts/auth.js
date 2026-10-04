/* ==========================================================================
   ChatFlow 认证流程交互 —— 登录 / 注册 / 找回密码 三页共用
   --------------------------------------------------------------------------
   采用「按元素存在性启用」的方式：脚本对三个页面都是安全的，
   页面里没有的控件其逻辑不会运行。
   选择器一律走 data-* 属性，避免多表单共存时的 ID 冲突。
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ======================================================================
     图标
     ====================================================================== */
  var ICON = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.5 3.3M6.4 8.1A16.7 16.7 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 4-.9"/><path d="M3 3l18 18"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".7" fill="currentColor"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
  };

  /* ======================================================================
     主题
     ====================================================================== */
  var THEME_KEY = 'cf-theme';

  function currentTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    $$('[data-theme-toggle]').forEach(function (b) {
      b.innerHTML = t === 'dark' ? ICON.sun : ICON.moon;
      b.setAttribute('title', t === 'dark' ? '切换到浅色主题' : '切换到深色主题');
    });
  }

  applyTheme(currentTheme());

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-theme-toggle]')) {
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
      applyTheme(next);
    }
  });

  /* ======================================================================
     Toast
     ====================================================================== */
  var toastTimer = null;
  function toast(msg) {
    var el = $('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-show'); }, 2800);
  }

  /* ======================================================================
     图形验证码（PRD ACC-003：图形验证码防刷）
     ====================================================================== */
  var CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function refreshCaptcha(box) {
    var s = '';
    for (var i = 0; i < 4; i++) {
      s += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
    }
    box.dataset.code = s;
    box.innerHTML = s.split('').map(function (c) {
      var rot = (Math.random() * 22 - 11).toFixed(0);
      var dy = (Math.random() * 4 - 2).toFixed(0);
      return '<span style="transform:rotate(' + rot + 'deg) translateY(' + dy + 'px)">' + c + '</span>';
    }).join('');
  }

  $$('[data-captcha-refresh]').forEach(function (box) {
    refreshCaptcha(box);
    box.addEventListener('click', function () { refreshCaptcha(box); });
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-captcha-refresh]');
    if (b) refreshCaptcha(b);
  });

  /* ======================================================================
     校验规则
     ====================================================================== */
  var RULES = {
    phone:    { test: function (v) { return /^1[3-9]\d{9}$/.test(v); },
                empty: '请输入手机号', invalid: '手机号格式不正确' },
    email:    { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
                empty: '请输入邮箱地址', invalid: '邮箱格式不正确' },
    account:  { test: function (v) { return v.length >= 4; },
                empty: '请输入账号或手机号', invalid: '账号至少 4 位' },
    code:     { test: function (v) { return /^\d{6}$/.test(v); },
                empty: '请输入 6 位验证码', invalid: '验证码为 6 位数字' },
    // PRD ACC-009：≥8 位，含字母与数字
    password: { test: function (v) { return v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v); },
                empty: '请输入密码', invalid: '密码至少 8 位，且需同时包含字母和数字' },
    nickname: { test: function (v) { return v.length >= 1 && v.length <= 20; },
                empty: '请输入昵称', invalid: '昵称最多 20 个字符' }
  };

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, msg) {
    var f = fieldOf(input);
    if (!f) return;
    var box = $('.field__error', f);
    if (msg) {
      f.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (box) box.innerHTML = ICON.alert + '<span>' + msg + '</span>';
    } else {
      f.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }
  }

  function validateInput(input) {
    var rule = input.dataset.rule;
    if (!rule) return true;
    var v = input.value.trim();

    // 图形验证码：与当前显示的字符比对（不区分大小写）
    if (rule === 'captcha') {
      var box = $(input.dataset.captcha);
      if (!v) { setError(input, '请输入图形验证码'); return false; }
      if (!box || v.toUpperCase() !== String(box.dataset.code || '').toUpperCase()) {
        setError(input, '图形验证码不正确');
        if (box) refreshCaptcha(box);
        input.value = '';
        return false;
      }
      setError(input, null);
      return true;
    }

    var r = RULES[rule];
    if (!r) return true;
    if (!v) { setError(input, r.empty); return false; }
    if (!r.test(v)) { setError(input, r.invalid); return false; }

    // 确认密码
    if (input.dataset.match) {
      var other = $(input.dataset.match);
      if (other && other.value !== input.value) {
        setError(input, '两次输入的密码不一致');
        return false;
      }
    }
    setError(input, null);
    return true;
  }

  document.addEventListener('blur', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('input[data-rule]')) validateInput(t);
  }, true);

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('input[data-rule]')) {
      var f = fieldOf(t);
      if (f && f.classList.contains('has-error')) validateInput(t);
    }
  });

  /* ======================================================================
     密码可见性切换
     ====================================================================== */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-toggle-pw]');
    if (!btn) return;
    var input = $(btn.dataset.togglePw);
    if (!input) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = show ? ICON.eyeOff : ICON.eye;
    btn.setAttribute('aria-label', show ? '隐藏密码' : '显示密码');
  });

  /* ======================================================================
     密码强度
     ====================================================================== */
  function scorePassword(v) {
    if (!v) return 0;
    var score = 0;
    if (v.length >= 8) score++;
    if (v.length >= 12) score++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    if (score <= 2) return 1;
    if (score <= 4) return 2;
    return 3;
  }

  var PW_LABEL = { 0: '至少 8 位，需包含字母和数字', 1: '强度：弱', 2: '强度：中', 3: '强度：强' };

  $$('input[data-pw-meter]').forEach(function (input) {
    var meter = $(input.dataset.pwMeter);
    if (!meter) return;
    var text = $('.pw-meter__text', meter);
    input.addEventListener('input', function () {
      var lv = scorePassword(input.value);
      meter.dataset.level = String(lv);
      if (text) text.textContent = PW_LABEL[lv];
    });
  });

  /* ======================================================================
     验证码倒计时（PRD ACC-003：60s 频控）
     ====================================================================== */
  function startCountdown(btn, seconds) {
    var original = btn.dataset.label || btn.textContent.trim();
    btn.dataset.label = original;
    var left = seconds;
    btn.disabled = true;
    btn.textContent = left + 's 后重发';
    var timer = setInterval(function () {
      left--;
      if (left <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = original;
      } else {
        btn.textContent = left + 's 后重发';
      }
    }, 1000);
  }

  $$('[data-send-code]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      var target = $(btn.dataset.sendCode);
      var label = btn.dataset.sendLabel || '手机号';
      if (target && !validateInput(target)) {
        toast('请先填写正确的' + label);
        target.focus();
        return;
      }
      startCountdown(btn, 60);
      toast('验证码已发送，请注意查收');
    });
  });

  /* ======================================================================
     登录方式切换（密码 / 验证码 / 扫码）
     ====================================================================== */
  function bindTabs(tabAttr, paneAttr) {
    var tabs = $$('[' + tabAttr + ']');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute(tabAttr);
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        $$('[' + paneAttr + ']').forEach(function (p) {
          p.hidden = p.getAttribute(paneAttr) !== key;
        });
        if (key === 'qr') startQr();
      });
    });
  }

  bindTabs('data-login-tab', 'data-login-pane');
  bindTabs('data-reg-tab', 'data-reg-pane');

  /* ======================================================================
     扫码登录（PRD ACC-004：二维码 2 分钟过期、一次性）
     ====================================================================== */
  var qrTimer = null;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function qrSVG(seed) {
    var N = 25, rnd = mulberry32(seed), cells = '', reserved = {};
    function reserve(x, y, w, h) {
      for (var i = 0; i < w; i++) for (var j = 0; j < h; j++) reserved[(x + i) + ',' + (y + j)] = 1;
    }
    [[0, 0], [N - 7, 0], [0, N - 7]].forEach(function (p) { reserve(p[0] - 1, p[1] - 1, 9, 9); });
    reserve(N - 6, N - 6, 6, 6);

    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        if (reserved[x + ',' + y]) continue;
        if (rnd() > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }
    function finder(fx, fy) {
      return '<rect x="' + fx + '" y="' + fy + '" width="7" height="7" rx="1.6"/>' +
             '<rect x="' + (fx + 1) + '" y="' + (fy + 1) + '" width="5" height="5" rx="1" fill="var(--cf-surface-1)"/>' +
             '<rect x="' + (fx + 2) + '" y="' + (fy + 2) + '" width="3" height="3" rx=".6"/>';
    }
    return '<svg viewBox="-1 -1 ' + (N + 2) + ' ' + (N + 2) + '" xmlns="http://www.w3.org/2000/svg" ' +
      'fill="var(--cf-text-primary)" shape-rendering="crispEdges">' +
      cells + finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) +
      '<rect x="' + (N - 5) + '" y="' + (N - 5) + '" width="5" height="5" rx="1"/>' +
      '<rect x="' + (N - 4) + '" y="' + (N - 4) + '" width="3" height="3" rx=".6" fill="var(--cf-surface-1)"/>' +
      '<rect x="' + (N - 3) + '" y="' + (N - 3) + '" width="1" height="1" rx=".2"/>' +
      '</svg>';
  }

  function startQr() {
    var box = $('#qrCode');
    if (!box) return;
    var mask = $('#qrMask'), status = $('#qrStatus');
    var left = 120;                       // PRD ACC-004：2 分钟有效期
    box.innerHTML = qrSVG(Math.floor(Math.random() * 1e9));
    if (mask) mask.classList.remove('is-show');
    if (status) status.classList.remove('is-expired');

    clearInterval(qrTimer);
    function render() {
      if (left <= 0) {
        clearInterval(qrTimer);
        if (mask) mask.classList.add('is-show');
        if (status) {
          status.classList.add('is-expired');
          status.innerHTML = '二维码已失效，请点击刷新';
        }
        return;
      }
      if (status) {
        status.innerHTML = '请用手机扫码登录 · <strong class="num">' + left + '</strong> 秒后失效';
      }
    }
    render();
    qrTimer = setInterval(function () { left--; render(); }, 1000);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-qr-refresh]')) { startQr(); return; }
    if (e.target.closest('[data-qr-simulate]')) toast('原型演示：扫码成功，正在登录…');
  });

  if ($('[data-login-tab="qr"].is-active')) startQr();

  /* ======================================================================
     表单提交
     ====================================================================== */
  var failCount = 0;   // PRD ACC-002：连续失败 5 次锁定 15 分钟

  function validateForm(form) {
    var ok = true;
    $$('input[data-rule]', form).forEach(function (input) {
      if (!validateInput(input)) ok = false;
    });
    var agree = $('input[data-agree]', form);
    if (agree && !agree.checked) {
      var row = agree.closest('.check-row');
      if (row) row.classList.add('has-error');
      ok = false;
    }
    return ok;
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches('[data-auth-form]')) return;
    e.preventDefault();

    var agree = $('input[data-agree]', form);
    if (agree) {
      var row = agree.closest('.check-row');
      if (row) row.classList.toggle('has-error', !agree.checked);
    }
    if (!validateForm(form)) {
      toast('请检查表单中标红的项');
      var firstBad = $('.field.has-error input, .check-row.has-error input', form);
      if (firstBad) firstBad.focus();
      return;
    }

    var btn = $('[type="submit"]', form);
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = '处理中…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = original;

      var kind = form.dataset.authForm;
      if (kind === 'login') {
        failCount++;
        if (failCount >= 5) toast('密码连续错误 5 次，账号已锁定 15 分钟');
        else toast('原型演示：登录失败，密码不正确（还可尝试 ' + (5 - failCount) + ' 次）');
      } else if (kind === 'register') {
        toast('原型演示：注册成功，正在进入工作台…');
      } else if (kind === 'reset') {
        toast('原型演示：密码已重置，请用新账号登录');
      }
    }, 900);
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('input[data-agree]') && t.checked) {
      var row = t.closest('.check-row');
      if (row) row.classList.remove('has-error');
    }
  });

  /* ======================================================================
     其它演示交互
     ====================================================================== */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-sso]')) {
      toast('原型演示：跳转到企业 IdP 完成单点登录');
      return;
    }
    var copy = e.target.closest('[data-copy]');
    if (copy) {
      var text = copy.dataset.copy;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(
          function () { toast('已复制：' + text); },
          function () { toast('复制失败，请手动选择：' + text); }
        );
      } else {
        toast('内容：' + text);
      }
    }
  });

  /* ======================================================================
     首屏焦点（桌面端）
     ====================================================================== */
  var firstInput = $('.auth-card input:not([type="hidden"]):not([type="checkbox"])');
  if (firstInput && window.innerWidth >= 1024) firstInput.focus();

})();
