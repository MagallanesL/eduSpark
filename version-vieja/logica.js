const answers = {
  1: "633",
  2: "2134",
  3: "2",
  4: "3",
  5: "67",
  6: "25",
  7: "D",
  8: "11",
  9: "12",
  10: "2"
};

const hintOptions = {
  1: ["633", "623"],
  2: ["2134", "2314"],
  3: ["2", "3"],
  4: ["3", "1"],
  5: ["67", "68"],
  6: ["25", "27"],
  7: ["D", "B"],
  8: ["11", "13"],
  9: ["12", "8"],
  10: ["2", "3"]
};

const usedHints = {};
const maxHints = 4;
const storageKey = "gandhicaGameState";
const lastRunKey = "gandhicaLastRun";
const sessionKey = "gandhicaSessionLoaded";
const errorCount = {};
const pauseCooldownSeconds = 2400;

let secondsElapsed = 0;
let timerInterval = null;
let started = false;
let hintsUsedCount = 0;
let refreshPenaltyActive = false;
let solvedLevels = [];
let briefingOpen = false;
let teamName = "";
let isPaused = false;
let lastPauseAt = null;
let alertTimeoutId = null;

const startBtn = document.getElementById("startBtn");
const beginBtn = document.getElementById("beginBtn");
const game = document.getElementById("game");
const timerDisplay = document.getElementById("timer");
const finalScreen = document.getElementById("finalScreen");
const finalTime = document.getElementById("finalTime");
const pauseBtn = document.getElementById("pauseBtn");
const resetDemoBtn = document.getElementById("resetDemoBtn");
const pauseStatus = document.getElementById("pauseStatus");
const teamNameInput = document.getElementById("teamName");
const teamFeedback = document.getElementById("teamFeedback");
const lastRunBox = document.getElementById("lastRunBox");
const lastRunTime = document.getElementById("lastRunTime");
const lastRunMeta = document.getElementById("lastRunMeta");
const gameAlert = document.getElementById("gameAlert");
const gameAlertCard = document.getElementById("gameAlertCard");
const gameAlertEmoji = document.getElementById("gameAlertEmoji");
const gameAlertTitle = document.getElementById("gameAlertTitle");
const gameAlertText = document.getElementById("gameAlertText");

document.addEventListener("DOMContentLoaded", () => {
  restoreGameState();
  initializeVisualEffects();
  bindInputPersistence();
  renderLastRun();
});

startBtn.addEventListener("click", () => {
  if (briefingOpen) return;
  if (!validateTeamName()) return;

  briefingOpen = true;
  startBtn.classList.add("hidden");
  game.classList.remove("hidden");
  saveGameState();
});

beginBtn.addEventListener("click", () => {
  if (started) return;
  briefingOpen = true;
  started = true;
  beginBtn.classList.add("hidden");
  showCurrentLevel();
  updatePauseUI();
  saveGameState();
  startTimer();
});

pauseBtn.addEventListener("click", () => {
  if (!started) return;
  togglePause();
});

if (resetDemoBtn) {
  resetDemoBtn.addEventListener("click", resetDemo);
}

function startTimer() {
  if (timerInterval || isPaused) return;

  timerInterval = setInterval(() => {
    secondsElapsed++;
    timerDisplay.textContent = formatTime(secondsElapsed);
    updatePauseUI();
    saveGameState();
  }, 1000);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function checkAnswer(level) {
  if (isPaused) return;

  const input = document.getElementById(`answer${level}`);
  const feedback = document.getElementById(`feedback${level}`);
  const userAnswer = input.value.trim().toUpperCase();

  if (!userAnswer) {
    feedback.textContent = "Ingresa una respuesta.";
    feedback.className = "feedback error";
    showGameAlert({
      mood: "error",
      emoji: "😞",
      title: "Respuesta incompleta",
      text: "Escriban una respuesta antes de validar."
    });
    return;
  }

  if (userAnswer === answers[level]) {
    feedback.textContent = "Acertaron. Se abre el siguiente paso de la aventura.";
    feedback.className = "feedback ok";
    input.value = answers[level];
    input.disabled = true;
    solvedLevels = Array.from(new Set([...solvedLevels, level])).sort((a, b) => a - b);

    const hintButton = document.getElementById(`hintBtn${level}`);
    if (hintButton) {
      hintButton.disabled = true;
    }

    saveGameState();
    showGameAlert({
      mood: "success",
      emoji: "🎉",
      title: "Acertaron",
      text: "Muy bien. Se abre el siguiente paso de la aventura."
    });

    window.setTimeout(() => {
      unlockNext(level);
    }, 850);
    return;
  }

  if (!errorCount[level]) errorCount[level] = 0;
  errorCount[level]++;

  let penalty = 0;

  if (errorCount[level] === 1) penalty = 60;
  else if (errorCount[level] === 2) penalty = 120;
  else if (errorCount[level] === 3) penalty = 300;
  else penalty = 600;

  secondsElapsed += penalty;
  timerDisplay.textContent = formatTime(secondsElapsed);

  feedback.textContent = `Incorrecto. Intento ${errorCount[level]} -> +${penalty / 60} min.`;
  feedback.className = "feedback error";
  showGameAlert({
    mood: "error",
    emoji: "😞",
    title: "No salio esta vez",
    text: "Respuesta incorrecta. Revisen la pista y vuelvan a intentar."
  });

  input.disabled = true;
  setTimeout(() => {
    input.disabled = false;
    input.focus();
  }, 30000);

  saveGameState();
}

function showGameAlert({ mood, emoji, title, text }) {
  if (!gameAlert || !gameAlertCard || !gameAlertEmoji || !gameAlertTitle || !gameAlertText) {
    return;
  }

  if (alertTimeoutId) {
    window.clearTimeout(alertTimeoutId);
  }

  gameAlert.dataset.mood = mood;
  gameAlertEmoji.textContent = emoji;
  gameAlertTitle.textContent = title;
  gameAlertText.textContent = text;
  gameAlert.classList.remove("hidden");
  gameAlertCard.classList.remove("glitch-once");
  void gameAlertCard.offsetWidth;
  gameAlertCard.classList.add("glitch-once");

  alertTimeoutId = window.setTimeout(() => {
    gameAlert.classList.add("hidden");
  }, 1800);
}

window.showGameAlert = showGameAlert;

function unlockNext(currentLevel) {
  const currentSection = document.getElementById(`level${currentLevel}`);
  currentSection.classList.remove("active");

  const nextLevel = currentLevel + 1;
  const nextSection = document.getElementById(`level${nextLevel}`);

  if (nextSection) {
    nextSection.classList.remove("hidden");
    nextSection.classList.remove("locked");
    nextSection.classList.add("active");
    saveGameState();
    nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    endGame();
  }
}

function endGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = false;
  finalTime.textContent = formatTime(secondsElapsed);
  finalScreen.classList.remove("hidden");
  updatePauseUI();
  saveGameState();
  finalScreen.scrollIntoView({ behavior: "smooth", block: "start" });
}

function restartGame() {
  stopActiveCamera();
  localStorage.setItem(
    lastRunKey,
    JSON.stringify({
      teamName,
      finalTime: formatTime(secondsElapsed),
      secondsElapsed,
      finished: !finalScreen.classList.contains("hidden"),
      savedAt: new Date().toISOString()
    })
  );
  localStorage.removeItem(storageKey);
  sessionStorage.removeItem(sessionKey);
  window.location.reload();
}

function resetDemo() {
  clearInterval(timerInterval);
  timerInterval = null;
  stopActiveCamera();
  localStorage.removeItem(storageKey);
  sessionStorage.removeItem(sessionKey);
  window.location.reload();
}

function stopActiveCamera() {
  if (typeof window.stopCamera === "function") {
    window.stopCamera();
  }
}

function requestHint(level) {
  if (isPaused) return;

  const hintBox = document.getElementById(`hintBox${level}`);
  const hintButton = document.getElementById(`hintBtn${level}`);
  const hintList = hintBox ? hintBox.querySelector(".hint-options") : null;

  if (!hintBox || !hintButton || !hintList || usedHints[level] || !hintOptions[level] || hintsUsedCount >= maxHints) {
    return;
  }

  usedHints[level] = true;
  hintsUsedCount++;
  secondsElapsed += 1800;
  timerDisplay.textContent = formatTime(secondsElapsed);

  hintList.innerHTML = hintOptions[level]
    .map((option) => `<li>${option}</li>`)
    .join("");

  hintBox.classList.remove("hidden");
  hintBox.classList.add("revealed", "glitch-once");
  hintButton.disabled = true;
  hintButton.textContent = "Ayuda usada";
  updateHintUI();
  saveGameState();

  setTimeout(() => {
    hintBox.classList.remove("glitch-once");
  }, 550);
}

function initializeVisualEffects() {
  const cards = document.querySelectorAll(".reveal-card");
  const bootLines = document.querySelectorAll(".boot-line");
  const observedSections = document.querySelectorAll(".level, #finalScreen");

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("revealed");
    }, 80 * index);
  });

  bootLines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("visible");
    }, 350 * (index + 1));
  });

  syncCardStatuses();
  updateHintUI();

  observedSections.forEach((section) => {
    section.dataset.visualState = getVisualState(section);
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== "attributes" || mutation.attributeName !== "class") {
        return;
      }

      const target = mutation.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.classList.contains("level") || target.id === "finalScreen") {
        const nextState = getVisualState(target);

        if (target.dataset.visualState !== nextState) {
          target.dataset.visualState = nextState;
          flashReveal(target);
        }
      }
    });

    syncCardStatuses();
  });

  observedSections.forEach((section) => {
    observer.observe(section, { attributes: true });
  });
}

function syncCardStatuses() {
  document.querySelectorAll(".level").forEach((level) => {
    const status = level.querySelector(".card-status");
    if (!status) return;

    if (level.classList.contains("locked")) {
      status.textContent = "LOCKED";
      return;
    }

    status.textContent = level.classList.contains("active") ? "ACTIVE" : "UNLOCKED";
  });
}

function getVisualState(element) {
  return [
    element.classList.contains("locked") ? "locked" : "unlocked",
    element.classList.contains("active") ? "active" : "inactive",
    element.classList.contains("hidden") ? "hidden" : "visible"
  ].join("-");
}

function flashReveal(element) {
  if (element.dataset.animating === "true") {
    return;
  }

  element.dataset.animating = "true";
  element.classList.add("glitch-once", "revealed");

  setTimeout(() => {
    element.classList.remove("glitch-once");
    element.dataset.animating = "false";
  }, 550);
}

function updateHintUI() {
  const hintCounter = document.getElementById("hintCounter");
  const hintsRemaining = Math.max(0, maxHints - hintsUsedCount);

  if (hintCounter) {
    hintCounter.textContent = `${hintsRemaining}/${maxHints}`;
  }

  const allHintButtons = document.querySelectorAll('[id^="hintBtn"]');
  allHintButtons.forEach((button) => {
    const level = Number(button.id.replace("hintBtn", ""));
    const levelInput = document.getElementById(`answer${level}`);
    const levelResolved = Boolean(levelInput && levelInput.disabled);

    if (usedHints[level] || levelResolved) {
      return;
    }

    if (hintsRemaining <= 0) {
      button.disabled = true;
      button.textContent = "Sin ayudas";
    } else {
      button.disabled = false;
      button.textContent = "Solicitar ayuda (+30:00)";
    }
  });
}

function bindInputPersistence() {
  document.querySelectorAll('input[id^="answer"]').forEach((input) => {
    input.addEventListener("input", saveGameState);
  });

  if (teamNameInput) {
    teamNameInput.addEventListener("input", () => {
      teamName = teamNameInput.value.trim();
      if (!teamFeedback.classList.contains("hidden") && teamName) {
        teamFeedback.classList.add("hidden");
      }
      saveGameState();
    });
  }
}

function saveGameState() {
  const inputValues = {};
  document.querySelectorAll('input[id^="answer"]').forEach((input) => {
    inputValues[input.id] = input.value;
  });

  const state = {
    briefingOpen,
    started,
    teamName,
    isPaused,
    lastPauseAt,
    secondsElapsed,
    refreshPenaltyActive,
    solvedLevels,
    errorCount,
    usedHints,
    hintsUsedCount,
    inputValues,
    finished: !finalScreen.classList.contains("hidden")
  };

  localStorage.setItem(storageKey, JSON.stringify(state));
}

function restoreGameState() {
  const savedState = localStorage.getItem(storageKey);

  if (!savedState) {
    sessionStorage.setItem(sessionKey, "true");
    timerDisplay.textContent = formatTime(secondsElapsed);
    return;
  }

  try {
    const state = JSON.parse(savedState);

    briefingOpen = Boolean(state.briefingOpen);
    started = Boolean(state.started);
    teamName = typeof state.teamName === "string" ? state.teamName : "";
    isPaused = Boolean(state.isPaused);
    lastPauseAt = typeof state.lastPauseAt === "number" ? state.lastPauseAt : null;
    secondsElapsed = Number(state.secondsElapsed) || 0;
    refreshPenaltyActive = Boolean(state.refreshPenaltyActive);
    solvedLevels = Array.isArray(state.solvedLevels) ? state.solvedLevels.map(Number) : [];
    hintsUsedCount = Number(state.hintsUsedCount) || 0;

    Object.keys(usedHints).forEach((key) => delete usedHints[key]);
    Object.assign(usedHints, state.usedHints || {});

    Object.keys(errorCount).forEach((key) => delete errorCount[key]);
    Object.assign(errorCount, state.errorCount || {});

    const inputValues = state.inputValues || {};
    Object.entries(inputValues).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = value;
      }
    });

    if (teamNameInput) {
      teamNameInput.value = teamName;
    }

    if (briefingOpen || started) {
      startBtn.classList.add("hidden");
      game.classList.remove("hidden");
    }

    if (started) {
      beginBtn.classList.add("hidden");
    }

    applySolvedState();
    applyHintState();
    updatePauseUI();

    const wasReloaded = sessionStorage.getItem(sessionKey) === "true";
    if (wasReloaded && started && !state.finished && !isPaused) {
      secondsElapsed += 15;
      refreshPenaltyActive = true;
    }

    timerDisplay.textContent = formatTime(secondsElapsed);

    if (state.finished) {
      finalTime.textContent = formatTime(secondsElapsed);
      finalScreen.classList.remove("hidden");
    } else if (started && !isPaused) {
      startTimer();
    }

    updateHintUI();
    applyPauseState();
    saveGameState();
  } catch {
    localStorage.removeItem(storageKey);
  }

  sessionStorage.setItem(sessionKey, "true");
}

function applySolvedState() {
  const highestSolved = solvedLevels.length ? Math.max(...solvedLevels) : 0;

  document.querySelectorAll(".level").forEach((section, index) => {
    const level = index + 1;
    const input = document.getElementById(`answer${level}`);
    const feedback = document.getElementById(`feedback${level}`);
    const isSolved = solvedLevels.includes(level);
    const shouldBeVisible = started && level <= highestSolved + 1;
    const isCurrentLevel = started && !isSolved && level === highestSolved + 1;

    section.classList.toggle("hidden", !shouldBeVisible);
    section.classList.toggle("locked", started && !isSolved && !isCurrentLevel);
    section.classList.toggle("active", isCurrentLevel);

    if (!started) {
      section.classList.remove("active");
    }

    if (input && isSolved) {
      input.value = answers[level];
      input.disabled = true;
    }

    if (feedback && isSolved) {
      feedback.textContent = "Acertaron. Se abre el siguiente paso de la aventura.";
      feedback.className = "feedback ok";
    }
  });
}

function showCurrentLevel() {
  const highestSolved = solvedLevels.length ? Math.max(...solvedLevels) : 0;
  const nextLevel = highestSolved + 1;
  const nextSection = document.getElementById(`level${nextLevel}`);

  if (nextSection) {
    nextSection.classList.remove("hidden");
    nextSection.classList.remove("locked");
    nextSection.classList.add("active");
    nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function togglePause() {
  if (!isPaused) {
    const remaining = getPauseCooldownRemaining();
    if (remaining > 0) {
      updatePauseUI();
      saveGameState();
      return;
    }

    isPaused = true;
    lastPauseAt = secondsElapsed;
    clearInterval(timerInterval);
    timerInterval = null;
  } else {
    isPaused = false;
    startTimer();
  }

  updatePauseUI();
  applyPauseState();
  saveGameState();
}

function updatePauseUI() {
  if (!pauseBtn || !pauseStatus) return;

  const remaining = getPauseCooldownRemaining();

  pauseBtn.disabled = !started;
  pauseBtn.textContent = isPaused ? "Reanudar" : remaining > 0 ? "En espera" : "Pausar";
  pauseStatus.textContent = !started
    ? "Listos para la aventura"
    : isPaused
      ? "Cronometro en pausa"
      : remaining > 0
        ? `Pausa disponible en ${formatTime(remaining)}`
        : "Pausa disponible";

  if (!isPaused && started && remaining > 0) {
    pauseBtn.disabled = true;
  }
}

function applyPauseState() {
  document.body.classList.toggle("game-paused", isPaused);

  document.querySelectorAll(".level").forEach((section, index) => {
    const level = index + 1;
    const input = document.getElementById(`answer${level}`);
    const hintButton = document.getElementById(`hintBtn${level}`);
    const validateButton = section.querySelector(".action-row .btn");
    const isSolved = solvedLevels.includes(level);
    const isVisible = !section.classList.contains("hidden");

    if (input && isVisible && !isSolved) {
      input.disabled = isPaused;
    }

    if (validateButton && isVisible && !isSolved) {
      validateButton.disabled = isPaused;
    }

    if (hintButton && isVisible && !isSolved && !usedHints[level]) {
      hintButton.disabled = isPaused || hintsUsedCount >= maxHints;
    }
  });
}

function applyHintState() {
  Object.entries(usedHints).forEach(([levelKey, wasUsed]) => {
    if (!wasUsed) return;

    const level = Number(levelKey);
    const hintBox = document.getElementById(`hintBox${level}`);
    const hintButton = document.getElementById(`hintBtn${level}`);
    const hintList = hintBox ? hintBox.querySelector(".hint-options") : null;

    if (hintList && hintOptions[level]) {
      hintList.innerHTML = hintOptions[level]
        .map((option) => `<li>${option}</li>`)
        .join("");
    }

    if (hintBox) {
      hintBox.classList.remove("hidden");
    }

    if (hintButton) {
      hintButton.disabled = true;
      hintButton.textContent = "Ayuda usada";
    }
  });
}

function validateTeamName() {
  teamName = teamNameInput ? teamNameInput.value.trim() : "";

  if (teamName) {
    teamFeedback.classList.add("hidden");
    return true;
  }

  teamFeedback.classList.remove("hidden");
  if (teamNameInput) {
    teamNameInput.focus();
  }
  return false;
}

function renderLastRun() {
  const lastRunRaw = localStorage.getItem(lastRunKey);
  if (!lastRunRaw || !lastRunBox || !lastRunTime || !lastRunMeta) {
    return;
  }

  try {
    const lastRun = JSON.parse(lastRunRaw);
    const savedDate = lastRun.savedAt ? new Date(lastRun.savedAt) : null;
    const teamLabel = lastRun.teamName ? `Equipo: ${lastRun.teamName}` : "Equipo no informado";
    const dateLabel = savedDate && !Number.isNaN(savedDate.getTime())
      ? savedDate.toLocaleString("es-AR")
      : "";

    lastRunTime.textContent = lastRun.finalTime || "00:00";
    lastRunMeta.textContent = dateLabel ? `${teamLabel} // ${dateLabel}` : teamLabel;
    lastRunBox.classList.remove("hidden");
  } catch {
    localStorage.removeItem(lastRunKey);
  }
}

function getPauseCooldownRemaining() {
  if (lastPauseAt === null) {
    return 0;
  }

  return Math.max(0, pauseCooldownSeconds - (secondsElapsed - lastPauseAt));
}
