---
name: nuevo-menu
description: Procesa un PDF de plan nutricional nuevo (o actualizado) de una persona de menusemanal y lo integra en index.html — WEEK, OPCIONES, NUTRI, peso. Sustituye o añade el ciclo de dieta de esa persona, independiente del de las demás. Usar cuando el usuario dice "nuevo menú", "nueva dieta", "actualizar el plan de X", o /nuevo-menu.
---

# Nuevo menú — De PDF de la nutricionista a la app

Convierte el plan en PDF de una visita a la nutricionista en las estructuras de datos de
`index.html`, y opcionalmente registra el peso de esa visita. Cada persona (`PERSONAS`) tiene un
ciclo de dieta independiente — nunca asumas que dos personas comparten fechas de inicio/fin salvo
que el usuario lo diga.

Esto requiere una sesión de Claude Code con acceso al repo — no es una subida automática desde la
propia app (ver decisión documentada en issue #6: la extracción de PDF a estructura fiable necesita
lectura de fichero, Python y verificación humana en el medio, no una única llamada a un LLM).

## §1 — Preguntas obligatorias, por cada PDF que se vaya a procesar

Antes de tocar código, para cada persona/PDF:

1. **Persona**: ¿ya existe en `PERSONAS` (`index.html`) o es nueva? Si es nueva, crea su entrada en
   `PERSONAS`/`NUTRI` con un color propio: añade `--id`/`--id-soft` en las 3 variantes de tema
   (`:root`, `@media prefers-color-scheme:dark`, `:root[data-theme="dark"]`) y las reglas
   `.dot.id`/`.ing-src.id`/`.reminder.id`/`.personchip.on.id`.
2. **Próxima visita**: fecha (y hora si la da) de la siguiente cita con la nutricionista.
3. **Vigencia de este plan**: fecha de inicio (normalmente la fecha del PDF o el lunes siguiente) y
   fecha mínima hasta la que es válido. No asumas que coincide con la próxima visita — puede seguir
   vigente más allá, o el nuevo plan puede no empezar hasta bastante después de la visita (ver
   ejemplo real: alguien vuelve el 6/10 pero el menú no cambia hasta después del 12/10).
4. **Peso actual**: ¿cuánto pesa en esta visita? (issue #12, pestaña "Peso" de la app). Si no se
   da, no se registra — no inventar un valor.

Confirma estas 4 preguntas con quien te pase el PDF; no las infieras del nombre del fichero o su
fecha de modificación.

## §2 — Extracción del PDF

Extrae el texto con PyMuPDF (`import fitz`, `pip install pymupdf` si no está). Los planes de esta
nutricionista suelen venir en tablas "Día 1..Día 7" que la extracción de texto linealiza por filas
(Desayuno, Tentempié/Almuerzo, Comida, Tentempié/Merienda, Cena) en vez de por columnas — hay que
recomponer manualmente qué fragmento de texto corresponde a qué día y a qué comida. Cuando una
comida no tenga contenido extraíble (encabezados sueltos sin cuerpo, tablas perdidas en la
conversión), no se inventa: se documenta como ausente.

Si el PDF trae fotos reales de los platos (no siempre pasa — a veces son solo ilustraciones
genéricas de ejemplo), extráelas con `doc.extract_image()` y compruébalas a ojo antes de usarlas:
solo si el plato de la foto coincide de verdad con el ingrediente principal del día. Las que sirvan
van a `img/<persona>-<slug-plato>.jpg`. Issue #13 (fotos con IA) es la alternativa cuando no hay
foto real que encaje — no la hagas por defecto en esta skill salvo que se pida explícitamente.

Distingue:
- **Comida/Cena**: un plato fijo por día de la semana → entra en `WEEK[fecha][persona].comida/cena`.
- **Desayuno/Almuerzo/Merienda con "ELIGE UNA OPCIÓN"**: no varían por día, van en
  `OPCIONES[persona].desayuno/almuerzo/merienda` como tarjetas seleccionables (issue #8) — solo las
  categorías con contenido real, no inventar las que faltan.

## §3 — Mapeo a fechas de calendario

El plan de "Día 1..Día 7" es una plantilla semanal que se repite mientras dure la vigencia acordada
en §1.3. Genera o actualiza una entrada de `WEEK` por cada fecha real del rango (inicio → fin),
repitiendo el ciclo de 7 días tantas veces como haga falta. Si varias personas comparten fecha, sus
entradas van en el mismo objeto `{ name, date, persona1:{...}, persona2:{...} }` de `WEEK` — no
dupliques fechas ni crees un segundo objeto para la misma fecha.

Si la persona ya tenía un plan activo con fechas que se solapan con las nuevas, edita esas entradas
de `WEEK` en vez de añadir duplicados; las demás personas en esas mismas fechas no se tocan.

## §4 — Ingredientes

Cada plato necesita un `ing: [...]` con cantidad conocida cuando el PDF la da (p. ej. `"120 g
pollo"`), sin inventar cantidades que no aparecen. Alimenta la nevera/lista de la compra
(`fridgeItems()` en `index.html`), que ya deduplica por nombre normalizado — no hace falta
preocuparse por duplicados entre personas, solo por no inventar cantidades.

Si el plato es **elaborado** (guiso, arroz meloso, cocido, crema con técnica — no un simple
"proteína a la plancha/horno/vapor + verdura simple"), añade
`recipe:{servings, thermomix?:{steps,ing?}, nutri?:{steps,ing?}, tradicional?:{steps,ing?}}`
(issue #23 — interruptor de 3 vías en Nevera):

- **`nutri`**: si el propio PDF trae una receta completa para ese plato ("receta a continuación",
  con sus ingredientes y pasos tal cual los escribió la nutricionista), transcríbela aquí sin
  reformular. Si sus ingredientes difieren de la lista simplificada de `ing` del plato (p. ej. trae
  mascarpone, mantequilla, limón que no estaban en `ing`), añade también `nutri.ing` con la lista
  real de esa receta — si no difieren, no hace falta repetirla.
- **`thermomix`**: receta con técnica y programación real de Thermomix TM7, cuando la preparación lo
  permita razonablemente.
- **`tradicional`**: una receta real buscada en internet para ese mismo plato (no inventada desde
  cero) — la alternativa para quien no tiene Thermomix ni sigue la versión de la nutri. Solo hace
  falta buscarla si el plato no tiene ya al menos una versión utilizable; no es obligatorio rellenar
  las 3 para cada plato.

No hace falta que un plato tenga las 3 versiones — el interruptor de la app hace fallback solo a la
que exista. Verifica que las cantidades de los pasos de cada versión coinciden con las de su propio
`ing` (o con el `ing` general del plato si esa versión no tiene uno propio).

## §5 — NUTRI y peso

Actualiza `NUTRI[persona]` con `proximaVisita`, `inicioNuevoPlan`, `finPlanActual` según lo
confirmado en §1, y limpia `notaPendiente` si el plan pendiente que describía ya llegó.

Si en §1.4 se dio un peso, añade un registro a `peso[persona]` (pestaña Peso de la app):
`{fecha, kg}` con la fecha de la visita, no la fecha del PDF si son distintas. No sobrescribas
registros anteriores de esa persona; si ya existe uno para esa misma fecha, reemplázalo (evita
duplicar la misma visita).

## §6 — Verificación y cierre

1. Sirve `index.html` en local (`.claude/launch.json`, servidor `menusemanal`) y verifica en el
   navegador: el día de hoy muestra menú para cada persona tocada, las tarjetas de `OPCIONES`
   aparecen si las hay, la nevera/compra deduplican bien, y si se registró peso aparece en la
   pestaña Peso con su diferencia calculada.
2. Sin overflow en 375px real (`resize_window` mobile + `navigate` fresco) y sin errores de consola.
3. Esto es contenido de datos, no código nuevo: commit directo a `main` (sin PR y diciéndolo
   explícitamente), salvo que el propio PDF motive también un cambio de código (p. ej. una
   estructura de datos que todavía no existe) — en ese caso ese cambio de código sí sigue el flujo
   spec→implement→review→qa→deploy completo del proyecto, y el contenido se añade en un commit
   aparte una vez el código esté desplegado.
4. Verifica en producción tras el deploy (GitHub Pages es automático al llegar a `main`) antes de
   dar el trabajo por terminado.
