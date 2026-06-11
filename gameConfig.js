const TEACHABLE_MACHINE_MODEL_URL = "https://teachablemachine.withgoogle.com/models/RXOtQYhAB/";
const MIN_CONFIDENCE_DEFAULT = 0.85;

const moduleConfigs = {
  1: { id: 1, type: "text", topic: "Fuerza" },
  2: { id: 2, type: "text", topic: "Movimiento" },
  3: {
    id: 3,
    type: "image",
    topic: "Energia potencial",
    title: "Prueba 3 - Energia potencial",
    requiredClass: "energia_potencial",
    minConfidence: MIN_CONFIDENCE_DEFAULT,
    description:
      "Busquen una situacion donde un objeto tenga energia por su altura y muestrenla a la camara."
  },
  4: { id: 4, type: "text", topic: "Energia cinetica" },
  5: { id: 5, type: "text", topic: "Luz y reflexion" },
  6: { id: 6, type: "text", topic: "Electricidad" },
  7: { id: 7, type: "text", topic: "Magnetismo" },
  8: { id: 8, type: "text", topic: "Sonido" },
  9: { id: 9, type: "text", topic: "Calor y temperatura" },
  10: { id: 10, type: "text", topic: "Observacion cientifica" }
};
