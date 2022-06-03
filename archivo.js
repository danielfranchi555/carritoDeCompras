let carrito = [];

const lista = document.getElementById("miLista");
 renderizarProductos()

 function renderizarProductos(){
   for(let  producto of productos){
    lista.innerHTML+= `<li class="col-sm-3 list-group-item">
            <h3>ID: ${producto.id}</h3>
            <img src=${producto.foto} widht="250" height="150" >
            <p>Producto ${producto.nombre} </p>
            <p><strong> ${producto.precio} Precio  </strong> </p>
            <button class='btn btn-danger' id='btn${producto.id}'>Comprar </button>
        </li>`;
    

   }

   productos.forEach( producto=>{
       document.getElementById(` btn ${producto.id} `).addEventListener("click",function(){
         agregarAlCarrito(producto)
       })
   }

   )


 }

 function agregarAlCarrito(productoNuevo){
   carrito.push (productoNuevo);
   confirm.log (carrito);
   alert("producto " +productoNuevo.nombre+ "agregado al carro" )
   document.getElementById("tabla-body").innerHTML+=`
   <tr>
     <td> ${productoNuevo.id} </td>
     <td>${productoNuevo.nombre}</td>
     <td>${productoNuevo.precio}</td>
   </tr>`
   localStorage.setItem("carrito",JSON.stringify(carrito))
 }