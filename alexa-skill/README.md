# Skill de Alexa "Menú semanal"

Permite preguntar en voz alta, por ejemplo: **"Alexa, pregunta a Menú semanal qué tiene Rocío hoy
de comida"**, y que responda leyendo el plato real de la app.

No hace falta un servidor propio: Alexa llama a una función en AWS Lambda (gratis para este
volumen de uso), que lee `menu-data.json` — un volcado ligero (solo fechas y títulos de plato, sin
recetas) que se publica junto al resto de la web en GitHub Pages y se regenera cada vez que cambia
un menú.

## Qué necesitas crear tú (dos cuentas, las dos gratis)

1. **Cuenta de desarrollador de Amazon**: en https://developer.amazon.com — se entra con el MISMO
   correo/contraseña de tu cuenta normal de Amazon (la que ya usan los Echo de casa), no hace falta
   crear una cuenta nueva de Amazon, solo activar el acceso de desarrollador.
2. **Cuenta de AWS**: en https://aws.amazon.com — esta sí es independiente de tu cuenta de Amazon
   normal, pide una tarjeta para verificar la identidad pero el uso que le vamos a dar (una función
   Lambda con muy poco tráfico) cae dentro de la capa gratuita permanente de AWS (1 millón de
   peticiones al mes gratis; una familia preguntando el menú no llega ni de lejos).

Cuando tengas las dos, dime y seguimos con el resto — los pasos de abajo son para cuando llegues
ahí, los puedes leer antes para hacerte una idea.

## Paso 1 — Subir la función a AWS Lambda

1. Entra en https://console.aws.amazon.com/lambda y pulsa **Crear función**.
2. Elige **"Crear desde cero"**. Nombre: `menusemanal-alexa`. Runtime: **Node.js 20.x** (o la
   versión más alta que te ofrezca). Arquitectura: `x86_64` (la que viene por defecto).
3. Dentro de la función, pestaña **Código**: botón **Cargar desde** → **archivo .zip**. Sube el
   fichero `menusemanal-alexa-lambda.zip` que te he pasado (ya lleva el código y sus dependencias,
   no hay que instalar nada).
4. En **Configuración → Configuración general**, sube el **tiempo de espera (timeout)** a 10
   segundos (por defecto son 3, y la primera llamada tiene que descargar `menu-data.json`).
5. Copia el **ARN** de la función, arriba a la derecha (algo como
   `arn:aws:lambda:eu-west-1:123456789012:function:menusemanal-alexa`) — lo necesitas en el paso 3.

## Paso 2 — Crear la Skill en la consola de Alexa

1. Entra en https://developer.amazon.com/alexa/console/ask (con tu cuenta de Amazon normal) y
   pulsa **Create Skill**.
2. Nombre: `Menú semanal`. Idioma principal: **Español (ES)**. Tipo de modelo: **Custom**.
   Método de hosting: **Provision your own** (NO "Alexa-hosted", ya tenemos la Lambda).
3. Plantilla: **Start from scratch**.
4. Dentro de la skill, pestaña **Build** → **Interaction Model** → **JSON Editor**: borra lo que
   haya y pega el contenido completo de `alexa-skill/models/es-ES.json` (te lo paso aparte). Guarda
   y pulsa **Build Skill** (arriba a la derecha) — tarda medio minuto.
5. Pestaña **Build** → **Endpoint**: elige **AWS Lambda ARN**, región por defecto, y pega el ARN
   del Paso 1. Guarda.
6. Vuelve a la Lambda en AWS: pestaña **Configuración → Disparadores** → **Agregar disparador** →
   elige **Alexa Skills Kit** → pega el **Skill ID** (lo ves arriba del todo en la consola de Alexa,
   algo como `amzn1.ask.skill.xxxxxxxx-...`) → Agregar. Esto es importante por seguridad: así la
   Lambda solo acepta peticiones de tu skill, no de cualquiera.

## Paso 3 — Probarla

1. En la consola de Alexa, pestaña **Test**, activa el desplegable de arriba a "Development".
2. Escribe o di: `abre menú semanal` y luego `qué tiene Rocío hoy de comida`.
3. En cuanto funcione ahí, ya funciona también en los Echo/tablet de casa — mientras estén
   conectados a tu misma cuenta de Amazon, las skills en modo "Development" aparecen automáticamente
   en todos tus dispositivos, no hay que "instalarla" aparte.

## Qué se puede preguntar

- "qué tiene Pedro hoy" → responde comida y cena
- "qué tiene Eva de cena" / "de comida"
- "qué come Daniel mañana"
- "el menú de Marta"

Los nombres reconocidos ahora mismo: Pedro, Nuria, Rocío, Paqui, Sole, Eva, Marta, Daniel.

## Mantenimiento

- **Cambios de menú** (nuevo PDF de la nutri, corrección de fechas...): no hay que tocar nada de
  Alexa, yo regenero `menu-data.json` y lo subo junto con el cambio de menú.
- **Persona nueva**: si se añade alguien a la app, hay que añadirla también al slot `PERSONA` del
  modelo de interacción y volver a darle a "Build Skill" en la consola — te aviso cuando pase y te
  paso el JSON actualizado para pegar.
- **Cambios en la propia Lambda** (si alguna vez cambiamos cómo responde, no qué datos usa): te
  paso un .zip nuevo para subir en el Paso 1.3, no hace falta rehacer nada más.
