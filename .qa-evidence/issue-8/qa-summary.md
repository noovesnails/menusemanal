# QA funcional — issue #8 / PR #17

Vehículo: navegador integrado + `javascript_tool` (rama `8-opciones-comidas`, commit `70566f1`).

| Criterio | Resultado | Observación |
|---|---|---|
| 1. Solo categorías con contenido real | ✅ | `pedro:["desayuno"]`, `nuria:["desayuno","merienda"]`, sin "Almuerzo" en el HTML |
| 2. Tarjeta por opción con descripción | ✅ | 7 tarjetas Pedro, texto verbatim |
| 3. Toggle "elegida" sin persistencia | ✅ | click→`true`, click→`false` |
| 4. Sin opciones → sin sección | ✅ | mismo dato del criterio 1 |
| 5. Respeta `personasVisibles` (#7) | ✅ | desmarcar Pedro → sus tarjetas desaparecen; remarcar → vuelven |
| 6. Sin overflow en 375px real | ✅ | `innerWidth=scrollWidth=375` |

**6/6 criterios verificados y cumplidos.** Sin errores de consola.
