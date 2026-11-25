// Lambda de la Alexa Skill "Menú semanal". Lee menu-data.json (publicado junto al index.html en
// GitHub Pages, generado con scripts/export-menu-json.js) para responder qué tiene cada persona de
// comida o cena un día dado — sin reimplementar la rotación de la app por su cuenta.
//
// IDs de PERSONA reconocidos: pedro, nuria, rocio, paqui, sole, eva, marta, daniel (ver
// alexa-skill/models/es-ES.json). Si se añade alguien nuevo a la app (nuevo-menu), hay que añadirlo
// también al slot type PERSONA del modelo de interacción, o Alexa no sabrá reconocer su nombre.

const Alexa = require('ask-sdk-core');

const MENU_DATA_URL = 'https://noovesnails.github.io/menusemanal/menu-data.json';
const TIEMPO_CACHE_MS = 10 * 60 * 1000; // 10 min: el menú no cambia cada minuto, no hace falta pedirlo cada vez

// Se cachea en una variable de módulo: mientras el contenedor de Lambda siga "caliente" entre
// invocaciones (lo normal con poco tráfico de una familia), se reaprovecha sin volver a descargar.
let cache = { datos: null, enMs: 0 };

async function obtenerMenuData() {
  const ahora = Date.now();
  if (cache.datos && (ahora - cache.enMs) < TIEMPO_CACHE_MS) return cache.datos;
  const res = await fetch(MENU_DATA_URL);
  if (!res.ok) throw new Error('No se pudo descargar menu-data.json: HTTP ' + res.status);
  const datos = await res.json();
  cache = { datos, enMs: ahora };
  return datos;
}

// Fecha de hoy (o +offsetDias) en el huso horario de la familia, como "AAAA-MM-DD" — Lambda corre
// en UTC por defecto, y cerca de medianoche eso puede ser un día distinto al de Madrid.
function fechaMadrid(offsetDias) {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' });
  const partes = fmt.formatToParts(new Date()).reduce((o, p) => { o[p.type] = p.value; return o; }, {});
  const base = new Date(Date.UTC(Number(partes.year), Number(partes.month) - 1, Number(partes.day)));
  base.setUTCDate(base.getUTCDate() + offsetDias);
  return base.toISOString().slice(0, 10);
}

const IDS_PERSONA_CONOCIDOS = ['pedro', 'nuria', 'rocio', 'paqui', 'sole', 'eva', 'marta', 'daniel'];

function sinTildes(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Intenta primero la resolución de entidades de Alexa (el id del slot type, fiable incluso si
// dijeron un sinónimo); si no hay match, cae a comparar el texto reconocido a mano sin tildes.
function resolverIdDeSlot(slot, idsConocidos) {
  if (!slot) return null;
  const auth = slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority[0];
  if (auth && auth.status && auth.status.code === 'ER_SUCCESS_MATCH' && auth.values && auth.values.length) {
    return auth.values[0].value.id;
  }
  const crudo = sinTildes(slot.value);
  return idsConocidos.includes(crudo) ? crudo : null;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const texto = 'Bienvenido a Menú semanal. Puedes preguntarme, por ejemplo, qué tiene Rocío hoy de comida.';
    return handlerInput.responseBuilder.speak(texto).reprompt(texto).getResponse();
  },
};

const MenuDelDiaIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuDelDiaIntent';
  },
  async handle(handlerInput) {
    const env = handlerInput.requestEnvelope;
    const personaId = resolverIdDeSlot(Alexa.getSlot(env, 'persona'), IDS_PERSONA_CONOCIDOS);
    const tipoId = resolverIdDeSlot(Alexa.getSlot(env, 'tipo'), ['comida', 'cena']);
    const cuandoId = resolverIdDeSlot(Alexa.getSlot(env, 'cuando'), ['hoy', 'manana']);

    if (!personaId) {
      const texto = 'No he entendido de quién me preguntas. Puedes decir, por ejemplo, qué tiene Pedro hoy de comida.';
      return handlerInput.responseBuilder.speak(texto).reprompt(texto).getResponse();
    }

    let datos;
    try {
      datos = await obtenerMenuData();
    } catch (e) {
      const texto = 'No he podido consultar el menú ahora mismo. Inténtalo otra vez en un momento.';
      return handlerInput.responseBuilder.speak(texto).getResponse();
    }

    const fecha = fechaMadrid(cuandoId === 'manana' ? 1 : 0);
    const nombrePersona = (datos.personas && datos.personas[personaId]) || personaId;
    const diaTexto = cuandoId === 'manana' ? 'mañana' : 'hoy';
    const dia = datos.week && datos.week[fecha];
    const platos = dia && dia[personaId];

    if (!platos || (!platos.comida && !platos.cena)) {
      const texto = `No tengo ningún menú registrado para ${nombrePersona} ${diaTexto}.`;
      return handlerInput.responseBuilder.speak(texto).getResponse();
    }

    let texto;
    if (tipoId === 'comida') {
      texto = platos.comida
        ? `${diaTexto[0].toUpperCase() + diaTexto.slice(1)}, ${nombrePersona} tiene de comida: ${platos.comida}.`
        : `No tengo registrada la comida de ${nombrePersona} ${diaTexto}.`;
    } else if (tipoId === 'cena') {
      texto = platos.cena
        ? `${diaTexto[0].toUpperCase() + diaTexto.slice(1)}, ${nombrePersona} tiene de cena: ${platos.cena}.`
        : `No tengo registrada la cena de ${nombrePersona} ${diaTexto}.`;
    } else {
      const partes = [];
      if (platos.comida) partes.push(`de comida, ${platos.comida}`);
      if (platos.cena) partes.push(`de cena, ${platos.cena}`);
      texto = `${diaTexto[0].toUpperCase() + diaTexto.slice(1)}, ${nombrePersona} tiene ${partes.join('. Y ')}.`;
    }

    return handlerInput.responseBuilder.speak(texto).withSimpleCard('Menú semanal', texto).getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const texto = 'Puedes preguntarme qué tiene alguien de comida o de cena, hoy o mañana. Por ejemplo: qué tiene Eva de cena hoy.';
    return handlerInput.responseBuilder.speak(texto).reprompt(texto).getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    const tipo = Alexa.getRequestType(handlerInput.requestEnvelope);
    const nombre = tipo === 'IntentRequest' ? Alexa.getIntentName(handlerInput.requestEnvelope) : null;
    return tipo === 'IntentRequest' && (nombre === 'AMAZON.CancelIntent' || nombre === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak('Hasta luego.').getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const texto = 'No te he entendido. Puedes preguntarme, por ejemplo, qué tiene Pedro hoy de comida.';
    return handlerInput.responseBuilder.speak(texto).reprompt(texto).getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('Error en la skill:', error);
    const texto = 'Ha habido un problema al consultar el menú. Inténtalo de nuevo.';
    return handlerInput.responseBuilder.speak(texto).getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    MenuDelDiaIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
