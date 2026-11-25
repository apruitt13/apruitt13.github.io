(() => {
  const scriptUrl = document.currentScript?.src;
  const siteRoot = scriptUrl ? new URL('.', scriptUrl) : new URL('../', window.location.href);
  const link = (path) => new URL(path, siteRoot).href;
  const nav = document.querySelector('nav');

  if (!nav) return;

  if (!document.querySelector('link[data-learning-nav]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = link('site-nav.css');
    stylesheet.dataset.learningNav = 'true';
    document.head.appendChild(stylesheet);
  }

  nav.className = 'learning-nav legacy-page-nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML = `
    <a class="learning-nav-brand" href="${link('index.html')}">Computer Science Learning Lab</a>
    <div class="learning-nav-links">
      <a href="${link('teachers.html')}">For teachers</a>
      <a href="${link('students.html')}">For students</a>
      <a href="${link('index.html#explore')}">Explore</a>
      <div class="learning-nav-menu">
        <button id="lessons-button" type="button" aria-expanded="false" aria-controls="lessons-dropdown">Student drone missions</button>
        <div id="lessons-dropdown" class="learning-nav-dropdown hidden">
          <a href="${link('drone-simulator.html')}">Student mission directory</a>
          <a href="${link('lessons/agriculture.html')}">Agriculture</a>
          <a href="${link('lessons/construction.html')}">Construction</a>
          <a href="${link('lessons/realEstate.html')}">Real estate</a>
          <a href="${link('lessons/filmMaking.html')}">Filmmaking</a>
          <a href="${link('lessons/publicSafety.html')}">Public safety</a>
          <a href="${link('lessons/surveyingMapping.html')}">Surveying and mapping</a>
          <a href="${link('lessons/energyUtilities.html')}">Energy and utilities</a>
          <a href="${link('lessons/logisticsDelivery.html')}">Logistics and delivery</a>
          <a href="${link('lessons/journalism.html')}">Journalism</a>
          <a href="${link('lessons/environmentalConservation.html')}">Environmental conservation</a>
        </div>
      </div>
      <div class="learning-nav-menu">
        <button id="part107-button" type="button" aria-expanded="false" aria-controls="part107-dropdown">Part 107</button>
        <div id="part107-dropdown" class="learning-nav-dropdown hidden">
          <a href="${link('part107/part107.html')}">Study guide</a>
          <a href="${link('part107/regulations.html')}">Regulations</a>
          <a href="${link('part107/airspace.html')}">Airspace</a>
          <a href="${link('part107/weather.html')}">Weather</a>
          <a href="${link('part107/loading.html')}">Loading and performance</a>
          <a href="${link('part107/operations.html')}">Operations</a>
        </div>
      </div>
      <a href="${link('game/python_game.html')}">Python Quest</a>
    </div>`;

  document.addEventListener('click', (event) => {
    queueMicrotask(() => {
      for (const [buttonId, menuId] of [['lessons-button', 'lessons-dropdown'], ['part107-button', 'part107-dropdown']]) {
        const button = document.getElementById(buttonId);
        const menu = document.getElementById(menuId);
        button?.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
      }
    });
  });
})();
