import { soundAssets } from "../assets/assetPaths.js";

const soundState = {
  enabled: false,
  players: new Map()
};

function getPlayer(name) {
  if (!soundAssets[name]) return null;

  if (!soundState.players.has(name)) {
    const audio = new Audio(soundAssets[name]);
    audio.preload = "auto";
    soundState.players.set(name, audio);
  }

  return soundState.players.get(name);
}

export function setSoundEnabled(enabled) {
  soundState.enabled = Boolean(enabled);
}

export function isSoundEnabled() {
  return soundState.enabled;
}

export function playSound(name) {
  if (!soundState.enabled) return;

  const player = getPlayer(name);
  if (!player) return;

  try {
    player.currentTime = 0;
    const playPromise = player.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  } catch {
    // Optional sounds must never interrupt the game.
  }
}
