
let camara;
let foto;
let modelo;
let objetos = [];

function setup() {

    let lienzo = createCanvas(400, 300);
    lienzo.parent("lienzo");

    // Activar camara
    camara = createCapture(VIDEO);
    camara.size(320, 240);
    camara.hide();

    // Cargar inteligencia artificial
    modelo = ml5.objectDetector("cocossd", function() {

        document.getElementById("estado").innerHTML =
            "Inteligencia artificial lista";

        console.log("Red neuronal cargada");

    });

}

function draw() {

    background(230);

    // Mostrar camara o fotografia
    if (foto == null) {
        image(camara, 0, 0, 400, 300);
    } else {
        image(foto, 0, 0, 400, 300);
    }

    // Dibujar cuadros
    for (let i = 0; i < objetos.length; i++) {

        let x = objetos[i].x * 400 / foto.width;
        let y = objetos[i].y * 300 / foto.height;
        let w = objetos[i].width * 400 / foto.width;
        let h = objetos[i].height * 300 / foto.height;

        noFill();
        stroke("green");
        strokeWeight(3);

        rect(x, y, w, h);

        noStroke();
        fill("green");
        textSize(14);

        text(objetos[i].label, x, y - 5);

    }

}

// Tomar fotografia
function tomarFoto() {

    if (modelo == null) {
        alert("Espera a que cargue la IA");
        return;
    }

    if (camara.elt.readyState < 2) {
        alert("Espera a que se active la camara");
        return;
    }

    foto = camara.get();

    objetos = [];

    document.getElementById("estado").innerHTML =
        "Analizando fotografia...";

    modelo.detect(foto, mostrarResultados);

}

// Mostrar resultados
function mostrarResultados(error, resultados) {

    if (error) {
        console.log(error);
        return;
    }

    objetos = resultados;

    let mensaje = "";

    for (let i = 0; i < objetos.length; i++) {

        let nombre = objetos[i].label;
        let porcentaje = (objetos[i].confidence * 100).toFixed(1);

        mensaje += nombre + " - " + porcentaje + "%<br>";

        console.log(nombre, porcentaje + "%");

    }

    document.getElementById("resultado").innerHTML =
        mensaje || "No se reconocieron objetos";

    document.getElementById("estado").innerHTML =
        "Analisis terminado";

}

// Reiniciar
function reiniciar() {

    foto = null;
    objetos = [];

    document.getElementById("resultado").innerHTML =
        "Esperando fotografia...";

    document.getElementById("estado").innerHTML =
        "Camara lista";

}

