(() => {
  // --- Config ---
  const TILE = 32;
  const MOVE_FRAMES = 10;

  // limit world to exactly 4 rooms (2x2)
  const ALLOWED_ROOMS = new Set([
    '0,0', '1,0',
    '0,1', '1,1'
  ]);
  const MAP_DISPLAY_RADIUS = 1; // minimap grid radius used for display (3x3 area)

  // --- DOM refs ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  const collectedListEl = document.getElementById('collected');
  const msgEl = document.getElementById('msg');
  const nextBtn = document.getElementById('nextBtn');
  const resetBtn = document.getElementById('resetBtn');

  // lesson modal elements (may be missing)
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
    console.error('Game canvas not found. Ensure python_game.html contains <canvas id="gameCanvas" width="640" height="640">');
    return;
  }

  // tiles per room
  const COLS = Math.floor(canvas.width / TILE);
  const ROWS = Math.floor(canvas.height / TILE);

  // --- Rooms / map generation ---
  const rooms = {}; // key "rx,ry" -> { map, collectibles, boss, chests }
  function roomKey(rx, ry) { return `${rx},${ry}`; }
  function roomAllowed(rx, ry) { return ALLOWED_ROOMS.has(roomKey(rx, ry)); }

  // --- Chest challenges for starting room (0,0) ---
  // Each item includes an info/blurb, starter code for the in-game IDE, and expected printed output
  const START_CHEST_CHALLENGES = [
    {
      id: 'print_hello',
      title: 'Intro to print()',
      blurb: 'Use print() to output text. Try printing "Hello World".',
      starter: '# Use print() to show text\n# Change the line below to print "Hello World"\nprint("Hello")\n',
      expected: 'Hello World'
    },
    {
      id: 'print_math',
      title: 'Print math results',
      blurb: 'print() can show results of expressions. Make it print the number 5.',
      starter: '# Print the result of 2 + 3\nprint(2 + 3)\n',
      expected: '5'
    },
    {
      id: 'print_concat',
      title: 'String concatenation',
      blurb: 'You can join strings with +. Make it print AB.',
      starter: '# Join two strings\nprint("A" + "B")\n',
      expected: 'AB'
    },
    {
      id: 'print_len',
      title: 'Using len()',
      blurb: 'len() returns string length. Print the length of "abc".',
      starter: '# Print length of "abc"\nprint(len("abc"))\n',
      expected: '3'
    },
    {
      id: 'print_upper',
      title: 'String methods',
      blurb: 'Strings have methods like upper(). Print "HI" using .upper().',
      starter: '# Use .upper() to make "Hi" uppercase\nprint("Hi".upper())\n',
      expected: 'HI'
    }
  ];
  const REQUIRED_CHEST_POINTS = START_CHEST_CHALLENGES.length; // must open all to leave starting room

  // snippet pool (world-level) still used for collectibles
  const SNIPPET_POOL = [
    { id: 'print', label: 'print()', desc: 'print("hello") shows text.' },
    { id: 'variables', label: 'variables', desc: 'Variables store values: x = 5' },
    { id: 'numbers', label: 'numbers', desc: 'Numbers: 5, 3.14' },
    { id: 'strings', label: 'strings', desc: 'Text inside quotes: "hi"' },
    { id: 'if', label: 'if', desc: 'Use if to branch logic.' }
  ];

  // deterministic assignment of snippets to the four allowed rooms (round-robin)
  const allowedRoomsArr = Array.from(ALLOWED_ROOMS).sort(); // deterministic order
  const roomAssignments = {}; // roomKey -> [snippet objects]
  allowedRoomsArr.forEach(k => roomAssignments[k] = []);
  for (let i = 0; i < SNIPPET_POOL.length; i++) {
    const rk = allowedRoomsArr[i % allowedRoomsArr.length];
    roomAssignments[rk].push(SNIPPET_POOL[i]);
  }

  // force a boss into room '1,1' if allowed
  const BOSS_ROOM_KEY = '1,1';

  // Simple pseudo-random helper with seed per room for deterministic layout (seed from rx,ry)
  function seededRandom(rx, ry) {
    let s = (rx * 734287 + ry * 9127831) & 0xffffffff;
    return function () {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return ((s >>> 0) / 0x100000000);
    };
  }

  function generateRoom(rx, ry) {
    const rand = seededRandom(rx, ry);
    const map = new Array(ROWS).fill(0).map(() => new Array(COLS).fill(0));
    // border walls
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (r === 0 || c === 0 || r === ROWS - 1 || c === COLS - 1) map[r][c] = 1;
    }

    // create openings only if neighbor is allowed (so some edges end)
    const midC = Math.floor(COLS / 2);
    const midR = Math.floor(ROWS / 2);

    if (roomAllowed(rx, ry - 1) && rand() < 0.85) map[0][midC] = 0;           // top
    if (roomAllowed(rx, ry + 1) && rand() < 0.85) map[ROWS - 1][midC] = 0;  // bottom
    if (roomAllowed(rx - 1, ry) && rand() < 0.85) map[midR][0] = 0;        // left
    if (roomAllowed(rx + 1, ry) && rand() < 0.85) map[midR][COLS - 1] = 0; // right

    // internal walls: draw a few short segments randomly
    const wallCount = 6 + Math.floor(rand() * 12);
    for (let i = 0; i < wallCount; i++) {
      const rr = 2 + Math.floor(rand() * (ROWS - 4));
      const cc = 2 + Math.floor(rand() * (COLS - 4));
      map[rr][cc] = 1;
      if (rand() < 0.5 && cc + 1 < COLS - 1) map[rr][cc + 1] = 1;
      else if (rr + 1 < ROWS - 1) map[rr + 1][cc] = 1;
    }

    // place collectibles based on precomputed roomAssignments (deterministic distribution)
    const items = [];
    const assignKey = roomKey(rx, ry);
    const assignedSnips = roomAssignments[assignKey] || [];
    assignedSnips.forEach(sn => {
      // find random free tile to place snippet
      let attempts = 0;
      while (attempts++ < 80) {
        const rr = 2 + Math.floor(rand() * (ROWS - 4));
        const cc = 2 + Math.floor(rand() * (COLS - 4));
        if (map[rr][cc] === 0) {
          map[rr][cc] = 2;
          items.push({ id: sn.id, label: sn.label, desc: sn.desc, r: rr, c: cc });
          break;
        }
      }
    });

    // small chance for an extra random collectible (but only if there are less than 2 in the room)
    if (items.length < 2 && rand() < 0.35) {
      const pick = SNIPPET_POOL[Math.floor(rand() * SNIPPET_POOL.length)];
      let attempts = 0;
      while (attempts++ < 40) {
        const rr = 2 + Math.floor(rand() * (ROWS - 4));
        const cc = 2 + Math.floor(rand() * (COLS - 4));
        if (map[rr][cc] === 0) {
          map[rr][cc] = 2;
          items.push({ id: pick.id, label: pick.label, desc: pick.desc, r: rr, c: cc });
          break;
        }
      }
    }

    // boss: ensure boss in BOSS_ROOM_KEY if allowed
    let boss = null;
    if (roomKey(rx, ry) === BOSS_ROOM_KEY && roomAllowed(rx, ry)) {
      const br = Math.min(ROWS - 3, Math.floor(ROWS / 2));
      const bc = Math.min(COLS - 3, Math.floor(COLS / 2));
      map[br][bc] = 3;
      boss = { r: br, c: bc, required: SNIPPET_POOL.slice(0, 4).map(s => s.id) }; // require first 4 snippets
    }

    // starting-room chests: exactly N print challenges placed as chests
    const chests = [];
    if (rx === 0 && ry === 0) {
      const usedPositions = new Set();
      for (let i = 0; i < START_CHEST_CHALLENGES.length; i++) {
        let attempts = 0;
        while (attempts++ < 200) {
          const rr = 2 + Math.floor(rand() * (ROWS - 4));
          const cc = 2 + Math.floor(rand() * (COLS - 4));
          const key = rr + ',' + cc;
          if (map[rr][cc] === 0 && !usedPositions.has(key)) {
            usedPositions.add(key);
            map[rr][cc] = 4; // chest tile
            chests.push({
              id: START_CHEST_CHALLENGES[i].id,
              r: rr, c: cc,
              title: START_CHEST_CHALLENGES[i].title,
              q: START_CHEST_CHALLENGES[i].blurb,
              starter: START_CHEST_CHALLENGES[i].starter,
              expected: START_CHEST_CHALLENGES[i].expected,
              opened: false
            });
            break;
          }
        }
      }

      // Fallback: ensure we place all chests deterministically if random fails
      if (chests.length < START_CHEST_CHALLENGES.length) {
        for (let rr = 2; rr <= ROWS - 3 && chests.length < START_CHEST_CHALLENGES.length; rr++) {
          for (let cc = 2; cc <= COLS - 3 && chests.length < START_CHEST_CHALLENGES.length; cc++) {
            const key = rr + ',' + cc;
            if (map[rr][cc] === 0 && !usedPositions.has(key)) {
              const i = chests.length;
              usedPositions.add(key);
              map[rr][cc] = 4;
              chests.push({
                id: START_CHEST_CHALLENGES[i].id,
                r: rr, c: cc,
                title: START_CHEST_CHALLENGES[i].title,
                q: START_CHEST_CHALLENGES[i].blurb,
                starter: START_CHEST_CHALLENGES[i].starter,
                expected: START_CHEST_CHALLENGES[i].expected,
                opened: false
              });
            }
          }
        }
      }
    }

    return { map, collectibles: items, boss, chests };
  }

  function loadRoom(rx, ry) {
    // only allowed rooms (ensures exactly the four rooms)
    if (!roomAllowed(rx, ry)) return null;
    const key = roomKey(rx, ry);
    if (!rooms[key]) rooms[key] = generateRoom(rx, ry);
    return rooms[key];
  }

  // --- Start room ---
  let currentRoomX = 0, currentRoomY = 0;
  let roomData = loadRoom(currentRoomX, currentRoomY);

  // --- Player state & sprite ---
  const player = { r: 2, c: 2, px: 0, py: 0, targetR: 2, targetC: 2, moving: false, roomX: currentRoomX, roomY: currentRoomY, chestPoints: 0 };
  player.px = player.c * TILE;
  player.py = player.r * TILE;

  // load sprite and attempt to remove checkerboard background automatically
  const playerImg = new Image();
  playerImg.src = '../images/python_guy.png';
  let playerSpriteLoaded = false;
  let processedPlayerImg = null;

  // treasure chest image
  const chestImg = new Image();
  chestImg.src = '../images/treasurechest.png';
  let chestImgLoaded = false;
  chestImg.onload = () => { chestImgLoaded = true; };
  chestImg.onerror = () => { console.warn('Failed to load chest image:', chestImg.src); };

  playerImg.onload = () => {
    try {
      const w = playerImg.width, h = playerImg.height;
      const off = document.createElement('canvas');
      off.width = w; off.height = h;
      const octx = off.getContext('2d');
      octx.drawImage(playerImg, 0, 0);
      const data = octx.getImageData(0, 0, w, h);
      const pixels = data.data;

      // sample corners
      const samples = [
        [1, 1], [w - 2, 1], [1, h - 2], [w - 2, h - 2]
      ].map(([x, y]) => {
        const i = (y * w + x) * 4;
        return [pixels[i], pixels[i + 1], pixels[i + 2]];
      });

      function colorDist(a, b) {
        return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      }

      // merge similar samples
      const uniq = [];
      samples.forEach(s => {
        if (!uniq.some(u => colorDist(u, s) < 25)) uniq.push(s);
      });

      const THRESH = 60;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const col = [pixels[i], pixels[i + 1], pixels[i + 2]];
          if (uniq.some(u => colorDist(u, col) < THRESH)) {
            pixels[i + 3] = 0; // make transparent
          }
        }
      }

      octx.putImageData(data, 0, 0);
      processedPlayerImg = new Image();
      processedPlayerImg.src = off.toDataURL('image/png');
      processedPlayerImg.onload = () => { playerSpriteLoaded = true; };
      processedPlayerImg.onerror = () => { playerSpriteLoaded = true; };
    } catch (e) {
      playerSpriteLoaded = true;
    }
  };
  playerImg.onerror = () => { console.warn('Failed to load player sprite:', playerImg.src); playerSpriteLoaded = false; };

  const collectedSet = new Set();

  // --- Minimap integration (MapManager from map.js) ---
  if (window.MapManager && typeof MapManager.init === 'function') {
    MapManager.init('minimap', { maxRadius: MAP_DISPLAY_RADIUS, cellSize: 14 });
    // reveal starting room
    MapManager.reveal(currentRoomX, currentRoomY, roomData);
    MapManager.draw(currentRoomX, currentRoomY, rooms);
  }

  // --- UI helpers ---
  function updateCollectedUI() {
    if (!collectedListEl) return;
    collectedListEl.innerHTML = '';
    if (collectedSet.size === 0) {
      const hint = document.createElement('div'); hint.className = 'small'; hint.textContent = 'No snippets collected yet.';
      collectedListEl.appendChild(hint);
      return;
    }
    for (const id of collectedSet) {
      const div = document.createElement('div'); div.className = 'chip'; div.textContent = id;
      collectedListEl.appendChild(div);
    }
  }

  function showMessage(text) {
    if (msgEl) msgEl.textContent = text;
    else console.log(text);
  }

  // --- Skulpt capture helper ---
  async function runSkulptCapture(code) {
    if (!window.Sk) throw new Error('Skulpt not loaded');
    return new Promise((resolve) => {
      let out = '';
      function outfCapture(txt) { out += txt; }
      function builtinRead(x) { if (Sk && Sk.builtinFiles && Sk.builtinFiles["files"][x]) return Sk.builtinFiles["files"][x]; throw "File not found: '" + x + "'"; }
      Sk.configure({ output: outfCapture, read: builtinRead });
      Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
        .then(() => resolve(out))
        .catch((e) => resolve(out + '\nERROR: ' + String(e)));
    });
  }

  // --- Chest interaction (modal-based) ---
  let currentChest = null;

  function openChest(chest) {
    // If modal UI is absent, fallback to a simple prompt check
    if (!lessonModal || !lessonEditor || !completeLessonBtn || !runLessonBtn || !lessonOutput) {
      const ans = window.prompt(chest.q + '\nEnter the printed result:');
      if (ans === null) { showMessage('Challenge cancelled.'); return; }
      if (ans.trim() === String(chest.expected)) {
        chest.opened = true;
        roomData.map[chest.r][chest.c] = 0;
        player.chestPoints = (player.chestPoints || 0) + 1;
        showMessage(`Correct! You opened the chest. Points: ${player.chestPoints}/${REQUIRED_CHEST_POINTS}`);
        if (window.MapManager) { MapManager.reveal(player.roomX, player.roomY, roomData); MapManager.draw(player.roomX, player.roomY, rooms); }
      } else {
        showMessage('Incorrect. Try again in the IDE when available.');
      }
      return;
    }

    // Open modal in chest-mode
    currentChest = chest;
    lessonModal.classList.add('open'); lessonModal.setAttribute('aria-hidden', 'false');
    lessonTitle.textContent = chest.title || 'Chest Challenge';
    lessonDesc.textContent = (chest.q || '') + '\n\nTry the code below in the editor and run it. When the output matches the expected printed result, click "Complete & Collect".';
    lessonEditor.value = chest.starter || '# try here\nprint("...")\n';
    if (lessonOutput) lessonOutput.textContent = '';
    if (lessonTip) lessonTip.textContent = 'Run the code. When the printed output matches the expected result, click Complete & Collect.';

    // ensure run button invokes runSkulpt and shows output
    if (runLessonBtn) runLessonBtn.onclick = () => {
      lessonOutput.textContent = '';
      runSkulpt(lessonEditor.value);
    };

    // complete button checks output via Skulpt capture
    if (completeLessonBtn) completeLessonBtn.onclick = async () => {
      lessonOutput.textContent = '';
      try {
        const out = await runSkulptCapture(lessonEditor.value);
        const printed = String(out).trim();
        const expect = String(chest.expected).trim();
        if (printed.includes('ERROR:')) {
          lessonOutput.textContent = out;
          showMessage('Your code had an error. Fix it and try again.');
          return;
        }
        // allow loose match (exact printed token or exact line)
        if (printed === expect || printed.split('\n').map(s => s.trim()).includes(expect)) {
          chest.opened = true;
          roomData.map[chest.r][chest.c] = 0;
          player.chestPoints = (player.chestPoints || 0) + 1;
          showMessage(`Correct! You opened the chest. Points: ${player.chestPoints}/${REQUIRED_CHEST_POINTS}`);
          updateCollectedUI();
          if (window.MapManager) { MapManager.reveal(player.roomX, player.roomY, roomData); MapManager.draw(player.roomX, player.roomY, rooms); }
          closeLesson(); // reuse same modal close
        } else {
          lessonOutput.textContent = out;
          showMessage(`Output did not match expected: "${expect}". Try again.`);
        }
      } catch (e) {
        lessonOutput.textContent = String(e);
        showMessage('Skulpt not available to check code.');
      }
    };

    if (exampleBtn) exampleBtn.onclick = () => { lessonEditor.value = lessonEditor.value + '\n# example\nprint("Example")'; };
    if (closeLessonBtn) closeLessonBtn.onclick = () => { closeLesson(); };
  }

  function closeLesson() {
    currentChest = null;
    if (!lessonModal) return;
    lessonModal.classList.remove('open'); lessonModal.setAttribute('aria-hidden', 'true');
    if (lessonOutput) lessonOutput.textContent = '';
  }

  // --- Input & movement ---
  const inputQueue = [];
  window.addEventListener('keydown', (e) => {
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

    // leaving current room: handle room transition if the tile beyond edge is open and room exists
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) {
      // Prevent leaving starting room until all chest challenges passed
      if (player.roomX === 0 && player.roomY === 0 && (player.chestPoints || 0) < REQUIRED_CHEST_POINTS) {
        showMessage(`You must open all ${REQUIRED_CHEST_POINTS} chests before leaving this area.`);
        return;
      }

      const dx = (nc < 0) ? -1 : (nc >= COLS) ? 1 : 0;
      const dy = (nr < 0) ? -1 : (nr >= ROWS) ? 1 : 0;
      const newRX = player.roomX + dx;
      const newRY = player.roomY + dy;
      const neighbor = loadRoom(newRX, newRY);
      if (!neighbor) {
        showMessage('The path ends here.');
        return;
      }
      // move into neighbor
      player.roomX = newRX; player.roomY = newRY;
      roomData = neighbor;
      // wrap player to opposite edge
      if (nr < 0) nr = ROWS - 1;
      if (nr >= ROWS) nr = 0;
      if (nc < 0) nc = COLS - 1;
      if (nc >= COLS) nc = 0;

      // ensure not landing on wall
      if (roomData.map[nr][nc] === 1) {
        let found = false;
        for (let rOff = -2; rOff <= 2 && !found; rOff++) {
          for (let cOff = -2; cOff <= 2 && !found; cOff++) {
            const rr = Math.max(1, Math.min(ROWS - 2, nr + rOff));
            const cc = Math.max(1, Math.min(COLS - 2, nc + cOff));
            if (roomData.map[rr][cc] === 0) { nr = rr; nc = cc; found = true; }
          }
        }
      }

      player.r = nr; player.c = nc;
      player.targetR = nr; player.targetC = nc;
      player.px = player.c * TILE; player.py = player.r * TILE;
      player.moving = false;
      updateCollectedUI();
      showMessage(`Entered area (${player.roomX},${player.roomY}). Explore!`);

      // reveal on minimap
      if (window.MapManager) {
        MapManager.reveal(player.roomX, player.roomY, roomData);
        MapManager.draw(player.roomX, player.roomY, rooms);
      }

      onEnterTile(player.r, player.c);
      return;
    }

    // within room collision
    if (roomData.map[nr][nc] === 1) { showMessage('A wall blocks your way.'); return; }
    player.targetR = nr; player.targetC = nc; player.moving = true;
  }

  // --- Update loop ---
  let moveProgress = 0;
  function update() {
    if (!player.moving && inputQueue.length > 0) {
      const dir = inputQueue.shift();
      tryMove(dir);
    }
    if (player.moving) {
      moveProgress++;
      const sx = player.c * TILE, sy = player.r * TILE;
      const ex = player.targetC * TILE, ey = player.targetR * TILE;
      const t = Math.min(moveProgress / MOVE_FRAMES, 1);
      player.px = sx + (ex - sx) * t;
      player.py = sy + (ey - sy) * t;
      if (t >= 1) {
        player.r = player.targetR; player.c = player.targetC;
        player.px = player.c * TILE; player.py = player.r * TILE;
        player.moving = false; moveProgress = 0;
        onEnterTile(player.r, player.c);
      }
    }
  }

  // --- Tile enter handler ---
  function onEnterTile(r, c) {
    const val = roomData.map[r][c];
    if (val === 2) {
      const found = (roomData.collectibles || []).find(it => it.r === r && it.c === c);
      if (found && !collectedSet.has(found.id)) {
        openLesson(found);
        return;
      }
    } else if (val === 3 && roomData.boss) {
      const missing = roomData.boss.required.filter(k => !collectedSet.has(k));
      if (missing.length === 0) {
        showMessage('You used your knowledge to defeat the boss! You win 🎉');
        roomData.map[r][c] = 0;
      } else {
        showMessage('Boss remains. You still need: ' + missing.join(', '));
      }
    } else if (val === 4) { // chest tile
      const chest = (roomData.chests || []).find(ch => ch.r === r && ch.c === c);
      if (chest && !chest.opened) {
        openChest(chest);
        return;
      } else {
        showMessage('This chest is empty.');
      }
    } else {
      showMessage('Explore the area. Collect code snippets to learn Python.');
    }
  }

  // --- Rendering ---
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw tiles
    for (let rr = 0; rr < ROWS; rr++) {
      for (let cc = 0; cc < COLS; cc++) {
        const x = cc * TILE, y = rr * TILE;
        if (roomData.map[rr][cc] === 1) ctx.fillStyle = '#0b1320';
        else ctx.fillStyle = '#7ec0d6';
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
      }
    }

    // collectibles
    (roomData.collectibles || []).forEach(it => {
      if (!collectedSet.has(it.id) && roomData.map[it.r][it.c] === 2) {
        const x = it.c * TILE, y = it.r * TILE;
        ctx.fillStyle = '#facc15'; ctx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
        ctx.fillStyle = '#08293b'; ctx.font = '10px sans-serif'; ctx.fillText(it.label, x + 8, y + 20);
      }
    });

    // chests
    (roomData.chests || []).forEach(ch => {
      if (!ch.opened && roomData.map[ch.r][ch.c] === 4) {
        const x = ch.c * TILE, y = ch.r * TILE;
        if (chestImgLoaded) {
          ctx.drawImage(chestImg, x + 4, y + 4, TILE - 8, TILE - 8);
        } else {
          // fallback square
          ctx.fillStyle = '#a16207';
          ctx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
        }
      }
    });

    // boss
    if (roomData.boss && roomData.map[roomData.boss.r][roomData.boss.c] === 3) {
      const bx = roomData.boss.c * TILE, by = roomData.boss.r * TILE;
      ctx.fillStyle = '#ef4444'; ctx.fillRect(bx + 4, by + 4, TILE - 8, TILE - 8);
      ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.fillText('Boss', bx + 8, by + 20);
    }

    // draw player (sprite or fallback)
    const SPRITE_SCALE = 0.9;
    const spriteSize = TILE * SPRITE_SCALE;
    const drawX = player.px + (TILE - spriteSize) / 2;
    const drawY = player.py + (TILE - spriteSize) / 2;
    const imgToUse = processedPlayerImg || playerImg;

    if (playerSpriteLoaded && imgToUse) {
      ctx.drawImage(imgToUse, drawX, drawY, spriteSize, spriteSize);
    } else {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.arc(player.px + TILE / 2, player.py + TILE / 2, TILE / 2 - 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#022c55'; ctx.font = '12px sans-serif'; ctx.fillText('You', player.px + 10, player.py + 20);
    }

    // HUD: room coords + chest points
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(6, 6, 320, 22);
    ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif';
    ctx.fillText(`Area: ${player.roomX},${player.roomY}   Chests: ${player.chestPoints}/${REQUIRED_CHEST_POINTS}`, 12, 22);
  }

  function loop() { update(); draw(); requestAnimationFrame(loop); }

  // --- Lesson modal & Skulpt integration for normal collectibles ---
  function openLesson(collectible) {
    if (!lessonModal || !lessonEditor) {
      // auto-collect if UI missing
      collectedSet.add(collectible.id);
      roomData.map[collectible.r][collectible.c] = 0;
      roomData.collectibles = (roomData.collectibles || []).filter(it => !(it.r === collectible.r && it.c === collectible.c && it.id === collectible.id));
      updateCollectedUI();
      showMessage(`Collected "${collectible.label}". ${collectible.desc}`);
      // reveal map update
      if (window.MapManager) { MapManager.reveal(player.roomX, player.roomY, roomData); MapManager.draw(player.roomX, player.roomY, rooms); }
      return;
    }

    // open the modal with snippet lesson content (existing behavior)
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
    if (lessonOutput) lessonOutput.textContent = '';
    if (lessonTip) lessonTip.textContent = 'Run your code using the Run button. When you understand, click "Complete & Collect".';

    // pause and clear inputs
    inputQueue.length = 0; player.moving = false;

    if (runLessonBtn) runLessonBtn.onclick = () => runSkulpt(lessonEditor.value);
    if (exampleBtn) exampleBtn.onclick = () => { lessonEditor.value = lessonEditor.value + '\n# example run\nprint("Example run")'; };
    if (completeLessonBtn) completeLessonBtn.onclick = () => {
      collectedSet.add(collectible.id);
      roomData.map[collectible.r][collectible.c] = 0;
      roomData.collectibles = (roomData.collectibles || []).filter(it => !(it.r === collectible.r && it.c === collectible.c && it.id === collectible.id));
      updateCollectedUI();
      showMessage(`Collected "${collectible.label}". ${collectible.desc}`);
      // reveal map update
      if (window.MapManager) { MapManager.reveal(player.roomX, player.roomY, roomData); MapManager.draw(player.roomX, player.roomY, rooms); }
      closeLesson();
    };
    if (closeLessonBtn) closeLessonBtn.onclick = () => closeLesson();
  }

  // Skulpt runner used for non-capture runs (prints to modal output)
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
    // full reset
    currentRoomX = 0; currentRoomY = 0; roomData = loadRoom(currentRoomX, currentRoomY);
    player.roomX = currentRoomX; player.roomY = currentRoomY;
    player.r = 2; player.c = 2; player.px = player.c * TILE; player.py = player.r * TILE;
    player.targetR = player.r; player.targetC = player.c; player.moving = false;
    player.chestPoints = 0;
    collectedSet.clear();
    for (const k in rooms) delete rooms[k];
    roomData = loadRoom(currentRoomX, currentRoomY);
    if (window.MapManager) { MapManager.hideAll(); MapManager.reveal(currentRoomX, currentRoomY, roomData); MapManager.draw(currentRoomX, currentRoomY, rooms); }
    updateCollectedUI(); showMessage('Game reset. Good luck!');
  });

  // --- Init ---
  updateCollectedUI();
  showMessage('Use arrow keys or WASD to move. Collect code snippets to learn.');
  // reveal starting room on minimap
  if (window.MapManager) { MapManager.reveal(currentRoomX, currentRoomY, roomData); MapManager.draw(currentRoomX, currentRoomY, rooms); }

  requestAnimationFrame(loop);
})();