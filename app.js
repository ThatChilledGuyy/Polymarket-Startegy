// ── STRATEGY CARDS ──────────────────────────────────────────────
function renderStrategies(filter = 'all') {
  const grid = document.getElementById('strat-grid');
  const filtered = filter === 'all' ? STRATEGIES : STRATEGIES.filter(s => s.type === filter);
  
  grid.innerHTML = filtered.map((s, i) => `
    <div class="strat-card ${s.type} fade-in" style="transition-delay: ${i * 60}ms" onclick="openModal('${s.id}')">
      <div class="strat-type-label ${s.type}">${s.type === 'core' ? '▲ Core Strategy' : '◆ Uncommon Strategy'}</div>
      <div class="strat-card-top">
        <div class="strat-name">${s.name}</div>
        <span class="strat-badge ${s.badgeType}">${s.badge}</span>
      </div>
      <div class="strat-desc">${s.desc}</div>
      <div class="strat-meta">
        <div class="meta-item">
          <div class="meta-label">Capital</div>
          <div class="meta-val">${s.capital}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Returns</div>
          <div class="meta-val">${s.returns}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Timeframe</div>
          <div class="meta-val">${s.timeframe}</div>
        </div>
      </div>
      <div class="strat-arrow">↗</div>
    </div>
  `).join('');

  // Trigger fade-in
  requestAnimationFrame(() => {
    document.querySelectorAll('.strat-card.fade-in').forEach(el => {
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  });
}

// ── TABS ────────────────────────────────────────────────────────
document.querySelectorAll('.strat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.strat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderStrategies(tab.dataset.filter);
  });
});

// ── MODAL ───────────────────────────────────────────────────────
function openModal(id) {
  const s = STRATEGIES.find(x => x.id === id);
  if (!s) return;

  const stepsHtml = s.steps.map((st, i) => `
    <div class="step-item">
      <div class="step-num">${i + 1}</div>
      <div class="step-body">
        <div class="step-title">${st.title}</div>
        <div class="step-text">${st.text}</div>
      </div>
    </div>
  `).join('');

  const toolsHtml = s.tools.map(t => `<span class="tool-pill">${t}</span>`).join('');

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-tag ${s.type}">${s.type === 'core' ? '▲ Core Strategy' : '◆ Uncommon Strategy'}</div>
    <div class="modal-title">${s.name}</div>
    <div class="modal-desc">${s.desc}</div>
    <div class="modal-meta">
      <div class="modal-meta-item">
        <div class="modal-meta-label">Min. Capital</div>
        <div class="modal-meta-val">${s.capital}</div>
      </div>
      <div class="modal-meta-item">
        <div class="modal-meta-label">Returns</div>
        <div class="modal-meta-val">${s.returns}</div>
      </div>
      <div class="modal-meta-item">
        <div class="modal-meta-label">Timeframe</div>
        <div class="modal-meta-val">${s.timeframe}</div>
      </div>
      <div class="modal-meta-item">
        <div class="modal-meta-label">Risk level</div>
        <div class="modal-meta-val">${s.badge}</div>
      </div>
    </div>
    <div class="steps-title">Execution steps</div>
    <div class="steps-list">${stepsHtml}</div>
    <div class="info-box tip">
      <div class="info-label">Pro Tip</div>
      <div class="info-text">${s.tip}</div>
    </div>
    <div class="info-box warn">
      <div class="info-label">Key Risk</div>
      <div class="info-text">${s.warn}</div>
    </div>
    <div class="steps-title" style="margin-top: 20px;">Tools needed</div>
    <div class="tools-pills">${toolsHtml}</div>
  `;

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── CALCULATORS ─────────────────────────────────────────────────
function updateArb() {
  const yes = parseFloat(document.getElementById('yes-price').value) / 100;
  const no  = parseFloat(document.getElementById('no-price').value) / 100;
  const cap = parseFloat(document.getElementById('capital').value);
  const fee = parseFloat(document.getElementById('fee').value) / 100;

  document.getElementById('yes-val').textContent     = yes.toFixed(2);
  document.getElementById('no-val').textContent      = no.toFixed(2);
  document.getElementById('capital-val').textContent = '$' + cap.toLocaleString();
  document.getElementById('fee-val').textContent     = (fee * 100).toFixed(1) + '%';

  const combined  = yes + no;
  const grossSpread = 1 - combined;
  const feesCost  = (cap * fee);
  const netProfit = (grossSpread * cap) - feesCost;

  document.getElementById('r-combined').textContent = combined.toFixed(3);
  document.getElementById('r-gross').textContent    = (grossSpread * 100).toFixed(1) + '¢';
  document.getElementById('r-fees').textContent     = '-$' + feesCost.toFixed(2);
  document.getElementById('r-net').textContent      = (netProfit >= 0 ? '+' : '') + '$' + netProfit.toFixed(2);

  const verdict = document.getElementById('r-verdict');
  if (grossSpread <= 0) {
    verdict.textContent  = '✗ No opportunity — combined cost exceeds $1.00';
    verdict.className = 'result-verdict bad';
  } else if (netProfit <= 0) {
    verdict.textContent  = '✗ Fees eat the spread — not worth taking';
    verdict.className = 'result-verdict bad';
  } else {
    const roi = ((netProfit / cap) * 100).toFixed(1);
    verdict.textContent  = `✓ Viable — ${roi}% net return on deployed capital`;
    verdict.className = 'result-verdict good';
  }
}

function updateBond() {
  const price     = parseFloat(document.getElementById('bond-price').value) / 100;
  const capital   = parseFloat(document.getElementById('bond-capital').value);
  const days      = parseInt(document.getElementById('bond-days').value);
  const positions = parseInt(document.getElementById('bond-positions').value);

  document.getElementById('bond-price-val').textContent    = price.toFixed(2);
  document.getElementById('bond-capital-val').textContent  = '$' + capital.toLocaleString();
  document.getElementById('bond-days-val').textContent     = days + (days === 1 ? ' day' : ' days');
  document.getElementById('bond-positions-val').textContent = positions;

  const shares       = capital / price;
  const profitTrade  = shares * (1 - price);
  const returnPct    = ((1 - price) / price) * 100;
  const cyclesPerYear = 365 / days;
  const annualised   = (Math.pow(1 + (1 - price) / price, cyclesPerYear) - 1) * 100;
  const cyclesPerMonth = 30 / days;
  const monthlyIncome = profitTrade * positions * cyclesPerMonth;

  document.getElementById('b-profit').textContent  = '$' + profitTrade.toFixed(2);
  document.getElementById('b-return').textContent  = returnPct.toFixed(1) + '%';
  document.getElementById('b-annual').textContent  = annualised.toFixed(0) + '%';
  document.getElementById('b-monthly').textContent = '$' + monthlyIncome.toFixed(0);
}

['yes-price','no-price','capital','fee'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateArb);
});
['bond-price','bond-capital','bond-days','bond-positions'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateBond);
});

// ── TOOLS ───────────────────────────────────────────────────────
function renderTools() {
  const urls = {
    'eventarb.com': 'https://eventarb.com',
    'PolyMonit': 'https://polymonit.com',
    'PolyTrack': 'https://polytrack.io',
    'Arkham Intel': 'https://intel.arkm.com',
    'Polymarket Gamma API': 'https://gamma-api.polymarket.com',
    'Dune Analytics': 'https://dune.com',
    'Kalshi': 'https://kalshi.com',
    'Ratio Discord bot': 'https://discord.gg/ratio',
  };

  document.getElementById('tools-grid').innerHTML = TOOLS.map(t => `
    <a class="tool-card" href="${urls[t.name] || '#'}" target="_blank" rel="noopener">
      <div class="tool-card-icon" style="background: ${t.color}22; color: ${t.color}">${t.icon}</div>
      <div class="tool-card-name">${t.name}</div>
      <div class="tool-card-desc">${t.desc}</div>
      <div class="tool-strats">
        ${t.strategies.map(s => `<span class="tool-strat-tag">${s}</span>`).join('')}
      </div>
    </a>
  `).join('');
}

// ── ALLOCATION ──────────────────────────────────────────────────
function renderAllocations() {
  document.getElementById('alloc-grid').innerHTML = ALLOCATIONS.map(a => `
    <div class="alloc-card">
      <div class="alloc-header">
        <div class="alloc-name">${a.name}</div>
        <div class="alloc-pct" style="color: ${a.color}">${a.pct}%</div>
      </div>
      <div class="alloc-bar-track">
        <div class="alloc-bar-fill" style="width: ${a.pct}%; background: ${a.color}"></div>
      </div>
      <div class="alloc-reason">${a.reason}</div>
    </div>
  `).join('');
}

// ── RULES ───────────────────────────────────────────────────────
function renderRules() {
  document.getElementById('rules-grid').innerHTML = RULES.map(r => `
    <div class="rule-card fade-in">
      <div class="rule-icon">${r.icon}</div>
      <div class="rule-name">${r.name}</div>
      <div class="rule-text">${r.text}</div>
    </div>
  `).join('');
}

// ── INTERSECTION OBSERVER (fade-in on scroll) ───────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

function observeFadeIns() {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── INIT ────────────────────────────────────────────────────────
renderStrategies();
renderTools();
renderAllocations();
renderRules();
updateArb();
updateBond();

requestAnimationFrame(() => {
  observeFadeIns();
});
