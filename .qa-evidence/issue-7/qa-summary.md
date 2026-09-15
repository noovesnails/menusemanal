# QA funcional — issue #7 / PR #16

Vehículo: navegador integrado + `javascript_tool` contra `http://localhost:8123` (rama
`7-selector-personas`, commit `a7e799e`). Sin Playwright/Docker disponibles.

| Criterio | Resultado | Comando/observación |
|---|---|---|
| 1. Control con 1 entrada por persona | ✅ | `chips = ["pedro","nuria","rocio"]` |
| 2. Desmarcar oculta al instante | ✅ | tras click en chip Pedro: `#viewMenu .person` → solo `["Nuria"]` |
| 3. Persiste entre días durante la sesión | ✅ | cambio de día tras desmarcar: sigue `["Nuria"]`, `personasVisibles` intacto |
| 4. Default = personas con plato (Rocío fuera) | ✅ | estado inicial `["pedro:true","nuria:true","rocio:false"]` |
| 5. Sin overflow en 375px real | ✅ | `innerWidth=scrollWidth=375, overflow=false` |
| Hallazgo review: estado vacío al desmarcar todo | ✅ | desmarcando todo: `"Ninguna persona seleccionada arriba 👆"`; restaurado tras volver a marcar |

**5/5 criterios + 1/1 hallazgo del review, todo confirmado.** Sin errores de consola.
