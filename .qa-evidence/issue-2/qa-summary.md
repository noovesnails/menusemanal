# QA funcional — issue #2 / PR #4

Vehículo: navegador integrado (Chromium real, headed) contra la app levantada en
`http://localhost:8123` (rama `2-boton-receta-thermomix`, commit `faf3426`), vía `python -m
http.server`. No había Playwright ni Docker disponibles en esta máquina, así que en vez del script
Node que documenta la skill se usó `javascript_tool` para ejecutar JS real en la página y medir el
DOM — mismo principio (ejercitar la app real, evidencia cruda, no parafraseada), vehículo distinto.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Los 9 platos listados muestran botón "Receta" | ✅ | [criterio-01-04-boton-receta-por-plato.txt](criterio-01-04-boton-receta-por-plato.txt) |
| 2. Desplegable con raciones + ingredientes (antes) + pasos numerados | ✅ | [criterio-02-03-contenido-y-modo.txt](criterio-02-03-contenido-y-modo.txt) |
| 3. Etiqueta "Thermomix TM7" / "Manual" | ✅ | [criterio-02-03-contenido-y-modo.txt](criterio-02-03-contenido-y-modo.txt) |
| 4. Platos no listados sin botón | ✅ | [criterio-01-04-boton-receta-por-plato.txt](criterio-01-04-boton-receta-por-plato.txt) |
| 5. Móvil 375px sin overflow/solape | ✅ | [criterio-05-mobile-375-sin-overflow.txt](criterio-05-mobile-375-sin-overflow.txt) |

**5/5 criterios verificados y cumplidos.**

## Hallazgo colateral (fuera de alcance de este PR)

Al validar el criterio 5 se descubrió que `index.html` no tiene ninguna etiqueta `<meta
name="viewport">`. Sin ella, los navegadores móviles renderizan con un viewport de layout por
defecto de ~980px y hacen zoom-out de toda la página para encajarla en la pantalla — con lo que la
app nunca llega a ejercitar su CSS "mobile-first" en un teléfono real, aunque visualmente parezca
correcta por el zoom. Detalle completo, con la medición que lo confirma, en
[criterio-05-mobile-375-sin-overflow.txt](criterio-05-mobile-375-sin-overflow.txt). Es un bug
preexistente (no introducido por este PR) que afecta a toda la app, no solo a la feature de
recetas — se reporta como issue nuevo, no se arregla aquí.
