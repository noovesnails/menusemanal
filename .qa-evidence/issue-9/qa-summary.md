# QA funcional — issue #9 / PR #18

Vehículo: navegador integrado (servidor local `python -m http.server`) + `javascript_tool`, rama `9-toggle-thermomix-manual`, commit `d0dd86c`.

| Criterio | Resultado | Observación |
|---|---|---|
| 1. `recipe` admite ambas versiones opcionalmente | ✅ | Las 9 recetas migradas conservan solo sus claves reales (7 `thermomix`, 2 `manual`) |
| 2. Interruptor visible en Nevera | ✅ | Comprobado visualmente (captura), estilo coherente con el resto de la app |
| 3. Cambia la vista Menú al instante, sin recargar | ✅ | Click en el interruptor recalcula `.recipe-mode` en el DOM sin `location.reload()` |
| 4. Persiste entre sesiones (`localStorage`) | ✅ | Tras recargar la página, `modoReceta` mantiene el último valor guardado |
| 5. Plato con una sola versión se ve igual en cualquier posición | ✅ | Lunes (solo Thermomix): mismo resultado con el interruptor en ambas posiciones. Jueves (comida solo Thermomix + cena solo manual): mismo resultado en ambas posiciones |
| 6. Las 9 recetas existentes funcionan sin cambios visibles | ✅ | Mismos pasos, raciones y etiqueta por defecto (Thermomix) que antes de la migración |

**6/6 criterios verificados y cumplidos.** Sin errores de consola. Sin overflow en 375px real (viewport móvil real, no solo emulado).
