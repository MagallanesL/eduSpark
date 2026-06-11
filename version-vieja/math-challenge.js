import { MODEL_URL, mathQuestions } from "./math-data.js";
import { getMathCameraHint } from "./src/utils/getMathCameraHint.js";

let currentMathQuestionIndex = 0;
let mathModel = null;
let mathQuestionHost = null;
let mathFeedback = null;
let cameraPanel = null;
let webcamContainer = null;
let predictionResult = null;
let readImageButton = null;
let retryImageButton = null;
let switchCameraButton = null;
let closeHintCardButton = null;
let cameraHintCard = null;
let cameraHintTitle = null;
let cameraHintText = null;
let cameraUnavailable = false;
let cameraStream = null;
let cameraVideo = null;
let analysisCanvas = null;
let analysisContext = null;
let isAnalyzing = false;
let analyzeTimeoutId = null;
let availableCameras = [];
let activeCameraIndex = -1;

const positiveFeedbackMessages = [
  "Excelente. Superaron este reto y el camino sigue abierto.",
  "Muy bien. Su equipo gano impulso para la siguiente etapa de la aventura.",
  "Acertaron. Dieron un gran paso hacia el proximo desafio.",
  "Lo lograron. Pensaron como exploradores y abrieron una nueva puerta."
];

document.addEventListener("DOMContentLoaded", () => {
  mathQuestionHost = document.getElementById("mathQuestionHost");
  mathFeedback = document.getElementById("mathFeedback");
  cameraPanel = document.getElementById("cameraPanel");
  webcamContainer = document.getElementById("webcamContainer");
  predictionResult = document.getElementById("predictionResult");
  readImageButton = document.getElementById("readImageBtn");
  retryImageButton = document.getElementById("retryImageBtn");
  switchCameraButton = document.getElementById("switchCameraBtn");
  closeHintCardButton = document.getElementById("closeHintCardBtn");
  cameraHintCard = document.getElementById("cameraHintCard");
  cameraHintTitle = document.getElementById("cameraHintTitle");
  cameraHintText = document.getElementById("cameraHintText");

  const openButton = document.getElementById("openMathChallengeBtn");
  const closeButton = document.getElementById("closeCameraBtn");
  const beginButton = document.getElementById("beginBtn");

  if (openButton) {
    openButton.addEventListener("click", openMathChallenge);
  }

  if (closeButton) {
    closeButton.addEventListener("click", stopCamera);
  }

  if (readImageButton) {
    readImageButton.addEventListener("click", startContinuousAnalysis);
  }

  if (retryImageButton) {
    retryImageButton.addEventListener("click", () => {
      resetCameraFeedback();
      if (cameraVideo && predictionResult) {
        predictionResult.textContent = "Enfoquen una imagen y presionen Analizar imagen.";
      }
    });
  }

  if (switchCameraButton) {
    switchCameraButton.addEventListener("click", switchCamera);
  }

  if (closeHintCardButton) {
    closeHintCardButton.addEventListener("click", hideHintCard);
  }

  if (beginButton) {
    beginButton.addEventListener("click", hideMathChallenge);
  }

  window.addEventListener("beforeunload", stopCamera);
});

function openMathChallenge() {
  const section = document.getElementById("mathChallenge");
  if (!section) return;

  hideLogicChallenge();
  section.classList.remove("hidden");
  section.classList.add("revealed");
  renderMathQuestion();
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideLogicChallenge() {
  document.querySelectorAll(".level, #finalScreen").forEach((section) => {
    section.classList.add("hidden");
    section.classList.remove("active");
  });
}

function hideMathChallenge() {
  stopCamera();

  const section = document.getElementById("mathChallenge");
  if (section) {
    section.classList.add("hidden");
  }
}

function renderMathQuestion() {
  const question = mathQuestions[currentMathQuestionIndex];
  stopCamera();

  if (!question || !mathQuestionHost) return;

  mathFeedback.textContent = "";
  mathFeedback.className = "feedback";
  resetCameraFeedback();

  mathQuestionHost.innerHTML = `
    <div class="math-progress">Reto ${currentMathQuestionIndex + 1} de ${mathQuestions.length}</div>
    <p class="math-exhibit-note">
      La camara no revela la respuesta final: solo despierta pistas para que sigan explorando.
    </p>
    <h2>${question.title}</h2>
    <p>${question.question}</p>
    <div class="math-options">
      ${question.options
        .map((option) => `<button class="btn math-option" type="button" data-answer="${option}">${option}</button>`)
        .join("")}
    </div>
    <div id="mathHintBox" class="hint-box hidden"></div>
    <div class="action-row">
      <button id="scanImageBtn" class="btn btn-secondary" type="button" ${cameraUnavailable ? "disabled" : ""}>
        ${cameraUnavailable ? "Pistas de camara no disponibles" : "Buscar pista con camara"}
      </button>
    </div>
  `;

  mathQuestionHost.querySelectorAll(".math-option").forEach((button) => {
    button.addEventListener("click", () => checkMathAnswer(button.dataset.answer));
  });

  const scanButton = document.getElementById("scanImageBtn");
  if (scanButton) {
    scanButton.addEventListener("click", startCamera);
  }
}

function checkMathAnswer(answer) {
  const question = mathQuestions[currentMathQuestionIndex];
  if (!question) return;

  if (answer === question.correctAnswer) {
    mathFeedback.textContent = getPositiveFeedback();
    mathFeedback.className = "feedback ok math-reward";
    showSharedAlert({
      mood: "success",
      emoji: "🎉",
      title: "Acertaron",
      text: "Muy bien. Avanzan al siguiente reto."
    });
    stopCamera();

    window.setTimeout(() => {
      currentMathQuestionIndex += 1;

      if (currentMathQuestionIndex >= mathQuestions.length) {
        completeMathChallenge();
        return;
      }

      renderMathQuestion();
    }, 900);
    return;
  }

  mathFeedback.textContent = "Todavia no es la clave correcta. Revisen la pista o prueben otra imagen de ayuda.";
  mathFeedback.className = "feedback error";
  showSharedAlert({
    mood: "error",
    emoji: "😞",
    title: "No salio esta vez",
    text: "Esa opcion no es correcta. Revisen la pista y vuelvan a intentar."
  });
}

function getPositiveFeedback() {
  const messageIndex = currentMathQuestionIndex % positiveFeedbackMessages.length;
  return positiveFeedbackMessages[messageIndex];
}

function completeMathChallenge() {
  stopCamera();
  resetCameraFeedback();

  if (mathQuestionHost) {
    mathQuestionHost.innerHTML = `
      <h2>Desafio matematico completado</h2>
      <p>Superaron esta travesia numerica. El portal queda listo para una nueva partida.</p>
      <button id="restartMathBtn" class="btn primary" type="button">Jugar otra vez</button>
    `;
  }

  mathFeedback.textContent = "";
  mathFeedback.className = "feedback";

  const status = document.getElementById("mathStatus");
  if (status) {
    status.textContent = "COMPLETADO";
  }

  const restartButton = document.getElementById("restartMathBtn");
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      currentMathQuestionIndex = 0;
      if (status) status.textContent = "PILOTO";
      renderMathQuestion();
    });
  }
}

async function initCameraModel() {
  if (mathModel) return mathModel;

  if (MODEL_URL.includes("PEGAR_ACA_URL_DEL_MODELO")) {
    throw new Error("Falta configurar MODEL_URL con la URL del modelo de Teachable Machine.");
  }

  if (!window.tmImage) {
    throw new Error("No se pudo cargar la libreria oficial de Teachable Machine.");
  }

  mathModel = await window.tmImage.load(`${MODEL_URL}model.json`, `${MODEL_URL}metadata.json`);
  return mathModel;
}

async function startCamera() {
  try {
    await initCameraModel();
    resetCameraFeedback();
    await openCameraStream();

    if (cameraPanel) {
      cameraPanel.classList.remove("hidden");
    }

    if (predictionResult) {
      predictionResult.textContent = "La camara esta lista. Enfoquen una pista y presionen Analizar imagen.";
    }

    updateReadImageButton(false);
    updateRetryButton(false);
    updateSwitchCameraButton(false);
    cameraUnavailable = false;
  } catch (error) {
    const fallbackMessage =
      `${error.message || "No se pudo abrir la camara."} Podes continuar respondiendo sin usar pistas visuales.`;
    cameraUnavailable = true;
    stopCamera();
    renderMathQuestion();

    if (mathFeedback) {
      mathFeedback.textContent = fallbackMessage;
      mathFeedback.className = "feedback error";
    }
  }
}

async function openCameraStream(deviceId) {
  stopCameraStreamOnly();

  const initialConstraints = deviceId
    ? {
        audio: false,
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 320 },
          height: { ideal: 240 }
        }
      }
    : {
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 320 },
          height: { ideal: 240 }
        }
      };

  cameraStream = await navigator.mediaDevices.getUserMedia(initialConstraints);
  await refreshAvailableCameras();

  if (!deviceId) {
    const preferredIndex = getPreferredCameraIndex();

    if (preferredIndex >= 0) {
      const preferredDeviceId = availableCameras[preferredIndex].deviceId;
      const activeTrack = cameraStream.getVideoTracks()[0];
      const activeSettings = activeTrack ? activeTrack.getSettings() : null;
      const activeDeviceId = activeSettings?.deviceId || "";

      if (preferredDeviceId && activeDeviceId && preferredDeviceId !== activeDeviceId) {
        stopMediaTracks(cameraStream);
        cameraStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            deviceId: { exact: preferredDeviceId },
            width: { ideal: 320 },
            height: { ideal: 240 }
          }
        });
      }
    }
  }

  syncActiveCameraIndex();
  ensureCameraSurface();
  cameraVideo.srcObject = cameraStream;
  await cameraVideo.play();
}

async function refreshAvailableCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  availableCameras = devices.filter((device) => device.kind === "videoinput");
}

function getPreferredCameraIndex() {
  if (!availableCameras.length) return -1;

  const environmentIndex = availableCameras.findIndex((device) =>
    /back|rear|environment|trasera/i.test(device.label)
  );

  return environmentIndex >= 0 ? environmentIndex : 0;
}

function syncActiveCameraIndex() {
  const activeTrack = cameraStream?.getVideoTracks()?.[0];
  const activeSettings = activeTrack ? activeTrack.getSettings() : null;
  const activeDeviceId = activeSettings?.deviceId || "";

  activeCameraIndex = availableCameras.findIndex((device) => device.deviceId === activeDeviceId);

  if (activeCameraIndex < 0 && availableCameras.length) {
    activeCameraIndex = 0;
  }
}

function ensureCameraSurface() {
  if (!webcamContainer) return;

  webcamContainer.innerHTML = "";

  cameraVideo = document.createElement("video");
  cameraVideo.setAttribute("playsinline", "true");
  cameraVideo.setAttribute("autoplay", "true");
  cameraVideo.setAttribute("muted", "true");
  cameraVideo.className = "camera-video";

  webcamContainer.appendChild(cameraVideo);

  analysisCanvas = document.createElement("canvas");
  analysisCanvas.width = 320;
  analysisCanvas.height = 240;
  analysisContext = analysisCanvas.getContext("2d", { willReadFrequently: true });
}

function stopCamera() {
  stopContinuousAnalysis();
  stopCameraStreamOnly();
  resetCameraFeedback();

  if (cameraPanel) {
    cameraPanel.classList.add("hidden");
  }

  updateReadImageButton(true);
  updateRetryButton(true);
  updateSwitchCameraButton(true);
}

function stopCameraStreamOnly() {
  if (cameraVideo) {
    cameraVideo.pause();
    cameraVideo.srcObject = null;
    cameraVideo = null;
  }

  if (webcamContainer) {
    webcamContainer.innerHTML = "";
  }

  if (cameraStream) {
    stopMediaTracks(cameraStream);
    cameraStream = null;
  }

  analysisCanvas = null;
  analysisContext = null;
}

function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => track.stop());
}

async function switchCamera() {
  if (availableCameras.length < 2) {
    return;
  }

  const nextIndex = activeCameraIndex >= 0
    ? (activeCameraIndex + 1) % availableCameras.length
    : 0;

  try {
    stopContinuousAnalysis();
    resetCameraFeedback();
    await openCameraStream(availableCameras[nextIndex].deviceId);

    if (predictionResult) {
      predictionResult.textContent = "Nueva camara lista. Enfoquen otra pista y sigan explorando.";
    }

    updateReadImageButton(false);
    updateRetryButton(false);
    updateSwitchCameraButton(false);
  } catch (error) {
    showMathCameraMessage(error.message || "No se pudo cambiar de camara.");
  }
}

function startContinuousAnalysis() {
  if (!mathModel || !cameraVideo || isAnalyzing) return;

  isAnalyzing = true;
  resetCameraFeedback();
  updateReadImageButton(true, "Analizando...");
  updateRetryButton(true);
  updateSwitchCameraButton(true);

  if (predictionResult) {
    predictionResult.textContent = "Explorando la imagen en tiempo real...";
  }

  analyzeCurrentFrame();
}

async function analyzeCurrentFrame() {
  if (!isAnalyzing || !mathModel || !cameraVideo || !analysisCanvas || !analysisContext) {
    return;
  }

  if (cameraVideo.readyState < 2) {
    scheduleNextAnalysis();
    return;
  }

  analysisContext.drawImage(cameraVideo, 0, 0, analysisCanvas.width, analysisCanvas.height);

  try {
    const predictions = await mathModel.predict(analysisCanvas);
    const bestPrediction = predictions.reduce((best, item) => (
      item.probability > best.probability ? item : best
    ), predictions[0]);

    if (bestPrediction) {
      const shouldStop = handlePrediction(bestPrediction.className, bestPrediction.probability);

      if (shouldStop) {
        stopContinuousAnalysis();
        updateRetryButton(false);
        updateSwitchCameraButton(false);
        return;
      }
    }
  } catch {
    showMathCameraMessage("No pudimos leer esa imagen. Prueben otra vez con una pista mas clara.");
    stopContinuousAnalysis();
    updateRetryButton(false);
    updateSwitchCameraButton(false);
    return;
  }

  scheduleNextAnalysis();
}

function scheduleNextAnalysis() {
  analyzeTimeoutId = window.setTimeout(() => {
    analyzeCurrentFrame();
  }, 450);
}

function stopContinuousAnalysis() {
  isAnalyzing = false;

  if (analyzeTimeoutId) {
    window.clearTimeout(analyzeTimeoutId);
    analyzeTimeoutId = null;
  }

  updateReadImageButton(!cameraVideo);
}

function updateReadImageButton(disabled, text) {
  if (!readImageButton) return;

  readImageButton.disabled = disabled || !cameraVideo;
  readImageButton.textContent = text || "Analizar imagen";
}

function updateRetryButton(disabled) {
  if (!retryImageButton) return;

  retryImageButton.disabled = disabled || !cameraVideo;
}

function updateSwitchCameraButton(disabled) {
  if (!switchCameraButton) return;

  switchCameraButton.disabled = disabled || availableCameras.length < 2 || !cameraVideo;
}

function handlePrediction(className, probability) {
  const question = mathQuestions[currentMathQuestionIndex];
  if (!question) return false;

  const hintResult = getMathCameraHint(question.id, className, probability);

  if (predictionResult) {
    predictionResult.textContent = hintResult.status === "low_confidence"
      ? "Seguimos buscando hasta encontrar una pista clara."
      : hintResult.status === "useful"
        ? "Pista encontrada. Usen esa orientacion para seguir avanzando."
        : "La imagen fue reconocida, pero no corresponde a esta pregunta.";
  }

  if (hintResult.status === "useful") {
    showHintCard({
      title: "Pista encontrada",
      text: hintResult.message
    });
    showMathHint("", false);
    return true;
  }

  hideHintCard();
  showMathHint(hintResult.message, true);

  return hintResult.status === "not_allowed";
}

function showMathHint(message, isWarning) {
  const hintBox = document.getElementById("mathHintBox");
  if (!hintBox) return;

  if (!message) {
    hintBox.textContent = "";
    hintBox.classList.add("hidden");
    hintBox.classList.remove("camera-warning");
    return;
  }

  hintBox.textContent = message;
  hintBox.classList.remove("hidden");
  hintBox.classList.toggle("camera-warning", Boolean(isWarning));
}

function showMathCameraMessage(message) {
  if (predictionResult) {
    predictionResult.textContent = message;
  }

  if (cameraPanel) {
    cameraPanel.classList.remove("hidden");
  }
}

function showHintCard({ title, text }) {
  if (!cameraHintCard || !cameraHintTitle || !cameraHintText) return;

  cameraHintTitle.textContent = title;
  cameraHintText.textContent = text;
  cameraHintCard.classList.remove("hidden");
  cameraHintCard.classList.remove("revealed");
  void cameraHintCard.offsetWidth;
  cameraHintCard.classList.add("revealed");
}

function hideHintCard() {
  if (!cameraHintCard || !cameraHintTitle || !cameraHintText) return;

  cameraHintTitle.textContent = "Pista encontrada";
  cameraHintText.textContent =
    "La camara puede darte una orientacion de procedimiento, no la respuesta final.";
  cameraHintCard.classList.add("hidden");
  cameraHintCard.classList.remove("revealed");
}

function showSharedAlert(payload) {
  if (typeof window.showGameAlert === "function") {
    window.showGameAlert(payload);
  }
}

function resetCameraFeedback() {
  showMathHint("", false);
  hideHintCard();

  if (predictionResult) {
    predictionResult.textContent = cameraVideo
      ? "Enfoquen una imagen y presionen Analizar imagen."
      : "Muestren una imagen de pista frente a la camara.";
  }
}

window.initCameraModel = initCameraModel;
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.predictImage = startContinuousAnalysis;
