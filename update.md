# Menú Semanal — bitácora del proyecto

App HTML de una sola página para consultar en el móvil el menú diario (comida y cena) de Pedro y Nuria, chequear qué hay en la nevera, y ver la lista de la compra del día. Pensada mobile-first, con 3 pestañas: **Menú / Nevera / Compra**.

## Enlaces
- **Artifact publicado (usar este link en el móvil):** https://claude.ai/code/artifact/0261b58a-f4bb-46a8-af57-d21798c28e37
- **Fichero fuente:** `C:\Users\Rocio\menu-semanal-app\index.html` (un único archivo, sin dependencias externas)

## Origen de los datos
- `C:\Users\Rocio\Documents\Pedro Chillaron Escriva 24-07-2026.md` (PDF de la nutricionista convertido a .md, 24-07-2026)
- `C:\Users\Rocio\Documents\Nuria Vera 15-06-2026.md` (PDF de la nutricionista convertido a .md, 15-06-2026)
- Solo se han usado **comida y cena** (desayuno, almuerzo y merienda quedan fuera, según lo pedido).
- Semana cargada: **lunes 7 a domingo 13 de septiembre de 2026** (la semana del PDF empieza en lunes; hoy era domingo 6-sept, así que se arranca al día siguiente).

### Notas sobre la fuente
- **Pedro**: el documento traía primero una tabla desordenada y después una sección limpia LUNES→DOMINGO con receta, ingredientes con cantidades exactas (para 2 raciones) y preparación. Se ha usado esa sección limpia.
- **Nuria**: el documento solo traía una rejilla de 7 opciones de comida y 7 de cena, **sin días etiquetados** y sin cantidades exactas de cada ingrediente (solo la proteína principal lleva gramaje, ej. "140 g pollo"). Se asumió el orden **Lunes→Domingo** porque coincide exactamente con el patrón de la misma rejilla en el documento de Pedro (comprobado columna a columna contra su sección clara de días). Si el orden real fuera distinto, solo hay que reordenar el array `WEEK` en `index.html`.

## Decisiones tomadas con el usuario
- **Almacenamiento compartido**: se reutiliza el JSONBin ya existente (Bin ID `6a301b19f5f4af5e29f5ec66`) en vez de la base de datos nativa del Artifact, para que Nuria pueda ver y guardar los datos en ese mismo sitio. **Aviso de seguridad**: al ser una app 100% cliente, la Master Key de JSONBin queda visible en el código fuente de la página para cualquiera que tenga el enlace. Aceptado conscientemente por el usuario porque el enlace no se comparte públicamente.
- **Orden semanal de Nuria**: confirmado Lunes→Domingo sin revisión adicional contra el PDF original (ver nota arriba).
- Los ingredientes de comida+cena se muestran **juntos** en la pestaña Nevera (no separados por comida), tal como se pidió.
- La lista de la compra es **por día** (no acumulada semanal) — cada pestaña Compra muestra solo lo que falta para el día seleccionado.

## Cómo funciona la sincronización
- Al cargar, la app hace `GET` al bin (`/latest`) y guarda el objeto completo en memoria (`remoteRecord`) para no pisar otras claves que ya hubiera en ese bin.
- El estado de los checks de nevera se guarda bajo la clave `menuSemanal.checks` dentro de ese mismo bin.
- Cada cambio de checkbox dispara un `PUT` (con debounce de 700ms) que reenvía el objeto completo con `menuSemanal.checks` actualizado.
- Si falla la conexión, se guarda en `localStorage` del navegador como respaldo y se avisa en la barra de estado ("Sin conexión").

## Cómo actualizar la semana siguiente
1. Convertir los nuevos PDFs de la nutricionista a texto/markdown.
2. Editar el array `WEEK` en `index.html` (7 días, cada uno con `pedro.comida`, `pedro.cena`, `nuria.comida`, `nuria.cena` y su lista `ing`).
3. Actualizar `WEEK_START` a la fecha del nuevo lunes.
4. Volver a publicar el Artifact (mismo fichero → mismo link).

## Pendiente / ideas para más adelante
- Vista de lista de la compra **semanal** (acumulada), no solo diaria.
- Deduplicar ingredientes por nombre normalizado (ahora mismo el mismo ingrediente con distinta redacción puede aparecer duplicado).
- Cantidades exactas para el menú de Nuria (actualmente solo la proteína principal lleva gramaje).
- Posible migración futura del almacenamiento compartido a la base de datos nativa del Artifact si en algún momento se prefiere no exponer la Master Key de JSONBin.

## Historial de cambios
- **2026-09-06**: primera versión. Carpeta de proyecto creada, datos de Pedro y Nuria cargados para la semana 7–13 sept 2026, 3 pestañas (Menú/Nevera/Compra), sincronización con JSONBin existente, publicado como Artifact.
- **2026-09-06**: proyecto movido a `C:\Users\Rocio\proyectos\menusemanal` e incorporado al flujo de `agent_flow` (`C:\Users\Rocio\proyectos\agent_flow`, skill `new-project`):
  - Repo GitHub: https://github.com/noovesnails/menusemanal (público)
  - Tablero: https://github.com/users/noovesnails/projects/3, con los 6 estados del flujo (Backlog → In Progress → Code Review → QA → Ready for prod → Done) y campo `Priority` (P0–P3)
  - Labels de tipo creados (`feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `skip-qa`, `blocked-external`); labels de fábrica de GitHub borrados
  - Scaffold `.agents/` (rules, notes/INDEX.md), `.gitignore` con `.agents/tasks/`
  - **Desviación documentada**: `AGENTS.md` y `CLAUDE.md` no son symlinks a `.agents/rules/global.md` como indica la skill — Windows sin modo desarrollador no permite crear symlinks reales a un usuario sin privilegios de administrador, y `ln -s` en Git Bash cae a copiar el contenido (rompe la sincronía). Se dejaron como ficheros puntero de una línea que remiten a `.agents/rules/global.md`, mismo patrón que la skill ya prevé para Cursor en Windows. Si en el futuro se activa el modo desarrollador, se pueden sustituir por symlinks reales.
  - Siguiente paso natural: usar `/spec` para crear los primeros issues (ideas ya mencionadas: lista de la compra semanal acumulada, cantidades exactas para Nuria, deduplicar ingredientes).
