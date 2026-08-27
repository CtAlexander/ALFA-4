// ============================================================
// WHORE NIGHT PARTY
// app.js
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    get,
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
// VARIABLES
// ============================================================

let ticketIdActual = null;

let palabraActual = null;


// ============================================================
// MOSTRAR / OCULTAR PAGO
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

            pagoBox.classList.remove(
                "hidden"
            );

        }

    } else {

        if (pagoBox) {

            pagoBox.classList.add(
                "hidden"
            );

        }

    }

}


// ============================================================
// CAMBIO PREVENTA / COVER
// ============================================================

document
    .querySelectorAll(
        'input[name="tipo"]'
    )
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
// GENERADOR DE PALABRA
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
// COMPROBAR SI PALABRA EXISTE
// ============================================================

async function palabraExiste(palabra) {

    const ticketsRef =
        ref(
            db,
            "tickets"
        );


    const palabraQuery =
        query(
            ticketsRef,
            orderByChild("palabra"),
            equalTo(palabra)
        );


    const snapshot =
        await get(
            palabraQuery
        );


    return snapshot.exists();

}


// ============================================================
// GENERAR PALABRA ÚNICA
// ============================================================

async function generarPalabraUnica() {

    for (
        let intento = 0;
        intento < 100;
        intento++
    ) {

        const candidata =
            generarPalabraCandidata();


        const existe =
            await palabraExiste(
                candidata
            );


        if (!existe) {

            return candidata;

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
            "Debes leer y aceptar las reglas antes de continuar."
        );

        aceptarReglas.focus();

        return;

    }


    // --------------------------------------------------------
    // DESACTIVAR BOTÓN
    // --------------------------------------------------------

    submitBtn.disabled = true;

    submitBtn.textContent =
        "REGISTRANDO...";


    try {


        // ====================================================
        // GENERAR PALABRA ÚNICA
        // ====================================================

        const palabra =
            await generarPalabraUnica();


        // ====================================================
        // ESTADOS
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

        const fechaRegistro =
            new Date().toISOString();


        // ====================================================
        // CREAR TICKET
        // ====================================================

        const nuevoTicket =
            push(
                ref(
                    db,
                    "tickets"
                )
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
        // GUARDAR EN LOCALSTORAGE
        // ====================================================

        localStorage.setItem(
            "whoreNightTicketId",
            ticketId
        );


        localStorage.setItem(
            "whoreNightKeyword",
            palabra
        );


        ticketIdActual =
            ticketId;


        palabraActual =
            palabra;


        // ====================================================
        // MOSTRAR RESULTADO
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
// ACTUALIZAR ESTADO VISUAL
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


        if (keywordElement) {

            keywordElement.textContent =
                "--------";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "ENTRADA CANCELADA";

        }


        if (resultText) {

            resultText.textContent =
                "Esta entrada fue cancelada y la palabra clave no permite el acceso al evento.";

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


        if (keywordElement) {

            keywordElement.textContent =
                boleto.palabra || "--------";

        }


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
        boleto.estado === "pagado" &&
        boleto.estadoPago === "pagado"
    ) {

        statusBadge.classList.add(
            "paid"
        );

        statusBadge.textContent =
            "PAGADO";


        // AQUÍ SE REVELA LA PALABRA

        if (keywordElement) {

            keywordElement.textContent =
                boleto.palabra;

        }


        if (resultTitle) {

            resultTitle.textContent =
                "TU PALABRA CLAVE";

        }


        if (resultText) {

            resultText.textContent =
                "Tu pago de $150 fue confirmado. Conserva esta palabra clave y muéstrala al ingresar al evento.";

        }


        return;

    }


    // ========================================================
    // PREVENTA PENDIENTE
    // ========================================================

    if (
        boleto.tipo === "preventa"
    ) {

        statusBadge.classList.add(
            "pending"
        );

        statusBadge.textContent =
            "PAGO PENDIENTE";


        // NO SE REVELA LA PALABRA

        if (keywordElement) {

            keywordElement.textContent =
                "🔒 PENDIENTE";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "PALABRA CLAVE PENDIENTE";

        }


        if (resultText) {

            resultText.innerHTML = `
                <strong>Tu solicitud de preventa por $150 fue registrada correctamente.</strong>
                <br><br>

                La palabra clave todavía no está disponible.
                <br><br>

                <strong>La palabra clave se mostrará automáticamente cuando nuestro equipo confirme tu pago.</strong>
                <br><br>

                Para realizar tu pago por transferencia o efectivo,
                envía mensaje a alguno de estos usuarios:
                <br><br>

                <strong>@al3xander_ct</strong><br>
                <strong>@o_morenx</strong><br>
                <strong>@mxian__247</strong><br>
                <strong>@hxo_sxnnt</strong>
                <br><br>

                Una vez confirmado el pago, tu estado cambiará a
                <strong>PAGADO</strong>
                y podrás consultar tu palabra clave desde esta página.
            `;

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


        // COVER SÍ MUESTRA PALABRA

        if (keywordElement) {

            keywordElement.textContent =
                boleto.palabra;

        }


        if (resultTitle) {

            resultTitle.textContent =
                "TU PALABRA CLAVE";

        }


        if (resultText) {

            resultText.innerHTML = `
                Tu palabra clave ha sido registrada correctamente.
                <br><br>

                <strong>No necesitas informar previamente sobre el pago de tu entrada.</strong>
                <br><br>

                Al llegar al evento, muestra tu palabra clave
                mediante una captura o directamente desde esta página.
                Nuestro personal te indicará los siguientes pasos.
                <br><br>

                El cover tiene un costo de
                <strong>$200</strong>.
                <br><br>

                Lleva tu teléfono con batería y datos o Internet
                por si necesitas consultar tu palabra clave.
            `;

        }


        return;

    }


    // ========================================================
    // ESTADO DESCONOCIDO
    // ========================================================

    statusBadge.classList.add(
        "pending"
    );

    statusBadge.textContent =
        "PENDIENTE";


    if (keywordElement) {

        keywordElement.textContent =
            "--------";

    }


    if (resultTitle) {

        resultTitle.textContent =
            "BOLETO PENDIENTE";

    }


    if (resultText) {

        resultText.textContent =
            "Tu boleto está registrado y pendiente de actualización.";

    }

}


// ============================================================
// CARGAR BOLETO DEL USUARIO
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
            await get(
                ticketRef
            );


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
// ACTUALIZAR ESTADO
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
            await get(
                ticketRef
            );


        if (!snapshot.exists()) {

            alert(
                "No encontramos tu boleto en Firebase."
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
// CARGAR BOLETO AL ABRIR LA PÁGINA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarBoletoActual();

    }
);
