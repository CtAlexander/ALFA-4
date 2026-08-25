// app.js

import { db } from "./firebase-config.js";

import {
  ref,
  push,
  set,
  get,
  query,
  orderByChild,
  equalTo
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ======================================================
// CONFIGURACIÓN DEL EVENTO
// ======================================================

const EVENTO = {
  nombre: "WHORE NIGHT PARTY",
  fecha: "23 de octubre de 2026",
  fechaISO: "2026-10-23",

  preventa: 150,
  cover: 200
};


// ======================================================
// ELEMENTOS DEL HTML
// ======================================================

const ticketForm = document.getElementById("ticketForm");
const nombreInput = document.getElementById("nombre");

const pagoBox = document.getElementById("pagoBox");

const resultCard = document.getElementById("resultCard");
const statusBadge = document.getElementById("statusBadge");
const resultTitle = document.getElementById("resultTitle");
const keywordElement = document.getElementById("keyword");
const resultText = document.getElementById("resultText");

const refreshBtn = document.getElementById("refreshBtn");
const submitBtn = document.getElementById("submitBtn");


// ======================================================
// VARIABLES
// ======================================================

let ticketActualId = null;
let palabraActual = null;


// ======================================================
// MOSTRAR / OCULTAR OPCIONES DE PAGO
// ======================================================

function actualizarTipoBoleto() {

  const tipoSeleccionado = document.querySelector(
    'input[name="tipo"]:checked'
  )?.value;

  if (tipoSeleccionado === "preventa") {

    pagoBox.classList.remove("hidden");

  } else {

    pagoBox.classList.add("hidden");

  }
}


// Escuchar cambios

document.querySelectorAll('input[name="tipo"]').forEach((radio) => {

  radio.addEventListener("change", actualizarTipoBoleto);

});


// Estado inicial

actualizarTipoBoleto();


// ======================================================
// GENERAR PALABRA CLAVE
// ======================================================

function generarPalabra() {

  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numeros = "23456789";

  let palabra = "";

  for (let i = 0; i < 4; i++) {

    palabra += letras[
      Math.floor(Math.random() * letras.length)
    ];

  }

  for (let i = 0; i < 4; i++) {

    palabra += numeros[
      Math.floor(Math.random() * numeros.length)
    ];

  }

  return palabra;

}


// ======================================================
// COMPROBAR SI LA PALABRA YA EXISTE
// ======================================================

async function palabraExiste(palabra) {

  const ticketsRef = ref(db, "tickets");

  const palabraQuery = query(
    ticketsRef,
    orderByChild("palabra"),
    equalTo(palabra)
  );

  const snapshot = await get(palabraQuery);

  return snapshot.exists();

}


// ======================================================
// GENERAR PALABRA ÚNICA
// ======================================================

async function generarPalabraUnica() {

  let palabra;

  let existe = true;

  let intentos = 0;

  while (existe && intentos < 20) {

    palabra = generarPalabra();

    existe = await palabraExiste(palabra);

    intentos++;

  }

  if (existe) {

    throw new Error(
      "No fue posible generar una palabra única."
    );

  }

  return palabra;

}


// ======================================================
// CREAR BOLETO
// ======================================================

async function crearBoleto(nombre, tipo, metodoPago) {

  const palabra = await generarPalabraUnica();

  const ticketRef = push(
    ref(db, "tickets")
  );

  const id = ticketRef.key;

  const precio =
    tipo === "preventa"
      ? EVENTO.preventa
      : EVENTO.cover;


  let estado;

  if (tipo === "preventa") {

    estado = "PENDIENTE";

  } else {

    estado = "PENDIENTE A PAGAR";

  }


  const boleto = {

    id: id,

    nombre: nombre,

    tipo: tipo,

    precio: precio,

    metodoPago:
      tipo === "preventa"
        ? metodoPago
        : "pago_en_evento",

    palabra: palabra,

    estado: estado,

    entrada: "NO UTILIZADA",

    usado: false,

    evento: EVENTO.nombre,

    fechaEvento: EVENTO.fecha,

    fechaEventoISO: EVENTO.fechaISO,

    fechaCreacion: Date.now(),

    fechaActualizacion: Date.now()

  };


  await set(ticketRef, boleto);


  return boleto;

}


// ======================================================
// MOSTRAR RESULTADO
// ======================================================

function mostrarResultado(boleto) {

  ticketActualId = boleto.id;

  palabraActual = boleto.palabra;


  resultCard.classList.remove("hidden");


  keywordElement.textContent = boleto.palabra;


  actualizarEstadoVisual(boleto);


  if (boleto.tipo === "preventa") {

    if (boleto.estado === "PAGADO") {

      resultTitle.textContent = "Boleto pagado";

      resultText.innerHTML =
        "Tu preventa ha sido <b>PAGADA</b>. " +
        "Conserva tu palabra clave para ingresar al evento.";

    } else {

      resultTitle.textContent = "Preventa registrada";

      resultText.innerHTML =
        "Tu boleto está <b>PENDIENTE</b> de autorización del pago.";

    }

  } else {

    resultTitle.textContent = "Tu entrada";

    resultText.innerHTML =
      "Tu palabra clave ha sido generada. " +
      "El pago del cover se realizará en el evento.";

  }


  resultCard.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}


// ======================================================
// ESTADO VISUAL
// ======================================================

function actualizarEstadoVisual(boleto) {

  statusBadge.className = "status";


  if (boleto.estado === "PAGADO") {

    statusBadge.classList.add("paid");

    statusBadge.textContent = "PAGADO";

  }

  else if (boleto.estado === "USADO") {

    statusBadge.classList.add("used");

    statusBadge.textContent = "USADO";

  }

  else {

    statusBadge.classList.add("pending");

    statusBadge.textContent = boleto.estado;

  }

}


// ======================================================
// BUSCAR BOLETO POR ID
// ======================================================

async function obtenerBoleto(id) {

  if (!id) {

    return null;

  }


  const boletoRef = ref(
    db,
    `tickets/${id}`
  );


  const snapshot = await get(boletoRef);


  if (!snapshot.exists()) {

    return null;

  }


  return snapshot.val();

}


// ======================================================
// BOTÓN ACTUALIZAR ESTADO
// ======================================================

refreshBtn.addEventListener("click", async () => {

  if (!ticketActualId) {

    return;

  }


  refreshBtn.disabled = true;

  refreshBtn.textContent = "ACTUALIZANDO...";


  try {

    const boleto = await obtenerBoleto(
      ticketActualId
    );


    if (!boleto) {

      alert(
        "No se encontró el boleto."
      );

      return;

    }


    mostrarResultado(boleto);

  }

  catch (error) {

    console.error(error);

    alert(
      "No fue posible actualizar el estado."
    );

  }

  finally {

    refreshBtn.disabled = false;

    refreshBtn.textContent =
      "ACTUALIZAR ESTADO";

  }

});


// ======================================================
// FORMULARIO
// ======================================================

ticketForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const nombre =
      nombreInput.value.trim();


    const tipo =
      document.querySelector(
        'input[name="tipo"]:checked'
      )?.value;


    const metodoPago =
      document.querySelector(
        'input[name="metodoPago"]:checked'
      )?.value;


    // ----------------------------------------------
    // VALIDACIONES
    // ----------------------------------------------

    if (!nombre) {

      alert(
        "Escribe tu nombre."
      );

      nombreInput.focus();

      return;

    }


    if (!tipo) {

      alert(
        "Selecciona el tipo de boleto."
      );

      return;

    }


    if (
      tipo === "preventa" &&
      !metodoPago
    ) {

      alert(
        "Selecciona una forma de pago."
      );

      return;

    }


    // ----------------------------------------------
    // DESACTIVAR BOTÓN
    // ----------------------------------------------

    submitBtn.disabled = true;

    submitBtn.textContent =
      "GENERANDO...";


    try {

      const boleto = await crearBoleto(
        nombre,
        tipo,
        metodoPago
      );


      mostrarResultado(boleto);


      // Guardar localmente para poder
      // recuperar el boleto posteriormente

      localStorage.setItem(
        "whoreNightTicketId",
        boleto.id
      );

      localStorage.setItem(
        "whoreNightKeyword",
        boleto.palabra
      );


    }

    catch (error) {

      console.error(
        "Error creando boleto:",
        error
      );


      alert(
        "No fue posible generar tu boleto. " +
        "Inténtalo nuevamente."
      );

    }

    finally {

      submitBtn.disabled = false;

      submitBtn.textContent =
        "GENERAR MI PALABRA CLAVE";

    }

  }
);


// ======================================================
// RECUPERAR BOLETO AL RECARGAR
// ======================================================

async function recuperarBoletoAnterior() {

  const id =
    localStorage.getItem(
      "whoreNightTicketId"
    );


  if (!id) {

    return;

  }


  try {

    const boleto =
      await obtenerBoleto(id);


    if (!boleto) {

      return;

    }


    mostrarResultado(boleto);

  }

  catch (error) {

    console.error(
      "Error recuperando boleto:",
      error
    );

  }

}


recuperarBoletoAnterior();