---
name: nuevo-menu
description: Sustituye el plan nutricional de Pedro o de Nuria (independientes entre sí) a partir de un PDF/.md nuevo de la nutricionista. Pregunta las fechas de la nueva cita, inicio y fin de dieta; pide el fichero; extrae texto e imágenes; reconstruye los platos de esa persona en index.html (con receta Thermomix/manual para los elaborados y foto si hay alguna real); actualiza el recordatorio en la app; y despliega. Usar cuando el usuario dice "nuevo menú", "nueva dieta", "actualizar el plan de Pedro/Nuria", o /nuevo-menu.
---

# Nuevo menú — sustituir el plan de una persona

Esta skill es específica de `menusemanal`. Sustituye el ciclo de dieta de **una persona** (Pedro o
Nuria — nunca las dos a la vez, sus ciclos son independientes) a partir del PDF/.md que la
nutricionista entrega en cada visita.

## 1. Preguntas obligatorias (antes de pedir el fichero)

Pregunta, en este orden, con `AskUserQuestion` donde aplique:

1. **¿Para quién es este plan?** Pedro / Nuria (nunca ambos en una misma ejecución).
2. **Fecha de la próxima visita a la nutricionista** (la que viene después de esta entrega).
3. **Fecha aproximada de inicio de esta nueva dieta** (normalmente el lunes siguiente a la
   entrega del plan).
4. **Fecha aproximada de fin de esta dieta** (normalmente el lunes anterior a la próxima visita,
   o lo que el usuario indique — la duración real la marca la nutricionista, no una regla fija).

No sigas sin las 4 respuestas.

## 2. Pide el fichero

Pide la ruta del PDF (preferido, trae fotos) o `.md` (si no hay fotos) del nuevo plan. Cópialo a
`planes/` con el mismo criterio de nombre que los existentes (`<Nombre> <Apellidos> <fecha
entrega>.md`/`.pdf`).

## 3. Extracción (reproducible, ver sesión de referencia en `update.md`)

- **Texto**: si es PDF, léelo con el `Read` tool; si el texto no sale limpio, conviértelo aparte.
- **Imágenes**: si es PDF, extrae con PyMuPDF (`python -m pip install --quiet pymupdf` si no está
  instalado):
  ```python
  import fitz
  doc = fitz.open(ruta_pdf)
  for i in range(len(doc)):
      for j, img in enumerate(doc[i].get_images(full=True)):
          base = doc.extract_image(img[0])
          if base["width"] < 80 or base["height"] < 80: continue  # descarta iconos/logos
          # guarda base["image"] con extensión base["ext"]
  ```
  **No asumas que las fotos están una por plato**: en los dos PDFs ya vistos son ilustraciones
  sueltas de ejemplo (desayuno, comida, cena genéricos), no fotos del plato exacto de cada día.
  Antes de usar una, mírala (`Read` sobre el fichero de imagen) y comprueba a ojo que el plato
  coincide de verdad con el ingrediente principal — si no hay coincidencia razonable, no la uses
  para ningún plato. Las que sirvan van a `img/<persona>-<slug-plato>.jpg`.

## 4. Reconstruir los platos de esa persona en `index.html`

- Sustituye únicamente las entradas `pedro:{...}` o `nuria:{...}` (la que toque) de cada día del
  array `WEEK` — la otra persona no se toca.
- Si la nueva dieta dura más o menos días que la semana actual del array, ajusta el array `WEEK`
  completo (añade/quita objetos de día) para cubrir el rango real inicio→fin de esta persona;
  coordina las fechas con la otra persona si sus rangos no coinciden (puede que un día tenga a
  Pedro en dieta nueva y a Nuria todavía en la vieja — el array ya soporta eso, cada `WEEK[i]`
  tiene `pedro` y `nuria` por separado).
- Para cada plato, igual que en el issue #2 de este proyecto:
  - `ing`: ingredientes con cantidades tal como los da el documento (no inventes cantidades que no
    estén — si faltan, dilo explícitamente en el array, ej. `"sin cantidad especificada"`).
  - Si el plato es **elaborado** (guiso, arroz meloso, cocido, crema con técnica, algo que se
    forma/cocina en varios pasos — no un simple "proteína a la plancha/horno/vapor + verdura
    simple"), añade `recipe:{servings, mode:"thermomix"|"manual", steps:[...]}`. Usa Thermomix
    TM7 cuando la técnica lo permita razonablemente (guisos con función presión, arroces melosos,
    cremas), Manual si no (pasta, revueltos de huevo, cocciones muy largas). Verifica que las
    cantidades de los pasos coinciden con las de `ing` — el review de #2 encontró justo ese fallo.
  - Si hay foto real para el plato (ver §3), añade `img:"img/..."`.

## 5. Recordatorio en la app (crear la primera vez, actualizar las siguientes)

Si `index.html` todavía no tiene un banner de recordatorio, créalo: un aviso visible en la vista
Menú con, por persona, la próxima visita y la fecha de fin aproximada de su dieta actual (usa las
mismas variables de color `--pedro`/`--nuria` que ya identifican a cada persona en el resto de la
app). Guarda las fechas como constantes JS junto a `WEEK_START`, con nombres
`PEDRO_PROXIMA_VISITA`, `PEDRO_FIN_DIETA`, `NURIA_PROXIMA_VISITA`, `NURIA_FIN_DIETA` (o los que ya
existan de una ejecución anterior de esta skill — actualiza solo los de la persona de este plan).

## 6. Cierre

- Actualiza `update.md` con la entrega: persona, fecha del documento, fechas de inicio/fin/próxima
  visita.
- Sigue el flujo normal del proyecto (`.agents/rules/global.md`): esto es contenido de producto,
  no arquitectura, así que un `/spec` + `/implement` con un único issue por entrega es proporcionado
  — no hace falta partirlo en varios. Si el usuario pide ir directo (como ya ha hecho otras veces
  en sesiones con pocos tokens), commit + push a `main` y decirlo explícitamente, sin fingir que
  pasó por review.
- Despliega (GitHub Pages es automático al llegar a `main`) y haz un smoke check: abre la app,
  comprueba que el banner y los platos nuevos de esa persona se ven bien, y que la otra persona no
  ha cambiado.
