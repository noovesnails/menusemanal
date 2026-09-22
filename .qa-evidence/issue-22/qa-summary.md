# QA funcional — issue #22 / PR #26

Vehículo: navegador integrado (servidor local, contra el JSONBin real) + `javascript_tool`, rama `22-otros-articulos-por-dia`, commit `c951453`.

| Criterio | Resultado | Observación |
|---|---|---|
| 1. `itemsSueltos` indexado por fecha | ✅ | Verificado en memoria y en el JSONBin tras guardar |
| 2. Artículos de un día no aparecen en otro | ✅ | Añadido uno en 23/9, no aparece en 22/9 y viceversa |
| 3. Persiste y sincroniza, migrando sin perder datos | ✅ | Los 6 artículos reales ya existentes en producción (formato antiguo) migraron correctamente al día de hoy (22/9) |

**3/3 criterios verificados y cumplidos.** Sin errores de consola. Sin overflow en 375px real. El artículo de prueba añadido para verificar el aislamiento por día se eliminó tras la prueba; los 6 artículos reales de la familia se conservaron intactos.
