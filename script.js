let carrito = [];
let productosJSON = [];
let dolarCompra;


 window.onload=()=>{
     document.querySelector("#fila_prueba").style.background="red";
     obtenerValorDolar();
  
     document.querySelector("#miSeleccion option[value='pordefecto']").setAttribute("selected", true);
     document.querySelector("#miSeleccion").onchange=()=>ordenar();
 };





function renderizarProductos() {
    //renderizamos los productos 
    console.log(productosJSON)
    for (const prod of productosJSON) {
        document.querySelector(".milista").innerHTML+=(`<li class="col-sm-3 list-group-item">
        <h3>ID: ${prod.id}</h3>
        <img src="${prod.foto}" width="250px" height="250px">
        <p>Producto: ${prod.nombre}</p>
        <p>Precio $ ${prod.precio}</p>
        <p>Precio U$ ${(prod.precio/dolarCompra).toFixed(1)}</p>
        <button class="btn btn-danger" id='btn${prod.id}'>COMPRAR</button>
    </li>`);
    }
    //EVENTOS
    for (const prod of productosJSON) {
         //Evento para cada boton
         document.querySelector(`#btn${prod.id}`).onclick= function() {
            agregarACarrito(prod);
        };
    }
}

class ProductoCarrito {
    constructor(objProd) {
        this.id = objProd.id;
        this.foto = objProd.foto;
        this.nombre = objProd.nombre;
        this.precio = objProd.precio;
        this.cantidad = 1;
    }
}

function agregarACarrito(productoNuevo) {
    let encontrado = carrito.find(p => p.id == productoNuevo.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = new ProductoCarrito(productoNuevo);
        carrito.push(prodACarrito);
        console.log(carrito);
        Swal.fire(
            'Nuevo producto agregado al carro',
            productoNuevo.nombre,
            'success'
        );
        //agregamos una nueva fila a la tabla de carrito
        document.querySelector("#tablabody").innerHTML+=(`
            <tr id='fila${prodACarrito.id}'>
            <td> ${prodACarrito.id} </td>
            <td> ${prodACarrito.nombre}</td>
            <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
            <td> ${prodACarrito.precio}</td>
            <td> <button class='btn btn-light' onclick='eliminar(${prodACarrito.id})'>🗑️</button>`);
    } else {
        //pido al carro la posicion del producto 
        let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
        console.log(posicion);
        carrito[posicion].cantidad += 1;
        //con querySelector falla
        document.getElementById(productoNuevo.id).innerHTML=carrito[posicion].cantidad;
    }
    document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);

}

function calcularTotal() {
    let suma = 0;
    for (const elemento of carrito) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}

function eliminar(id){
    let indice=carrito.findIndex(prod => prod.id==id);
    carrito.splice(indice,1);
    let fila=document.getElementById(`fila${id}`);
    document.getElementById("tablabody").removeChild(fila);
    document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
}

function ordenar() {
    let seleccion = document.querySelector("#miSeleccion").value;
    console.log(seleccion)
    if (seleccion == "menor") {
        productosJSON.sort(function(a, b) {
            return a.precio - b.precio
        });
    } else if (seleccion == "mayor") {
        productosJSON.sort(function(a, b) {
            return b.precio - a.precio
        });
    } else if (seleccion == "alfabetico") {
        productosJSON.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }
    document.querySelector(".milista").innerHTML="";
    renderizarProductos();
}

//GETJSON de productos.json
async function obtenerJSON() {
    const URLJSON="/productos.json"
    const resp=await fetch("productos.json")
    const data= await resp.json()
    productosJSON = data;
    renderizarProductos();
}


//function para obtener el valor del dolar blue en tiempo real
async function obtenerValorDolar() {
    const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/dolarblue";
    const resp=await fetch(URLDOLAR)
    const data=await resp.json()
    document.querySelector("#fila_prueba").innerHTML+=(`<p align="center">Dolar compra: $ ${data.compra}  Dolar venta: $ ${data.venta}</p>`);
    dolarCompra = data.compra;
    obtenerJSON();
}