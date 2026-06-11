class ImageRecognitionChallenge {
  constructor({ mountNode, moduleConfig, onSuccess, isPaused }) {
    this.mountNode = mountNode;
    this.moduleConfig = moduleConfig;
    this.onSuccess = onSuccess;
    this.isPaused = isPaused;
    this.tmModule = null;
    this.resolved = false;
  }

  async init() {
    if (!this.mountNode || !this.moduleConfig) return;

    if (!TEACHABLE_MACHINE_MODEL_URL || !window.tmImage || !window.tf) {
      this.renderMessage("Modelo de reconocimiento no configurado todavía.");
      return;
    }

    this.renderShell();

    try {
      await this.startRecognition();
    } catch (error) {
      console.error("Image recognition init failed", error);
      this.renderMessage("Modelo de reconocimiento no configurado todavía.");
      this.destroy();
    }
  }

  async startRecognition() {
    this.tmModule = new TeachableMachineImageModule({
      modelUrl: TEACHABLE_MACHINE_MODEL_URL,
      onPrediction: ({ topPrediction }) => {
        if (this.isPaused && this.isPaused()) return;
        this.handlePrediction(topPrediction);
      }
    });

    await this.tmModule.init();

    const webcamHost = this.mountNode.querySelector("[data-webcam]");
    const canvas = this.tmModule.getCanvas();
    if (webcamHost && canvas) {
      webcamHost.innerHTML = "";
      webcamHost.appendChild(canvas);
    }
  }

  handlePrediction(bestPrediction) {
    if (!bestPrediction || this.resolved) return;

    this.renderPrediction(bestPrediction);

    const meetsConfidence =
      bestPrediction.className === this.moduleConfig.requiredClass &&
      bestPrediction.probability >= (this.moduleConfig.minConfidence ?? MIN_CONFIDENCE_DEFAULT);

    if (meetsConfidence) {
      this.resolved = true;
      this.onSuccess();
    }
  }

  renderShell() {
    this.mountNode.innerHTML = `
      <div class="image-challenge">
        <p class="hint">Modulo de Observacion</p>
        <p>${this.moduleConfig.description}</p>
        <div class="image-challenge-grid">
          <div class="image-camera-frame" data-webcam></div>
          <div class="image-diagnostics">
            <p><strong>Evidencia detectada:</strong> <span data-class>Iniciando camara...</span></p>
            <p><strong>Confianza del modelo:</strong> <span data-confidence>0%</span></p>
          </div>
        </div>
      </div>
    `;
  }

  renderPrediction(prediction) {
    const classNode = this.mountNode.querySelector("[data-class]");
    const confidenceNode = this.mountNode.querySelector("[data-confidence]");

    if (classNode) classNode.textContent = prediction.className;
    if (confidenceNode) {
      confidenceNode.textContent = `${(prediction.probability * 100).toFixed(1)}%`;
    }
  }

  renderMessage(message) {
    this.mountNode.innerHTML = `<div class="image-challenge"><p class="feedback error">${message}</p></div>`;
  }

  destroy() {
    if (!this.tmModule) return;
    this.tmModule.stop();
    this.tmModule = null;
  }
}
