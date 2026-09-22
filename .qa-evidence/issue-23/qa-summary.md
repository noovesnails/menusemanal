# QA funcional — issue #23 / PR #27

Vehículo: navegador integrado (servidor local) + `javascript_tool`, rama `23-receta-3-vias`, commit `3481670`.

| Criterio | Resultado | Observación |
|---|---|---|
| 1. Interruptor de 3 posiciones | ✅ | Thermomix TM7 / Receta nutri / Tradicional, verificado en desktop y móvil (375px) |
| 2. `recipe` admite `{thermomix?, nutri?, tradicional?}` con `ing` propio | ✅ | Verificado en el código y con datos de prueba |
| 3. Cambiar el interruptor recalcula ingredientes de nevera/compra | ✅ | Probado con un plato con `ing` distinto por versión: cambia de verdad al mover el interruptor |
| 4. Plato sin `recipe` usa su `ing` de siempre | ✅ | Sin cambios en ese camino, verificado que no se rompió |
| 5. Fallback a la versión disponible | ✅ | Verificado en ambos sentidos con platos de una sola versión |
| 6. Recetas históricas y de Pedro siguen funcionando | ✅ | Renombradas de `manual` a `tradicional`, mismo contenido, verificado que se siguen mostrando |

**6/6 criterios verificados y cumplidos.** Sin errores de consola. Sin overflow en 375px real con las 3 etiquetas del interruptor. Las pruebas con ingredientes de versión distinta se hicieron en memoria y se revirtieron sin tocar los datos reales de la familia.
