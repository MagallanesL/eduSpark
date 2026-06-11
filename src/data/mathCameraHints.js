export const imageHints = {
  concava_abajo: [
    "Observa hacia donde se abre la parabola.",
    "El signo del coeficiente principal determina la concavidad.",
    "Cuando a es negativo, la parabola no abre hacia arriba."
  ],
  concava_arriba: [
    "Esta imagen muestra una parabola con comportamiento opuesto.",
    "Revisa el signo del coeficiente principal de la funcion.",
    "Compara esta grafica con la funcion dada."
  ],
  dos_raices: [
    "Cuenta cuantas veces la parabola corta al eje X.",
    "Cada interseccion con el eje X representa una raiz real.",
    "Observa si existen uno, dos o ningun punto de corte."
  ],
  raiz_doble: [
    "La parabola toca el eje X pero no lo atraviesa.",
    "En algunos casos las raices pueden coincidir.",
    "Analiza si la funcion dada tiene ese comportamiento."
  ],
  raices_imaginarias: [
    "No toda parabola corta al eje X.",
    "Si no existen cortes, las raices no son reales.",
    "Verifica si la funcion propuesta presenta esta situacion."
  ],
  trigonometria: [
    "Se forma un triangulo rectangulo.",
    "La escalera representa la hipotenusa.",
    "Identifica que dato conoces y cual necesitas calcular.",
    "SOHCAHTOA puede ayudarte a elegir la razon trigonometrica adecuada."
  ]
};

export const questionImageClasses = {
  1: ["concava_abajo", "concava_arriba"],
  2: ["dos_raices", "raiz_doble", "raices_imaginarias"],
  3: ["dos_raices", "raiz_doble", "raices_imaginarias"],
  4: ["trigonometria"]
};

export const imageClassAliases = {
  concavaabajo: "concava_abajo",
  concava_abajo: "concava_abajo",
  concavaarriba: "concava_arriba",
  concava_arriba: "concava_arriba",
  "2raices": "dos_raices",
  dos_raices: "dos_raices",
  "1raiz": "raiz_doble",
  raiz_doble: "raiz_doble",
  imaginarias: "raices_imaginarias",
  raices_imaginarias: "raices_imaginarias",
  escalera: "trigonometria",
  trigonometria: "trigonometria"
};
