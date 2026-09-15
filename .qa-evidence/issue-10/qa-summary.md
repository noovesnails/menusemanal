# QA funcional — issue #10 / PR #15

Vehículo: navegador integrado + `javascript_tool` contra `http://localhost:8123` (rama
`10-dedup-compra`, commit `e5be6d3`). Sin Playwright/Docker disponibles.

**Reproducción del bug original**: [reproduccion-bug-original.txt](reproduccion-bug-original.txt) — el caso real "aceite de oliva" (miércoles, Pedro) ya no sale duplicado.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Fusión por nombre base | ✅ | [reproduccion-bug-original.txt](reproduccion-bug-original.txt) |
| 2. Formato `Nombre (cantidad)` | ✅ | mismo fichero: "Aceite de oliva (1 c/s)" vs "Brócoli" (sin cantidad) |
| 3. Orden alfabético (7 días) | ✅ | [qa-checks.txt](qa-checks.txt) |
| 4. Icono por línea con fallback | ✅ | [qa-checks.txt](qa-checks.txt) |
| 5. Etiqueta de origen tras la fusión | ✅ | reproducción: "Aceite de oliva (1 c/s)" → Pedro |

**Hallazgos del review, re-verificados en fresco (no reutilizada la comprobación de esa fase):**
- Regex `g`/`l` sin límite de palabra: confirmado arreglado, sin regresión — [qa-checks.txt](qa-checks.txt)
- Persistencia por clave estable: confirmado arreglado (toggle en ambos sentidos) — [qa-checks.txt](qa-checks.txt)

**5/5 criterios verificados y cumplidos, 2/2 hallazgos del review confirmados arreglados.** Sin
errores de consola.
