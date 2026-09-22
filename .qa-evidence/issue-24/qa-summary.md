# QA funcional — issue #24 / PR #28

Vehículo: navegador integrado (servidor local) + `javascript_tool`, rama `24-tab-yo-onboarding`, commit `1f4d49d` (incluye el fix de seguridad de la review).

## Onboarding

| Criterio | Resultado | Observación |
|---|---|---|
| 1. Pantalla para elegir tu usuario (selección única) | ✅ | Verificado con las 7 personas |
| 2. Segunda pantalla para elegir a quién más ver (opcional, múltiple) | ✅ | Verificado seleccionando 2 personas adicionales |
| 3. Persiste en localStorage, no repite el flujo | ✅ | Verificado recargando la página tras completar el onboarding |

## Pestaña "Yo"

| Criterio | Resultado | Observación |
|---|---|---|
| 4. 5ª pestaña, cabecera con tu usuario | ✅ | "Hola, Rocío" visible tras el onboarding |
| 5. Gestión de personas visibles reubicada | ✅ | Mismo mecanismo, ahora dentro de "Yo" |
| 6. Citas por persona visible (footer retirado del resto) | ✅ | Verificado que `#reminders` ya no existe en Menú/Nevera/Compra/Peso |
| 7. Edición de fechas por persona | ✅ | Probado con Nuria, revertido tras la prueba sin tocar datos reales |
| 8. Notas de la nutri visibles | ✅ | Nota de Marta (interacción con pomelo) visible correctamente |

**Seguridad**: hallazgo de la review (inyección HTML vía `nutriEdits` sin escapar en atributo `value`) verificado como corregido — un payload de prueba (`2026-01-01" onmouseover="..."`) no tiene efecto tras el fix.

**8/8 criterios verificados y cumplidos.** Sin errores de consola. Sin overflow en 375px real con 5 pestañas y el formulario de fechas.
