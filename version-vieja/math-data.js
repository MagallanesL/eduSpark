
export const MODEL_URL = "https://teachablemachine.withgoogle.com/models/fK5vn6tPS/";
export const MIN_PREDICTION_CONFIDENCE = 0.85;

// Preguntas, respuestas, pistas y clases del modelo.

export const mathQuestions = [
  {
    id: 1,
    title: "Pregunta 1",
    question: "Teniendo en cuenta la funcion f(x) = -3x2 + 3x + 5, que tipo de concavidad tiene?",
    options: [
      "Concava hacia abajo",
      "Concava hacia arriba",
      "No tiene concavidad",
      "Es una funcion lineal"
    ],
    correctAnswer: "Concava hacia abajo"
  },
  {
    id: 2,
    title: "Pregunta 2",
    question: "La funcion f(x) = x2 + x - 2 tiene raices del tipo:",
    options: [
      "Dos raices",
      "Una raiz doble",
      "Raices imaginarias",
      "No es una funcion cuadratica"
    ],
    correctAnswer: "Dos raices"
  },
  {
    id: 3,
    title: "Pregunta 3",
    question: "La funcion f(x) = 2x2 + 3x + 2 tiene raices del tipo:",
    options: [
      "Dos raices reales",
      "Una raiz doble",
      "Raices imaginarias",
      "No tiene termino independiente"
    ],
    correctAnswer: "Raices imaginarias"
  },
  {
    id: 4,
    title: "Pregunta 4",
    question: "Una escalera se apoya en una pared a 5 metros de altura. El angulo entre la escalera y la pared es de 50 grados. Cual es la longitud de la escalera?",
    options: ["7,77 m", "8,21 m", "3,21 m", "6,53 m"],
    correctAnswer: "7,77 m"
  }
];
