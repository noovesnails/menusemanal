# QA funcional — issue #11 / PR #19

Vehículo: navegador integrado (servidor local) + `javascript_tool`, rama `11-items-sueltos-compra`, commit `4ef4662` (incluye el fix de escape de XSS encontrado en review).

| Criterio | Resultado | Observación |
|---|---|---|
| 1. Campo para añadir un artículo suelto en Nevera/Compra | ✅ | Formulario visible en la sección "Otros" de Compra |
| 2. El artículo aparece en la lista de la Compra | ✅ | Sección "Otros" separada (opción que el propio issue dejaba abierta) |
| 3. Se puede marcar como comprado y eliminar | ✅ | Checkbox con tachado igual que los ingredientes; botón ✕ elimina |
| 4. Persiste y sincroniza entre dispositivos (mismo JSONBin) | ✅ | Verificado recargando la página tras guardar (lee del JSONBin real, no solo localStorage) |

**Seguridad**: verificado que un nombre de artículo con HTML/JS (`<img onerror=...>`) se muestra como texto plano y no se ejecuta, tras el fix de escape aplicado en review.

**4/4 criterios verificados y cumplidos.** Sin errores de consola. Sin overflow en 375px real. El dato de prueba usado durante la verificación se eliminó del JSONBin de producción tras cada prueba.
