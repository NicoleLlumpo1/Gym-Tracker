// ══════════════════════════════════════════════════════════
// logicaGymtracker.js
// Lógica completa de la app GymTracker 2026
// Autora: Nicole Llumpo
// ══════════════════════════════════════════════════════════

// ── Constantes de datos ───────────────────────────────────
const NOMBRES_MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const NOMBRES_DIAS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const DATOS_RUTINA = [
  {
    dia: 'LUNES', grupo: 'ISQUIOS · GLÚTEOS', claseColor: 'lunes',
    ejercicios: [
      { nombre: 'Serie movilidad',                      series: '5-10 min' },
      { nombre: 'Hip Thrust libre',                     series: '4×10' },
      { nombre: 'Peso muerto convencional',             series: '4×10' },
      { nombre: 'Sentadilla búlgara',                   series: '4×10' },
      { nombre: 'Patada de glúteos',                    series: '4×10' },
      { nombre: 'Máquina abductores (cerrado-glúteos)', series: '4×10' },
      { nombre: 'Máquina de isquios',                   series: '4×10' },
      { nombre: 'Cinta',                                series: '5-10 min' },
    ]
  },
  {
    dia: 'MARTES', grupo: 'ESPALDA · BÍCEPS · ABDOMEN', claseColor: 'martes',
    ejercicios: [
      { nombre: 'Dorsalera pecho agarre abierto', series: '4×10' },
      { nombre: 'Remo bajo con cable',            series: '4×10' },
      { nombre: 'Pullover',                       series: '4×10' },
      { nombre: 'Remo con mancuerna',             series: '4×10' },
      { nombre: 'Curl martillo',                  series: '4×10' },
      { nombre: 'Serie abdominales',              series: '—' },
      { nombre: 'Cinta',                          series: '5-10 min' },
    ]
  },
  {
    dia: 'MIÉRCOLES', grupo: 'CUADRICEPS · GLÚTEOS', claseColor: 'miercoles',
    ejercicios: [
      { nombre: 'Serie movilidad',                          series: '5-10 min' },
      { nombre: 'Sentadilla en Smith',                      series: '4×10' },
      { nombre: 'Sentadilla goblet mancuerna',              series: '4×10' },
      { nombre: 'Sillón de cuadriceps + mantengo + cortas', series: '4×10' },
      { nombre: 'Prensa (medio-bajo-cerrado)',               series: '4×10' },
      { nombre: 'Aductores en máquina (abierto)',            series: '4×15' },
      { nombre: 'Cinta',                                    series: '5-10 min' },
    ]
  },
  {
    dia: 'JUEVES', grupo: 'PECHO · TRÍCEPS · HOMBRO', claseColor: 'jueves',
    ejercicios: [
      { nombre: 'Aperturas Peck Deck',         series: '3×10' },
      { nombre: 'Press de banca con barra',    series: '4×10' },
      { nombre: 'Banco inclinado',             series: '4×10' },
      { nombre: 'Press de hombros con mancuerna', series: '4×10' },
      { nombre: 'Vuelos laterales',            series: '4×10' },
      { nombre: 'Tríceps pushdown en polea',   series: '4×10' },
      { nombre: 'Serie abdominales',           series: '—' },
      { nombre: 'Cinta',                       series: '5-10 min' },
    ]
  },
  {
    dia: 'VIERNES', grupo: 'LEGS DAY', claseColor: 'viernes',
    ejercicios: [
      { nombre: 'Serie movilidad',                    series: '5-10 min' },
      { nombre: 'Hip Thrust en máquina',              series: '10 completas + 10 mantengo + 10 cortas' },
      { nombre: 'Peso muerto + unilateral mancuerna', series: '4×10' },
      { nombre: 'Sentadilla sumo',                    series: '4×12' },
      { nombre: 'Abductores',                         series: '—' },
      { nombre: 'Cinta',                              series: '5-10 min' },
    ]
  },
];

// ── Estado de la aplicación ───────────────────────────────
let estadoRegistroDiario = {
  energia:   0,
  fatiga:    '',
  sensacion: '',
  progresion:'',
  sueno:     '',
  molestias: '',
};

let mesFiltroHistorial  = new Date().getMonth();
let mesFiltroEjercicios = new Date().getMonth();
let mesFiltroAsistencia = new Date().getMonth();
let mesFiltroEstadisticas = new Date().getMonth();

// ── LocalStorage ──────────────────────────────────────────

function obtenerDeStorage(clave) {
  try { return JSON.parse(localStorage.getItem(clave)) || []; }
  catch { return []; }
}

function guardarEnStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ── Navegación entre pantallas ────────────────────────────

function setScreen(idPantalla) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.querySelectorAll('.pestaniaNav').forEach(t => t.classList.remove('activa'));

  document.getElementById('pantalla-' + idPantalla).classList.add('activa');
  document.querySelector(`.pestaniaNav[onclick="setScreen('${idPantalla}')"]`).classList.add('activa');

  if (idPantalla === 'hoy')         inicializarPantallaHoy();
  if (idPantalla === 'cardio')      inicializarPantallaCardio();
  if (idPantalla === 'ejercicios')  inicializarPantallaEjercicios();
  if (idPantalla === 'asistencia')  inicializarPantallaAsistencia();
  if (idPantalla === 'estadisticas') inicializarPantallaEstadisticas();
  if (idPantalla === 'historial')   inicializarPantallaHistorial();
  if (idPantalla === 'rutina')      inicializarPantallaRutina();
}

// ── Toast de notificaciones ───────────────────────────────

function mostrarToast(mensaje, esError = false) {
  const contenedor = document.getElementById('contenedorToast');
  contenedor.textContent = mensaje;
  contenedor.className   = 'visible' + (esError ? ' error' : '');
  setTimeout(() => contenedor.className = '', 2500);
}

// ── Utilidades de fecha ───────────────────────────────────

function obtenerFechaHoy() {
  // Fecha local (toISOString usa UTC y después de las 21:00 en Argentina daba el día siguiente)
  const ahora = new Date();
  return ahora.getFullYear() + '-' + String(ahora.getMonth() + 1).padStart(2, '0') + '-' + String(ahora.getDate()).padStart(2, '0');
}

function obtenerDiaDeSemana(fecha) {
  // Lun=0 .. Dom=6
  return (fecha.getDay() + 6) % 7;
}

function obtenerSemanaDelMes(fecha) {
  const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const offsetPrimerDia = obtenerDiaDeSemana(primerDia);
  return Math.ceil((fecha.getDate() + offsetPrimerDia) / 7);
}

// ── HOY: inicialización y manejo de fecha ─────────────────

function inicializarPantallaHoy() {
  const inputFecha = document.getElementById('inputFechaHoy');
  if (!inputFecha.value) inputFecha.value = obtenerFechaHoy();
  actualizarFechaHoy();
  actualizarBannerEstadoDia();
  sincronizarControlesRecordatorio();
}

function actualizarFechaHoy() {
  const valorFecha = document.getElementById('inputFechaHoy').value || obtenerFechaHoy();
  const fecha      = new Date(valorFecha + 'T12:00:00');

  document.getElementById('tituloDiaHoy').textContent   = NOMBRES_DIAS[obtenerDiaDeSemana(fecha)];
  document.getElementById('fechaLegibleHoy').textContent =
    fecha.getDate() + ' de ' + NOMBRES_MESES[fecha.getMonth()] + ' ' + fecha.getFullYear();
  aplicarValoresRapidosHoy();
}

// ── HOY: selección de energía con estrellas ───────────────

function setStar(numero) {
  estadoRegistroDiario.energia = numero;
  document.querySelectorAll('#contenedorEstrellaEnergia .estrella').forEach((estrella, indice) => {
    estrella.classList.toggle('activa', indice < numero);
  });
}

// ── HOY: selección de pills ───────────────────────────────

function togglePill(elementoPill, campo, valor) {
  elementoPill.closest('.grupoPills').querySelectorAll('.pill').forEach(p => {
    p.classList.remove('seleccionada');
  });
  elementoPill.classList.add('seleccionada');
  estadoRegistroDiario[campo] = valor;
}

// ── HOY: guardar registro ─────────────────────────────────

function guardarRegistro() {
  const valorFecha   = document.getElementById('inputFechaHoy').value || obtenerFechaHoy();
  const grupoMuscular = document.getElementById('selectGrupoMuscular').value;
  const notas        = document.getElementById('textareaNotasHoy').value.trim();

  if (!grupoMuscular)                  return mostrarToast('Seleccioná el grupo muscular', true);
  if (!estadoRegistroDiario.energia)   return mostrarToast('Seleccioná la energía', true);

  const registros   = obtenerDeStorage('registros');
  const indiceExistente = registros.findIndex(r => r.fecha === valorFecha);
  const nuevoRegistro   = { fecha: valorFecha, grupoMuscular, ...estadoRegistroDiario, notas };

  if (indiceExistente > -1) registros[indiceExistente] = nuevoRegistro;
  else registros.push(nuevoRegistro);

  guardarEnStorage('registros', registros);
  mostrarToast('✓ Registro guardado');
  limpiarFormHoy();
  marcarAsistenciaGymAutomatica(valorFecha, true);
  actualizarBannerEstadoDia();
}

function limpiarFormHoy() {
  document.getElementById('selectGrupoMuscular').value = '';
  document.getElementById('textareaNotasHoy').value    = '';
  estadoRegistroDiario = { energia:0, fatiga:'', sensacion:'', progresion:'', sueno:'', molestias:'' };
  document.querySelectorAll('.estrella').forEach(e => e.classList.remove('activa'));
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('seleccionada'));
  aplicarValoresRapidosHoy();
}

// ── CARDIO: inicialización ────────────────────────────────

function inicializarPantallaCardio() {
  const inputFecha = document.getElementById('inputFechaCardio');
  if (!inputFecha.value) inputFecha.value = obtenerFechaHoy();
  actualizarFechaCardio();

  ['inputMinCaminando', 'inputMinCorriendo', 'inputMinBicicleta'].forEach(id => {
    document.getElementById(id).oninput = calcularTotalMinutosCardio;
  });
}

function actualizarFechaCardio() {
  const valorFecha = document.getElementById('inputFechaCardio').value || obtenerFechaHoy();
  const fecha      = new Date(valorFecha + 'T12:00:00');

  document.getElementById('tituloDiaCardio').textContent   = NOMBRES_DIAS[obtenerDiaDeSemana(fecha)].toUpperCase();
  document.getElementById('fechaLegibleCardio').textContent =
    fecha.getDate() + ' de ' + NOMBRES_MESES[fecha.getMonth()] + ' ' + fecha.getFullYear();

  renderizarSemanaCardio(valorFecha);
}

function calcularTotalMinutosCardio() {
  const minCaminando = parseFloat(document.getElementById('inputMinCaminando').value) || 0;
  const minCorriendo = parseFloat(document.getElementById('inputMinCorriendo').value) || 0;
  const minBicicleta = parseFloat(document.getElementById('inputMinBicicleta').value) || 0;
  document.getElementById('inputMinTotalesCardio').value = minCaminando + minCorriendo + minBicicleta;
}

// ── CARDIO: guardar ───────────────────────────────────────

function guardarCardio() {
  const valorFecha   = document.getElementById('inputFechaCardio').value || obtenerFechaHoy();
  const minCaminando = parseFloat(document.getElementById('inputMinCaminando').value) || 0;
  const minCorriendo = parseFloat(document.getElementById('inputMinCorriendo').value) || 0;
  const minBicicleta = parseFloat(document.getElementById('inputMinBicicleta').value) || 0;
  const hzCaminando  = parseFloat(document.getElementById('inputHzCaminando').value) || 0;
  const hzCorriendo  = parseFloat(document.getElementById('inputHzCorriendo').value) || 0;
  const totalMinutos = minCaminando + minCorriendo + minBicicleta;

  const sesiones    = obtenerDeStorage('cardios');
  const indice      = sesiones.findIndex(s => s.fecha === valorFecha);
  const nuevaSesion = { fecha: valorFecha, minCaminando, minCorriendo, minBicicleta, hzCaminando, hzCorriendo, totalMinutos };

  if (indice > -1) sesiones[indice] = nuevaSesion;
  else sesiones.push(nuevaSesion);

  guardarEnStorage('cardios', sesiones);
  mostrarToast('✓ Cardio guardado');
  limpiarCardio();
  marcarAsistenciaCardioAutomatica(valorFecha, totalMinutos > 0);
  actualizarFechaCardio();
}

function limpiarCardio() {
  ['inputMinCaminando','inputMinCorriendo','inputMinBicicleta',
   'inputHzCaminando','inputHzCorriendo','inputMinTotalesCardio'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ── CARDIO: renderizar semana ─────────────────────────────

function renderizarSemanaCardio(valorFecha) {
  const fecha       = new Date(valorFecha + 'T12:00:00');
  const diaSemana   = obtenerDiaDeSemana(fecha);
  const lunesSemana = new Date(fecha);
  lunesSemana.setDate(fecha.getDate() - diaSemana);

  const sesiones    = obtenerDeStorage('cardios');
  let htmlSemana    = '';

  for (let i = 0; i < 7; i++) {
    const diaActual  = new Date(lunesSemana);
    diaActual.setDate(lunesSemana.getDate() + i);
    const claveFecha = diaActual.toISOString().slice(0, 10);
    const sesion     = sesiones.find(s => s.fecha === claveFecha);
    const total      = sesion ? sesion.totalMinutos : 0;
    const esSeleccionado = claveFecha === valorFecha;

    htmlSemana += `
      <div class="diaCardio${esSeleccionado ? ' diaSeleccionado' : ''}">
        <div class="nombreDiaCardio">${NOMBRES_DIAS[i]}</div>
        <div class="totalMinutosCardio">${total > 0 ? total : '—'}</div>
        ${total > 0 ? '<div class="unidadMinutosCardio">min</div>' : ''}
      </div>`;
  }

  document.getElementById('grillaSemanaCardio').innerHTML = htmlSemana;
}

// ── EJERCICIOS: inicialización ────────────────────────────

function inicializarPantallaEjercicios() {
  const inputFecha = document.getElementById('inputFechaEjercicios');
  if (!inputFecha.value) inputFecha.value = obtenerFechaHoy();
  actualizarFechaEj();
  renderizarSelectorRutinaDelDia();
  renderizarPestaniasMesEjercicios();
  renderizarProgresionEjercicios();
}

function actualizarFechaEj() {
  const valorFecha = document.getElementById('inputFechaEjercicios').value || obtenerFechaHoy();
  const fecha      = new Date(valorFecha + 'T12:00:00');

  document.getElementById('tituloDiaEjercicios').textContent   = 'SEM ' + obtenerSemanaDelMes(fecha);
  document.getElementById('fechaLegibleEjercicios').textContent =
    NOMBRES_DIAS[obtenerDiaDeSemana(fecha)] + ' ' + fecha.getDate() + ' ' + NOMBRES_MESES[fecha.getMonth()];
  document.getElementById('inputNumeroSemana').value = obtenerSemanaDelMes(fecha);
}

// ── EJERCICIOS: guardar ───────────────────────────────────

function guardarEjercicio() {
  const est          = estadosSelectorEjercicio.suelto;
  const valorFecha   = document.getElementById('inputFechaEjercicios').value || obtenerFechaHoy();
  const pesoTotalKg  = parseFloat(document.getElementById('inputPesoTotalKg').value) || 0;
  const seriesRep    = document.getElementById('inputSeriesEjercicio').value.trim();
  const numeroSemana = parseInt(document.getElementById('inputNumeroSemana').value) || 1;

  if (!est.base) return mostrarToast('Elegí el ejercicio', true);

  const nombreEjercicio = obtenerNombreCompletoEjercicio(est.base, est.variante);
  const descripcionPeso = document.getElementById('inputDescripcionPeso').value.trim() || (pesoTotalKg + ' kg');
  const registro        = { fecha: valorFecha, nombreEjercicio, descripcionPeso, pesoTotalKg, seriesRep, numeroSemana };

  const ejercicios = obtenerDeStorage('ejercicios');
  const indiceExistente = ejercicios.findIndex(e => e.fecha === valorFecha && e.nombreEjercicio === nombreEjercicio);
  if (indiceExistente > -1) ejercicios[indiceExistente] = registro;
  else ejercicios.push(registro);

  guardarEnStorage('ejercicios', ejercicios);
  guardarUltimaVariante(est.base, est.variante);
  marcarAsistenciaGymAutomatica(valorFecha, true);
  mostrarToast('✓ ' + nombreEjercicio + ' guardado');
  limpiarEj();
  renderizarProgresionEjercicios();
  actualizarBannerEstadoDia();
}

function limpiarEj() {
  // Se mantiene el grupo muscular elegido para cargar el siguiente ejercicio más rápido
  const est = estadosSelectorEjercicio.suelto;
  est.base = '';
  est.variante = '';
  ['inputDescripcionPeso', 'inputPesoTotalKg', 'inputSeriesEjercicio'].forEach(id => { document.getElementById(id).value = ''; });
  renderizarSelectorEjercicio('suelto');
}

// ── EJERCICIOS: pestañas de mes ───────────────────────────

function renderizarPestaniasMesEjercicios() {
  document.getElementById('pestaniasMesEjercicios').innerHTML = NOMBRES_MESES.map((mes, indice) => `
    <button class="pestaniaMes${indice === mesFiltroEjercicios ? ' activa' : ''}"
      onclick="mesFiltroEjercicios=${indice};renderizarPestaniasMesEjercicios();renderizarProgresionEjercicios()">
      ${mes}
    </button>`
  ).join('');
}

// ── EJERCICIOS: progresión por nombre ─────────────────────

function renderizarProgresionEjercicios() {
  const ejercicios = obtenerDeStorage('ejercicios').filter(e =>
    new Date(e.fecha + 'T12:00:00').getMonth() === mesFiltroEjercicios
  );

  if (!ejercicios.length) {
    document.getElementById('contenedorProgresionEjercicios').innerHTML =
      '<div class="mensajeVacio">Sin ejercicios en este mes.</div>';
    return;
  }

  // Agrupar por nombre de ejercicio
  const agrupados = {};
  ejercicios.forEach(e => {
    if (!agrupados[e.nombreEjercicio]) agrupados[e.nombreEjercicio] = [];
    agrupados[e.nombreEjercicio].push(e);
  });

  let htmlProgresion = '';
  Object.entries(agrupados).forEach(([nombre, registros]) => {
    registros.sort((a, b) => a.numeroSemana - b.numeroSemana);
    const pesoMaximo = Math.max(...registros.map(r => r.pesoTotalKg));
    const pesoMinimo = Math.min(...registros.map(r => r.pesoTotalKg));
    const tendencia  = registros.length > 1
      ? (registros[registros.length - 1].pesoTotalKg > registros[0].pesoTotalKg ? '📈'
        : registros[registros.length - 1].pesoTotalKg < registros[0].pesoTotalKg ? '📉' : '➡')
      : '—';

    htmlProgresion += `<div class="seccionEjercicio">
      <div class="nombreEjercicioProgresion">${tendencia} ${nombre}</div>`;

    registros.forEach(r => {
      const porcentaje = pesoMaximo > 0 ? (r.pesoTotalKg / pesoMaximo * 100) : 0;
      htmlProgresion += `
        <div class="wrapperBarraProgreso">
          <div class="cabeceraBarraProgreso">
            <span class="textoBarraProgreso">Sem ${r.numeroSemana} — ${r.descripcionPeso}</span>
            <span class="valorBarraProgreso">${r.pesoTotalKg} kg · ${r.seriesRep}</span>
          </div>
          <div class="pistaBarraProgreso">
            <div class="rellenoBarraProgreso" style="width:${porcentaje}%"></div>
          </div>
        </div>`;
    });

    htmlProgresion += `
      <div class="resumenEjercicio">
        Máx: <span class="valorMaximo">${pesoMaximo} kg</span> ·
        Mín: ${pesoMinimo} kg
      </div>
    </div>`;
  });

  document.getElementById('contenedorProgresionEjercicios').innerHTML = htmlProgresion;
}

// ── ASISTENCIA: inicialización ────────────────────────────

function inicializarPantallaAsistencia() {
  renderizarPestaniasMesAsistencia();
  renderizarGrillasAsistenciaMes();
}

function renderizarPestaniasMesAsistencia() {
  document.getElementById('pestaniasMesAsistencia').innerHTML = NOMBRES_MESES.map((mes, indice) => `
    <button class="pestaniaMes${indice === mesFiltroAsistencia ? ' activa' : ''}"
      onclick="mesFiltroAsistencia=${indice};renderizarPestaniasMesAsistencia();renderizarGrillasAsistenciaMes()">
      ${mes}
    </button>`
  ).join('');
}

function renderizarGrillasAsistenciaMes() {
  const mes  = mesFiltroAsistencia;
  const anio = new Date().getFullYear();
  const diasEnMes  = new Date(anio, mes + 1, 0).getDate();
  const offsetInicio = obtenerDiaDeSemana(new Date(anio, mes, 1));

  document.getElementById('etiquetaMesAsistencia').textContent = NOMBRES_MESES[mes];
  renderizarGrillaAsistencia('gym',    mes, anio, diasEnMes, offsetInicio);
  renderizarGrillaAsistencia('cardio', mes, anio, diasEnMes, offsetInicio);
}

function renderizarGrillaAsistencia(tipo, mes, anio, diasEnMes, offset) {
  const claveStorage = `asist_${tipo}`;
  const datos        = obtenerDeStorage(claveStorage);
  const datosMes     = datos.find(d => d.mes === mes && d.anio === anio) || { mes, anio, dias: {} };

  // Encabezados de días de la semana
  let htmlGrilla = NOMBRES_DIAS.map(d =>
    `<div class="etiquetaDiaSemana">${d}</div>`
  ).join('');

  // Celdas vacías hasta el primer día
  for (let i = 0; i < offset; i++) {
    htmlGrilla += `<div class="celdaAsistencia inactiva"></div>`;
  }

  for (let numeroDia = 1; numeroDia <= diasEnMes; numeroDia++) {
    const fechaStr    = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(numeroDia).padStart(2, '0')}`;
    const diaSemana   = obtenerDiaDeSemana(new Date(fechaStr + 'T12:00:00'));
    const esDomingo   = diaSemana === 6;
    const esSabado    = diaSemana === 5;
    const estadoDia   = datosMes.dias[numeroDia];

    if (esDomingo) { htmlGrilla += `<div class="celdaAsistencia inactiva">—</div>`; continue; }

    let claseEstado = '';
    let contenidoCelda = esSabado ? '🟡' : String(numeroDia);
    if (estadoDia === 'fue')   { claseEstado = ' fue';   contenidoCelda = '✅'; }
    if (estadoDia === 'falto') { claseEstado = ' falto'; contenidoCelda = '❌'; }

    htmlGrilla += `<div class="celdaAsistencia${claseEstado}"
      onclick="toggleCeldaAsistencia('${tipo}',${numeroDia},'${fechaStr}')">${contenidoCelda}</div>`;
  }

  const idGrilla = tipo === 'gym' ? 'grillaAsistenciaGym' : 'grillaAsistenciaCardio';
  document.getElementById(idGrilla).innerHTML = htmlGrilla;
}

// ── ASISTENCIA: toggle de celda ───────────────────────────

function toggleCeldaAsistencia(tipo, numeroDia, fechaStr) {
  const claveStorage = `asist_${tipo}`;
  const mes          = new Date(fechaStr + 'T12:00:00').getMonth();
  const anio         = new Date(fechaStr + 'T12:00:00').getFullYear();
  const datos        = obtenerDeStorage(claveStorage);

  let datosMes = datos.find(d => d.mes === mes && d.anio === anio);
  if (!datosMes) { datosMes = { mes, anio, dias: {} }; datos.push(datosMes); }

  const estadoActual = datosMes.dias[numeroDia];
  if (!estadoActual)              datosMes.dias[numeroDia] = 'fue';
  else if (estadoActual === 'fue') datosMes.dias[numeroDia] = 'falto';
  else                             delete datosMes.dias[numeroDia];

  guardarEnStorage(claveStorage, datos);
  renderizarGrillasAsistenciaMes();
}

// ── ASISTENCIA: marcado automático ───────────────────────

function marcarAsistenciaGymAutomatica(fechaStr, asistio) {
  const fecha  = new Date(fechaStr + 'T12:00:00');
  const datos  = obtenerDeStorage('asist_gym');
  let datosMes = datos.find(d => d.mes === fecha.getMonth() && d.anio === fecha.getFullYear());
  if (!datosMes) { datosMes = { mes: fecha.getMonth(), anio: fecha.getFullYear(), dias: {} }; datos.push(datosMes); }
  datosMes.dias[fecha.getDate()] = asistio ? 'fue' : 'falto';
  guardarEnStorage('asist_gym', datos);
}

function marcarAsistenciaCardioAutomatica(fechaStr, completo) {
  const fecha  = new Date(fechaStr + 'T12:00:00');
  const datos  = obtenerDeStorage('asist_cardio');
  let datosMes = datos.find(d => d.mes === fecha.getMonth() && d.anio === fecha.getFullYear());
  if (!datosMes) { datosMes = { mes: fecha.getMonth(), anio: fecha.getFullYear(), dias: {} }; datos.push(datosMes); }
  datosMes.dias[fecha.getDate()] = completo ? 'fue' : 'falto';
  guardarEnStorage('asist_cardio', datos);
}

// ── ESTADÍSTICAS: pantalla aparte ─────────────────────────

function inicializarPantallaEstadisticas() {
  renderizarPestaniasMesEstadisticas();
  renderizarPantallaEstadisticas();
}

function renderizarPestaniasMesEstadisticas() {
  document.getElementById('pestaniasMesEstadisticas').innerHTML = NOMBRES_MESES.map((mes, indice) => `
    <button class="pestaniaMes${indice === mesFiltroEstadisticas ? ' activa' : ''}"
      onclick="mesFiltroEstadisticas=${indice};renderizarPestaniasMesEstadisticas();renderizarPantallaEstadisticas()">
      ${mes}
    </button>`
  ).join('');
}

function renderizarPantallaEstadisticas() {
  const mes  = mesFiltroEstadisticas;
  const anio = new Date().getFullYear();
  renderizarEstadisticasEntrenos(mes, anio);
  renderizarEstadisticasAsistencia('gym', mes, anio);
  renderizarEstadisticasAsistencia('cardio', mes, anio);
  renderizarEstadisticasCardioMes(mes, anio);
}

function esDelMesYAnio(fechaTexto, mes, anio) {
  const fecha = new Date(fechaTexto + 'T12:00:00');
  return fecha.getMonth() === mes && fecha.getFullYear() === anio;
}

function renderizarEstadisticasEntrenos(mes, anio) {
  const registros = obtenerDeStorage('registros').filter(r => esDelMesYAnio(r.fecha, mes, anio));

  const totalEntrenos   = registros.length;
  const promedioEnergia = totalEntrenos
    ? (registros.reduce((acum, r) => acum + r.energia, 0) / totalEntrenos).toFixed(1)
    : '—';
  const countFatigaAlta = registros.filter(r => r.fatiga === 'Alta').length;
  const countSubioPeso  = registros.filter(r => r.progresion === 'Subí peso').length;

  document.getElementById('tiraEstadisticasEntrenos').innerHTML = `
    <div class="tarjetaEstadistica"><div class="valorEstadistica lima">${totalEntrenos}</div><div class="etiquetaEstadistica">Entrenos</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica azul">${promedioEnergia}</div><div class="etiquetaEstadistica">Energía ⌀</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica rojo">${countFatigaAlta}</div><div class="etiquetaEstadistica">Fatiga Alta</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica naranja">${countSubioPeso}</div><div class="etiquetaEstadistica">Subí peso</div></div>`;
}

function renderizarEstadisticasAsistencia(tipo, mes, anio) {
  const datosMes  = obtenerDeStorage(`asist_${tipo}`).find(d => d.mes === mes && d.anio === anio) || { dias: {} };
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const valoresDias = Object.values(datosMes.dias);
  const countFue    = valoresDias.filter(v => v === 'fue').length;
  const countFalto  = valoresDias.filter(v => v === 'falto').length;
  const etiqueta    = tipo === 'gym' ? 'Asistencia' : 'Cardio';
  const idStats     = tipo === 'gym' ? 'tiraEstadisticasGym' : 'tiraEstadisticasCardio';

  document.getElementById(idStats).innerHTML = `
    <div class="tarjetaEstadistica"><div class="valorEstadistica lima">${countFue}</div><div class="etiquetaEstadistica">${etiqueta} ✅</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica rojo">${countFalto}</div><div class="etiquetaEstadistica">Faltas ❌</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica azul">${diasEnMes - countFue - countFalto}</div><div class="etiquetaEstadistica">Sin marcar</div></div>`;
}

function renderizarEstadisticasCardioMes(mes, anio) {
  const sesiones = obtenerDeStorage('cardios').filter(s => esDelMesYAnio(s.fecha, mes, anio));
  const totalMinutos   = sesiones.reduce((a, s) => a + s.totalMinutos, 0);
  const totalCaminando = sesiones.reduce((a, s) => a + s.minCaminando, 0);
  const totalCorriendo = sesiones.reduce((a, s) => a + s.minCorriendo, 0);
  const totalBicicleta = sesiones.reduce((a, s) => a + s.minBicicleta, 0);

  document.getElementById('tiraEstadisticasCardioMes').innerHTML = `
    <div class="tarjetaEstadistica"><div class="valorEstadistica azul">${totalMinutos}</div><div class="etiquetaEstadistica">Min totales</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica lima">${totalCaminando}</div><div class="etiquetaEstadistica">Min caminando</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica naranja">${totalCorriendo}</div><div class="etiquetaEstadistica">Min corriendo</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica">${totalBicicleta}</div><div class="etiquetaEstadistica">Min bicicleta</div></div>`;
}

// ── HISTORIAL: inicialización ─────────────────────────────

function inicializarPantallaHistorial() {
  renderizarPestaniasMesHistorial();
  renderizarListaHistorial();
}

function renderizarPestaniasMesHistorial() {
  document.getElementById('pestaniasMesHistorial').innerHTML = NOMBRES_MESES.map((mes, indice) => `
    <button class="pestaniaMes${indice === mesFiltroHistorial ? ' activa' : ''}"
      onclick="mesFiltroHistorial=${indice};renderizarPestaniasMesHistorial();renderizarListaHistorial()">
      ${mes}
    </button>`
  ).join('');
}

function renderizarListaHistorial() {
  const registros = obtenerDeStorage('registros')
    .filter(r => new Date(r.fecha + 'T12:00:00').getMonth() === mesFiltroHistorial)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (!registros.length) {
    document.getElementById('listaHistorial').innerHTML =
      `<div class="mensajeVacio">Sin registros en ${NOMBRES_MESES[mesFiltroHistorial]}.</div>`;
    return;
  }

  const generarBadgeEnergia = energia => {
    const clase = energia >= 4 ? 'badgeLima' : energia >= 3 ? 'badgeNaranja' : 'badgeRojo';
    return `<span class="badgeHistorial ${clase}">⚡ ${energia}/5</span>`;
  };

  document.getElementById('listaHistorial').innerHTML = registros.map(r => {
    const fecha = new Date(r.fecha + 'T12:00:00');
    return `
      <div class="itemHistorial">
        <div class="fechaItemHistorial">${NOMBRES_DIAS[obtenerDiaDeSemana(fecha)]} ${fecha.getDate()} ${NOMBRES_MESES[fecha.getMonth()]}</div>
        <div class="grupoItemHistorial">${r.grupoMuscular}</div>
        <div class="contenedorBadgesHistorial">
          ${generarBadgeEnergia(r.energia)}
          ${r.fatiga ? `<span class="badgeHistorial ${r.fatiga === 'Alta' ? 'badgeRojo' : r.fatiga === 'Media' ? 'badgeNaranja' : 'badgeGris'}">Fatiga: ${r.fatiga}</span>` : ''}
          ${r.progresion ? `<span class="badgeHistorial ${r.progresion === 'Subí peso' ? 'badgeLima' : r.progresion === 'Bajé peso' ? 'badgeRojo' : 'badgeGris'}">${r.progresion}</span>` : ''}
          ${r.sueno ? `<span class="badgeHistorial badgeAzul">😴 ${r.sueno}</span>` : ''}
          ${r.molestias && r.molestias !== 'Ninguna' ? `<span class="badgeHistorial badgeRojo">⚠ ${r.molestias}</span>` : ''}
        </div>
        ${r.notas ? `<div class="notasItemHistorial">"${r.notas}"</div>` : ''}
      </div>`;
  }).join('');
}

// ── RUTINA: inicialización ────────────────────────────────

function inicializarPantallaRutina() {
  const contenedor = document.getElementById('contenedorRutina');
  if (contenedor.innerHTML.trim()) return; // ya fue renderizado

  contenedor.innerHTML = DATOS_RUTINA.map((diaRutina, indice) => `
    <div class="tarjetaRutinaDia">
      <div class="cabeceraRutinaDia" onclick="toggleAccordionRutina(${indice})">
        <h3 class="tituloRutinaDia">${diaRutina.dia}</h3>
        <span class="badgeGrupoMuscular ${diaRutina.claseColor}">${diaRutina.grupo}</span>
        <span class="flechaRutinaDia" id="flechaRutina-${indice}">▶</span>
      </div>
      <div class="cuerpoRutinaDia" id="cuerpoRutina-${indice}">
        <ul class="listaEjerciciosRutina">
          ${diaRutina.ejercicios.map(ej => `
            <li class="itemEjercicioRutina">
              <span>${ej.nombre}</span>
              <span class="seriesEjercicioRutina">${ej.series}</span>
            </li>`).join('')}
        </ul>
      </div>
    </div>`).join('');
}

function toggleAccordionRutina(indice) {
  const cuerpo  = document.getElementById('cuerpoRutina-' + indice);
  const flecha  = document.getElementById('flechaRutina-' + indice);
  const abierto = cuerpo.classList.toggle('abierto');
  flecha.textContent = abierto ? '▼' : '▶';
}

// ── HOY: valores rápidos por defecto ──────────────────────
// Carga más rápida: el grupo muscular se elige solo según el día y "Ninguna" queda en molestias
const GRUPO_MUSCULAR_POR_DIA = ['Glúteo / Isquios', 'Espalda / Bíceps', 'Cuadriceps / Glúteo', 'Pecho / Tríceps / Hombro', 'Legs Day'];

function aplicarValoresRapidosHoy() {
  const selectGrupo = document.getElementById('selectGrupoMuscular');
  const fecha = new Date((document.getElementById('inputFechaHoy').value || obtenerFechaHoy()) + 'T12:00:00');
  const grupoDelDia = GRUPO_MUSCULAR_POR_DIA[obtenerDiaDeSemana(fecha)];
  if (!selectGrupo.value && grupoDelDia) selectGrupo.value = grupoDelDia;

  if (!estadoRegistroDiario.molestias) {
    const pillNinguna = [...document.querySelectorAll('#grupoPillsMolestias .pill')].find(p => p.textContent.includes('Ninguna'));
    if (pillNinguna) pillNinguna.click();
  }
}

// ── EJERCICIOS: catálogo (grupo muscular → ejercicio → variantes) ──
const CATALOGO_EJERCICIOS = {
  'Piernas / Glúteos': {
    'Hip Thrust':                       ['libre', 'máquina', 'en Smith', 'con banda'],
    'Peso Muerto':                      ['convencional', 'rumano', 'unilateral', 'sumo', 'con mancuernas'],
    'Sentadilla':                       ['libre', 'con mancuerna', 'goblet', 'sin peso', 'en Smith', 'hack', 'sumo', 'búlgara'],
    'Prensa':                           ['pies bajos', 'pies altos', 'cerrada', 'abierta'],
    'Patada de Glúteos':                ['en polea', 'en máquina', 'con banda'],
    'Abductores':                       ['máquina', 'en polea', 'con banda'],
    'Aductores':                        ['máquina', 'en polea'],
    'Isquios':                          ['máquina', 'con mancuerna', 'en polea'],
    'Sillón de Cuadriceps':             ['máquina', 'unilateral'],
    'Elevación de cadera a una pierna': ['sin peso', 'con mancuerna'],
    'Zancadas':                         ['caminando', 'hacia atrás', 'con mancuernas'],
  },
  'Espalda / Bíceps': {
    'Dorsalera':     ['agarre abierto', 'agarre cerrado', 'agarre neutro', 'unilateral'],
    'Remo':          ['bajo con cable', 'con mancuerna', 'con barra', 'en máquina'],
    'Pullover':      ['en polea', 'con mancuerna'],
    'Curl Martillo': ['con mancuernas', 'en polea con cuerda', 'alterno'],
    'Bíceps':        ['con barra W', 'unilateral', 'con mancuernas', 'en polea'],
    'Dominadas':     ['asistidas', 'libres', 'agarre neutro'],
  },
  'Pecho / Tríceps / Hombro': {
    'Aperturas':        ['peck deck', 'con mancuernas', 'en polea'],
    'Press de Banca':   ['con barra', 'con mancuernas', 'en Smith'],
    'Banco Inclinado':  ['con barra', 'con mancuernas', 'en Smith'],
    'Press de Hombros': ['con mancuerna', 'con barra', 'en máquina', 'Arnold'],
    'Vuelos Laterales': ['con mancuernas', 'en polea'],
    'Tríceps Pushdown': ['con barra', 'con cuerda'],
    'Tríceps':          ['francés con mancuerna', 'fondos en banco', 'sobre la cabeza en polea'],
  },
};

const ICONO_GRUPO_EJERCICIO = { 'Piernas / Glúteos': '🍑', 'Espalda / Bíceps': '🔵', 'Pecho / Tríceps / Hombro': '🟠' };

// Cómo se llama cada ejercicio de DATOS_RUTINA dentro del catálogo (ejercicio base + variante)
const EQUIVALENCIA_RUTINA_CATALOGO = {
  'Hip Thrust libre':                          { base: 'Hip Thrust',           variante: 'libre' },
  'Hip Thrust en máquina':                     { base: 'Hip Thrust',           variante: 'máquina' },
  'Peso muerto convencional':                  { base: 'Peso Muerto',          variante: 'convencional' },
  'Peso muerto + unilateral mancuerna':        { base: 'Peso Muerto',          variante: 'unilateral' },
  'Sentadilla búlgara':                        { base: 'Sentadilla',           variante: 'búlgara' },
  'Sentadilla en Smith':                       { base: 'Sentadilla',           variante: 'en Smith' },
  'Sentadilla goblet mancuerna':               { base: 'Sentadilla',           variante: 'goblet' },
  'Sentadilla sumo':                           { base: 'Sentadilla',           variante: 'sumo' },
  'Patada de glúteos':                         { base: 'Patada de Glúteos',    variante: '' },
  'Máquina abductores (cerrado-glúteos)':      { base: 'Abductores',           variante: 'máquina' },
  'Abductores':                                { base: 'Abductores',           variante: '' },
  'Máquina de isquios':                        { base: 'Isquios',              variante: 'máquina' },
  'Sillón de cuadriceps + mantengo + cortas':  { base: 'Sillón de Cuadriceps', variante: '' },
  'Prensa (medio-bajo-cerrado)':               { base: 'Prensa',               variante: '' },
  'Aductores en máquina (abierto)':            { base: 'Aductores',            variante: 'máquina' },
  'Dorsalera pecho agarre abierto':            { base: 'Dorsalera',            variante: 'agarre abierto' },
  'Remo bajo con cable':                       { base: 'Remo',                 variante: 'bajo con cable' },
  'Remo con mancuerna':                        { base: 'Remo',                 variante: 'con mancuerna' },
  'Pullover':                                  { base: 'Pullover',             variante: '' },
  'Curl martillo':                             { base: 'Curl Martillo',        variante: '' },
  'Aperturas Peck Deck':                       { base: 'Aperturas',            variante: 'peck deck' },
  'Press de banca con barra':                  { base: 'Press de Banca',       variante: 'con barra' },
  'Banco inclinado':                           { base: 'Banco Inclinado',      variante: '' },
  'Press de hombros con mancuerna':            { base: 'Press de Hombros',     variante: 'con mancuerna' },
  'Vuelos laterales':                          { base: 'Vuelos Laterales',     variante: '' },
  'Tríceps pushdown en polea':                 { base: 'Tríceps Pushdown',     variante: '' },
};

// Nombres viejos (desplegable anterior) → nombre nuevo "Ejercicio (variante)", para no perder la progresión
const MIGRACION_NOMBRES_EJERCICIOS = {
  'Peso Muerto Convencional': 'Peso Muerto (convencional)',
  'Peso Muerto Unilateral':   'Peso Muerto (unilateral)',
  'Sentadilla Búlgara':       'Sentadilla (búlgara)',
  'Sentadilla en Smith':      'Sentadilla (en Smith)',
  'Sentadilla Goblet':        'Sentadilla (goblet)',
  'Sentadilla Sumo':          'Sentadilla (sumo)',
  'Máquina Abductores':       'Abductores (máquina)',
  'Máquina de Isquios':       'Isquios (máquina)',
  'Remo Bajo con Cable':      'Remo (bajo con cable)',
  'Remo con Mancuerna':       'Remo (con mancuerna)',
  'Bíceps con Barra W':       'Bíceps (con barra W)',
  'Bíceps Unilateral':        'Bíceps (unilateral)',
  'Aperturas Peck Deck':      'Aperturas (peck deck)',
  'Press de Banca':           'Press de Banca (con barra)',
  'Press de Hombros':         'Press de Hombros (con mancuerna)',
};

function migrarNombresEjerciciosAntiguos() {
  if (localStorage.getItem('migracionNombresEjerciciosV1')) return;
  const ejercicios = obtenerDeStorage('ejercicios');
  ejercicios.forEach(e => {
    if (MIGRACION_NOMBRES_EJERCICIOS[e.nombreEjercicio]) e.nombreEjercicio = MIGRACION_NOMBRES_EJERCICIOS[e.nombreEjercicio];
  });
  guardarEnStorage('ejercicios', ejercicios);
  localStorage.setItem('migracionNombresEjerciciosV1', '1');
}

// ── EJERCICIOS: utilidades del catálogo ───────────────────
function escaparHtml(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function obtenerObjetoDeStorage(clave) {
  try { return JSON.parse(localStorage.getItem(clave)) || {}; }
  catch { return {}; }
}

function pedirTextoNuevo(mensaje) {
  const texto = window.prompt(mensaje);
  return texto ? texto.replace(/[()]/g, '').trim().slice(0, 40) : '';
}

function obtenerNombreCompletoEjercicio(base, variante) {
  return variante ? base + ' (' + variante + ')' : base;
}

function obtenerEjerciciosDelGrupo(grupo) {
  const delCatalogo = Object.keys(CATALOGO_EJERCICIOS[grupo] || {});
  const propios = obtenerDeStorage('ejerciciosPersonalizados').filter(e => e.grupo === grupo).map(e => e.base);
  return delCatalogo.concat(propios.filter(nombre => !delCatalogo.includes(nombre)));
}

function buscarEjercicioExistente(nombre) {
  const minuscula = nombre.toLowerCase();
  for (const grupo of Object.keys(CATALOGO_EJERCICIOS)) {
    const encontrado = obtenerEjerciciosDelGrupo(grupo).find(b => b.toLowerCase() === minuscula);
    if (encontrado) return encontrado;
  }
  return '';
}

function obtenerGrupoDeEjercicio(base) {
  return Object.keys(CATALOGO_EJERCICIOS).find(grupo => obtenerEjerciciosDelGrupo(grupo).includes(base)) || '';
}

function obtenerVariantesDeEjercicio(base) {
  const delCatalogo = (CATALOGO_EJERCICIOS[obtenerGrupoDeEjercicio(base)] || {})[base] || [];
  const propias = obtenerObjetoDeStorage('variantesPersonalizadas')[base] || [];
  return delCatalogo.concat(propias.filter(v => !delCatalogo.includes(v)));
}

function guardarEjercicioPersonalizado(grupo, nombre) {
  const existente = buscarEjercicioExistente(nombre);
  if (existente) return existente;
  const lista = obtenerDeStorage('ejerciciosPersonalizados');
  lista.push({ grupo, base: nombre });
  guardarEnStorage('ejerciciosPersonalizados', lista);
  return nombre;
}

function guardarVariantePersonalizada(base, nombre) {
  const existente = obtenerVariantesDeEjercicio(base).find(v => v.toLowerCase() === nombre.toLowerCase());
  if (existente) return existente;
  const propias = obtenerObjetoDeStorage('variantesPersonalizadas');
  propias[base] = (propias[base] || []).concat(nombre);
  guardarEnStorage('variantesPersonalizadas', propias);
  return nombre;
}

function obtenerUltimaVariante(base) { return obtenerObjetoDeStorage('ultimaVariante')[base] || ''; }

function guardarUltimaVariante(base, variante) {
  const ultimas = obtenerObjetoDeStorage('ultimaVariante');
  ultimas[base] = variante;
  guardarEnStorage('ultimaVariante', ultimas);
}

const PALABRAS_SIN_CARGA = ['cinta', 'movilidad', 'abdominales'];

function obtenerEjerciciosConCarga(diaRutina) {
  return diaRutina.ejercicios.filter(ej => !PALABRAS_SIN_CARGA.some(p => ej.nombre.toLowerCase().includes(p)));
}

function obtenerUltimoPesoEjercicio(nombreEjercicio) {
  const previos = obtenerDeStorage('ejercicios')
    .filter(e => e.nombreEjercicio === nombreEjercicio)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  return previos.length ? previos[0].pesoTotalKg : '';
}

// ── EJERCICIOS: selector (grupo → ejercicio → variante) ────
// Se usa en dos lugares: 'suelto' (cargar ejercicio suelto) y 'dia' (agregar a la rutina de hoy)
const estadosSelectorEjercicio = {
  suelto: { grupo: '', base: '', variante: '' },
  dia:    { grupo: '', base: '', variante: '' },
};
const CONTENEDOR_SELECTOR_EJERCICIO = { suelto: 'contenedorSelectorEjercicioSuelto', dia: 'contenedorSelectorEjercicioDia' };

function renderizarSelectorEjercicio(prefijo) {
  const est    = estadosSelectorEjercicio[prefijo];
  const grupos = Object.keys(CATALOGO_EJERCICIOS);

  let html = '<div class="chipsSelector">' + grupos.map((g, i) =>
    `<button type="button" class="chipSelector${g === est.grupo ? ' activo' : ''}" onclick="elegirGrupoSelector('${prefijo}',${i})">${ICONO_GRUPO_EJERCICIO[g] || ''} ${g}</button>`
  ).join('') + '</div>';

  if (est.grupo) {
    html += `<div class="campoFormulario campoSelectorEjercicio"><label>Ejercicio</label>
      <select onchange="elegirEjercicioSelector('${prefijo}', this.value)">
        <option value="">Seleccioná...</option>
        ${obtenerEjerciciosDelGrupo(est.grupo).map(b => `<option value="${escaparHtml(b)}"${b === est.base ? ' selected' : ''}>${escaparHtml(b)}</option>`).join('')}
        <option value="__nuevo__">➕ Crear ejercicio nuevo…</option>
      </select></div>`;
  }

  if (est.base) {
    html += `<div class="campoFormulario campoSelectorEjercicio"><label>Variante</label><div class="chipsSelector">` +
      obtenerVariantesDeEjercicio(est.base).map((v, i) =>
        `<button type="button" class="chipSelector${v === est.variante ? ' activo' : ''}" onclick="elegirVarianteSelector('${prefijo}',${i})">${escaparHtml(v)}</button>`
      ).join('') +
      `<button type="button" class="chipSelector chipNuevo" onclick="elegirVarianteSelector('${prefijo}',-1)">➕ Otra</button></div></div>`;
  }

  document.getElementById(CONTENEDOR_SELECTOR_EJERCICIO[prefijo]).innerHTML = html;
}

function elegirGrupoSelector(prefijo, indiceGrupo) {
  const est = estadosSelectorEjercicio[prefijo];
  est.grupo = Object.keys(CATALOGO_EJERCICIOS)[indiceGrupo];
  est.base = '';
  est.variante = '';
  renderizarSelectorEjercicio(prefijo);
  alCambiarSeleccionSelector(prefijo);
}

function elegirEjercicioSelector(prefijo, valor) {
  const est = estadosSelectorEjercicio[prefijo];
  if (valor === '__nuevo__') {
    const nombre = pedirTextoNuevo('Nombre del ejercicio nuevo:');
    valor = nombre ? guardarEjercicioPersonalizado(est.grupo, nombre) : '';
    if (valor) est.grupo = obtenerGrupoDeEjercicio(valor) || est.grupo;
  }
  est.base = valor;
  est.variante = valor ? obtenerUltimaVariante(valor) : '';
  renderizarSelectorEjercicio(prefijo);
  alCambiarSeleccionSelector(prefijo);
}

function elegirVarianteSelector(prefijo, indice) {
  const est = estadosSelectorEjercicio[prefijo];
  if (indice === -1) {
    const nombre = pedirTextoNuevo('Nombre de la variante (ej: agarre cerrado):');
    if (!nombre) return;
    est.variante = guardarVariantePersonalizada(est.base, nombre);
  } else {
    const variante = obtenerVariantesDeEjercicio(est.base)[indice];
    est.variante = est.variante === variante ? '' : variante; // tocar de nuevo la deselecciona
  }
  renderizarSelectorEjercicio(prefijo);
  alCambiarSeleccionSelector(prefijo);
}

function alCambiarSeleccionSelector(prefijo) {
  if (prefijo === 'suelto') precargarEjercicioSuelto();
}

// Al elegir un ejercicio se precarga lo último que usaste: solo ajustás y guardás
function precargarEjercicioSuelto() {
  const est = estadosSelectorEjercicio.suelto;
  if (!est.base) return;
  const nombre  = obtenerNombreCompletoEjercicio(est.base, est.variante);
  const previos = obtenerDeStorage('ejercicios')
    .filter(e => e.nombreEjercicio === nombre)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  document.getElementById('inputPesoTotalKg').value     = previos.length ? previos[0].pesoTotalKg : '';
  document.getElementById('inputSeriesEjercicio').value = previos.length && previos[0].seriesRep ? previos[0].seriesRep : '4x10';
}

function ajustarCampoNumerico(idCampo, variacion) {
  const campo = document.getElementById(idCampo);
  campo.value = Math.max(0, Math.round(((parseFloat(campo.value) || 0) + variacion) * 100) / 100);
}

// ── EJERCICIOS: rutina del día (armable: variantes, saltear, agregar) ──
let filasRutinaDelDia = [];
let contadorFilasRutinaDelDia = 0;

function crearFilaRutinaDelDia(base, variante, series) {
  contadorFilasRutinaDelDia++;
  return {
    id: contadorFilasRutinaDelDia, base, variante, series,
    pesoKg: obtenerUltimoPesoEjercicio(obtenerNombreCompletoEjercicio(base, variante)),
    hecho: false,
  };
}

function construirFilasDesdeRutina(diaRutina) {
  return obtenerEjerciciosConCarga(diaRutina).map(ej => {
    const equivalencia = EQUIVALENCIA_RUTINA_CATALOGO[ej.nombre] || { base: ej.nombre, variante: '' };
    return crearFilaRutinaDelDia(equivalencia.base, equivalencia.variante, ej.series);
  });
}

function buscarFilaRutina(id) { return filasRutinaDelDia.find(f => f.id === id); }

function renderizarSelectorRutinaDelDia() {
  renderizarSelectorEjercicio('suelto');
  renderizarSelectorEjercicio('dia');

  const selector = document.getElementById('selectRutinaDelDia');
  if (selector.options.length) return; // ya armado: no pisamos lo que estás editando
  selector.innerHTML = DATOS_RUTINA.map((d, i) => `<option value="${i}">${d.dia} — ${d.grupo}</option>`).join('');
  const indiceHoy = obtenerDiaDeSemana(new Date());
  selector.value = indiceHoy < DATOS_RUTINA.length ? indiceHoy : 0;
  cargarRutinaDelDiaSeleccionada();
}

function cargarRutinaDelDiaSeleccionada() {
  const diaRutina = DATOS_RUTINA[parseInt(document.getElementById('selectRutinaDelDia').value)];
  filasRutinaDelDia = construirFilasDesdeRutina(diaRutina);
  renderizarRutinaDelDia();
}

// Si cambiás la fecha (ej: cargás el lunes que te olvidaste), se elige la rutina de ese día
function cambiarRutinaPorFecha() {
  const fecha  = new Date((document.getElementById('inputFechaEjercicios').value || obtenerFechaHoy()) + 'T12:00:00');
  const indice = obtenerDiaDeSemana(fecha);
  if (indice >= DATOS_RUTINA.length) return;
  document.getElementById('selectRutinaDelDia').value = indice;
  cargarRutinaDelDiaSeleccionada();
}

function renderizarRutinaDelDia() {
  const contenedor = document.getElementById('contenedorRutinaDelDia');
  if (!filasRutinaDelDia.length) {
    contenedor.innerHTML = '<div class="mensajeVacio">No quedan ejercicios. Agregá uno o tocá "Restaurar".</div>';
    return;
  }
  contenedor.innerHTML = filasRutinaDelDia.map(fila => {
    const variantes = obtenerVariantesDeEjercicio(fila.base);
    if (fila.variante && !variantes.includes(fila.variante)) variantes.push(fila.variante);
    const opciones = '<option value="">— sin variante —</option>' +
      variantes.map(v => `<option value="${escaparHtml(v)}"${v === fila.variante ? ' selected' : ''}>${escaparHtml(v)}</option>`).join('') +
      '<option value="__otra__">➕ Otra…</option>';
    return `
      <div class="filaRutinaDelDia${fila.hecho ? ' filaMarcada' : ''}" id="filaRutina-${fila.id}">
        <div class="lineaSuperiorFilaRutina">
          <input type="checkbox" class="checkEjercicioRutina" id="checkFila-${fila.id}" ${fila.hecho ? 'checked' : ''} onchange="marcarFilaRutina(${fila.id}, this.checked)"/>
          <span class="nombreRutinaEj">${escaparHtml(fila.base)}</span>
          <button type="button" class="botonQuitarFila" title="Saltear hoy" onclick="quitarFilaRutina(${fila.id})">✕</button>
        </div>
        <div class="lineaInferiorFilaRutina">
          <select class="selectVarianteRutina" onchange="cambiarVarianteFilaRutina(${fila.id}, this.value)">${opciones}</select>
          <div class="controlKg">
            <button type="button" class="botonKg" onclick="ajustarPesoFilaRutina(${fila.id}, -2.5)">−</button>
            <input type="number" class="inputRutinaEj inputKgRutina" id="pesoFila-${fila.id}" value="${fila.pesoKg}" placeholder="kg" min="0" step="0.5" oninput="cambiarPesoFilaRutina(${fila.id}, this.value)"/>
            <button type="button" class="botonKg" onclick="ajustarPesoFilaRutina(${fila.id}, 2.5)">+</button>
          </div>
          <input type="text" class="inputRutinaEj" value="${escaparHtml(fila.series)}" oninput="cambiarSeriesFilaRutina(${fila.id}, this.value)"/>
        </div>
      </div>`;
  }).join('');
}

function marcarFilaRutina(id, valor) {
  const fila = buscarFilaRutina(id);
  if (!fila) return;
  fila.hecho = valor;
  document.getElementById('checkFila-' + id).checked = valor;
  document.getElementById('filaRutina-' + id).classList.toggle('filaMarcada', valor);
}

function cambiarPesoFilaRutina(id, valor) {
  buscarFilaRutina(id).pesoKg = valor === '' ? '' : parseFloat(valor);
  marcarFilaRutina(id, true); // tocar el peso marca el ejercicio como hecho
}

function ajustarPesoFilaRutina(id, variacion) {
  const fila = buscarFilaRutina(id);
  fila.pesoKg = Math.max(0, Math.round(((parseFloat(fila.pesoKg) || 0) + variacion) * 100) / 100);
  document.getElementById('pesoFila-' + id).value = fila.pesoKg;
  marcarFilaRutina(id, true);
}

function cambiarSeriesFilaRutina(id, valor) { buscarFilaRutina(id).series = valor; }

function cambiarVarianteFilaRutina(id, valor) {
  const fila = buscarFilaRutina(id);
  if (valor === '__otra__') {
    const nombre = pedirTextoNuevo('Nombre de la variante (ej: agarre cerrado):');
    valor = nombre ? guardarVariantePersonalizada(fila.base, nombre) : fila.variante;
  }
  fila.variante = valor;
  fila.pesoKg = obtenerUltimoPesoEjercicio(obtenerNombreCompletoEjercicio(fila.base, valor));
  renderizarRutinaDelDia();
}

function quitarFilaRutina(id) {
  filasRutinaDelDia = filasRutinaDelDia.filter(f => f.id !== id);
  renderizarRutinaDelDia();
}

function marcarTodasLasFilasRutina() {
  const todasMarcadas = filasRutinaDelDia.every(f => f.hecho);
  filasRutinaDelDia.forEach(f => { f.hecho = !todasMarcadas; });
  renderizarRutinaDelDia();
}

function agregarEjercicioARutinaDelDia() {
  const est = estadosSelectorEjercicio.dia;
  if (!est.base) return mostrarToast('Elegí el ejercicio a agregar', true);
  filasRutinaDelDia.push(crearFilaRutinaDelDia(est.base, est.variante, '4×10'));
  est.base = '';
  est.variante = '';
  renderizarSelectorEjercicio('dia');
  renderizarRutinaDelDia();
  mostrarToast('✓ Agregado a la rutina de hoy');
}

function guardarRutinaDelDia() {
  const fecha        = document.getElementById('inputFechaEjercicios').value || obtenerFechaHoy();
  const numeroSemana = parseInt(document.getElementById('inputNumeroSemana').value) || 1;
  const guardados    = obtenerDeStorage('ejercicios');
  let cantidadGuardados = 0;

  filasRutinaDelDia.filter(f => f.hecho).forEach(fila => {
    const nombreEjercicio = obtenerNombreCompletoEjercicio(fila.base, fila.variante);
    const pesoTotalKg     = parseFloat(fila.pesoKg) || 0;
    const registro = { fecha, nombreEjercicio, descripcionPeso: pesoTotalKg + ' kg', pesoTotalKg, seriesRep: String(fila.series).trim(), numeroSemana };
    const indiceExistente = guardados.findIndex(e => e.fecha === fecha && e.nombreEjercicio === nombreEjercicio);
    if (indiceExistente > -1) guardados[indiceExistente] = registro;
    else guardados.push(registro);
    guardarUltimaVariante(fila.base, fila.variante);
    cantidadGuardados++;
  });

  if (!cantidadGuardados) return mostrarToast('Marcá al menos un ejercicio', true);
  guardarEnStorage('ejercicios', guardados);
  marcarAsistenciaGymAutomatica(fecha, true);
  mostrarToast('✓ ' + cantidadGuardados + ' ejercicios guardados');
  renderizarProgresionEjercicios();
  actualizarBannerEstadoDia();
}

// ── ESTADO DEL DÍA ────────────────────────────────────────
function yaCompletoEntrenamientoHoy() {
  const hoy = obtenerFechaHoy();
  return obtenerDeStorage('registros').some(r => r.fecha === hoy)
      || obtenerDeStorage('ejercicios').some(e => e.fecha === hoy);
}

function esDiaDeEntrenamiento() {
  return obtenerDiaDeSemana(new Date()) <= 4; // Lun–Vie (igual que tu grilla de asistencia)
}

function actualizarBannerEstadoDia() {
  const banner = document.getElementById('bannerEstadoDia');
  if (!banner) return;
  const completo = yaCompletoEntrenamientoHoy();
  if (completo) {
    banner.className = 'bannerEstadoDia bannerCompleto';
    banner.textContent = '✅ ¡Hoy ya completaste tu rutina!';
  } else if (esDiaDeEntrenamiento()) {
    banner.className = 'bannerEstadoDia bannerPendiente';
    banner.textContent = '⏰ Hoy no completaste tu rutina';
  } else {
    banner.className = 'bannerEstadoDia bannerLibre';
    banner.textContent = '😴 Hoy es día libre';
  }
}

// ── RECORDATORIO DIARIO (Notification API) ────────────────
function obtenerConfigRecordatorio() {
  try { return JSON.parse(localStorage.getItem('recordatorio')) || { activo: false, hora: '20:00', ultimoAviso: '' }; }
  catch { return { activo: false, hora: '20:00', ultimoAviso: '' }; }
}

function sincronizarControlesRecordatorio() {
  const config = obtenerConfigRecordatorio();
  document.getElementById('checkRecordatorioActivo').checked = config.activo;
  document.getElementById('inputHoraRecordatorio').value     = config.hora;
  const textoPermiso = document.getElementById('textoEstadoPermisoNotificacion');
  textoPermiso.textContent = !('Notification' in window)
    ? 'Este navegador no soporta notificaciones.'
    : 'Permiso del navegador: ' + Notification.permission + '. El aviso llega mientras la app esté abierta.';
}

async function alternarRecordatorio(activar) {
  const config = obtenerConfigRecordatorio();
  if (activar && 'Notification' in window && Notification.permission !== 'granted') {
    const permiso = await Notification.requestPermission();
    if (permiso !== 'granted') { activar = false; mostrarToast('Permiso de notificaciones denegado', true); }
  }
  config.activo = activar;
  guardarEnStorage('recordatorio', config);
  sincronizarControlesRecordatorio();
}

function guardarHoraRecordatorio() {
  const config = obtenerConfigRecordatorio();
  config.hora = document.getElementById('inputHoraRecordatorio').value || '20:00';
  config.ultimoAviso = '';
  guardarEnStorage('recordatorio', config);
}

function revisarRecordatorioPendiente() {
  actualizarBannerEstadoDia();
  const config = obtenerConfigRecordatorio();
  if (!config.activo || !('Notification' in window) || Notification.permission !== 'granted') return;
  if (!esDiaDeEntrenamiento() || yaCompletoEntrenamientoHoy()) return;

  const ahora = new Date();
  const horaActual = String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
  if (horaActual >= config.hora && config.ultimoAviso !== obtenerFechaHoy()) {
    new Notification('GymTracker', { body: 'Hoy no completaste tu rutina 💪 ¡Todavía llegás!' });
    config.ultimoAviso = obtenerFechaHoy();
    guardarEnStorage('recordatorio', config);
  }
}

function inicializarRecordatorio() {
  sincronizarControlesRecordatorio();
  revisarRecordatorioPendiente();
  setInterval(revisarRecordatorioPendiente, 30000);
}

// ── Inicialización al cargar la página ───────────────────
migrarNombresEjerciciosAntiguos();
inicializarPantallaHoy();
inicializarRecordatorio();