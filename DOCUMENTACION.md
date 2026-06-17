# Documentacion de cambios

## Ajuste de tono narrativo y estilo de juego

### Que se modifico
- Se actualizaron textos visibles de portada, onboarding y modos de juego para que el tono sea mas aventurero, ludico y motivador.
- Se suavizaron mensajes del desafio matematico y feedback general para reforzar la idea de exploracion, travesia y trabajo en equipo.
- No se modifico la logica de respuestas, camara, navegacion ni estados del juego.

### Archivos afectados
- `index.html`
- `math-challenge.js`
- `logica.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Revisar la portada, el inicio de la experiencia y los textos del desafio matematico.
- Confirmar que el juego conserve el mismo flujo, pero con mensajes mas cercanos a una aventura educativa.

### Riesgos o supuestos
- El cambio es solo editorial y de experiencia de usuario.
- Algunos textos antiguos del archivo pueden seguir pendientes si luego se quiere unificar todo el proyecto bajo el mismo tono narrativo.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica para este cambio.

## Nuevo modulo de Lengua y Literatura

### Que se modifico
- Se habilito el acceso a `Lengua y Literatura` desde la pantalla de seleccion de senderos.
- Se agrego una seccion paralela al desafio matematico, reutilizando la misma estructura visual de progreso, opciones, feedback y cierre.
- Se creo `language-data.js` con 5 preguntas, 4 opciones por pregunta, una unica respuesta correcta y feedback especifico por caso.
- Se creo `language-challenge.js` para renderizar una pregunta por vez, validar respuestas, mostrar feedback, avanzar y reiniciar el modulo al completarlo.
- No se uso camara en este modulo y no se modifico la logica existente de Lógica ni Matemática.

### Archivos afectados
- `index.html`
- `language-data.js`
- `language-challenge.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Iniciar la mision principal.
- En la pantalla de caminos, entrar a `Lengua y Literatura`.
- Verificar que se muestren 5 preguntas en secuencia.
- Confirmar que cada pregunta tenga 4 opciones.
- Validar que una respuesta incorrecta muestre feedback y no avance.
- Validar que una respuesta correcta muestre feedback y avance a la siguiente pregunta.
- Completar las 5 preguntas y comprobar que aparezca la pantalla de cierre del modulo con opcion de reinicio.
- Volver a probar `Desafio lógico` y `Desafio matemático` para confirmar que siguen funcionando igual que antes.

### Riesgos o supuestos
- El modulo de Lengua y Literatura funciona como desafio paralelo, igual que el matematico, y no altera el contador global del juego principal.
- Se reutilizaron clases visuales ya existentes (`math-progress`, `math-options`, `feedback`) para evitar estilos paralelos.
- No se realizaron cambios estructurales en `logica.js`; la integracion depende de los hooks globales ya expuestos para alertas y dialogos de Sparky.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica.

## Ajuste de feedback y texto del modal en Lengua

### Que se modifico
- El modal de recompensa de `Lengua y Literatura` ahora usa el `feedback.correct` de la pregunta como mensaje principal.
- Se reforzo la normalizacion del texto del boton compartido para que muestre `Siguiente misión` y no variantes rotas por encoding.

### Archivos afectados
- `language-challenge.js`
- `logica.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Entrar a `Lengua y Literatura`.
- Responder correctamente una pregunta.
- Verificar que el modal muestre el feedback correcto de esa pregunta.
- Verificar que el boton del modal diga `Siguiente misión`.

### Riesgos o supuestos
- El fallback del alert chico se mantiene solo como respaldo; el flujo principal sigue siendo el modal grande de recompensa.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica.

## Progreso global de chispas entre modulos

### Que se modifico
- El progreso superior de chispas dejo de depender solo de `solvedLevels` de LÃ³gica.
- Se agrego un registro compartido de chispas recuperadas para que LÃ³gica, MatemÃ¡tica y Lengua sumen sobre el mismo contador global.
- MatemÃ¡tica ahora registra `spark-math` al acertar.
- Lengua y Literatura ahora registra `spark-knowledge` al acertar.
- Se mantiene `solvedLevels` solo para el desbloqueo interno del modulo de LÃ³gica.

### Archivos afectados
- `logica.js`
- `math-challenge.js`
- `language-challenge.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Resolver un acierto en `Desafio matematico` y verificar que se actualice la barra superior.
- Resolver un acierto en `Lengua y Literatura` y verificar que tambien se actualice.
- Resolver un acierto en `Desafio lÃ³gico` y confirmar que siga marcando progreso como antes.
- Recargar la pagina y verificar que las chispas recuperadas se mantengan.

### Riesgos o supuestos
- El contador superior ahora refleja chispas unicas recuperadas, no simplemente cantidad de respuestas correctas.
- No se modifico el orden visual de las chispas ni la UI del header.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica.

## Reutilizacion del modal de chispa en MatemÃ¡tica y Lengua

### Que se modifico
- Se reutilizo el mismo `rewardModal` que ya usaba LÃ³gica para mostrar la recompensa visual al acertar en MatemÃ¡tica y Lengua.
- `logica.js` ahora expone `window.showRewardModal` y admite configuracion por modulo, sin romper el uso previo por nivel.
- MatemÃ¡tica deja de avanzar automaticamente al acertar y ahora espera el clic en `Siguiente misiÃ³n` dentro del modal.
- Lengua y Literatura deja de avanzar automaticamente al acertar y ahora espera el mismo modal antes de continuar.
- Se elimino la solucion provisoria de `shared-alerts.js` porque ya no hacia falta.

### Archivos afectados
- `index.html`
- `logica.js`
- `math-challenge.js`
- `language-challenge.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Entrar a `Desafio matematico` y responder correctamente una pregunta.
- Verificar que aparezca el modal grande de chispa como en LÃ³gica y que solo avance al presionar `Siguiente misiÃ³n`.
- Entrar a `Lengua y Literatura` y responder correctamente una pregunta.
- Verificar el mismo comportamiento.
- Confirmar que LÃ³gica siga mostrando el mismo modal de siempre.

### Riesgos o supuestos
- El modal reutiliza los assets de chispas ya existentes: `spark-math` para MatemÃ¡tica y `spark-knowledge` para Lengua.
- No se modifico la validacion de respuestas; solo el momento en que se produce el avance tras un acierto.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica.

## Ajuste de alertas entre modulos

### Que se modifico
- Se agrego `shared-alerts.js` para normalizar el alert de respuesta correcta en MatemÃ¡tica y Lengua.
- El mensaje visual de acierto ahora replica el de LÃ³gica: `Chispa recuperada` + `Â¡Bien hecho! Recuperaste una chispa.`

### Archivos afectados
- `index.html`
- `shared-alerts.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Responder correctamente una pregunta en `Desafio lÃ³gico`, `Desafio matemÃ¡tico` y `Lengua y Literatura`.
- Verificar que en los tres casos aparezca el mismo alert visual de acierto.

### Riesgos o supuestos
- No se modifico la validacion interna de respuestas; solo se normalizo el payload del alert compartido.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica.

## Alertas visuales para aciertos y errores

### Que se modifico
- Se agrego un aviso visual reutilizable en la parte superior de la app para reforzar el resultado de cada intento.
- Cuando una respuesta es correcta, se muestra un festejo con `🎉` antes de avanzar al siguiente reto.
- Cuando una respuesta es incorrecta, se muestra una alerta con `😞`.
- El sistema se reutiliza tanto en el desafio logico como en el desafio matematico.

### Archivos afectados
- `index.html`
- `style.css`
- `logica.js`
- `math-challenge.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Ingresar una respuesta correcta en un reto logico y verificar:
  - aparece una alerta de festejo;
  - luego avanza al siguiente reto.
- Ingresar una respuesta incorrecta en un reto logico y verificar:
  - aparece una alerta con carita triste;
  - no avanza.
- Repetir la prueba en el desafio matematico con una opcion correcta e incorrecta.

### Riesgos o supuestos
- La alerta comparte un unico contenedor global para evitar duplicar componentes.
- Se mantuvo la logica previa de avance, penalizacion y validacion; solo se agrego refuerzo visual.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica.

## Sistema centralizado de pistas pedagogicas por imagen

### Que se modifico
- Se reemplazo la logica de pistas por ejercicio por un sistema centralizado basado en clases detectadas del modelo.
- `src/data/mathCameraHints.js` ahora concentra:
  - `imageHints` con pistas pedagogicas por clase;
  - `questionImageClasses` con las clases habilitadas por pregunta;
  - `imageClassAliases` para adaptar los labels reales del modelo a los nombres pedagogicos.
- `src/utils/getMathCameraHint.js` ahora solo habilita pista cuando la confianza es mayor o igual a `85%` y la clase detectada corresponde a la pregunta activa.
- `math-challenge.js` deja de mostrar objeto, tema y coincidencia como bloque principal, y pasa a mostrar una card destacada con titulo `Pista encontrada`, icono y boton `Entendido`.
- La camara no valida respuestas, no avanza de pregunta y no marca aciertos: solo brinda ayuda contextual.
- Se actualizaron las preguntas del desafio matematico para que todas tengan exactamente `4` opciones.

### Archivos afectados
- `index.html`
- `math-challenge.js`
- `math-data.js`
- `style.css`
- `src/data/mathCameraHints.js`
- `src/utils/getMathCameraHint.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Entrar al `Desafio matematico`.
- Verificar que cada pregunta muestre `4` opciones.
- En Pregunta 1 comprobar estas opciones:
  - `Concava hacia abajo`
  - `Concava hacia arriba`
  - `No tiene concavidad`
  - `Es una funcion lineal`
- Presionar `Buscar pista con camara`.
- Abrir una imagen reconocible por el modelo y luego presionar `Analizar imagen`.
- Verificar estos casos:
  - confianza menor a `85%`: no debe abrir la card de pista y debe seguir buscando;
  - clase valida para la pregunta: debe aparecer la card `Pista encontrada` con una pista aleatoria y el boton `Entendido`;
  - clase reconocida pero no asociada a la pregunta: no debe mostrar respuesta ni validar la opcion.
- Confirmar que `Entendido` solo cierre la card y permita seguir resolviendo.
- Confirmar que `Cerrar camara` cierre el panel sin cambiar la pregunta actual.
- Confirmar que responder correctamente siga avanzando a la siguiente pregunta sin depender de la camara.

### Riesgos o supuestos
- El mapeo depende de que el modelo siga devolviendo las clases actuales: `concavaAbajo`, `concavaArriba`, `1raiz`, `2raices`, `imaginarias` y `escalera`.
- Si el modelo cambia labels o agrega clases nuevas, hay que actualizar `imageClassAliases` y, si corresponde, `imageHints`.
- No se agrego validacion automatica en runtime para forzar `4` opciones; en esta iteracion se corrigieron las preguntas existentes.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- `MODEL_URL` en `math-data.js` sigue definiendo el modelo usado por el desafio matematico.

## Ajuste visual del hero sin imagen lateral

### Que se modifico
- Se removio la imagen lateral de `Edu-Spark` del encabezado principal.
- Se acomodo la grilla del hero para que el contenido textual ocupe todo el ancho disponible en esa zona.
- Se redistribuyeron los textos del hero en dos bloques:
  - contenido principal de bienvenida;
  - bloque lateral con pasos de ingreso y nota destacada.
- Se conservaron los textos y la logica existente de la app; el cambio fue solo visual.

### Archivos afectados
- `index.html`
- `style.css`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Verificar que ya no aparezca la imagen de `Edu-Spark` en el hero.
- Confirmar que el bloque principal quede alineado y ocupe correctamente el espacio disponible.
- Confirmar que los pasos de inicio aparezcan en un bloque lateral separado y que la nota del portal quede visualmente destacada.
- Confirmar que botones, textos y flujo de inicio sigan funcionando igual.

### Riesgos o supuestos
- No se modifico logica, eventos ni estructura del juego fuera del bloque visual del hero.
- El cambio asume que la imagen removida no se reutiliza en otra parte del encabezado.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica.

## Soporte inicial para feria de ciencias orientada a Fisica

### Que se modifico
- Se agrego configuracion de modulos con soporte para `type: "text"` y `type: "image"`.
- Se incorporo el componente `ImageRecognitionChallenge` para reconocimiento con Teachable Machine.
- Se movio la logica base de carga de modelo, webcam y loop a `teachableMachineModule.js`.
- Se adapto el modulo 3 como ejemplo de prueba de imagen sobre energia potencial.
- Se adaptaron los textos de los modulos 1 a 10 para que toda la experiencia quede orientada a Fisica.
- Se actualizaron textos principales para contexto de laboratorio de Fisica.
- Se agrego un boton visible de `Reiniciar app` para uso rapido en modo muestra.

### Archivos afectados
- `index.html`
- `logica.js`
- `style.css`
- `gameConfig.js`
- `teachableMachineModule.js`
- `imageRecognitionChallenge.js`

### Como probarlo
- Abrir `index.html`.
- Iniciar una partida con nombre de equipo.
- Avanzar hasta el modulo 3.
- Si `TEACHABLE_MACHINE_MODEL_URL` esta vacio o no carga, debe verse el mensaje: `Modelo de reconocimiento no configurado todavía.`
- Si la URL apunta a un modelo valido, la camara debe activarse y validar cuando detecte `requiredClass` con la confianza minima.
- El boton `Reiniciar app` debe pedir confirmacion y volver la app a estado inicial.

### Riesgos o supuestos
- La carga del modelo depende de que TensorFlow.js y Teachable Machine esten disponibles en el navegador.
- El acceso a camara requiere permisos del navegador.
- La URL del modelo debe apuntar a la carpeta exportada por Teachable Machine.
- La URL configurada actualmente es `https://teachablemachine.withgoogle.com/models/RXOtQYhAB/`.

### Variables de entorno / configuracion
- `TEACHABLE_MACHINE_MODEL_URL`
- `MIN_CONFIDENCE_DEFAULT`

## Mejora visual de portada y visibilidad de interfaz

### Que se modifico
- Se reforzo el `head` de `index.html` con `title`, `meta description`, `theme-color` y etiquetas Open Graph basicas.
- Se reorganizo la portada para priorizar el onboarding: propuesta breve, pasos rapidos, nombre de equipo y CTA principal.
- Se agrupo el acceso inicial dentro de un bloque visual unico para mejorar jerarquia y escaneabilidad.
- Se ajusto el tablero superior para mostrar los 4 paneles en una grilla consistente.
- Se sumo un `skip link` y descripciones accesibles al campo de nombre de equipo.
- Se suavizo el bloque de mensajes de estado para que siga visible sin competir con la accion principal.

### Archivos afectados
- `index.html`
- `style.css`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Verificar que la primera accion visible sea completar el nombre del equipo y usar `Entrar al juego`.
- Confirmar que el tablero de estado muestre 4 paneles alineados en desktop y apilados en mobile.
- Navegar con teclado y comprobar que el enlace `Saltar al contenido principal` aparezca al recibir foco.
- Revisar que el campo `Nombre del equipo` mantenga la validacion actual y que el flujo del juego no cambie.

### Riesgos o supuestos
- No se modifico la logica del juego ni los listeners de `logica.js`; los cambios son de estructura visual y metadatos.
- La etiqueta `og:image` usa un recurso local del proyecto; para despliegue publico puede requerir una URL absoluta.
- Se mantuvo la estetica retro existente, solo reduciendo competencia visual en la portada.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica para esta mejora visual.

## Fallback sin camara en desafio matematico

### Que se modifico
- Se agrego un fallback en `math-challenge.js` para que el desafio matematico no quede bloqueado si la camara no existe, falla o no tiene permisos.
- Cuando la webcam no puede abrirse, la pregunta sigue disponible, se muestra un mensaje claro y el boton de pistas por camara queda deshabilitado.
- Se hizo mas robusto `stopCamera()` para evitar que un estado parcial de la webcam interrumpa el avance al responder correctamente.

### Archivos afectados
- `math-challenge.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Entrar al `Desafio matematico`.
- Intentar abrir la camara en un equipo sin webcam o negar permisos.
- Verificar que aparezca un mensaje indicando que se puede continuar sin pistas visuales.
- Seleccionar la respuesta correcta y confirmar que avance a la siguiente pregunta.

### Riesgos o supuestos
- Si la camara falla una vez en esa sesion, el boton de pistas queda deshabilitado para evitar nuevos bloqueos.
- No se modificaron respuestas, preguntas ni logica general de avance; solo el manejo de errores de camara.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica para este cambio.

## Pistas pedagogicas de camara en desafio matematico

### Que se modifico
- Se incorporo la capa de pistas pedagogicas para camara en el desafio matematico.
- Se creo `src/data/mathCameraHints.js` para mapear cada ejercicio activo con su tema, objetos aceptados, pistas de procedimiento y mensaje de rechazo.
- Se creo `src/utils/getMathCameraHint.js` para resolver el resultado del analisis segun `activeExerciseId`, `detectedLabel` y `confidence`.
- Se agrego `exerciseId` unico a cada ejercicio de `math-data.js` para vincular la imagen detectada con la pista correcta.
- El modulo de camara ahora muestra objeto detectado, porcentaje de coincidencia, tema matematico, pista y boton `Intentar con otra imagen`.
- La camara sigue analizando solo bajo accion explicita del usuario al presionar `Analizar imagen`.

### Archivos afectados
- `index.html`
- `math-challenge.js`
- `math-data.js`
- `style.css`
- `src/data/mathCameraHints.js`
- `src/utils/getMathCameraHint.js`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Entrar al `Desafio matematico`.
- Abrir la camara de pistas.
- Presionar `Analizar imagen` con distintas imagenes.
- Verificar los tres casos:
  - confianza menor a `60%`: debe pedir mejorar la imagen.
  - objeto aceptado: debe mostrar una pista de procedimiento, nunca la respuesta final.
  - objeto no aceptado: debe indicar que el objeto es interesante, pero no se usara en esa ocasion.
- Confirmar que el boton `Intentar con otra imagen` limpie el resultado actual sin romper la pregunta activa.
- Confirmar que responder correctamente siga avanzando al siguiente ejercicio sin cambios.

### Riesgos o supuestos
- Los `acceptedObjects` se apoyan en las etiquetas reales que devuelve el modelo actual de Teachable Machine.
- Se mantuvo la logica de respuestas correctas sin cambios; solo se reemplazo la interpretacion pedagogica del analisis de imagen.
- Si en el futuro cambia el modelo o sus labels, debera actualizarse `src/data/mathCameraHints.js`.
- El modelo `https://teachablemachine.withgoogle.com/models/fK5vn6tPS/` expone actualmente estas clases: `concavaAbajo`, `concavaArriba`, `1raiz`, `2raices`, `escalera`, `imaginarias`.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- `MODEL_URL` en `math-data.js` sigue definiendo el modelo usado por el desafio matematico.

## Cambio de camara y lectura continua en desafio matematico

### Que se modifico
- Se reemplazo la captura del desafio matematico por un flujo nativo con `getUserMedia` para poder cambiar de camara cuando hay mas de un dispositivo disponible.
- Se agrego el boton `Cambiar cámara` en el panel de pistas del modulo matematico.
- La app ahora intenta priorizar la camara trasera o `environment` cuando existe, en lugar de depender siempre de la frontal.
- El boton `Analizar imagen` ahora inicia un analisis continuo por frames hasta obtener una pista util o determinar que la imagen no corresponde.
- Si la confianza es baja, el analisis sigue automaticamente sin obligar al usuario a sacar una nueva “foto”.
- Se mantuvo la logica de respuestas correctas y el contrato publico usado por `logica.js` para cerrar la camara.

### Archivos afectados
- `index.html`
- `math-challenge.js`
- `style.css`
- `DOCUMENTACION.md`

### Como probarlo
- Abrir `index.html`.
- Entrar al `Desafio matematico`.
- Abrir la camara de pistas.
- Verificar que, si hay mas de una camara, aparezca habilitado `Cambiar cámara`.
- Cambiar entre camaras y confirmar que el preview se actualice.
- Presionar `Analizar imagen` y comprobar que:
  - siga leyendo en continuo si la confianza es baja;
  - se detenga cuando encuentre una pista util;
  - se detenga cuando detecte que la imagen no corresponde.
- Usar `Intentar con otra imagen` y verificar que limpie el resultado sin cerrar la camara.

### Riesgos o supuestos
- La deteccion de camaras disponibles depende de `navigator.mediaDevices` y de los permisos del navegador.
- El cambio de camara solo se habilita cuando el dispositivo expone mas de un `videoinput`.
- No se realizo una prueba visual automatizada en navegador dentro de esta iteracion; la verificacion fue estatica.

### Endpoints
- No aplica.

### Variables de entorno / configuracion
- No aplica para este cambio.
