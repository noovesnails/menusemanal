# QA funcional — issue #12 / PR #20

Vehículo: navegador integrado (servidor local) + `javascript_tool`, rama `12-seguimiento-peso`, commit `479120a`.

| Criterio | Resultado | Observación |
|---|---|---|
| 1. Vista con peso por fecha y diferencia respecto al anterior | ✅ | "72,3 kg (-0,8 kg desde el 24/7)" — mismo formato del ejemplo del issue |
| 2. Se puede añadir un registro nuevo (persona + fecha + valor) | ✅ | El selector de persona mantiene la elección entre altas seguidas (bug corregido durante implementación) |
| 3. La skill `/nuevo-menu` pregunta el peso en su flujo | ✅ | `.claude/skills/nuevo-menu/SKILL.md` §1.4 y §5 |
| 4. El histórico persiste y sincroniza vía el mismo JSONBin | ✅ | Verificado recargando la página tras guardar |

**4/4 criterios verificados y cumplidos.** Sin errores de consola relevantes (el único error de consola observado es un artefacto del tooling de `resize_window`, reproducible sin tocar el código de la app). Sin overflow en 375px real con la 4ª pestaña añadida. Los datos de prueba se eliminaron del JSONBin de producción tras cada verificación.
