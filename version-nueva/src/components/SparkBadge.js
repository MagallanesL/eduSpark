import { getRewardAsset } from "../assets/assetPaths.js";

export class SparkBadge extends HTMLElement {
  static get observedAttributes() {
    return ["reward", "label"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const reward = this.getAttribute("reward") || "spark-observation";
    const label = this.getAttribute("label") || "Chispa coleccionable";
    const src = getRewardAsset(reward);

    this.classList.add("spark-badge");
    this.setAttribute("role", "img");
    this.setAttribute("aria-label", label);
    this.innerHTML = `<img src="${src}" alt="${label}" />`;

    const image = this.querySelector("img");
    image.addEventListener(
      "error",
      () => {
        image.hidden = true;
        this.classList.add("spark-badge-fallback");
      },
      { once: true }
    );
  }
}

customElements.define("spark-badge", SparkBadge);
