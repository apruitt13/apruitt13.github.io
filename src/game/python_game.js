(() => {
  // --- DOM references ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  const collectedListEl = document.getElementById('collected');
  const msgEl = document.getElementById('msg');
  const nextBtn = document.getElementById('nextBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Lesson modal elements (may be undefined if HTML incomplete)
  const lessonModal = document.getElementById('lessonModal');
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonDesc = document.getElementById('lessonDesc');
  const lessonEditor = document.getElementById('lessonEditor');
  const lessonOutput = document.getElementById('lessonOutput');
  const lessonTip = document.getElementById('lessonTip');
  const runLessonBtn = document.getElementById('runLessonBtn');
  const closeLessonBtn = document.getElementById('closeLessonBtn');
  const completeLessonBtn = document.getElementById('completeLessonBtn');
  const exampleBtn = document.getElementById('exampleBtn');

  if (!canvas || !ctx) {
    console.error('Game canvas not found. Ensure src/game/python_game.html contains <canvas id="gameCanvas" width="640" height="640">');
    return;
  }

  // --- Grid / map ---
  const TILE = 32;
  const COLS = Math.floor(canvas.width / TILE);
  const ROWS = Math.floor(canvas.height / TILE);

  const map = new Array(ROWS).fill(0).map(() => new Array(COLS).fill(0));
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (r === 0 || c === 0 || r === ROWS - 1 || c === COLS - 1) map[r][c] = 1;
    }
  }
  // sample internal walls (guard bounds)
  for (let r = 4; r < 16; r++) if (r < ROWS && 8 < COLS) map[r][8] = 1;
  for (let c = 10; c < 17; c++) if (12 < ROWS && c < COLS) map[12][c] = 1;

  // --- Collectibles / boss ---
  const collectibles = [
    { id: 'print', label: 'print()', r: 2, c: 3, desc: 'Use print("hello") to show text.' },
    { id: 'variables', label: 'variables', r: 3, c: 14, desc: 'Variables store values: x = 5' },
    { id: 'numbers', label: 'numbers', r: 15, c: 4, desc: 'Numbers are ints and floats: 5, 3.14' },
    { id: 'strings', label: 'strings', r: 15, c: 15, desc: 'Text uses quotes: "hello"' },
    { id: 'if', label: 'if statement', r: 6, c: 16, desc: 'Use if to make decisions.' }
  ];
  collectibles.forEach(it => { if (it.r < ROWS && it.c < COLS) map[it.r][it.c] = 2; });

  const bossTile = { r: 9, c: Math.max(2, COLS - 2), required: ['print', 'variables', 'numbers', 'strings'] };
  if (bossTile.r < ROWS && bossTile.c < COLS) map[bossTile.r][bossTile.c] = 3;

  // --- Player state + sprite ---
  const player = { r: 2, c: 2, px: 0, py: 0, targetR: 2, targetC: 2, moving: false };
  player.px = player.c * TILE;
  player.py = player.r * TILE;

  // Load player sprite (PNG)
  const playerImg = new Image();
  // path relative to python_game.html in src/game -> ../images/python_guy.png
  playerImg.src = '../images/python_guy.png';
  let playerSpriteLoaded = false;
  playerImg.onload = () => { playerSpriteLoaded = true; };
  playerImg.onerror = () => { console.warn('Failed to load player sprite:', playerImg.src); };

  const collectedSet = new Set();

  // --- UI helpers ---
  function updateCollectedUI() {
    if (!collectedListEl) return;
    collectedListEl.innerHTML = '';
    if (collectedSet.size === 0) {
      const hint = document.createElement('div'); hint.className = 'small'; hint.textContent = 'No snippets collected yet.'; collectedListEl.appendChild(hint);
      return;
    }
    for (const id of collectedSet) {
      const div = document.createElement('div'); div.className = 'chip'; div.textContent = id; collectedListEl.appendChild(div);
    }
  }
  function showMessage(text) { if (msgEl) msgEl.textContent = text; else console.log(text); }

  // --- Movement queue & logic ---
  const inputQueue = [];
  window.addEventListener('keydown', (e) => {
    // if lesson modal open allow Escape only
    if (lessonModal && lessonModal.classList && lessonModal.classList.contains('open')) {
      if (e.key === 'Escape') closeLesson();
      return;
    }
    const k = e.key;
    if (['ArrowUp', 'w', 'W'].includes(k)) inputQueue.push('up');
    if (['ArrowDown', 's', 'S'].includes(k)) inputQueue.push('down');
    if (['ArrowLeft', 'a', 'A'].includes(k)) inputQueue.push('left');
    if (['ArrowRight', 'd', 'D'].includes(k)) inputQueue.push('right');
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
  });

  function tryMove(dir) {
    if (player.moving) return;
    let nr = player.r, nc = player.c;
    if (dir === 'up') nr--;
    if (dir === 'down') nr++;
    if (dir === 'left') nc--;
    if (dir === 'right') nc++;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;
    if (map[nr][nc] === 1) { showMessage('A wall blocks your way.'); return; }
    player.targetR = nr; player.targetC = nc; player.moving = true;
  }

  // --- Movement smoothing ---
  const MOVE_FRAMES = 10;
  let moveProgress = 0;

  function update() {
    if (!player.moving && inputQueue.length > 0) {
      const dir = inputQueue.shift();
      tryMove(dir);
    }
    if (player.moving) {
      moveProgress++;
      const startX = player.c * TILE, startY = player.r * TILE;
      const endX = player.targetC * TILE, endY = player.targetR * TILE;
      const t = Math.min(moveProgress / MOVE_FRAMES, 1);
      player.px = startX + (endX - startX) * t;
      player.py = startY + (endY - startY) * t;
      if (t >= 1) {
        player.r = player.targetR; player.c = player.targetC;
        player.px = player.c * TILE; player.py = player.r * TILE;
        player.moving = false; moveProgress = 0;
        onEnterTile(player.r, player.c);
      }
    }
  }

  function onEnterTile(r, c) {
    const val = map[r][c];
    if (val === 2) {
      const found = collectibles.find(it => it.r === r && it.c === c);
      if (found && !collectedSet.has(found.id)) { openLesson(found); return; }
    } else if (val === 3) {
      const missing = bossTile.required.filter(k => !collectedSet.has(k));
      if (missing.length === 0) {
        showMessage('You used your knowledge to defeat the boss! You win 🎉');
        map[r][c] = 0;
      } else {
        showMessage('Boss remains. You still need: ' + missing.join(', '));
      }
    } else {
      showMessage('Explore the map. Collect code snippets to learn Python.');
    }
  }

  // --- Rendering ---
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // tiles
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * TILE, y = r * TILE;
        if (map[r][c] === 1) { ctx.fillStyle = '#0b1320'; ctx.fillRect(x, y, TILE, TILE); }
        else { ctx.fillStyle = '#7ec0d6'; ctx.fillRect(x, y, TILE, TILE); }
        ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
      }
    }
    // collectibles
    collectibles.forEach(it => {
      if (!collectedSet.has(it.id) && map[it.r][it.c] === 2) {
        const x = it.c * TILE, y = it.r * TILE;
        ctx.fillStyle = '#facc15'; ctx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
        ctx.fillStyle = '#08293b'; ctx.font = '10px sans-serif'; ctx.fillText(it.label, x + 8, y + 20);
      }
    });
    // boss
    if (map[bossTile.r][bossTile.c] === 3) {
      const bx = bossTile.c * TILE, by = bossTile.r * TILE;
      ctx.fillStyle = '#ef4444'; ctx.fillRect(bx + 4, by + 4, TILE - 8, TILE - 8);
      ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.fillText('Boss', bx + 8, by + 20);
    }

    // draw player sprite centered in tile if loaded, otherwise fallback circle
    const SPRITE_SCALE = 0.9;
    const spriteSize = TILE * SPRITE_SCALE;
    const drawX = player.px + (TILE - spriteSize) / 2;
    const drawY = player.py + (TILE - spriteSize) / 2;

    if (playerSpriteLoaded) {
      ctx.drawImage(playerImg, drawX, drawY, spriteSize, spriteSize);
    } else {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.arc(player.px + TILE / 2, player.py + TILE / 2, TILE / 2 - 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#022c55'; ctx.font = '12px sans-serif'; ctx.fillText('You', player.px + 10, player.py + 20);
    }
  }

  function loop() { update(); draw(); requestAnimationFrame(loop); }

  // --- Lesson modal + Skulpt integration (if Skulpt is included in HTML) ---
  function openLesson(collectible) {
    if (!lessonModal || !lessonEditor) {
      // If modal UI missing, auto-collect and show message
      collectedSet.add(collectible.id);
      map[collectible.r][collectible.c] = 0;
      updateCollectedUI();
      showMessage(`Collected "${collectible.label}". ${collectible.desc}`);
      return;
    }

    lessonModal.classList.add('open'); lessonModal.setAttribute('aria-hidden', 'false');
    lessonTitle.textContent = collectible.label + ' lesson';
    lessonDesc.textContent = collectible.desc || '';
    const starters = {
      'print': 'print("Hello, Python!")\n# Try changing the text inside quotes.',
      'variables': 'x = 5\nprint("x is", x)\n# Try assigning x = 10 and run again.',
      'numbers': 'a = 2\nb = 3.5\nprint(a, "+", b, "=", a + b)\n# Try other math operations.',
      'strings': 'name = "Ava"\nprint("Hello", name)\n# Try concatenation: print("Hi " + name)',
      'if': 'x = 5\nif x > 3:\n    print("x is greater than 3")\nelse:\n    print("x is 3 or less")'
    };
    lessonEditor.value = starters[collectible.id] || '# Try here\nprint("Try Python code!")';
    lessonOutput && (lessonOutput.textContent = '');
    lessonTip && (lessonTip.textContent = 'Run your code using the Run button. When you understand, click "Complete & Collect".');

    // pause movement and clear inputs
    inputQueue.length = 0; player.moving = false;

    // wire lesson buttons if present
    if (runLessonBtn) runLessonBtn.onclick = () => runSkulpt(lessonEditor.value);
    if (exampleBtn) exampleBtn.onclick = () => { lessonEditor.value = lessonEditor.value + '\n# example run\nprint("Example run")'; };
    if (completeLessonBtn) completeLessonBtn.onclick = () => {
      collectedSet.add(collectible.id);
      map[collectible.r][collectible.c] = 0;
      updateCollectedUI();
      showMessage(`Collected "${collectible.label}". ${collectible.desc}`);
      closeLesson();
    };
    if (closeLessonBtn) closeLessonBtn.onclick = () => closeLesson();
  }

  function closeLesson() {
    if (!lessonModal) return;
    lessonModal.classList.remove('open'); lessonModal.setAttribute('aria-hidden', 'true');
    if (lessonOutput) lessonOutput.textContent = '';
  }

  // Skulpt runner (only works if Skulpt scripts are included in HTML)
  function outf(text) { if (lessonOutput) lessonOutput.textContent += text; }
  function builtinRead(x) { if (Sk && Sk.builtinFiles && Sk.builtinFiles["files"][x]) return Sk.builtinFiles["files"][x]; throw "File not found: '" + x + "'"; }
  async function runSkulpt(code) {
    if (!window.Sk) {
      if (lessonOutput) lessonOutput.textContent = 'Skulpt not loaded. Include Skulpt scripts in HTML to run Python in-browser.';
      return;
    }
    if (lessonOutput) lessonOutput.textContent = '';
    Sk.configure({ output: outf, read: builtinRead });
    try {
      await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
    } catch (e) {
      lessonOutput.textContent += '\nError: ' + e.toString();
    }
  }

  // --- UI controls ---
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const tips = [
      'Tip: print("hello") prints text to the screen.',
      'Tip: Variables store values: name = "Ava".',
      'Tip: Numbers are used for math: 2 + 2 = 4.',
      'Tip: Strings are text inside quotes: "abc".',
      'Tip: If statements let programs choose: if x > 5: ...'
    ];
    showMessage(tips[Math.floor(Math.random() * tips.length)]);
  });

  if (resetBtn) resetBtn.addEventListener('click', () => {
    // reset
    player.r = 2; player.c = 2; player.px = player.c * TILE; player.py = player.r * TILE;
    player.targetR = player.r; player.targetC = player.c; player.moving = false;
    collectedSet.clear();
    collectibles.forEach(it => { if (it.r < ROWS && it.c < COLS) map[it.r][it.c] = 2; });
    if (bossTile.r < ROWS && bossTile.c < COLS) map[bossTile.r][bossTile.c] = 3;
    updateCollectedUI(); showMessage('Game reset. Good luck!');
  });

  // --- Init ---
  updateCollectedUI(); showMessage('Use arrow keys or WASD to move. Collect code snippets to learn.');
  requestAnimationFrame(loop);
})();