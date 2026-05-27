/* ===================================
   CALCULADORA DE MAGNITUDES FÍSICAS
   script.js — Lógica y funcionalidad
   =================================== */

/* =====================
   TAB NAVIGATION
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initParticles();
});

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.calc-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabSections.forEach(s => s.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      const targetSection = document.getElementById('tab-' + target);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      // Scroll tab into view
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });
}

/* =====================
   PARTICLES
   ===================== */
function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#3d5060', '#8b3a22', '#5f7a7a', '#b0b8bc', '#2a3a47', '#b04e30', '#7a9898'];
  const count = 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 15;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(p);
  }
}

/* =====================
   UTILITY FUNCTIONS
   ===================== */

/**
 * Gets and validates a numeric value from an input field.
 * @param {string} id - The input element ID
 * @returns {number|null} - Parsed number or null if invalid/empty
 */
function getVal(id) {
  const el = document.getElementById(id);
  const val = el.value.trim();
  if (val === '' || val === null) return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

/**
 * Displays a successful result in the result box.
 * @param {string} boxId - The result box element ID
 * @param {number} result - The calculated result value
 * @param {string} unit - The unit of measurement
 * @param {string} formulaUsed - The formula shown with values
 */
function showResult(boxId, result, unit, formulaUsed) {
  const box = document.getElementById(boxId);
  box.className = 'result-box success';

  // Format: avoid excessive decimals
  let formatted;
  if (Math.abs(result) >= 1e6 || (Math.abs(result) < 0.001 && result !== 0)) {
    formatted = result.toExponential(4);
  } else {
    formatted = parseFloat(result.toFixed(4)).toString();
  }

  box.innerHTML = `
    <div class="result-content">
      <div class="result-label">✅ Resultado</div>
      <div class="result-value">${formatted} ${unit}</div>
      <div class="result-formula-used">${formulaUsed}</div>
    </div>
  `;
}

/**
 * Displays an error message in the result box.
 * @param {string} boxId - The result box element ID
 * @param {string} message - The error message to display
 */
function showError(boxId, message) {
  const box = document.getElementById(boxId);
  box.className = 'result-box error';
  box.innerHTML = `
    <div class="result-error">
      <span>⚠️</span>
      <span>${message}</span>
    </div>
  `;
}

/**
 * Validates that all provided values are not null.
 * @param {...number|null} vals - Values to check
 * @returns {boolean} - True if all valid
 */
function allValid(...vals) {
  return vals.every(v => v !== null);
}

/* =====================
   1. VELOCIDAD
   v = d / t
   ===================== */
function calcularVelocidad() {
  const d = getVal('vel-d');
  const t = getVal('vel-t');

  if (!allValid(d, t)) {
    return showError('res-velocidad', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (t === 0) {
    return showError('res-velocidad', 'El tiempo (t) no puede ser cero. División por cero no permitida.');
  }

  const v = d / t;
  showResult('res-velocidad', v, 'm/s', `v = ${d} m ÷ ${t} s = ${parseFloat(v.toFixed(4))} m/s`);
}

/* =====================
   2. ACELERACIÓN
   a = Δv / Δt
   ===================== */
function calcularAceleracion() {
  const dv = getVal('acel-dv');
  const dt = getVal('acel-dt');

  if (!allValid(dv, dt)) {
    return showError('res-aceleracion', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (dt === 0) {
    return showError('res-aceleracion', 'El cambio de tiempo (Δt) no puede ser cero. División por cero no permitida.');
  }

  const a = dv / dt;
  showResult('res-aceleracion', a, 'm/s²', `a = ${dv} m/s ÷ ${dt} s = ${parseFloat(a.toFixed(4))} m/s²`);
}

/* =====================
   3. FUERZA
   F = m · a
   ===================== */
function calcularFuerza() {
  const m = getVal('fuerza-m');
  const a = getVal('fuerza-a');

  if (!allValid(m, a)) {
    return showError('res-fuerza', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (m < 0) {
    return showError('res-fuerza', 'La masa (m) no puede ser negativa.');
  }

  const F = m * a;
  showResult('res-fuerza', F, 'N', `F = ${m} kg × ${a} m/s² = ${parseFloat(F.toFixed(4))} N`);
}

/* =====================
   4. TRABAJO
   W = F · d · cos(θ)
   ===================== */
function calcularTrabajo() {
  const F   = getVal('trab-f');
  const d   = getVal('trab-d');
  const ang = getVal('trab-ang');

  if (!allValid(F, d, ang)) {
    return showError('res-trabajo', 'Por favor, completa todos los campos con valores numéricos.');
  }

  const theta = (ang * Math.PI) / 180; // Degrees to radians
  const cosTheta = Math.cos(theta);
  const W = F * d * cosTheta;

  showResult(
    'res-trabajo', W, 'J',
    `W = ${F} N × ${d} m × cos(${ang}°) = ${F} × ${d} × ${parseFloat(cosTheta.toFixed(4))} = ${parseFloat(W.toFixed(4))} J`
  );
}

/* =====================
   5. ENERGÍA CINÉTICA
   K = ½ · m · v²
   ===================== */
function calcularCinetica() {
  const m = getVal('cin-m');
  const v = getVal('cin-v');

  if (!allValid(m, v)) {
    return showError('res-cinetica', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (m < 0) {
    return showError('res-cinetica', 'La masa (m) no puede ser negativa.');
  }

  const K = 0.5 * m * v * v;
  showResult('res-cinetica', K, 'J', `K = ½ × ${m} kg × (${v} m/s)² = ${parseFloat(K.toFixed(4))} J`);
}

/* =====================
   6. ENERGÍA POTENCIAL GRAVITATORIA
   U = m · g · h
   ===================== */
function calcularPotencial() {
  const m = getVal('pot-m');
  const g = getVal('pot-g');
  const h = getVal('pot-h');

  if (!allValid(m, g, h)) {
    return showError('res-potencial', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (m < 0) {
    return showError('res-potencial', 'La masa (m) no puede ser negativa.');
  }

  const U = m * g * h;
  showResult('res-potencial', U, 'J', `U = ${m} kg × ${g} m/s² × ${h} m = ${parseFloat(U.toFixed(4))} J`);
}

/* =====================
   7. DENSIDAD
   ρ = m / V
   ===================== */
function calcularDensidad() {
  const m = getVal('dens-m');
  const V = getVal('dens-v');

  if (!allValid(m, V)) {
    return showError('res-densidad', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (V === 0) {
    return showError('res-densidad', 'El volumen (V) no puede ser cero. División por cero no permitida.');
  }
  if (m < 0 || V < 0) {
    return showError('res-densidad', 'La masa y el volumen deben ser valores positivos.');
  }

  const rho = m / V;
  showResult('res-densidad', rho, 'kg/m³', `ρ = ${m} kg ÷ ${V} m³ = ${parseFloat(rho.toFixed(4))} kg/m³`);
}

/* =====================
   8. PRESIÓN
   P = F / A
   ===================== */
function calcularPresion() {
  const F = getVal('pres-f');
  const A = getVal('pres-a');

  if (!allValid(F, A)) {
    return showError('res-presion', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (A === 0) {
    return showError('res-presion', 'El área (A) no puede ser cero. División por cero no permitida.');
  }
  if (A < 0) {
    return showError('res-presion', 'El área (A) no puede ser negativa.');
  }

  const P = F / A;
  showResult('res-presion', P, 'Pa', `P = ${F} N ÷ ${A} m² = ${parseFloat(P.toFixed(4))} Pa`);
}

/* =====================
   9. CARGA ELÉCTRICA
   q = I · t
   ===================== */
function calcularCarga() {
  const I = getVal('carg-i');
  const t = getVal('carg-t');

  if (!allValid(I, t)) {
    return showError('res-carga', 'Por favor, completa todos los campos con valores numéricos.');
  }

  const q = I * t;
  showResult('res-carga', q, 'C', `q = ${I} A × ${t} s = ${parseFloat(q.toFixed(4))} C`);
}

/* =====================
   10. LEY DE OHM
   V = I · R
   ===================== */
function calcularOhm() {
  const I = getVal('ohm-i');
  const R = getVal('ohm-r');

  if (!allValid(I, R)) {
    return showError('res-ohm', 'Por favor, completa todos los campos con valores numéricos.');
  }
  if (R < 0) {
    return showError('res-ohm', 'La resistencia (R) no puede ser negativa.');
  }

  const V = I * R;
  showResult('res-ohm', V, 'V', `V = ${I} A × ${R} Ω = ${parseFloat(V.toFixed(4))} V`);
}

/* =====================
   KEYBOARD SUPPORT
   Press Enter to calculate
   ===================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const activeSection = document.querySelector('.calc-section.active');
    if (activeSection) {
      const btn = activeSection.querySelector('.calc-btn');
      if (btn) btn.click();
    }
  }
});
