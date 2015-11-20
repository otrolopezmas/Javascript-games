var casillaNegra; //El td donde se encuentra la casilla vacía
var posicionNegra; //La posición (id de td) donde se encuentra la casilla vacía
var casillas; //El conjunto de td's del juego que iniciaremos en la función construirJuego()
var imagenes; //Array con las etiqueta <img> del juego
var dificultad; //Número de fichas que hay en el tablero
var intentos = 0;

/**
 * Función de arranque de juego.
 * 1. Recoge las etiquetas td 
 * 2. Introduce aleatoriamente las imagenes en el array casillas
 * 3. Especificamos que la casilla vacía es aquella con el name 8
 */
function construirJuego(numCasillas) {
    dificultad = numCasillas;
    /**
     * Creamos un array con todas las imágenes de la carpeta que posteriormente
     * desordenaremos.
     */
    imagenes = (function () {
        var array = [];
        for (var i = 0; i < dificultad; i++) {
            var img = document.createElement("img");
            img.src = "../img/rompecabezas/" + numCasillas + "/" + i + ".jpg";
            img.name = i;
            img.onclick = function () {
                mover(this);
            };
            array[i] = img;
        }
        return array;
    }());

    /**
     * Creamos los tr y td necesarios dependiendo de la modalidad de juego.
     */
    var tabla = document.getElementById("tabla");
    for (var i = 0, long = (Math.sqrt(dificultad)); i < long; i++) {
        console.log(long)
        var tr = document.createElement("tr");
        for (var j = 0; j < long; j++) {
            var td = document.createElement("td");
            td.id = (long * i) + j;
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
    casillas = document.getElementsByTagName("td");
    casillaNegra = imagenesAleatorias();
    imagenSolucion();

    document.getElementById("musica").src = (dificultad === 9) ? "../musica/jota.mp3" : "../musica/queen.mp3";

    /**
     * Activación del reloj, pasamos por parámetro
     * el número de minutos del contrarreloj dependiendo
     * del modo de dificultad elegido
     */
    if (document.getElementById("contrarreloj").checked) {
        (dificultad === 9) ? iniciarReloj(3): iniciarReloj(5);
    }
    document.getElementById("cuadroModos").remove();
    document.getElementById("pintentos").style.visibility = "visible";
}

/**
 * Función que asigna a cada td una imagen del array imagenes
 */
function imagenesAleatorias() {
    var booleanos = [];
    var i = 0;
    while (i < dificultad) {
        var numero = Math.round(Math.random() * (dificultad - 1)); //Numero aleatorio entre 0 y 8
        /*
         * Comprobamos que huecos de booleanos[] están
         * vacíos 
         */
        if (typeof booleanos[numero] == "undefined") {
            booleanos[numero] = true;
            if (numero === (dificultad - 1)) posicionNegra = i;
            casillas[i++].appendChild(imagenes[numero]);
        }
    }
    return document.getElementsByName("" + (dificultad - 1) + "")[0];
}

function imagenSolucion() {
    document.getElementById("textoSolucion").innerHTML = "Solución";
    document.getElementById("imgSolucion").src = (dificultad == 9) ? "../img/rompecabezas/basilica.png" : "../img/rompecabezas/queen.png";

}

/*
 * Función general para mover la ficha negra por otra
 * 1. Comprueba si la ficha puede ser movida 
 * 1.1 Se intercambia la casilla clickada por la casilla negra
 * 1.2 Se comprueba si se ha ganado
 */
function mover(elemento) {
    if (adyacencia(elemento.parentNode.id)) {
        document.getElementById("intentos").innerHTML = ++intentos;
        posicionNegra = intercambiar(elemento);
        if (comprobarVictoria()) {
            casillaNegra.src = "../img/rompecabezas/" + dificultad + "/final.jpg"; //Rellenamos el cuadro con la imagen completa
            alert("Has ganado");
            victoria();
        }
    } else {
        alert("Lo sentimos, esa ficha no puede ser movida.");
    }
}

/*
 * Función que comprueba si la casillaElemento se encuentra 
 * en el rango de movimiento de la casilla vacía
 * @param casillaElemento
 */
function adyacencia(casillaElemento) {
    var problema;

    function problemas(objetivo) {
        return parseInt(posicionNegra) === objetivo;
    }
    var aux = parseInt(casillaElemento);

    if (dificultad === 9) {
        switch (aux) {
        case 2:
        case 5:
            problema = problemas(aux + 1);
            break;
        case 3:
        case 6:
            problema = problemas(aux - 1);
            break;
        default:
            problema = false;
            break;
        }
    } else {
        switch (aux) {
        case 4:
        case 9:
        case 14:
        case 19:
            problema = problemas(aux + 1);
            break;
        case 5:
        case 10:
        case 15:
        case 20:
            problema = problemas(aux - 1);
        }
    }

    if (problema) return false;

    var operacion = casillaElemento - posicionNegra;
    return Math.abs(operacion) == 1 || Math.abs(operacion) == (Math.sqrt(dificultad));
}

/*
 * Cambia de posición la casilla clickada por la casilal con la ficha negra
 */
function intercambiar(elemento) {
    var posicion = elemento.parentNode.id; //id del td al que pertenece elemento

    casillas[posicion].removeChild(elemento);
    casillas[posicionNegra].removeChild(casillaNegra);

    casillas[posicionNegra].appendChild(elemento);
    casillas[posicion].appendChild(casillaNegra);

    return posicion;
}

/**
 * Función para comprobar si todas las fichas estan en su
 * correspondiente lugar y por lo tanto has ganado.
 */
function comprobarVictoria() {
    for (var i = 0; i < dificultad; i++) {
        if (casillas[i].id !== casillas[i].childNodes[0].name) return false;
    }
    return true;
}