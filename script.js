/* ============================================================
   TERMINAL TYPEWRITER
   ============================================================ */
const terminalLines = [
  { type: 'cmd', text: '$ git init meu-projeto' },
  { type: 'ok',  text: 'Initialized empty Git repository' },
  { type: 'cmd', text: '$ git add .' },
  { type: 'cmd', text: '$ git commit -m "feat: primeiro commit"' },
  { type: 'ok',  text: '[main (root-commit) a1b2c3d] feat: primeiro commit' },
  { type: 'cmd', text: '$ git checkout -b feature/login' },
  { type: 'ok',  text: "Switched to a new branch 'feature/login'" },
  { type: 'cmd', text: '$ git push origin feature/login' },
  { type: 'ok',  text: 'Branch pushed. Open a Pull Request ↑' },
];

function typeLines(lines, container, lineIndex = 0, charIndex = 0) {
  if (lineIndex >= lines.length) {
    // Restart after pause
    setTimeout(() => {
      container.innerHTML = '';
      typeLines(lines, container, 0, 0);
    }, 3000);
    return;
  }

  const line = lines[lineIndex];

  // Create line element if starting fresh
  let lineEl = container.querySelector(`[data-line="${lineIndex}"]`);
  if (!lineEl) {
    lineEl = document.createElement('div');
    lineEl.dataset.line = lineIndex;
    lineEl.className = line.type;

    // Remove old cursor
    const oldCursor = container.querySelector('.cursor');
    if (oldCursor) oldCursor.remove();

    container.appendChild(lineEl);
  }

  if (charIndex < line.text.length) {
    lineEl.textContent = line.text.slice(0, charIndex + 1);

    // Append cursor
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    lineEl.appendChild(cursor);

    const delay = line.type === 'cmd' ? 45 : 18;
    setTimeout(() => typeLines(lines, container, lineIndex, charIndex + 1), delay);
  } else {
    // Line done — pause then next
    lineEl.textContent = line.text;
    setTimeout(() => typeLines(lines, container, lineIndex + 1, 0), 400);
  }
}

// ============================================================
// COMMANDS DATA
// ============================================================
const commands = [
  { code: 'git init',                desc: 'Inicializa um repositório Git no diretório atual.' },
  { code: 'git clone <url>',         desc: 'Clona um repositório remoto para a sua máquina.' },
  { code: 'git add .',               desc: 'Adiciona todas as alterações à área de staging.' },
  { code: 'git commit -m "msg"',     desc: 'Salva um snapshot do projeto com uma mensagem.' },
  { code: 'git push',                desc: 'Envia os commits locais para o repositório remoto.' },
  { code: 'git pull',                desc: 'Baixa e integra as alterações do repositório remoto.' },
  { code: 'git branch <nome>',       desc: 'Cria uma nova branch a partir da atual.' },
  { code: 'git checkout <branch>',   desc: 'Troca para a branch especificada.' },
  { code: 'git merge <branch>',      desc: 'Mescla a branch especificada na branch atual.' },
  { code: 'git log --oneline',       desc: 'Exibe o histórico de commits de forma resumida.' },
  { code: 'git status',              desc: 'Mostra o estado atual dos arquivos no repositório.' },
  { code: 'git diff',                desc: 'Exibe as diferenças entre arquivos modificados.' },
];

function renderCommands() {
  const grid = document.getElementById('commands-grid');
  if (!grid) return;

  commands.forEach((cmd, i) => {
    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.style.transitionDelay = `${i * 50}ms`;
    card.innerHTML = `
      <div class="cmd-code">${escapeHtml(cmd.code)}</div>
      <div class="cmd-desc">${escapeHtml(cmd.desc)}</div>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================
// INTERSECTION OBSERVER — animate on scroll
// ============================================================
function setupObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  // Cards
  document.querySelectorAll('.card').forEach((el, i) => {
    const delay = el.dataset.delay || 0;
    el.style.transitionDelay = `${delay}ms`;
    observer.observe(el);
  });

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
    observer.observe(el);
  });

  // Generic fade-ins
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function setupCommandObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.cmd-card').forEach(card => observer2.observe(card));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  const grid = document.getElementById('commands-grid');
  if (grid) observer.observe(grid);
}

// ============================================================
// SMOOTH ANCHOR OFFSET
// ============================================================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 30;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Terminal
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {
    setTimeout(() => typeLines(terminalLines, terminalBody), 800);
  }

  // Render command cards
  renderCommands();

  // Observers
  setupObserver();
  setupCommandObserver();

  // Smooth scroll
  setupSmoothScroll();

  // Animate hero elements on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(24px)';
    heroContent.style.transition = 'opacity .7s ease, transform .7s ease';
    requestAnimationFrame(() => {
      setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 100);
    });
  }
});
