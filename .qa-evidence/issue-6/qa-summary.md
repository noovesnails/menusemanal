# QA funcional — issue #6 / PR #14

Vehículo: navegador integrado (Chromium real) contra la app levantada en `http://localhost:8123`
(rama `6-n-personas-rocio`, commit `68f46ba`), vía `python -m http.server`. Sin Playwright/Docker
disponibles; se usó `javascript_tool` para ejecutar JS real y leer el DOM/estado, igual que en el
QA del issue #2.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Tarjetas derivadas de `WEEK`, sin Rocío hasta tener platos | ✅ | [criterio-01-06-tarjetas-por-dia.txt](criterio-01-06-tarjetas-por-dia.txt) |
| 2. `rocio` en `NUTRI` con la fecha pedida | ✅ | [criterio-02-05-07-nutri-y-banner.txt](criterio-02-05-07-nutri-y-banner.txt) |
| 3. `pedro.proximaVisita = 2026-09-30T18:00` | ✅ | mismo fichero |
| 4. `nuria.proximaVisita = 2026-09-16` | ✅ | mismo fichero |
| 5. `NUTRI` admite N personas | ✅ | mismo fichero |
| 6. Sin regresión Pedro/Nuria | ✅ | [criterio-01-06-tarjetas-por-dia.txt](criterio-01-06-tarjetas-por-dia.txt) |
| 7. Banner muestra a Rocío | ✅ | [criterio-02-05-07-nutri-y-banner.txt](criterio-02-05-07-nutri-y-banner.txt) |
| 8. Etiquetado `origen()` con 1/2/3 personas | ✅ | [criterio-08-etiquetado-origen.txt](criterio-08-etiquetado-origen.txt) |

**8/8 criterios verificados y cumplidos.** Sin errores de consola durante toda la sesión de QA.
