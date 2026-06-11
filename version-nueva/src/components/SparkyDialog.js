const fallbackMessages = {
  start: "Esta misión necesita observación. Vamos paso a paso.",
  correct: "¡Excelente! Tu chispa acaba de crecer.",
  incorrect: "No pasa nada. Pensar también es parte del juego.",
  hint: "Encontré una pista, pero la respuesta la descubrís vos.",
  cameraMiss: "Interesante objeto, pero no pertenece a esta misión.",
  complete: "¡Una chispa más recuperada!"
};

export class SparkyDialog extends HTMLElement {
  static get observedAttributes() {
    return ["mood", "message", "state"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const state = this.getAttribute("state") || "start";
    const mood = this.getAttribute("mood") || this.getMoodForState(state);
    const message = this.getAttribute("message") || fallbackMessages[state] || fallbackMessages.start;

    this.classList.add("sparky-dialog");
    this.innerHTML = `
      <sparky-character mood="${mood}"></sparky-character>
      <div class="sparky-dialog-bubble" role="status" aria-live="polite">
        <span>Sparky</span>
        <p>${message}</p>
      </div>
    `;
  }

  getMoodForState(state) {
    const moodByState = {
      start: "thinking",
      correct: "happy",
      incorrect: "confused",
      hint: "thinking",
      cameraMiss: "confused",
      complete: "celebration"
    };

    return moodByState[state] || "default";
  }
}

customElements.define("sparky-dialog", SparkyDialog);

export function showSparkyDialog({ targetId = "sparkyGlobalDialog", state, mood, message } = {}) {
  const dialog = document.getElementById(targetId);
  if (!dialog) return;

  if (state) dialog.setAttribute("state", state);
  if (mood) dialog.setAttribute("mood", mood);
  if (message) dialog.setAttribute("message", message);

  dialog.classList.remove("hidden", "sparky-dialog-pop");
  void dialog.offsetWidth;
  dialog.classList.add("sparky-dialog-pop");
}
