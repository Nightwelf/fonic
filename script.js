const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// Waveform bars with deterministic heights, so the demo looks the same on every load.
function bars(el, n) {
  for (let i = 0; i < n; i++) {
    const b = document.createElement('span');
    b.style.setProperty('--h', (.3 + .7 * Math.abs(Math.sin(i * .9) * Math.sin(i * .31 + 1.3))).toFixed(2));
    b.style.setProperty('--i', i);
    el.append(b);
  }
  return [...el.children];
}

bars(document.querySelector('.hero-bars'), 110);

// Phone mockup: playback progress, timer and the highlighted segment.
const demo = document.querySelector('.demo');
const waveBars = bars(demo.querySelector('.p-wave'), 46);
const segs = [...demo.querySelectorAll('[data-t]')];
const time = demo.querySelector('.p-time');
const total = 34;
let t = reduceMotion ? 12 : 0;

function tick() {
  const p = t / total;
  waveBars.forEach((b, i) => b.classList.toggle('on', i / waveBars.length < p));
  segs.forEach((s, i) => s.classList.toggle('active', t >= s.dataset.t && !(t >= segs[i + 1]?.dataset.t)));
  time.textContent = fmt(t);
  t = (t + .15) % total; // 1.5× speed at 100 ms per tick
}
tick();

// Recording notification timer.
const clock = document.querySelector('[data-clock]');
let elapsed = 767;

if (!reduceMotion) {
  setInterval(tick, 100);
  setInterval(() => clock.textContent = fmt(++elapsed), 1000);
}

// Reveal on scroll.
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Cursor spotlight on cards.
document.querySelectorAll('.card').forEach(card => card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}));
