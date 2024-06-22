"use strict";

async function load_pagina() {
  let current_page = 1;
  let ids = []
  let tabla = document.getElementById("tablaDinamica");

  cargar_tabla(current_page, tabla, ids);

  //boton pagina anterior
  document.getElementById("anterior-pagina").addEventListener("click", () => {
    if (current_page > 1) {
      current_page--;
      cargar_tabla(current_page, tabla, ids);
    }
  });

  //boton pagina siguiente
  document.getElementById("siguiente-pagina").addEventListener("click", () => {
    current_page++;
    cargar_tabla(current_page, tabla, ids);
  });

  let tablaAgregar = document.getElementById("tablaAgregarEvento");
  
  document.getElementById("agregarEvento").addEventListener("click", () => {
    AgregarCamposEventos(tablaAgregar);
  });

  document.getElementById("cargarEventos").addEventListener("click", () => {
    AgregarEventos(tablaAgregar,tabla,ids,current_page);
  });

  document.getElementById("cancelarEvento").addEventListener("click", () => {
    document.getElementById("contenedor-formulario-evento").style.display = "none";
  });


  //filtros
  let filtroNombre = document.getElementById("filtronombre");
  let filtroFecha = document.getElementById("filtrofecha");
  let filtroLugar = document.getElementById("filtrolugar");
  let filtroTematica = document.getElementById("filtrotematica");
  let filtroCostoMenor = document.getElementById("filtrocostomin");
  let filtroCostoMayor = document.getElementById("filtrocostomax");

  filtroNombre.addEventListener("input", filtros);
  filtroFecha.addEventListener("input", filtros);
  filtroLugar.addEventListener("input", filtros);
  filtroTematica.addEventListener("input", filtros);
  filtroCostoMenor.addEventListener("input", filtros);
  filtroCostoMayor.addEventListener("input", filtros);

  function filtros() {
    let tabla = document.getElementById("tablaDinamica");
    let tr = tabla.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td");
      let nombre = td[0].textContent;
      let fecha = td[1].textContent;
      let lugar = td[2].textContent;
      let tematica = td[3].textContent;
      let costo = td[5].textContent;
      if (nombre.toLowerCase().includes(filtroNombre.value.toLowerCase()) && compararfechas(fecha, filtroFecha.value) &&
        lugar.toLowerCase().includes(filtroLugar.value.toLowerCase()) && tematica.toLowerCase().includes(filtroTematica.value.toLowerCase()) &&
        (filtroCostoMenor.value === "" || parseFloat(costo) >= parseFloat(filtroCostoMenor.value)) && (filtroCostoMayor.value === "" || parseFloat(costo) <= parseFloat(filtroCostoMayor.value))) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

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

load_pagina();


async function cargar_tabla(pagina, tabla, ids) {
  tabla.innerHTML = "";
  const api_url = `https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos?page=${pagina}&limit=5`;

  const response = await (await fetch(api_url)).json();

  //cargar tabla
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
    ids.push(response[i].id);
    celdaBorrar.innerHTML = `<button>Borrar</button>`;
    celdaBorrar.addEventListener("click", () => { borrarFila(fila, response[i].id, ids); });
    celdaEditar.innerHTML = `<button>Editar</button>`;
    celdaEditar.addEventListener("click", () => { editar(fila, i, ids, celdaEditar, tabla); });
  }
}

function borrarFila(fila, id, ids) {
  fetch(
    `https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos/${id}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      fila.parentNode.removeChild(fila);
      ids.splice(ids.indexOf(id), 1);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function editar(fila, i, ids, celdaEditar, tabla) {
  let cells = fila.getElementsByTagName("td");
  let eventId = ids[i];
  if (celdaEditar.innerHTML === "<button>Editar</button>") { //editar
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
    console.log("guardar");
    console.log(cells[0].getElementsByTagName("input")[0]);
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
  contenedor.style.display = "block";

  let form = document.getElementById("formulario");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let formulario = new FormData(form);
    let nombre = formulario.get("nombreEvento");
    let fecha = formulario.get("fechaEvento");
    let lugar = formulario.get("lugarEvento");
    let tematica = formulario.get("tematicaEvento");
    let link = formulario.get("sitioEvento");
    let costo = formulario.get("costoEvento");
    console.log(nombre, fecha, lugar, tematica, link, costo);
    // Submit the form
    submitForm(nombre, fecha, lugar, tematica, link, costo);
    form.reset();
  });

  function submitForm(nombre, fecha, lugar, tematica, link, costo) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.textContent = nombre;
    tr.appendChild(td1);

    let td2 = document.createElement("td");
    td2.textContent = fecha;
    tr.appendChild(td2);

    let td3 = document.createElement("td");
    td3.textContent = lugar;
    tr.appendChild(td3);

    let td4 = document.createElement("td");
    td4.textContent = tematica;
    tr.appendChild(td4);

    let td5 = document.createElement("td");
    td5.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
    tr.appendChild(td5);

    let td6 = document.createElement("td");
    td6.textContent = costo;
    tr.appendChild(td6);

    let td7 = document.createElement("td");
    let button = document.createElement("button");
    button.textContent = "Borrar";
    button.addEventListener("click", () => {
      tr.parentNode.removeChild(tr);
    });
    td7.appendChild(button);
    tr.appendChild(td7);

    tabla.appendChild(tr);

    document.getElementById("contenedor-formulario-evento").style.display = "none";
  }
}

async function AgregarEventos(tablaAgregar, tabla,ids,current_page) {
  let trs = tablaAgregar.getElementsByTagName("tr");
  
  for(let i=0; i< trs.length; i++){
    let tds = trs[i].getElementsByTagName("td");
    console.log(tds);
    let nombre = tds[0].textContent;
    let fecha = Math.floor(new Date(tds[1].textContent).getTime() / 1000);
    let lugar = tds[2].textContent;
    let tematica = tds[3].textContent;
    let link = tds[4].getElementsByTagName("a")[0].textContent;
    let costo = parseInt(tds[5].textContent);
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
  tablaAgregar.innerHTML = "";
  cargar_tabla(current_page, tabla, ids);

}
