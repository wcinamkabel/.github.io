const lenis = new Lenis({
  duration: 1.4,         // Przyspieszony scroll (z 2.5 na 1.4) – strona reaguje natychmiast
  lerp: 0.08,            // Zwiększona responsywność (mniej "maślanego" opóźnienia podczas jazdy)
  wheelMultiplier: 0.9,  // Przywrócona standardowa siła kółka myszy (prawie 100%)
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- ZOPTYMALIZOWANY, MOCNY EFEKT GUMKI (ODSEPAROWANY OD PRĘDKOŚCI) ---
const body = document.body;
let bounceOffset = 0;
const maxBounce = 1000;   // POWIĘKSZONY ZASIĘG: Strona odskoczy mocniej (aż o 160px)
const elasticity = 3; // WIĘKSZA CZUŁOŚĆ: Szybciej reaguje na krańcach

window.addEventListener('wheel', (e) => {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  // Aktywuj gumkę tylko na samych krańcach, nie spowalniając środka strony
  if (scrollY <= 0 && e.deltaY < 0) {
    bounceOffset -= e.deltaY * elasticity;
    if (bounceOffset > maxBounce) bounceOffset = maxBounce;
    body.style.transform = `translateY(${bounceOffset}px)`;
  } 
  else if (scrollY >= maxScroll - 1 && e.deltaY > 0) {
    bounceOffset -= e.deltaY * elasticity;
    if (bounceOffset < -maxBounce) bounceOffset = -maxBounce;
    body.style.transform = `translateY(${bounceOffset}px)`;
  }
}, { passive: true }); // "passive" upewnia przeglądarkę, że nie blokujemy płynności przewijania

// Bardzo płynny, sprężysty powrót (jak prawdziwa gumka)
setInterval(() => {
  if (bounceOffset !== 0) {
    bounceOffset *= 0.82; // Szybki powrót do normy
    if (Math.abs(bounceOffset) < 0.5) bounceOffset = 0;
    body.style.transform = bounceOffset === 0 ? 'none' : `translateY(${bounceOffset}px)`;
  }
}, 16);

// Dodanie płynnej, elastycznej animacji powrotu w CSS
body.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.35