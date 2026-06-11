import { backgroundAssets } from "../assets/assetPaths.js";
import "./SparkyCharacter.js";
import "./SparkBadge.js";
import { showSparkyDialog } from "./SparkyDialog.js";
import { isSoundEnabled, playSound, setSoundEnabled } from "./soundManager.js";

const backgroundTargets = [
  ["home", ".hero"],
  ["mission", "#game"]
];

for (const [assetName, selector] of backgroundTargets) {
  const element = document.querySelector(selector);
  const assetPath = backgroundAssets[assetName];

  if (element && assetPath) {
    element.style.setProperty(`--${assetName}-background-image`, `url("${assetPath}")`);
    element.dataset.assetBackground = assetName;
  }
}

window.showSparkyDialog = showSparkyDialog;
window.eduSparkSound = {
  isEnabled: isSoundEnabled,
  play: playSound,
  setEnabled: setSoundEnabled
};
