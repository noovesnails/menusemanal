# menusemanal — rules

## Qué es

App web de una sola página (mobile-first) para consultar en el móvil el menú diario de comida y
cena de Pedro y Nuria (planes de una nutricionista), chequear qué ingredientes hay ya en la nevera,
y ver la lista de la compra del día resultante. Pensada para que la usen dos personas desde sus
propios móviles con el estado sincronizado.

## Stack y entorno

- **Un único fichero estático**: `index.html` (HTML + CSS + JS vanilla, sin build, sin dependencias
  ni CDNs). Se abre directamente en el navegador o se sirve como Artifact de Claude.
- **Datos del menú**: hardcodeados en el array `WEEK` dentro de `index.html`, a partir de los PDFs
  de la nutricionista convertidos a texto. No hay backend propio.
- **Estado compartido** (checks de nevera): JSONBin.io (bin ya existente, ver `update.md` para el
  Bin ID — no se versiona la Master Key en las rules). La Master Key vive embebida en el propio
  `index.html` porque es una app 100% cliente; asumido conscientemente, ver `update.md`.
- **No hay tests automatizados ni CI todavía** — proyecto de un solo fichero, sin superficie de
  backend que testear por ahora.
- **Arranque**: abrir `index.html` en un navegador, o publicar como Artifact.

## Mantenimiento

- Editar solo dentro de `.agents/` para todo lo que sea proceso (rules, notes); el código vive en
  la raíz del repo.
- Leer `.agents/notes/INDEX.md` al empezar sesión y abrir solo las notes cuyo disparador encaje con
  la tarea — no todas.
- Al cerrar una unidad de trabajo, volcar a una note el estado: hecho, pendiente, decisiones tomadas
  y siguiente paso. El contexto vive en ficheros, no en el historial de conversación.
- El histórico detallado de cambios y decisiones del producto (no del proceso) sigue en `update.md`
  en la raíz — no se duplica aquí.

## Flujo de trabajo (GitHub)

- **Repo**: [`noovesnails/menusemanal`](https://github.com/noovesnails/menusemanal) · **Tablero**:
  [Project 3 de noovesnails](https://github.com/users/noovesnails/projects/3) (enlazado al repo).
  Las tareas son **issues** de este repo.

### El estado vive en el tablero; los labels dicen el tipo

Son dos ejes distintos y **no se mezclan**. Seis estados, en el campo `Status` del Project y **en
ningún otro sitio**:

```
Backlog → In Progress → Code Review → QA → Ready for prod → Done
```

- **No hay labels de estado.** Duplicarlo en label y columna obliga a sincronizar a mano, y lo que
  se escribe en dos sitios acaba discrepando.
- **Un issue que no está en el tablero no tiene estado**: `/spec` lo añade al crearlo.
- `Ready for prod` es el único estado donde la tarea espera a algo ajeno a ti (una ventana de
  despliegue).

**Labels = tipo de tarea**, mismo vocabulario que los tipos de commit: `feat`, `fix`, `refactor`,
`test`, `chore`, `docs`. Uno por issue, y no cambia durante el ciclo. **`Priority`** (P0–P3) es otro
campo del tablero.

- Las skills de proceso (`/spec`, `/implement`...) crean y leen las tareas aquí, y leen esta sección
  para saber los estados. Cada issue define sus criterios de aceptación: son el contrato de QA.

### Lo que las skills preguntan si no está escrito aquí

- **Estrategia de merge**: commit de merge (no squash) — así los commits de implementación y de
  arreglo del review quedan identificables en el historial.
- **Commit de evidencias de QA**: no aplica todavía (proyecto de un solo fichero sin QA con
  evidencias automatizadas); se define cuando haga falta.
- **Dónde corre la app en local**: no hay servidor — se abre `index.html` directamente en el
  navegador, o se prueba la versión publicada como Artifact de Claude.
- **Cómo se despliega**: no hay despliegue automático. Publicar es republicar el Artifact desde
  `index.html` (mismo fichero → mismo link). `/deploy` termina en el merge a `main`.
- **Dónde se anota el desfase main↔producción**: en `.agents/notes/qa-pendiente-main.md` (se crea
  la primera vez que haga falta).
