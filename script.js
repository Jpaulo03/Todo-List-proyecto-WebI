const inputBuscador = document.querySelector(".agregar-item");
const botonAgregar = document.querySelector(".btn-agregar");

const cajaTareas = document.querySelector(".caja-contenido");
const mensajeVacio = document.querySelector(".mensaje-vacio");
const consejos = document.querySelector(".consejos");


function mostrarTarea(textoDeLaTarea) {
    if(mensajeVacio) mensajeVacio.style.display = "none";
    if(consejos) consejos.style.display = "none";

    const divTarea = document.createElement("div");
    divTarea.classList.add("tarea-item");

    divTarea.innerHTML= `
    <button class="btn-completar"></button>
    <span class="texto-tarea">${textoDeLaTarea}</span>
    <button class="btn-eliminar">X</button>
    `;

    cajaTareas.appendChild(divTarea);
}


function agregarTarea() {
    const nombreTarea = inputBuscador.value.trim();

    if(nombreTarea !== "") {
        console.log("Se capturo la tarea: ", nombreTarea);

        mostrarTarea(nombreTarea);

        inputBuscador.value = "";
    } else {
        console.log("Campo de texto vacio")
    }
}

botonAgregar.addEventListener("click", agregarTarea);