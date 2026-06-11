import {
  imageClassAliases,
  imageHints,
  questionImageClasses
} from "../data/mathCameraHints.js";

const MIN_HINT_CONFIDENCE = 0.85;

function normalizeLabel(label) {
  return String(label || "").trim().toLowerCase();
}

function normalizeClassName(label) {
  const normalizedLabel = normalizeLabel(label);
  return imageClassAliases[normalizedLabel] || normalizedLabel;
}

export function getHintForClass(className) {
  const hints = imageHints[className];

  if (!hints) {
    return "Imagen reconocida, pero no existe una pista asociada.";
  }

  return hints[Math.floor(Math.random() * hints.length)];
}

export function getMathCameraHint(questionId, detectedLabel, probability) {
  const normalizedClassName = normalizeClassName(detectedLabel);
  const confidence = Number(probability) || 0;
  const allowedClasses = questionImageClasses[questionId] || [];

  if (confidence < MIN_HINT_CONFIDENCE) {
    return {
      status: "low_confidence",
      confidence: Math.round(confidence * 100),
      className: normalizedClassName,
      message: "Todavia no se detecta una imagen con suficiente claridad."
    };
  }

  if (!allowedClasses.includes(normalizedClassName)) {
    return {
      status: "not_allowed",
      confidence: Math.round(confidence * 100),
      className: normalizedClassName,
      message: "La imagen fue reconocida, pero no corresponde a esta pregunta."
    };
  }

  return {
    status: "useful",
    confidence: Math.round(confidence * 100),
    className: normalizedClassName,
    message: getHintForClass(normalizedClassName)
  };
}
