import { getSparkyAsset } from "../assets/assetPaths.js";

const moodLabels = {
  default: "Sparky, una pequena llama curiosa",
  happy: "Sparky feliz",
  thinking: "Sparky pensando",
  confused: "Sparky confundido",
  celebration: "Sparky celebrando"
};

export class SparkyCharacter extends HTMLElement {
  static get observedAttributes() {
    return ["mood", "label"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const mood = this.getAttribute("mood") || "default";
    const label = this.getAttribute("label") || moodLabels[mood] || moodLabels.default;
    const src = getSparkyAsset(mood);

    this.classList.add("sparky-character");
    this.setAttribute("role", "img");
    this.setAttribute("aria-label", label);
    this.innerHTML = `
      <figure class="sparky-avatar" data-mood="${mood}">
        <img src="${src}" alt="${label}" />
      </figure>
    `;

    const image = this.querySelector("img");
    image.addEventListener(
      "error",
      () => {
        image.hidden = true;
        image.closest(".sparky-avatar").classList.add("sparky-avatar-fallback");
      },
      { once: true }
    );
  }
}

customElements.define("sparky-character", SparkyCharacter);
