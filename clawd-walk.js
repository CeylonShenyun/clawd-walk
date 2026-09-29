/*!
 * clawd-walk — 像素 clawd 叼着信，沿红蓝航空虚线走向小木屋的加载条。
 * 它会看日子和天气换衣服：生日捧蛋糕、纪念日抱花、中秋叼月饼、圣诞戴帽子、下雨撑伞、天冷围围巾、夜里提灯……
 * 零依赖，一个文件，没有图片文件（衣服、小木屋都是代码里的像素画，clawd 是内嵌的一帧）。MIT License（clawd 那帧除外，见 README）.
 * https://github.com/CeylonShenyun/clawd-walk
 */
(function (global) {
  'use strict';

  // ── 像素画：一行一串字符，字符查调色板，同色连着的合成一个 rect ──
  function pix(rows, pal) {
    var w = rows[0].length, h = rows.length, out = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" shape-rendering="crispEdges">';
    for (var y = 0; y < h; y++) {
      var r = rows[y], x = 0;
      while (x < w) {
        var ch = r.charAt(x), c = pal[ch];
        if (!c) { x++; continue; }
        var x0 = x; while (x < w && r.charAt(x) === ch) x++;
        out += '<rect x="' + x0 + '" y="' + y + '" width="' + (x - x0) + '" height="1" fill="' + c + '"/>';
      }
    }
    return out + '</svg>';
  }

  // clawd 本体：clawd-on-desk（github.com/rullerzhou-afk/clawd-on-desk）idle 动图里的一帧，版权归原作者
  var CLAWD = 'data:image/webp;base64,UklGRlABAABXRUJQVlA4TEMBAAAvYwAQEM+gqJEkZZmf61/pgQ0FbSQpx3fPKOD9m3y1bdswSi9T/n828x8A1OTmrmgpe+k99h3NTtSwmV7NS9LkNJnPpkqIViwMZ0coEBUiEPERDDj/wXEjSYq0tzywzOu/pUMtOv5E9F+R27aNA6StTm4633Cn41zOWQq/EbGe2y6E7xjJ6Z8zRmL65walfyfWRelyZfDVslVZuKx4cJ35yDW+WjoPDDY8uAml8Gse6lHz4EgaveaJxIPjhMcmSi8Fr1IxUBlmjPEGzHqRg88r7Q2YtSC8HGlv0Kx5MWYl3iHuVOuyGvB40K1yuefB67zOy7yueLxF/rBYCqfFfByLpXBazMefHd/pWL6Pf/Y/DeMDWMuoIuT+CASsZVQROn90AtYyWls6f3SK1hPYG+T+/kB4nHzuQw2hCzp/dMpY42egGwA=';

  // 红蓝航空条纹的伞：左边那只小爪握着伞柄，CSS 再往前倾一点
  function umbrella() {
    var rows = ['........k........', '......brrrb......', '....bbbrrrbbb....', '..rbbbbrrrbbbbr..', '.rrbbbbrrrbbbbrr.', 'rrrbbbbrrrbbbbrrr', 'r.r.bb.r.r.bb.r.r'];
    for (var i = 0; i < 10; i++) rows.push('........k........');
    rows.push('......k.k........', '......kkk........');
    return pix(rows, { k: '#5a3a28', r: '#cc3a31', b: '#27488a' });
  }

  var LETTER = '<svg viewBox="0 0 15 11" width="15" height="11"><rect x=".5" y=".5" width="14" height="10" rx="1" fill="#fbf8f0" stroke="#b9ad98" stroke-width=".6"/>' +
    '<path d="M.8 .9 7.5 6.2 14.2 .9" fill="none" stroke="#b9ad98" stroke-width=".7"/>' +
    '<path d="M1 10h2l1-1H2zM5 10h2l1-1H6zM9 10h2l1-1h-2z" fill="#cc3a31"/><path d="M3 10h2l1-1H4zM7 10h2l1-1H8zM11 10h2l1-1h-2z" fill="#27488a"/>' +
    '<circle cx="7.5" cy="6.4" r="1.5" fill="#8c1c24"/></svg>';

  var CABIN = '<svg class="cw-cabin" viewBox="0 0 15 13"><rect x="11" y="0" width="2" height="3" fill="#5a3a28"/><rect x="4" y="1" width="7" height="1" fill="#f7f4ec"/>' +
    '<rect x="3" y="2" width="9" height="1" fill="#f7f4ec"/><rect x="2" y="3" width="11" height="1" fill="#f7f4ec"/><rect x="1" y="4" width="13" height="1" fill="#dcd6ca"/>' +
    '<rect x="2" y="5" width="11" height="7" fill="#8a5a3c"/><rect x="2" y="7" width="11" height="1" fill="#7a4d33"/><rect x="2" y="10" width="11" height="1" fill="#7a4d33"/>' +
    '<rect x="3" y="6" width="3" height="3" fill="#f2c94c"/><rect x="4" y="6" width="1" height="3" fill="#e0a93a"/><rect x="8" y="7" width="3" height="5" fill="#4a2e20"/>' +
    '<rect x="0" y="12" width="15" height="1" fill="#f7f4ec"/></svg>';

  // ── 衣柜：slot = cr 嘴里/手上 · ov 头上 · nk 脖子；k = 放大倍数 ──
  var ITEMS = {
    letter: { slot: 'cr', html: LETTER, k: 1 },
    flower: { slot: 'cr', k: 1.7, html: pix(['.pp.pp.', 'ppppppp', 'ppyyypp', 'ppppppp', '.pp.pp.', '...g...', '...g.ll', '...gll.', '...g...', '...g...'],
      { p: '#e8849a', y: '#f2c94c', g: '#5b8a3a', l: '#7fae52' }) },
    bouquet: { slot: 'cr', k: 1.55, html: pix(['.rr..yy..pp', 'rrrryyyyppp', 'rrrryyyyppp', '.rrg.yyg.pp', '..g..g..g..', '..kgggggk..', '..kkgggkk..', '...kkgkk...', '...kkkkk...', '....kkk....', '....kkk....'],
      { r: '#d6453d', y: '#f2c94c', p: '#e8849a', g: '#5b8a3a', k: '#c9a77c' }) },
    cake: { slot: 'cr', k: 1.6, html: pix(['.....f.....', '.....c.....', '..pppcppp..', '.ppppppppp.', '.pbpbppbpp.', '.bbbbbbbbb.', '.jjjjjjjjj.', '.bbbbbbbbb.', 'ddddddddddd'],
      { f: '#f2c94c', c: '#6c9bd2', p: '#e8849a', b: '#f7d9a8', j: '#d6453d', d: '#e0d8c8' }) },
    mooncake: { slot: 'cr', k: 1.5, html: pix(['...oooo...', '.ooOOOOoo.', '.oOoOOoOo.', 'oOOOooOOOo', 'oOOoyyoOOo', 'oOOoyyoOOo', 'oOOOooOOOo', '.oOoOOoOo.', '.ooOOOOoo.', '...oooo...'],
      { o: '#a86a2a', O: '#c98a3c', y: '#f2c94c' }) },
    suitcase: { slot: 'cr', k: 1.5, html: pix(['....hhhh....', '....h..h....', 'cccccccccccc', 'cbbccccccccc', 'cbbcccccwwcc', 'cccccccccccc', 'dddddddddddd', 'cccccccccccc', 'cccccccccccc', '.k........k.'],
      { h: '#5a3a28', c: '#c8703a', b: '#27488a', w: '#f7f4ec', d: '#a8572a', k: '#4a2e20' }) },
    lantern: { slot: 'cr', k: 1.6, glow: true, html: pix(['...kk...', '...k....', '..kkkk..', '.kyyyyk.', '.kyYYyk.', '.kyYYyk.', '.kyyyyk.', '..kkkk..', '...kk...'],
      { k: '#5a3a28', y: '#f2c94c', Y: '#fff1b8' }) },
    flag: { slot: 'cr', k: 1.5, html: pix(['srrrwbwrrrrr', 'srrrwbwrrrrr', 'swwwwbwwwwww', 'sbbbbbbbbbbb', 'swwwwbwwwwww', 'srrrwbwrrrrr', 'srrrwbwrrrrr', 's...........', 's...........'],
      { s: '#8a5a3c', r: '#ba0c2f', w: '#ffffff', b: '#00205b' }) },
    umbrella: { slot: 'ov', k: 2, html: umbrella() },
    santa: { slot: 'ov', k: 2, html: pix(['.....rrrr....', '....rrrrrRR..', '...rrrrrR.RR.', '...rrrrRR..ww', '..rrrrrrRR.wg', '.rrrrrrrrRR..', 'wwwwwwwwwwwww', 'ggwwwwwwwwwgg'],
      { r: '#cc3a31', R: '#a52c25', w: '#f7f4ec', g: '#dcd6ca' }) },
    heart: { slot: 'ov', k: 1.5, float: true, html: pix(['.hh.hh.', 'hhhhhhh', 'hhhhhhh', '.hhhhh.', '..hhh..', '...h...'], { h: '#e05a6a' }) },
    scarf: { slot: 'nk', k: 1.4, html: pix(['rrwwrrwwrrwwrrww', 'rrwwrrwwrrwwrrww', '..........rrw...', '..........rrw...', '..........wrr...'],
      { r: '#cc3a31', w: '#f7f4ec' }) }
  };

  var CSS =
    '.cw{position:relative;width:var(--cw-width,240px);height:64px;pointer-events:none;font-family:var(--cw-font,"Dancing Script",cursive)}' +
    '.cw .cw-rt{position:absolute;left:0;right:34px;top:44px;height:3px;border-radius:1.5px;' +
      'background:repeating-linear-gradient(90deg,#cc3a31 0 7px,transparent 7px 11px,#27488a 11px 18px,transparent 18px 22px)}' +
    '.cw .cw-rt0{opacity:.26}.cw .cw-rt1{opacity:.9;clip-path:inset(0 100% 0 0)}' +
    '.cw svg.cw-cabin{position:absolute;right:0;top:20px;width:30px;height:26px;shape-rendering:crispEdges}' +
    '.cw .cw-wk{position:absolute;left:0;top:0;width:44px;height:44px;margin-left:-8px;will-change:transform}' +
    '.cw .cw-bob{position:absolute;left:0;bottom:0;width:44px;height:30px;animation:cwBob .5s steps(1,end) infinite}' +
    '.cw .cw-cl{position:absolute;left:4px;bottom:-1.8px;width:30px;height:19.5px;image-rendering:pixelated;clip-path:inset(0 0 9.3% 0)}' +   // 裁掉底下那条影子
    '.cw .cr,.cw .ov,.cw .nk{position:absolute;display:block;line-height:0}' +
    '.cw .cr{left:24px;bottom:3px;transform:rotate(-8deg);transform-origin:0 100%}' +
    '.cw .cr.glow:before{content:"";position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:radial-gradient(rgba(255,214,120,.55),rgba(255,214,120,0) 70%)}' +
    '.cw .ov{left:5px;bottom:14px}' +
    '.cw .ov.santa{left:6px;bottom:15.7px}' +                                                              // 帽檐比脑袋两边各宽一格，压住头顶一格
    '.cw .ov.umbrella{left:-11px;bottom:4.7px;transform:rotate(14deg);transform-origin:17px 33px}' +        // 握柄对准左边小爪
    '.cw .ov.heart{left:14px;bottom:23px;animation:cwFloat 1.6s ease-in-out infinite alternate}' +
    '.cw .nk{left:8px;bottom:3px}' +
    '.cw .cr svg,.cw .ov svg,.cw .nk svg{display:block;position:relative}' +
    '.cw .cw-tx{position:absolute;left:-40px;right:-40px;top:56px;text-align:center;font-weight:700;font-size:16px;line-height:1;color:var(--cw-ink,#6a5c4e);opacity:.8;white-space:nowrap}' +
    '@keyframes cwFloat{from{transform:translate3d(0,0,0)}to{transform:translate3d(0,-3px,0)}}' +
    '@keyframes cwBob{0%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-2px,0)}}' +
    '@media (prefers-reduced-motion:reduce){.cw .cw-bob,.cw .ov.heart{animation:none}}' +
    '.cw-veil{position:fixed;inset:0;z-index:2147483600;background:var(--cw-paper,#e9e8e0);display:flex;align-items:center;justify-content:center;transition:opacity .6s ease}' +
    '.cw-veil.cw-off{opacity:0}';

  var injected = false;
  function injectCSS() {
    if (injected || typeof document === 'undefined') return;
    injected = true;
    var st = document.createElement('style'); st.setAttribute('data-clawd-walk', ''); st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  // ── 今天穿哪身 ──
  var MID_AUTUMN = ['2024-09-17', '2025-10-06', '2026-09-25', '2027-09-15', '2028-10-03', '2029-09-22', '2030-09-12', '2031-10-01', '2032-09-19',
    '2033-09-08', '2034-09-27', '2035-09-16', '2036-10-04', '2037-09-24', '2038-09-13', '2039-10-02', '2040-09-20', '2041-09-10', '2042-09-28',
    '2043-09-17', '2044-10-05', '2045-09-25', '2046-09-15', '2047-10-04', '2048-09-22', '2049-09-11', '2050-09-30', '2051-09-19', '2052-09-07',
    '2053-09-26', '2054-09-16', '2055-10-05', '2056-09-24', '2057-09-13', '2058-10-02', '2059-09-21', '2060-09-09'];

  var TEXTS = {
    walk: 'på vei hjem',                     // 在回家的路上
    trip: 'vi drar hjem',                    // 我们回家啦
    flower: 'en blomst til deg',             // 给你一朵花
    anniversary: 'gratulerer med oss',       // 恭喜我们
    birthday: 'gratulerer med dagen',        // 生日快乐
    midAutumn: 'god midthøstfest',           // 中秋快乐
    christmas: 'god jul',                    // 圣诞快乐
    norway: 'hipp hurra for 17. mai'         // 五月十七，万岁！（挪威国庆）
  };

  var DEFAULTS = {
    birthday: null,        // '03-21'，或者农历生日每年不一样就写一串 ['2026-04-18', '2027-04-07']
    name: '',              // 生日那天那句后面带上名字：gratulerer med dagen, xxx
    anniversary: null,     // '07-07' 在一起的纪念日：抱一束花，头上飘小心心
    monthly: 0,            // 每月这一天叼一朵花（比如 20），0 = 不要
    trips: [],             // [{ from: '2026-10-01', to: '2026-10-07', text: 'vi drar hjem' }] 这几天拎行李箱
    days: [],              // 自己加的日子 [{ date: '02-14', carry: 'flower', over: 'heart', text: '...' }]，date 可以是 'MM-DD' 或 'YYYY-MM-DD'
    midAutumn: true,       // 中秋叼月饼（内置 2024~2060 的日子）
    christmas: true,       // 12-24、12-25 戴圣诞帽
    norway: true,          // 5 月 17 日（挪威国庆）举小国旗
    night: [19, 6],        // 夜里（19 点到第二天 6 点）叼一盏小灯；false = 不要
    weather: false,        // { lat, lon } 自己去 open-meteo 查（免 key），或者直接给 { key: 'rain'|'storm'|'snow'|'clear', temp: 10 }
    cold: 12,              // 气温 ≤ 这个度数就围围巾
    texts: {}              // 覆盖底下那行字，键见 TEXTS
  };

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in (b || {})) if (b[k] !== undefined) o[k] = b[k]; return o; }
  function sameDay(spec, today) {   // spec: 'MM-DD' | 'YYYY-MM-DD' | [..]
    if (!spec) return false;
    if (Array.isArray(spec)) return spec.some(function (s) { return sameDay(s, today); });
    spec = String(spec);
    return spec.length === 5 ? spec === today.slice(5) : spec === today;
  }

  /** 按日子、钟点和天气挑今天这一身：{ carry, over, neck, text } */
  function today(opts, now, wx) {
    var o = merge(DEFAULTS, opts), T = merge(TEXTS, o.texts);
    now = now || new Date();
    var t = ymd(now), h = now.getHours();
    var r = { carry: 'letter', over: '', neck: '', text: T.walk };
    if (o.night && (h >= o.night[0] || h < o.night[1])) r.carry = 'lantern';
    if (o.norway && t.slice(5) === '05-17') { r.carry = 'flag'; r.text = T.norway; }
    if (o.christmas && (t.slice(5) === '12-24' || t.slice(5) === '12-25')) { r.over = 'santa'; r.text = T.christmas; }
    if (o.monthly && now.getDate() === o.monthly) { r.carry = 'flower'; r.text = T.flower; }
    (o.trips || []).forEach(function (tr) {
      if (tr && tr.from && tr.to && t >= tr.from && t <= tr.to) { r.carry = 'suitcase'; r.text = tr.text || T.trip; }
    });
    (o.days || []).forEach(function (d) {
      if (d && sameDay(d.date, t)) { r.carry = d.carry || 'flower'; r.over = d.over || r.over; r.neck = d.neck || r.neck; r.text = d.text || T.flower; }
    });
    if (o.midAutumn && MID_AUTUMN.indexOf(t) >= 0) { r.carry = 'mooncake'; r.text = T.midAutumn; }
    if (sameDay(o.anniversary, t)) { r.carry = 'bouquet'; r.over = 'heart'; r.text = T.anniversary; }
    if (sameDay(o.birthday, t)) { r.carry = 'cake'; r.text = T.birthday + (o.name ? ', ' + o.name : ''); }
    wx = wx || (o.weather && o.weather.key ? o.weather : null);
    if (wx) {
      if (wx.key === 'rain' || wx.key === 'storm') r.over = 'umbrella';
      if (wx.key === 'snow' || (typeof wx.temp === 'number' && wx.temp <= o.cold)) r.neck = 'scarf';
    }
    return r;
  }

  // open-meteo 的 WMO 天气码 → rain / storm / snow / clear；一小时内用缓存
  var WX_KEY = 'clawd-walk:wx';
  function wmo(code) {
    if (code >= 95) return 'storm';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    return 'clear';
  }
  function cachedWeather(w) {
    try {
      var c = JSON.parse(localStorage.getItem(WX_KEY) || 'null');
      if (c && c.lat === w.lat && c.lon === w.lon && Date.now() - c.at < 3600e3) return c;
    } catch (e) {}
    return null;
  }
  function fetchWeather(w) {
    if (!w || w.key || typeof w.lat !== 'number' || typeof w.lon !== 'number' || typeof fetch !== 'function') return Promise.resolve(null);
    var c = cachedWeather(w);
    if (c) return Promise.resolve(c);
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + w.lat + '&longitude=' + w.lon + '&current=temperature_2m,weather_code';
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.current) return null;
      var v = { lat: w.lat, lon: w.lon, at: Date.now(), key: wmo(j.current.weather_code), temp: j.current.temperature_2m };
      try { localStorage.setItem(WX_KEY, JSON.stringify(v)); } catch (e) {}
      return v;
    }).catch(function () { return null; });
  }

  // ── 一条加载条 ──
  function slotHTML(slot, name) {
    var it = name && ITEMS[name];
    if (!it) return '<i class="' + slot + '"></i>';
    var html = it.html;
    if (it.k && it.k !== 1) html = html.replace(/width="([\d.]+)" height="([\d.]+)"/, function (m, w, h) { return 'width="' + (w * it.k).toFixed(1) + '" height="' + (h * it.k).toFixed(1) + '"'; });
    return '<i class="' + slot + ' ' + name + (it.glow ? ' glow' : '') + '">' + html + '</i>';
  }

  /**
   * 做一条加载条（自己放哪都行）。opts 同 today() 的设置，另外：
   *   look: { carry, over, neck, text } 不看日子，直接穿这身
   * 返回 { el, set(0~100), dress(look), look }
   */
  function create(opts) {
    injectCSS();
    opts = opts || {};
    var el = document.createElement('div');
    el.className = 'cw';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="cw-rt cw-rt0"></div><div class="cw-rt cw-rt1"></div>' + CABIN +
      '<div class="cw-wk"><div class="cw-bob"><img class="cw-cl" alt="" src="' + CLAWD + '"><i class="nk"></i><i class="cr"></i><i class="ov"></i></div></div>' +
      '<div class="cw-tx"></div>';
    var wk = el.querySelector('.cw-wk'), rt1 = el.querySelector('.cw-rt1'), bob = el.querySelector('.cw-bob'), tx = el.querySelector('.cw-tx');
    var api = { el: el, look: null };
    api.dress = function (look) {
      api.look = look;
      ['nk', 'cr', 'ov'].forEach(function (slot) {
        var key = slot === 'cr' ? 'carry' : slot === 'ov' ? 'over' : 'neck';
        var old = bob.querySelector('.' + slot), tmp = document.createElement('div');
        tmp.innerHTML = slotHTML(slot, look[key]);
        bob.replaceChild(tmp.firstChild, old);
      });
      tx.textContent = look.text || '';
    };
    api.set = function (p) {   // 0~100：clawd 从虚线起点走到木屋门口，走过的那段虚线变实
      var w = el.offsetWidth || 240, x = Math.round((w - 64) * Math.max(0, Math.min(100, p)) / 100);
      wk.style.transform = 'translate3d(' + x + 'px,0,0)';
      rt1.style.clipPath = 'inset(0 ' + Math.max(0, (w - 34) - (x + 22)) + 'px 0 0)';
    };
    if (opts.look) api.dress(opts.look);
    else {
      api.dress(today(opts));
      fetchWeather(opts.weather).then(function (wx) { if (wx) api.dress(today(opts, null, wx)); });
    }
    api.set(0);
    return api;
  }

  /**
   * 整页加载幕：一层纸色盖住页面，中间一条加载条，页面 load 完走到木屋门口再淡出。
   * 在 <body> 里尽量早地引用这个脚本、调用 ClawdWalk.overlay({...})。
   *   paper: 幕的颜色；minMs: 至少走多久（默认 1200，让人看得见）；maxMs: 最多等多久（默认 6000）
   *   manual: true → 不等 load，自己调 .done()
   * 返回 { el, bar, set(0~100), done() }
   */
  function overlay(opts) {
    injectCSS();
    opts = opts || {};
    var veil = document.createElement('div');
    veil.className = 'cw-veil';
    if (opts.paper) veil.style.setProperty('--cw-paper', opts.paper);
    var bar = create(opts);
    var vw = global.innerWidth || 412;
    bar.el.style.setProperty('--cw-width', Math.round(Math.max(200, Math.min(270, vw * 0.6))) + 'px');
    veil.appendChild(bar.el);
    (document.body || document.documentElement).appendChild(veil);
    var t0 = Date.now(), minMs = opts.minMs == null ? 1200 : opts.minMs, maxMs = opts.maxMs || 6000;
    var loaded = false, shown = 0, last = 0, gone = false, manual = null;
    function aim() {
      var t = Date.now() - t0, c = 80 * (1 - Math.exp(-t / 900));   // 没好之前慢慢爬，永远到不了头
      if (loaded) c = 100;
      if (manual != null) c = Math.max(c, Math.min(manual, loaded ? 100 : 95));
      return c;
    }
    function tick() {
      if (gone) return;
      var now = Date.now(), dt = last ? Math.min(250, now - last) : 16; last = now;   // 按真实时间走，掉帧也不拖住
      shown = Math.min(aim(), shown + dt * (100 / Math.max(300, minMs)));
      bar.set(shown);
      if (shown >= 100) { setTimeout(leave, 200); return; }
      requestAnimationFrame(tick);
    }
    function leave() {
      if (gone) return; gone = true;
      veil.classList.add('cw-off');
      setTimeout(function () { if (veil.parentNode) veil.parentNode.removeChild(veil); }, 700);
    }
    function markLoaded() { loaded = true; }
    if (!opts.manual) {
      if (document.readyState === 'complete') markLoaded();
      else global.addEventListener('load', markLoaded, { once: true });
    }
    setTimeout(markLoaded, maxMs - 1000 > 0 ? maxMs - 1000 : maxMs);   // 兜底：最多 maxMs 就走到
    setTimeout(leave, maxMs + 1500);                                      // 硬兜底：不靠动画帧，一定揭开
    requestAnimationFrame(tick);
    return { el: veil, bar: bar, set: function (p) { manual = p; }, done: markLoaded };
  }

  // 衣柜：所有能穿的套装（演示页和 README 用）
  var LOOKS = [
    { carry: 'letter', text: TEXTS.walk, when: '平时', zh: '在回家的路上' },
    { carry: 'lantern', text: TEXTS.walk, when: '夜里（默认 19 点到早上 6 点）', zh: '叼盏小灯照路' },
    { carry: 'suitcase', text: TEXTS.trip, when: 'trips 里写的那几天', zh: '我们回家啦' },
    { carry: 'flower', text: TEXTS.flower, when: '每月 monthly 那天 / 自己加的日子', zh: '给你一朵花' },
    { carry: 'bouquet', over: 'heart', text: TEXTS.anniversary, when: 'anniversary 纪念日', zh: '恭喜我们' },
    { carry: 'cake', text: TEXTS.birthday, when: 'birthday 生日', zh: '生日快乐' },
    { carry: 'mooncake', text: TEXTS.midAutumn, when: '中秋（内置日子）', zh: '中秋快乐' },
    { carry: 'flag', text: TEXTS.norway, when: '5 月 17 日，挪威国庆', zh: '五月十七，万岁！' },
    { carry: 'letter', over: 'santa', text: TEXTS.christmas, when: '圣诞（12 月 24、25 日）', zh: '圣诞快乐' },
    { carry: 'letter', over: 'umbrella', text: TEXTS.walk, when: '下雨、打雷', zh: '小爪子举着一把航空条纹的伞' },
    { carry: 'letter', neck: 'scarf', text: TEXTS.walk, when: '下雪，或者气温 ≤ cold', zh: '围一条小围巾' },
    { carry: 'lantern', over: 'umbrella', neck: 'scarf', text: TEXTS.walk, when: '又冷又下雨的晚上', zh: '全副武装' }
  ];

  global.ClawdWalk = { create: create, overlay: overlay, today: today, items: ITEMS, looks: LOOKS, texts: TEXTS, pix: pix, version: '1.0.0' };
})(typeof window !== 'undefined' ? window : this);
