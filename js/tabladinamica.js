"use strict"

// Inicia las funcionalidad de la pagina de eventos
async function iniciarPagina() {
  let paginaActual = 1;
  let idsEventos = []
  const tablaDinamica = document.getElementById("tabla-dinamica");

  cargarTablaDinamica(paginaActual, tablaDinamica, idsEventos);

  // Boton pagina anterior
  document.getElementById("anterior-pagina").addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      cargarTablaDinamica(paginaActual, tablaDinamica, idsEventos);
    }
  });

  // Boton pagina siguiente
  document.getElementById("siguiente-pagina").addEventListener("click", () => {
    paginaActual++;
    cargarTablaDinamica(paginaActual, tablaDinamica, idsEventos);
  });

  const tablaAgregarEvento = document.getElementById("tabla-agregar-evento");
  
  // Muestra el formulario para cargar un nuevo evento
  document.getElementById("agregar-evento").addEventListener("click", () => {
    AgregarCamposEventos(tablaAgregarEvento);
  });

  // Envia eventos a la mockapi y los agrega a la tabla dinamica
  document.getElementById("cargar-eventos").addEventListener("click", () => {
    agregarEventos(tablaAgregarEvento,tablaDinamica,idsEventos,paginaActual);
  });

  // Oculta el formulario para un nuevo evento
  document.getElementById("cancelar-evento").addEventListener("click", () => {
    document.getElementById("contenedor-formulario-evento").classList.add('hidden');
  });

  // Filtros
  document.querySelectorAll('.filters input').forEach( filter => { filter.addEventListener('input', realizarFiltrado) })
  const filtroNombre = document.getElementById("filtro-nombre");
  const filtroFecha = document.getElementById("filtro-fecha");
  const filtroLugar = document.getElementById("filtro-lugar");
  const filtroTematica = document.getElementById("filtro-tematica");
  const filtroCostoMenor = document.getElementById("filtro-costo-min");
  const filtroCostoMayor = document.getElementById("filtro-costo-max");

  // Realiza el filtrado de los eventos, los que no cumplen los ocultan
  function realizarFiltrado() {
    const eventos = tablaDinamica.getElementsByTagName("tr");
    for (let i = 0; i < eventos.length; i++) {
      let evento = eventos[i].getElementsByTagName("td");
      let nombre = evento[0].textContent;
      let fecha = evento[1].textContent;
      let lugar = evento[2].textContent;
      let tematica = evento[3].textContent;
      let costo = evento[5].textContent;
      if (mostrarFila(nombre, fecha, lugar, tematica, costo)) {
        evento[i].classList.remove('hidden')
      } else {
        evento[i].classList.add('hidden')
      }
    }
  }

  // Verifica si el evento cumple el filtrado
  function mostrarFila(nombre, fecha, lugar, tematica, costo) {
    return (
      nombre.toLowerCase().includes(filtroNombre.value.toLowerCase()) && 
      compararfechas(fecha, filtroFecha.value) &&
      lugar.toLowerCase().includes(filtroLugar.value.toLowerCase()) && 
      tematica.toLowerCase().includes(filtroTematica.value.toLowerCase()) &&
      (filtroCostoMenor.value === "" || parseFloat(costo) >= parseFloat(filtroCostoMenor.value)) && 
      (filtroCostoMayor.value === "" || parseFloat(costo) <= parseFloat(filtroCostoMayor.value))
    )
  }

  // 
  function compararfechas(fecha, filtroFecha) {
    if (filtroFecha === "") {
      return true;
    }
    let f = fecha.split("/");
    let fecha1 = new Date(f[2], f[1] - 1, f[0]);
    let fecha2 = new Date(filtroFecha);
    return fecha1 >= fecha2;
  }
}

// Realiza la carga de la tabla dinamica
async function cargarTablaDinamica(pagina, tabla, idsEventos) {
  tabla.innerHTML = "";
  const api_url = `https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos?page=${pagina}&limit=5`;

  const response = await (await fetch(api_url)).json();

  //Carga la tabla dinamica
  for (let i = 0; i < response.length; i++) {
    let fila = tabla.insertRow(-1);
    let celdanombre = fila.insertCell(0);
    let celdaFecha = fila.insertCell(1);
    let celdaLugar = fila.insertCell(2);
    let celdatematica = fila.insertCell(3);
    let celdalink = fila.insertCell(4);
    let celdaCosto = fila.insertCell(5);
    let celdaBorrar = fila.insertCell(6);
    let celdaEditar = fila.insertCell(7);

    celdanombre.textContent = response[i].nombre;
    const date = new Date(response[i].fecha * 1000);
    const localDate = date.toLocaleDateString();
    celdaFecha.textContent = localDate;
    celdaLugar.textContent = response[i].lugar;
    celdatematica.textContent = response[i].tematica;
    celdalink.innerHTML = `<a href="${response[i].link}" target="_blank">${response[i].link}</a>`;
    celdaCosto.textContent = response[i].costo;
    idsEventos.push(response[i].id);
    celdaBorrar.innerHTML = `<button>Borrar</button>`;
    celdaBorrar.addEventListener("click", () => { borrarEvento(fila, response[i].id, idsEventos); });
    celdaEditar.innerHTML = `<button>Editar</button>`;
    celdaEditar.addEventListener("click", () => { editarEvento(fila, i, idsEventos, celdaEditar, tabla); });
  }
}

// Borra un evento
function borrarEvento(fila, id, idsEventos) {
  fetch(
    `https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos/${id}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then(() => {
      fila.parentNode.removeChild(fila);
      idsEventos.splice(idsEventos.indexOf(id), 1);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Editar un evento
function editarEvento(fila, i, idsEventos, celdaEditar, tabla) {
  let cells = fila.getElementsByTagName("td");
  let eventId = idsEventos[i];
  if (celdaEditar.innerHTML === "<button>Editar</button>") {
    let tableRows = tabla.getElementsByTagName("tr");
    let cells = tableRows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length - 2; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.value = cells[j].textContent;
      cells[j].textContent = "";
      cells[j].appendChild(input);
    }
    celdaEditar.innerHTML = '<button>Guardar</button>';
  } else {
    let body = {
      nombre: cells[0].getElementsByTagName("input")[0].value,
      fecha: Math.floor(new Date(cells[1].getElementsByTagName("input")[0].value).getTime() / 1000),
      lugar: cells[2].getElementsByTagName("input")[0].value,
      tematica: cells[3].getElementsByTagName("input")[0].value,
      link: cells[4].getElementsByTagName("input")[0].value,
      costo: cells[5].getElementsByTagName("input")[0].value
    };
    fetch(`https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        cells[0].textContent = data.nombre;
        const date = new Date(data.fecha * 1000);
        const localDate = date.toLocaleDateString();
        cells[1].textContent = localDate;
        cells[2].textContent = data.lugar;
        cells[3].textContent = data.tematica;
        cells[4].innerHTML = `<a href="${data.link}" target="_blank">${data.link}</a>`;
        cells[5].textContent = data.costo;
        celdaEditar.innerHTML = '<button>Editar</button>';
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function AgregarCamposEventos(tabla) {
  let contenedor = document.getElementById("contenedor-formulario-evento");
  contenedor.classList.remove("hidden");

  let formNuevoEvento = document.getElementById("form-nuevo-evento");

  // Evento al enviar el formulario de nuevo evento
  formNuevoEvento.addEventListener("submit", (event) => {
    event.preventDefault();
    const formulario = new FormData(formNuevoEvento);
    const nombre = formulario.get("nombre-evento");
    const fecha = formulario.get("fecha-evento");
    const lugar = formulario.get("lugar-evento");
    const tematica = formulario.get("tematica-evento");
    const link = formulario.get("sitio-evento");
    const costo = formulario.get("costo-evento");
    submitForm(nombre, fecha, lugar, tematica, link, costo);
    formNuevoEvento.reset();
  });

  // Carga el nuevo evento en la tabla de nuevos eventos, para que luego se cargue en la mockapi
  function submitForm(nombre, fecha, lugar, tematica, link, costo) {
    const nuevoEvento = document.createElement("tr");
    const nombreNuevoEvent = document.createElement("td");
    nombreNuevoEvent.innerHTML = nombre;
    nuevoEvento.appendChild(nombreNuevoEvent);

    const fechaNuevoEvento = document.createElement("td");
    fechaNuevoEvento.innerHTML = fecha;
    nuevoEvento.appendChild(fechaNuevoEvento);

    const lugarNuevoEvento = document.createElement("td");
    lugarNuevoEvento.innerHTML = lugar;
    nuevoEvento.appendChild(lugarNuevoEvento);

    const tematicaNuevoEvento = document.createElement("td");
    tematicaNuevoEvento.innerHTML = tematica;
    nuevoEvento.appendChild(tematicaNuevoEvento);

    const paginaNuevoEvento = document.createElement("td");
    paginaNuevoEvento.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
    nuevoEvento.appendChild(paginaNuevoEvento);

    const costoNuevoEvento = document.createElement("td");
    costoNuevoEvento.innerHTML = costo;
    nuevoEvento.appendChild(costoNuevoEvento);

    const borrarNuevoEvento = document.createElement("td");
    const btnBorrar = document.createElement("button");
    btnBorrar.innerHTML = "Borrar";
    btnBorrar.addEventListener("click", () => {
      nuevoEvento.parentNode.removeChild(tr);
    });
    borrarNuevoEvento.appendChild(btnBorrar);
    nuevoEvento.appendChild(borrarNuevoEvento);

    tabla.appendChild(nuevoEvento);

    document.getElementById("contenedor-formulario-evento").classList.add('hidden');
  }
}

// Realiza la carga de los nuevos eventos en la tabla dinamica y en la mockapi
async function agregarEventos(tablaAgregarEvento, tabla, idsEventos, paginaActual) {
  let eventosNuevos = tablaAgregarEvento.getElementsByTagName("tr");
  
  for(let i=0; i< eventosNuevos.length; i++){
    let eventoNuevo = eventosNuevos[i].getElementsByTagName("td");
    let nombre = eventoNuevo[0].textContent;
    let fecha = Math.floor(new Date(eventoNuevo[1].textContent).getTime() / 1000);
    let lugar = eventoNuevo[2].textContent;
    let tematica = eventoNuevo[3].textContent;
    let link = eventoNuevo[4].getElementsByTagName("a")[0].textContent;
    let costo = parseInt(eventoNuevo[5].textContent);
    let body = {
      nombre: nombre,
      fecha: fecha,
      lugar: lugar,
      tematica: tematica,
      link: link,
      costo: costo,
    };
    try {
      const response = await fetch("https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
      } else {
        throw new Error("Error: " + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  }
  tablaAgregarEvento.innerHTML = "";
  cargarTablaDinamica(paginaActual, tabla, idsEventos);

}

iniciarPagina();