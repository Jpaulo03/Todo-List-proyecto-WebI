const inputBuscador = document.querySelector(".agregar-item");
const botonAgregar = document.querySelector(".btn-agregar");
const cajaTareas = document.querySelector(".caja-contenido");
const mensajeVacio = document.querySelector(".mensaje-vacio");
const consejos = document.querySelector(".consejos");

const API_URL = "http://localhost:3000/api/todos";


function mostrarTarea(tarea) {
    if(mensajeVacio) mensajeVacio.style.display = "none";
    if(consejos) consejos.style.display = "none";

    const divTarea = document.createElement("div");
    divTarea.classList.add("tarea-item");
    divTarea.dataset.id = tarea.id;

    divTarea.innerHTML = `
    <button class="btn-completar"></button>
    <span class="texto-tarea">${tarea.title}</span>
    <button class="btn-eliminar">X</button>
    `;

    const btnCompletar = divTarea.querySelector(".btn-completar");
    const btnEliminar = divTarea.querySelector(".btn-eliminar");
    const spanTexto = divTarea.querySelector(".texto-tarea");

    let estadoCompletado = tarea.completed;

    const actualizarEstilos = (completada) => {
        if(completada) {
            spanTexto.style.textDecoration = "line-through";
            spanTexto.style.color = "gray";
            btnCompletar.style.backgroundColor = "#ffd6e9";
        } else {
            spanTexto.style.textDecoration = "none";
            spanTexto.style.color = "#080808";
            btnCompletar.style.backgroundColor = "#ffffff";
        }
    };

    actualizarEstilos(estadoCompletado);

    
    btnCompletar.addEventListener("click", async () => {
        const nuevoEstado = !estadoCompletado;
        
        try {
            const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: nuevoEstado })
            });

            if (respuesta.ok) {
                estadoCompletado = nuevoEstado;
                actualizarEstilos(estadoCompletado);
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    });

    
    btnEliminar.addEventListener("click", async () => {
        try {
            const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
                method: "DELETE"
            });

            if (respuesta.ok) {
                divTarea.remove();
                
                if (cajaTareas.children.length === 2) { 
                    if(mensajeVacio) mensajeVacio.style.display = "block";
                    if(consejos) consejos.style.display = "block";
                }
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    });

    cajaTareas.appendChild(divTarea);
}



async function cargarTareas() {
    try{
        const respuesta = await fetch(API_URL);
        const json = await respuesta.json();

        if(json.data && json.data.length > 0) {
            if(mensajeVacio) mensajeVacio.style.display = "none";
            if(consejos) consejos.style.display = "none";
            
            json.data.reverse() .forEach(tarea => {
                mostrarTarea(tarea);    
            });
        }
    } catch (error) {
        console.error("error al cargar las tareas", error);
    }
}


async function agregarTarea() {
    const nombreTarea = inputBuscador.value.trim();

    if(nombreTarea !== "") {
        try{
            const nuevaTarea = {
                 title: nombreTarea
            };

            const respuesta = await fetch (API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevaTarea)
            });

            const json = await respuesta.json();

            if(respuesta.status === 201) {
                mostrarTarea(json.data);
                inputBuscador.value = ""; 
            } else {
                console.error("Error del servidor", json.error);
                alert("Hubo un error al guardar la tarea");
            }

        } catch (error) {
                console.error("Error de conexion", error);
                alert("No se pudo conectar a la base de datos");
        }
    } else {
        console.log("Campo de texto vacio");
    }
}

botonAgregar.addEventListener("click", agregarTarea);

botonAgregar.addEventListener("keypress", (evento) =>{
    if(evento.key === "Enter") {
        agregarTarea();
    }
});

document.addEventListener("DOMContentLoaded", cargarTareas);