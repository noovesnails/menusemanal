// Genera menu-data.json a partir de index.html, para que la Alexa Skill (alexa-skill/) pueda leer
// el menú del día de cada persona sin depender del JS de la app ni reimplementar la rotación de
// extenderMenusSegunPlan() por su cuenta (eso ya dio un bug una vez, ver commit de Paqui/Sole).
//
// Carga index.html real con Playwright, deja que la propia app calcule su rotación completa
// (extenderMenusSegunPlan() no depende de la fecha de "hoy": siempre rellena hasta finPlanActual de
// cada persona), y vuelca solo lo que hace falta para responder por voz: fecha, persona, título de
// comida y cena. Nada de ingredientes ni recetas — eso no lo necesita Alexa y así el JSON pesa poco.
//
// Uso: node scripts/export-menu-json.js
// Hay que volver a ejecutarlo (y hacer commit de menu-data.json) cada vez que cambie WEEK/NUTRI
// (p. ej. al procesar un PDF nuevo con la skill /nuevo-menu) — si no, Alexa se queda con datos
// viejos aunque la app web ya esté actualizada.

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const indexPath = path.join(__dirname, '..', 'index.html');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route('https://api.open-meteo.com/**', route => route.abort());
  await page.route('https://api.jsonbin.io/**', route => route.abort());
  await page.addInitScript(() => {
    // Evita que se quede atascado en la pantalla de recuperación de datos locales (ver
    // mostrarRecuperacionLocal en index.html) y que intente pedir identidad de usuario.
    localStorage.setItem('recuperacionVista_20261108', '1');
    localStorage.setItem('miUsuario', 'pedro');
  });
  await page.goto('file://' + indexPath);
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const week = {};
    for (const dia of WEEK) {
      const personas = {};
      for (const id of Object.keys(PERSONAS)) {
        const p = dia[id];
        if (!p) continue;
        personas[id] = {
          comida: p.comida ? p.comida.title : null,
          cena: p.cena ? p.cena.title : null,
        };
      }
      if (Object.keys(personas).length) week[dia.date] = personas;
    }
    const personas = {};
    for (const id of Object.keys(PERSONAS)) personas[id] = PERSONAS[id].nombre;
    return { week, personas };
  });

  await browser.close();

  const salida = {
    generadoEl: new Date().toISOString(),
    personas: data.personas,
    week: data.week,
  };

  const outPath = path.join(__dirname, '..', 'menu-data.json');
  fs.writeFileSync(outPath, JSON.stringify(salida, null, 2));
  const fechas = Object.keys(data.week).sort();
  console.log('OK:', outPath);
  console.log('Fechas:', fechas[0], '->', fechas[fechas.length - 1], '(' + fechas.length + ' días)');
  console.log('Personas:', Object.keys(data.personas).join(', '));
})();
