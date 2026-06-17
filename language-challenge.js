import { languageQuestions } from "./language-data.js";

let currentQuestionIndex = 0;
let questionHost = null;
let feedbackNode = null;

document.addEventListener("DOMContentLoaded", () => {
  questionHost = document.getElementById("languageQuestionHost");
  feedbackNode = document.getElementById("languageFeedback");

  document.getElementById("openLanguageChallengeBtn")?.addEventListener("click", openLanguageChallenge);
  document.getElementById("beginBtn")?.addEventListener("click", hideLanguageChallenge);
});

function openLanguageChallenge() {
  stopMathCamera();
  hideOtherChallenges();
  document.getElementById("languageChallenge")?.classList.remove("hidden");
  document.getElementById("languageChallenge")?.classList.add("revealed");
  renderQuestion();
  document.getElementById("languageChallenge")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideOtherChallenges() {
  document.querySelectorAll(".level, #finalScreen, #mathChallenge").forEach((section) => {
    section.classList.add("hidden");
    section.classList.remove("active");
  });
}

function hideLanguageChallenge() {
  document.getElementById("languageChallenge")?.classList.add("hidden");
}

function renderQuestion() {
  const question = languageQuestions[currentQuestionIndex];
  if (!question || !questionHost || !feedbackNode) return;

  feedbackNode.textContent = "";
  feedbackNode.className = "feedback";
  showSparkyState("start");

  questionHost.innerHTML = `
    <div class="math-progress">Reto ${currentQuestionIndex + 1} de ${languageQuestions.length}</div>
    <sparky-dialog class="mission-sparky-dialog" state="start"
      message="Esta misión necesita observación. Vamos paso a paso."></sparky-dialog>
    <p class="math-exhibit-note">Respondan una opción por vez y lean el feedback antes de avanzar.</p>
    <h2>${question.title}</h2>
    <p>${question.question}</p>
    <div class="math-options">
      ${question.options
        .map((option) => `<button class="btn math-option" type="button" data-answer="${option}">${option}</button>`)
        .join("")}
    </div>
  `;

  questionHost.querySelectorAll(".math-option").forEach((button) => {
    button.addEventListener("click", () => checkAnswer(button.dataset.answer));
  });
}

function checkAnswer(answer) {
  const question = languageQuestions[currentQuestionIndex];
  if (!question || !feedbackNode) return;

  const isCorrect = answer === question.correctAnswer;
  feedbackNode.textContent = isCorrect ? question.feedback.correct : question.feedback.incorrect;
  feedbackNode.className = `feedback ${isCorrect ? "ok" : "error"}`;
  showSparkyState(isCorrect ? "correct" : "incorrect");
  if (isCorrect && typeof window.registerRecoveredSpark === "function") {
    window.registerRecoveredSpark("spark-knowledge");
  }
  if (!isCorrect || typeof window.showRewardModal !== "function") {
    showSharedAlert(isCorrect, question.feedback.correct);
  }

  if (!isCorrect) return;

  openLanguageRewardModal(question.feedback.correct, () => {
    currentQuestionIndex += 1;

    if (currentQuestionIndex >= languageQuestions.length) {
      renderCompletedState();
      return;
    }

    renderQuestion();
  });
}

function renderCompletedState() {
  const status = document.getElementById("languageStatus");
  if (status) status.textContent = "COMPLETADO";

  if (questionHost) {
    questionHost.innerHTML = `
      <h2>Lengua y Literatura completado</h2>
      <sparky-dialog class="mission-sparky-dialog" state="complete"
        message="¡Una chispa más recuperada!"></sparky-dialog>
      <p>Respondieron las 5 preguntas y cerraron este sendero de palabras.</p>
      <button id="restartLanguageBtn" class="btn primary" type="button">Jugar otra vez</button>
    `;
  }

  if (feedbackNode) {
    feedbackNode.textContent = "";
    feedbackNode.className = "feedback";
  }

  showSparkyState("complete");
  document.getElementById("restartLanguageBtn")?.addEventListener("click", restartChallenge);
}

function restartChallenge() {
  currentQuestionIndex = 0;
  const status = document.getElementById("languageStatus");
  if (status) status.textContent = "ACTIVO";
  renderQuestion();
}

function stopMathCamera() {
  if (typeof window.stopCamera === "function") {
    window.stopCamera();
  }
}

function openLanguageRewardModal(message, onNext) {
  if (typeof window.showRewardModal !== "function") {
    onNext();
    return;
  }

  window.showRewardModal({
    title: "Chispa del Conocimiento",
    reward: "spark-knowledge",
    message: message,
    buttonLabel: currentQuestionIndex >= languageQuestions.length - 1 ? "Ver resultado final" : "Siguiente misiÃ³n"
  }, onNext);
}

function showSharedAlert(isCorrect, successMessage) {
  if (typeof window.showGameAlert !== "function") return;
  const successText = successMessage || "Muy bien. Avanzan a la siguiente pregunta.";

  window.showGameAlert(isCorrect
    ? { mood: "success", emoji: "⚡", title: "Respuesta correcta", text: "Muy bien. Avanzan a la siguiente pregunta." }
    : { mood: "error", emoji: "⚪", title: "Respuesta incorrecta", text: "Lean el feedback y prueben otra vez." });
}

function showSparkyState(state) {
  if (typeof window.showSparkyDialog !== "function") return;

  const messages = {
    start: "Esta misión necesita observación. Vamos paso a paso.",
    correct: "Excelente. Esa respuesta fortalece la chispa del lenguaje.",
    incorrect: "No pasa nada. Lean con calma y prueben otra opción.",
    complete: "Una chispa más recuperada."
  };

  window.showSparkyDialog({ state, message: messages[state] });
}
