const assetRoot = "src/assets";

export const sparkyAssets = {
  default: `${assetRoot}/sparky/sparky-default.png`,
  happy: `${assetRoot}/sparky/sparky-happy.png`,
  thinking: `${assetRoot}/sparky/sparky-thinking.png`,
  confused: `${assetRoot}/sparky/sparky-confused.png`,
  celebration: `${assetRoot}/sparky/sparky-celebration.png`
};

export const backgroundAssets = {
  home: `${assetRoot}/backgrounds/home-bg.jpg`,
  mission: `${assetRoot}/backgrounds/mission-bg.jpg`
};

export const rewardAssets = {
  "spark-observation": `${assetRoot}/rewards/spark-observation.png`,
  "spark-logic": `${assetRoot}/rewards/spark-logic.png`,
  "spark-math": `${assetRoot}/rewards/spark-math.png`,
  "spark-creativity": `${assetRoot}/rewards/spark-creativity.png`,
  "spark-knowledge": `${assetRoot}/rewards/spark-knowledge.png`
};

export const uiAssets = {
  cornerSpark: `${assetRoot}/ui/corner-spark.png`,
  panelGlow: `${assetRoot}/ui/panel-glow.png`
};

export const challengeAssets = {
  math: `${assetRoot}/sparky/matematicas.png`,
  logic: `${assetRoot}/sparky/logica.png`,
  language: `${assetRoot}/sparky/lengua.png`
};

export const soundAssets = {
  success: `${assetRoot}/sounds/success.mp3`,
  error: `${assetRoot}/sounds/error.mp3`,
  unlock: `${assetRoot}/sounds/unlock.mp3`,
  complete: `${assetRoot}/sounds/complete.mp3`
};

export function getSparkyAsset(mood = "default") {
  return sparkyAssets[mood] || sparkyAssets.default;
}

export function getRewardAsset(reward = "spark-observation") {
  return rewardAssets[reward] || rewardAssets["spark-observation"];
}
