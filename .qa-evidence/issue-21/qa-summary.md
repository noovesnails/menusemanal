# QA funcional — issue #21 / PR #25

Vehículo: navegador integrado (servidor local) + `javascript_tool`, rama `21-borrar-peso`, commit `1b51c2a`.

| Criterio | Resultado | Observación |
|---|---|---|
| 1. Cada fila tiene control para eliminar | ✅ | Botón ✕ visible en cada registro |
| 2. Diferencia del registro siguiente se recalcula | ✅ | Verificado tras borrar un registro intermedio |
| 3. El borrado persiste y sincroniza | ✅ | Verificado contra el JSONBin real, sin afectar los registros reales existentes de Pedro, Paqui, Sole y Rocío |
| 4. Con menos de 2 registros, la gráfica desaparece | ✅ | Verificado en el bloque de Nuria tras dejarla con 1 registro |

**4/4 criterios verificados y cumplidos.** Sin errores de consola. Sin overflow en 375px real. Los 2 registros de prueba añadidos para verificar se eliminaron con el propio botón que este PR implementa, sin tocar los datos reales de la familia.
