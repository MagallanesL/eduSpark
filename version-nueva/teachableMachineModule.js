class TeachableMachineImageModule {
  constructor({ modelUrl, onPrediction, flip = true, width = 320, height = 240 }) {
    this.modelUrl = modelUrl;
    this.onPrediction = onPrediction;
    this.flip = flip;
    this.width = width;
    this.height = height;
    this.model = null;
    this.webcam = null;
    this.maxPredictions = 0;
    this.animationFrameId = null;
    this.isRunning = false;
  }

  async init() {
    if (!this.modelUrl || !window.tmImage || !window.tf) {
      throw new Error("Teachable Machine model is not available");
    }

    const normalizedUrl = this.modelUrl.replace(/\/$/, "");
    this.model = await window.tmImage.load(
      `${normalizedUrl}/model.json`,
      `${normalizedUrl}/metadata.json`
    );
    this.maxPredictions = this.model.getTotalClasses();

    this.webcam = new window.tmImage.Webcam(this.width, this.height, this.flip);
    await this.webcam.setup();
    await this.webcam.play();

    this.isRunning = true;
    this.loop();
  }

  async loop() {
    if (!this.isRunning || !this.webcam || !this.model) return;

    this.webcam.update();
    const predictions = await this.model.predict(this.webcam.canvas);
    const topPrediction = this.getTopPrediction(predictions);

    if (this.onPrediction) {
      this.onPrediction({
        predictions,
        topPrediction,
        maxPredictions: this.maxPredictions,
        canvas: this.webcam.canvas
      });
    }

    this.animationFrameId = window.requestAnimationFrame(() => this.loop());
  }

  getTopPrediction(predictions) {
    return predictions.reduce((best, current) =>
      current.probability > best.probability ? current : best
    );
  }

  getCanvas() {
    return this.webcam ? this.webcam.canvas : null;
  }

  stop() {
    this.isRunning = false;

    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.webcam) {
      this.webcam.stop();
      this.webcam = null;
    }
  }
}
