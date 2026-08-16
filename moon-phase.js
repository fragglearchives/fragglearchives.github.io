function getMoonPhaseIndex(date = new Date()) {
  const synodicMonth = 29.53058867;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);

  const now = date.getTime();
  const daysSinceKnownNewMoon = (now - knownNewMoon) / 86400000;

  const currentCycleDay =
    ((daysSinceKnownNewMoon % synodicMonth) + synodicMonth) % synodicMonth;

  const phaseFraction = currentCycleDay / synodicMonth;

  return Math.floor((phaseFraction * 8) + 0.5) % 8;
}

function initFooterMoonPhase() {
  const moons = document.querySelectorAll(".footer-moon");
  if (!moons.length) return;

  moons.forEach((moon) => {
    moon.classList.remove("current-phase");
    moon.removeAttribute("aria-current");
    moon.removeAttribute("title");
  });

  const phaseIndex = getMoonPhaseIndex();
  const currentMoon = document.querySelector(
    '.footer-moon[data-phase="' + phaseIndex + '"]'
  );

  if (currentMoon) {
    currentMoon.classList.add("current-phase");
    currentMoon.setAttribute("aria-current", "true");
    currentMoon.setAttribute("title", "Current moon phase: " + currentMoon.alt);
  }
}

window.initFooterMoonPhase = initFooterMoonPhase;
