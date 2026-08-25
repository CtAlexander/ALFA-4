// ============================================================
// WHORE NIGHT PARTY
// APP.JS
// Firebase Realtime Database
// ============================================================


// ============================================================
// FIREBASE
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    get,
    update,
    query,
    orderByChild,
    equalTo
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ============================================================
// CONFIGURACIÓN FIREBASE
// ============================================================

const firebaseConfig = {

    apiKey: "AIzaSyD323PEV7x7nnBWpMr2usOEEFQQ20YUcD8",

    authDomain: "plataforma-39bde.firebaseapp.com",

    databaseURL:
        "https://plataforma-39bde-default-rtdb.firebaseio.com",

    projectId: "plataforma-39bde",

    storageBucket:
        "plataforma-39bde.appspot.com",

    messagingSenderId: "313253115880",

    appId:
        "1:313253115880:web:fcaf513b16c4f892ae965d",

    measurementId: "G-D959K30F9R"

};


// ============================================================
// INICIALIZAR FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


// ============================================================
// CONFIGURACIÓN DEL EVENTO
// ============================================================

const EVENTO = {

    nombre: "WHORE NIGHT PARTY",

    fecha: "23 de octubre de 2026",

    fechaFirebase: "2026-10-23",

    preventa: 150,

    cover: 200

};


// ============================================================
// ELEMENTOS DEL HTML
// ============================================================

const ticketForm =
    document.getElementById("ticketForm");

const nombreInput =
    document.getElementById("nombre");

const pagoBox =
    document.getElementById("pagoBox");

const submitBtn =
    document.getElementById("submitBtn");

const resultCard =
    document.getElementById("resultCard");

const statusBadge =
    document.getElementById("statusBadge");

const resultTitle =
    document.getElementById("resultTitle");

const keywordElement =
    document.getElementById("keyword");

const resultText =
    document.getElementById("resultText");

const refreshBtn =
    document.getElementById("refreshBtn");

const aceptarReglas =
    document.getElementById("aceptarReglas");


// ============================================================
// VARIABLE DEL BOLETO ACTUAL
// ============================================================

let ticketIdActual = null;

let palabraActual = null;


// ============================================================
// CAMBIAR PREVENTA / COVER
// ============================================================

function actualizarTipo() {

    const tipo =
        document.querySelector(
            'input[name="tipo"]:checked'
        );

    if (!tipo) {
        return;
    }


    if (tipo.value === "preventa") {

        if (pagoBox) {
            pagoBox.classList.remove("hidden");
        }

    } else {

        if (pagoBox) {
            pagoBox.classList.add("hidden");
        }

    }

}


// ============================================================
// ESCUCHAR CAMBIO DE TIPO
// ============================================================

document
    .querySelectorAll('input[name="tipo"]')
    .forEach((radio) => {

        radio.addEventListener(
            "change",
            actualizarTipo
        );

    });


// ============================================================
// EJECUTAR AL CARGAR
// ============================================================

actualizarTipo();


// ============================================================
// GENERAR PALABRA CANDIDATA
// ============================================================

function generarPalabraCandidata() {

    const palabras = [

        "NOCHE",
        "FUEGO",
        "PARTY",
        "HALLOWEEN",
        "DARK",
        "NIGHT",
        "GHOST",
        "SHADOW",
        "RED",
        "BLACK",
        "GOLD",
        "FIESTA",
        "VENOM",
        "SKULL",
        "BLOOD",
        "WITCH",
        "MOON",
        "FIRE",
        "DEVIL",
        "PHANTOM",
        "MYSTERY",
        "HORROR",
        "VAMPIRE",
        "ZOMBIE",
        "CHAOS",
        "DEMON",
        "MIDNIGHT",
        "CEMETERY",
        "SCARY",
        "NIGHTMARE"

    ];


    const base =
        palabras[
            Math.floor(
                Math.random() *
                palabras.length
            )
        ];


    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let codigo = "";


    for (let i = 0; i < 6; i++) {

        codigo +=
            caracteres[
                Math.floor(
                    Math.random() *
                    caracteres.length
                )
            ];

    }


    return `${base}-${codigo}`;

}


// ============================================================
// COMPROBAR SI LA PALABRA YA EXISTE
// ============================================================

async function palabraExiste(palabra) {

    const ticketsRef =
        ref(db, "tickets");


    const palabraQuery =
        query(
            ticketsRef,
            orderByChild("palabra"),
            equalTo(palabra)
        );


    const snapshot =
        await get(palabraQuery);


    return snapshot.exists();

}


// ============================================================
// GENERAR PALABRA ÚNICA
// ============================================================

async function generarPalabraUnica() {

    for (let intento = 0; intento < 100; intento++) {

        const palabra =
            generarPalabraCandidata();


        const existe =
            await palabraExiste(palabra);


        if (!existe) {

            return palabra;

        }

    }


    throw new Error(
        "No se pudo generar una palabra única."
    );

}


// ============================================================
// OBTENER TIPO
// ============================================================

function obtenerTipo() {

    const seleccionado =
        document.querySelector(
            'input[name="tipo"]:checked'
        );


    if (!seleccionado) {

        return null;

    }


    return seleccionado.value;

}


// ============================================================
// OBTENER MÉTODO DE PAGO
// ============================================================

function obtenerMetodoPago() {

    const seleccionado =
        document.querySelector(
            'input[name="metodoPago"]:checked'
        );


    if (!seleccionado) {

        return null;

    }


    return seleccionado.value;

}


// ============================================================
// REGISTRAR BOLETO
// ============================================================

async function registrarBoleto(event) {

    event.preventDefault();


    // --------------------------------------------------------
    // NOMBRE
    // --------------------------------------------------------

    const nombre =
        nombreInput.value.trim();


    if (!nombre) {

        alert(
            "Debes escribir tu nombre."
        );

        nombreInput.focus();

        return;

    }


    // --------------------------------------------------------
    // TIPO
    // --------------------------------------------------------

    const tipo =
        obtenerTipo();


    if (!tipo) {

        alert(
            "Selecciona Preventa o Cover."
        );

        return;

    }


    // --------------------------------------------------------
    // MÉTODO DE PAGO
    // --------------------------------------------------------

    let metodoPago;


    if (tipo === "preventa") {

        metodoPago =
            obtenerMetodoPago();


        if (!metodoPago) {

            alert(
                "Selecciona una forma de pago."
            );

            return;

        }

    } else {

        metodoPago =
            "pago_en_evento";

    }


    // --------------------------------------------------------
    // ACEPTAR REGLAS
    // --------------------------------------------------------

    if (!aceptarReglas) {

        alert(
            "No se encontró la casilla de aceptación de reglas."
        );

        return;

    }


    if (!aceptarReglas.checked) {

        alert(
            "Debes leer y aceptar las reglas de acceso antes de generar tu palabra clave."
        );

        aceptarReglas.focus();

        return;

    }


    // --------------------------------------------------------
    // BLOQUEAR BOTÓN
    // --------------------------------------------------------

    submitBtn.disabled = true;

    submitBtn.textContent =
        "GENERANDO PALABRA...";


    try {


        // ====================================================
        // GENERAR PALABRA ÚNICA
        // ====================================================

        const palabra =
            await generarPalabraUnica();


        // ====================================================
        // PRECIO Y ESTADO
        // ====================================================

        let precio;

        let estado;

        let estadoPago;


        if (tipo === "preventa") {

            precio =
                EVENTO.preventa;

            estado =
                "pendiente";

            estadoPago =
                "pendiente";

        } else {

            precio =
                EVENTO.cover;

            estado =
                "pendiente_pago";

            estadoPago =
                "pendiente_en_evento";

        }


        // ====================================================
        // FECHA
        // ====================================================

        const ahora =
            new Date();


        const fechaRegistro =
            ahora.toISOString();


        // ====================================================
        // CREAR ID FIREBASE
        // ====================================================

        const nuevoTicket =
            push(
                ref(db, "tickets")
            );


        const ticketId =
            nuevoTicket.key;


        // ====================================================
        // DATOS DEL BOLETO
        // ====================================================

        const boleto = {

            id: ticketId,

            nombre: nombre,

            tipo: tipo,

            precio: precio,

            metodoPago: metodoPago,

            palabra: palabra,

            estado: estado,

            estadoPago: estadoPago,

            entradaUtilizada: false,

            cancelado: false,

            reglasAceptadas: true,

            fechaReglasAceptadas:
                fechaRegistro,

            fechaRegistro:
                fechaRegistro,

            evento:
                EVENTO.nombre,

            fechaEvento:
                EVENTO.fechaFirebase

        };


        // ====================================================
        // GUARDAR EN FIREBASE
        // ====================================================

        await set(
            nuevoTicket,
            boleto
        );


        // ====================================================
        // GUARDAR EN EL NAVEGADOR
        // ====================================================

        localStorage.setItem(
            "whoreNightTicketId",
            ticketId
        );


        localStorage.setItem(
            "whoreNightKeyword",
            palabra
        );


        // Variables actuales

        ticketIdActual =
            ticketId;

        palabraActual =
            palabra;


        // ====================================================
        // MOSTRAR BOLETO
        // ====================================================

        mostrarResultado(
            boleto
        );


    } catch (error) {

        console.error(
            "Error creando boleto:",
            error
        );


        alert(
            "No es posible generar tu boleto en este momento. Intenta nuevamente."
        );


    } finally {

        submitBtn.disabled = false;

        submitBtn.textContent =
            "GENERAR MI PALABRA CLAVE";

    }

}


// ============================================================
// MOSTRAR RESULTADO
// ============================================================

function mostrarResultado(boleto) {

    if (!resultCard) {
        return;
    }


    resultCard.classList.remove(
        "hidden"
    );


    if (keywordElement) {

        keywordElement.textContent =
            boleto.palabra || "--------";

    }


    actualizarEstadoVisual(
        boleto
    );


    setTimeout(() => {

        resultCard.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 200);

}


// ============================================================
// ESTADO VISUAL
// ============================================================

function actualizarEstadoVisual(boleto) {

    if (!statusBadge) {
        return;
    }


    statusBadge.className =
        "status";


    // ========================================================
    // CANCELADO
    // ========================================================

    if (
        boleto.cancelado === true ||
        boleto.estado === "cancelado"
    ) {

        statusBadge.classList.add(
            "used"
        );

        statusBadge.textContent =
            "CANCELADO";


        if (resultTitle) {

            resultTitle.textContent =
                "ENTRADA CANCELADA";

        }


        if (resultText) {

            resultText.textContent =
                "Esta palabra clave fue cancelada y no permite el acceso al evento.";

        }


        return;

    }


    // ========================================================
    // ENTRADA UTILIZADA
    // ========================================================

    if (
        boleto.entradaUtilizada === true ||
        boleto.estado === "usado"
    ) {

        statusBadge.classList.add(
            "used"
        );

        statusBadge.textContent =
            "UTILIZADO";


        if (resultTitle) {

            resultTitle.textContent =
                "ENTRADA UTILIZADA";

        }


        if (resultText) {

            resultText.textContent =
                "Esta palabra clave ya fue utilizada para ingresar al evento.";

        }


        return;

    }


    // ========================================================
    // PREVENTA PAGADA
    // ========================================================

    if (
        boleto.tipo === "preventa" &&
        (
            boleto.estado === "pagado" ||
            boleto.estado === "aprobado" ||
            boleto.estadoPago === "pagado"
        )
    ) {

        statusBadge.classList.add(
            "paid"
        );

        statusBadge.textContent =
            "PAGADO";


        if (resultTitle) {

            resultTitle.textContent =
                "PREVENTA APROBADA";

        }


        if (resultText) {

            resultText.textContent =
                "Tu pago de $150 ha sido confirmado. Conserva tu palabra clave y muéstrala al ingresar.";

        }


        return;

    }


    // ========================================================
    // COVER
    // ========================================================

    if (
        boleto.tipo === "cover"
    ) {

        statusBadge.classList.add(
            "pending"
        );

        statusBadge.textContent =
            "PENDIENTE A PAGAR";


        if (resultTitle) {

            resultTitle.textContent =
                "TU PALABRA CLAVE";

        }


        if (resultText) {

            resultText.textContent =
                "No necesitas informar nada previamente sobre el pago. Al llegar al evento, muestra tu palabra clave y nuestro personal te indicará los siguientes pasos. El cover es de $200.";

        }


        return;

    }


    // ========================================================
    // PREVENTA PENDIENTE
    // ========================================================

    statusBadge.classList.add(
        "pending"
    );

    statusBadge.textContent =
        "PENDIENTE";


    if (resultTitle) {

        resultTitle.textContent =
            "TU PALABRA CLAVE";

    }


    if (resultText) {

        resultText.textContent =
            "Tu preventa de $150 está registrada y pendiente de confirmación. Cuando el administrador confirme el pago, tu entrada aparecerá como PAGADO.";

    }

}


// ============================================================
// CARGAR BOLETO GUARDADO
// ============================================================

async function cargarBoletoActual() {

    const id =
        localStorage.getItem(
            "whoreNightTicketId"
        );


    if (!id) {

        return;

    }


    try {

        const ticketRef =
            ref(
                db,
                `tickets/${id}`
            );


        const snapshot =
            await get(ticketRef);


        if (!snapshot.exists()) {

            localStorage.removeItem(
                "whoreNightTicketId"
            );

            localStorage.removeItem(
                "whoreNightKeyword"
            );

            return;

        }


        const boleto =
            snapshot.val();


        ticketIdActual =
            id;

        palabraActual =
            boleto.palabra;


        mostrarResultado(
            boleto
        );


    } catch (error) {

        console.error(
            "Error cargando boleto:",
            error
        );

    }

}


// ============================================================
// ACTUALIZAR ESTADO DEL BOLETO
// ============================================================

async function actualizarEstado() {

    const id =
        ticketIdActual ||
        localStorage.getItem(
            "whoreNightTicketId"
        );


    if (!id) {

        alert(
            "No hay ningún boleto registrado en este dispositivo."
        );

        return;

    }


    try {

        if (refreshBtn) {

            refreshBtn.disabled =
                true;

            refreshBtn.textContent =
                "ACTUALIZANDO...";

        }


        const ticketRef =
            ref(
                db,
                `tickets/${id}`
            );


        const snapshot =
            await get(ticketRef);


        if (!snapshot.exists()) {

            alert(
                "No encontramos tu boleto."
            );

            return;

        }


        const boleto =
            snapshot.val();


        ticketIdActual =
            id;

        palabraActual =
            boleto.palabra;


        mostrarResultado(
            boleto
        );


    } catch (error) {

        console.error(
            "Error actualizando boleto:",
            error
        );


        alert(
            "No fue posible actualizar el estado."
        );


    } finally {

        if (refreshBtn) {

            refreshBtn.disabled =
                false;

            refreshBtn.textContent =
                "ACTUALIZAR ESTADO";

        }

    }

}


// ============================================================
// FORMULARIO
// ============================================================

if (ticketForm) {

    ticketForm.addEventListener(
        "submit",
        registrarBoleto
    );

}


// ============================================================
// BOTÓN ACTUALIZAR
// ============================================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        actualizarEstado
    );

}


// ============================================================
// CARGAR AL INICIAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarBoletoActual();

    }
);