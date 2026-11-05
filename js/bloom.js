/* BLOOM: the hidden Konami game.
   Guide the bee to each bud before it wilts. Every bloom spells out a letter of
   FULL BLOOM. Three wilted buds and the garden rests.
   Original pixel art, no outside assets. Loaded on demand by main.js. */
(function () {
  'use strict';
  var W = 240, H = 180, WORD = 'FULLBLOOM';
  var C = { sky: '#1f2a1c', ground: '#2b3a25', grass: '#3b4f31', stem: '#6f9a55', bud: '#9fc27a',
            wilt: '#6b5a44', petal: ['#E8B898', '#F2C9B0', '#C8967A', '#F6E3C6'], core: '#E6B04B',
            bee: '#F2C14E', stripe: '#2A211A', wing: '#F8F4EE', text: '#F8F4EE', dim: '#A89A84', accent: '#E8B898' };

  // 9x7 bee, drawn as text so it stays editable: . empty, y body, k stripe, w wing, e eye
  var BEE = ['...ww....', '..wwww...', '.yykyykye', 'yykyykyyy', '.yykyykyy', '..y..y...', '.........'];
  var LEAF = ['..gg', '.ggg', 'ggg.', 'g...'];

  function Game(canvas) {
    this.c = canvas; this.x = canvas.getContext('2d'); this.x.imageSmoothingEnabled = false;
    this.keys = {}; this.target = null; this.state = 'title'; this.t = 0; this.best = 0;
    try { this.best = +localStorage.getItem('fbc-bloom-best') || 0; } catch (e) {}
    this.reset(); this.bind();
  }
  Game.prototype.reset = function () {
    this.bee = { x: W / 2, y: H / 2 + 10, vx: 0, vy: 0, flip: false };
    this.buds = []; this.blooms = []; this.sparks = [];
    this.lives = 3; this.score = 0; this.letters = 0; this.spawnIn = 0.6; this.rate = 2.2; this.flash = 0;
  };
  Game.prototype.bind = function () {
    var g = this;
    this.onKey = function (e) {
      var k = e.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(k) > -1) e.preventDefault();
      g.keys[k.toLowerCase()] = e.type === 'keydown';
      if (e.type === 'keydown' && (k === 'Enter' || k === ' ') && g.state !== 'play') g.start();
    };
    this.onPoint = function (e) {
      var r = g.c.getBoundingClientRect();
      var p = e.touches ? e.touches[0] : e;
      if (!p) return;
      g.target = { x: (p.clientX - r.left) / r.width * W, y: (p.clientY - r.top) / r.height * H };
      if (e.type === 'pointerdown' && g.state !== 'play') g.start();
    };
    this.onUp = function () { g.target = null; };
    window.addEventListener('keydown', this.onKey); window.addEventListener('keyup', this.onKey);
    this.c.addEventListener('pointerdown', this.onPoint); this.c.addEventListener('pointermove', function (e) { if (e.buttons || e.pointerType === 'touch') g.onPoint(e); });
    window.addEventListener('pointerup', this.onUp);
  };
  Game.prototype.unbind = function () {
    window.removeEventListener('keydown', this.onKey); window.removeEventListener('keyup', this.onKey);
    window.removeEventListener('pointerup', this.onUp);
  };
  Game.prototype.start = function () { this.reset(); this.state = 'play'; };

  Game.prototype.spawn = function () {
    var tries = 0, x, y, ok;
    do {
      x = 16 + Math.random() * (W - 32); y = 46 + Math.random() * (H - 70); ok = true;
      for (var i = 0; i < this.buds.length; i++) if (Math.hypot(this.buds[i].x - x, this.buds[i].y - y) < 28) ok = false;
      if (Math.hypot(this.bee.x - x, this.bee.y - y) < 30) ok = false;
    } while (!ok && ++tries < 20);
    var life = Math.max(3.2, 6.5 - this.score * 0.12);
    this.buds.push({ x: x, y: y, life: life, max: life });
  };

  Game.prototype.update = function (dt) {
    this.t += dt;
    if (this.flash > 0) this.flash -= dt;
    this.sparks = this.sparks.filter(function (s) { s.t -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 40 * dt; return s.t > 0; });
    this.blooms = this.blooms.filter(function (b) { b.t -= dt; return b.t > 0; });
    if (this.state !== 'play') return;
    var b = this.bee, k = this.keys, ax = 0, ay = 0, sp = 260;
    if (k.arrowleft || k.a) ax -= 1; if (k.arrowright || k.d) ax += 1;
    if (k.arrowup || k.w) ay -= 1; if (k.arrowdown || k.s) ay += 1;
    if (this.target) { var dx = this.target.x - b.x, dy = this.target.y - b.y, d = Math.hypot(dx, dy); if (d > 3) { ax = dx / d; ay = dy / d; } }
    b.vx += ax * sp * dt; b.vy += ay * sp * dt; b.vx *= 0.9; b.vy *= 0.9;
    b.x = Math.max(6, Math.min(W - 6, b.x + b.vx * dt)); b.y = Math.max(30, Math.min(H - 8, b.y + b.vy * dt));
    if (Math.abs(b.vx) > 4) b.flip = b.vx < 0;

    this.spawnIn -= dt;
    if (this.spawnIn <= 0 && this.buds.length < 4) { this.spawn(); this.rate = Math.max(1.1, this.rate * 0.97); this.spawnIn = this.rate; }
    for (var i = this.buds.length - 1; i >= 0; i--) {
      var u = this.buds[i]; u.life -= dt;
      if (Math.hypot(u.x - b.x, u.y - b.y) < 14) {
        this.buds.splice(i, 1); this.score++;
        this.blooms.push({ x: u.x, y: u.y, t: 2.6, c: C.petal[this.score % C.petal.length] });
        for (var n = 0; n < 10; n++) this.sparks.push({ x: u.x, y: u.y, vx: (Math.random() - .5) * 90, vy: -Math.random() * 70, t: .7, c: C.petal[n % 4] });
        if (this.letters < WORD.length) { this.letters++; if (this.letters === WORD.length) this.flash = 3; }
      } else if (u.life <= 0) {
        this.buds.splice(i, 1); this.lives--;
        this.blooms.push({ x: u.x, y: u.y, t: 1.4, c: C.wilt, wilted: true });
        if (this.lives <= 0) { this.state = 'over'; if (this.score > this.best) { this.best = this.score; try { localStorage.setItem('fbc-bloom-best', this.best); } catch (e) {} } }
      }
    }
  };

  Game.prototype.px = function (rows, x, y, map, s, flip) {
    var g = this.x; s = s || 1;
    for (var r = 0; r < rows.length; r++) for (var c = 0; c < rows[r].length; c++) {
      var ch = rows[r][flip ? rows[r].length - 1 - c : c]; if (ch === '.' || !map[ch]) continue;
      g.fillStyle = map[ch]; g.fillRect(Math.round(x + c * s), Math.round(y + r * s), s, s);
    }
  };
  Game.prototype.flower = function (x, y, color, open) {
    var g = this.x, S = 2; x = Math.round(x); y = Math.round(y);
    function r(dx, dy, w, h, c) { g.fillStyle = c; g.fillRect(x + dx * S, y + dy * S, w * S, h * S); }
    r(0, 0, 1, 6, C.stem); r(-2, 2, 2, 1, C.stem); r(1, 4, 2, 1, C.stem);
    if (open) {
      [[0, -4], [-3, -1], [3, -1], [-2, 2], [2, 2], [-2, -3], [2, -3]].forEach(function (p) { r(p[0] - 1, p[1] - 1, 3, 2, color); });
      r(-1, -2, 3, 3, C.core);
    }
  };
  Game.prototype.text = function (s, x, y, size, color, align) {
    var g = this.x; g.font = 'bold ' + size + 'px ui-monospace, Menlo, Consolas, monospace';
    g.textAlign = align || 'center'; g.textBaseline = 'middle'; g.fillStyle = '#120e0a'; g.fillText(s, x + 1, y + 1); g.fillStyle = color; g.fillText(s, x, y);
  };

  Game.prototype.draw = function () {
    var g = this.x, t = this.t, i;
    g.fillStyle = C.sky; g.fillRect(0, 0, W, H);
    g.fillStyle = C.ground; g.fillRect(0, 34, W, H - 34);
    for (i = 0; i < 60; i++) { g.fillStyle = C.grass; g.fillRect((i * 37) % W, 40 + (i * 53) % (H - 44), 1, 2 + (i % 3)); }
    // garden of past blooms
    this.blooms.forEach(function (b) { var a = Math.min(1, b.t); g.globalAlpha = a; this.flower(b.x, b.y, b.c, !b.wilted); if (b.wilted) { g.fillStyle = C.wilt; g.fillRect(Math.round(b.x) - 4, Math.round(b.y) - 4, 9, 6); } g.globalAlpha = 1; }, this);
    // buds, pulsing faster as they run out of time
    this.buds.forEach(function (u) {
      var k = u.life / u.max, pulse = Math.sin(t * (6 + (1 - k) * 14)) > 0;
      this.flower(u.x, u.y, C.bud, false);
      g.fillStyle = k < .3 ? (pulse ? C.wilt : C.bud) : C.bud;
      g.fillRect(Math.round(u.x) - 4, Math.round(u.y) - 6, 10, 8);
      g.fillStyle = '#c9e09e'; g.fillRect(Math.round(u.x) - 2, Math.round(u.y) - 5, 3, 2);
      g.fillStyle = C.dim; g.fillRect(Math.round(u.x) - 8, Math.round(u.y) + 16, Math.round(16 * k), 1);
    }, this);
    this.sparks.forEach(function (s) { g.fillStyle = s.c; g.fillRect(Math.round(s.x), Math.round(s.y), 2, 2); });
    if (this.state === 'play' || this.state === 'over') {
      var b = this.bee, bob = Math.round(Math.sin(t * 12));
      this.px(BEE, b.x - 9, b.y - 7 + bob, { y: C.bee, k: C.stripe, w: (Math.sin(t * 40) > 0 ? C.wing : '#cfc6b8'), e: C.stripe }, 2, b.flip);
    }
    // HUD: the word fills in as you go
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, W, 26);
    var word = 'FULL BLOOM', shown = 0, cx = W / 2 - 54;
    for (i = 0; i < word.length; i++) {
      if (word[i] === ' ') { cx += 8; continue; }
      var on = shown < this.letters; shown++;
      this.text(word[i], cx + 6, 13, 11, on ? (this.flash > 0 && Math.sin(t * 16) > 0 ? '#fff' : C.accent) : 'rgba(248,244,238,.22)');
      cx += 12;
    }
    for (i = 0; i < 3; i++) this.px(LEAF, 6 + i * 10, 9, { g: i < this.lives ? C.stem : 'rgba(248,244,238,.18)' }, 2);
    this.text(String(this.score), W - 8, 13, 10, C.text, 'right');

    if (this.state === 'title') {
      g.fillStyle = 'rgba(18,14,10,.55)'; g.fillRect(0, 26, W, H - 26);
      this.text('BLOOM', W / 2, 70, 28, C.accent);
      this.text('Guide the bee to each bud', W / 2, 100, 9, C.text);
      this.text('before it wilts.', W / 2, 112, 9, C.text);
      if (Math.sin(t * 4) > -0.3) this.text('PRESS ENTER OR TAP', W / 2, 140, 9, C.accent);
      this.text('arrows / WASD / drag   esc to leave', W / 2, 162, 7, C.dim);
      this.px(BEE, W / 2 + 40, 56 + Math.round(Math.sin(t * 3) * 3), { y: C.bee, k: C.stripe, w: C.wing, e: C.stripe }, 2);
    } else if (this.state === 'over') {
      g.fillStyle = 'rgba(18,14,10,.62)'; g.fillRect(0, 26, W, H - 26);
      this.text(this.letters >= WORD.length ? 'FULL BLOOM' : 'THE GARDEN RESTS', W / 2, 72, 14, C.accent);
      this.text(this.score + ' blooms   best ' + this.best, W / 2, 98, 9, C.text);
      this.text(this.letters >= WORD.length ? 'You found the secret. Your nervous system thanks you.' : 'Breathe in. Breathe out. Try again?', W / 2, 118, 7, C.dim);
      if (Math.sin(t * 4) > -0.3) this.text('PRESS ENTER OR TAP', W / 2, 146, 9, C.accent);
    } else if (this.flash > 0) {
      this.text('FULL BLOOM!', W / 2, 96, 16, '#fff');
    }
  };

  var current = null, raf = null;
  window.FBBloom = {
    start: function (canvas) {
      if (current) current.unbind();
      current = new Game(canvas);
      var last = performance.now();
      cancelAnimationFrame(raf);
      (function loop(now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!document.hidden) { current.update(dt); current.draw(); }
        raf = requestAnimationFrame(loop);
      })(last);
    },
    stop: function () { cancelAnimationFrame(raf); if (current) current.unbind(); current = null; }
  };
})();
