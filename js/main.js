const container= document.getElementById("container");
let carrito = JSON.parse(localStorage.getItem("misProductos")) || [];

let todasLasExcursiones = [];

//Panel del carrito
const carritoPanel = document.getElementById('carritoPanel');

//Boton Ver Carrito
const btnVerCarrito= document.getElementById("verCarritoBtn");

//Evento sobre el boton "Ver Carrito"
document.addEventListener("DOMContentLoaded", (event) => {
  btnVerCarrito.addEventListener("click", ()=>verCarrito());
});


//boton vaciar Carrito
const btnVaciarCarrito = document.getElementById("vaciarCarritoBtn");
//Evento click sobre el boton "Vaciar Carrito"
btnVaciarCarrito.addEventListener("click", ()=>vaciarCarrito());


fetch("./js/excursiones.json")
    .then(response => response.json())
    .then(data => {
        const excursiones = data;

        excursiones.forEach((el)=>{
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML=`
            <h2 class="item">${el.nombre}</h2>
            <p id="idDestino">Destino: ${el.destino} </p>
            <p id="idPrecio">Precio: $${el.precio}</p>`;

            //Crea el elemento Imagen de la Card
            const imgExcursion = document.createElement("img");
            imgExcursion.src= el.img;
            imgExcursion.className= "imagen"

            //Crea el boton de "Agregar al Carrito"
            const btnAgregar= document.createElement("button");
            btnAgregar.innerText="Agregar al Carrito";
            btnAgregar.className= "btn btn-primary";
            //Evento click sobre el boton "Agregar Carrito"
            btnAgregar.addEventListener('click', () => agregarAlCarrito(el.id));

            //Agrega la imagen y el boton a la Card
            card.appendChild(imgExcursion);
            card.appendChild(btnAgregar);
            //Agrega la Card como hija del Container
            container.appendChild(card);

            todasLasExcursiones.push(el);

})
});
//Funcion para agregar una excursion al carrito

  function agregarAlCarrito(id) {
    // Busca la excursion en el array de excursiones disponibles por su id
    let excursionAgregar = todasLasExcursiones.find(el=> el.id === id);

        if(excursionAgregar.cupo>0){
        // Agrega la excursion al array del carrito
          if(!carrito.some(el => el.id === id)){
        
            carrito.push({
              ...excursionAgregar,
              cantidad:1,
            });

        //Agrega la excursion al localStorage para mantenerlo persistente
            localStorage.setItem("misProductos", JSON.stringify(carrito));

          }else{
          let indice = carrito.findIndex(el => el.id === id);
          carrito[indice].cantidad +=1;

        }
      }else{
            console.log('Excursion sin Cupo');
      }

      let respuesta = "Agregaste " + excursionAgregar.nombre + " al carrito"

      mostrarNotificacion(respuesta);
        
    }



//Funcion que muestra el carrito de compras
  function verCarrito() {

    
    carritoPanel.innerText='';
    carritoPanel.classList.toggle('oculto');
    carritoPanel.style.right = carritoPanel.style.right === '0px' ? '-400px' : '0';

    document.addEventListener('click', function (event) {
      const esDentroDelCarrito = carritoPanel.contains(event.target);
      const esBotonMostrarCarrito = event.target === btnVerCarrito;
    
      if ((!esDentroDelCarrito && !esBotonMostrarCarrito) || carrito.length===0) {
          carritoPanel.classList.add('oculto');
          carritoPanel.style.right = '-400px';
    }  
    });

    cargarCarritoDeCompras();

  }

  //Funcion que confirma la compra
  function confirmarCompra()
    {
      carrito=[];
      localStorage.setItem("misProductos", JSON.stringify(carrito));

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Su compra ha sido realizada exitosamente",
          showConfirmButton: false,
          timer: 1500
      });
               
    }
           
 //Funcion que calcula el total de la compra
  function totalExcursiones(){
            const total = carrito.reduce((acumulador, elemento) => acumulador + (elemento.precio * elemento.cantidad), 0);
            return total;
          }

  //Funcion que vacia el carrito de Compras
  function vaciarCarrito(){

    if(carrito.length >=1){

      Swal.fire({
        title: "¿Esta seguro que desea vaciar el carrito?",
        text: "Se eliminaran las excursiones del carrito!",
        icon: "question",
        showCancelButton: true,
        //confirmButtonColor: "#3085d6",
        //cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        confirmButtonClass: "btn btn-primary",
        cancelButtonClass: "btn btn-secondary"
      }).then((result) => {
        if (result.isConfirmed) {

          carrito=[];
          localStorage.setItem("misProductos", JSON.stringify(carrito));

          Swal.fire({
            title: "Carrito vacio!",
            text: "Se ha vaciado el carrito de compras",
            icon: "success"
          });
        }
      });

    }else
      mostrarNotificacion("No hay excursiones en el carrito");

    }
    //Funcion que elimina una excursion del carrito
    function eliminarDelCarrito(idExcursion){

      let excursionAEliminar = todasLasExcursiones.find(el=> el.id === idExcursion);

      carrito = carrito.filter(item => item.id !== parseInt(idExcursion));

      let mensaje= "Eliminaste " + excursionAEliminar.nombre + " del carrito"

      mostrarNotificacion(mensaje);

      verCarrito();
    }
  //Funcion que muestra las notificaciones
    function mostrarNotificacion(mensaje){

      Toastify({
        text: `${mensaje}`,
        duration: 1000,
    }).showToast();

    }
//Funcion que carga el carrito de compras
    function cargarCarritoDeCompras(){

       //valida si existe alguna excursion en el carrito y carga el listado de excursiones del carrito
    if(carrito.length>=1){

      const tituloCarrito = document.createElement("div");
      tituloCarrito.innerHTML= `<h5>Carrito de compras</h5>`;
      tituloCarrito.className="tituloCarrito";

      carritoPanel.appendChild(tituloCarrito);

      const containerCarrito= document.createElement("div")
      containerCarrito.id="containerCarrito";
      containerCarrito.innerHTML='';

      carritoPanel.appendChild(containerCarrito);

            carrito.forEach((el)=>{
              const card2 = document.createElement("div");
              card2.className = "card2";
  
              card2.innerHTML=`
              <h2 class="itemCarrito">${el.nombre}</h2>
              <h6 id="idDestino">Destino: ${el.destino} </h6>
              <h6 id="idPrecio">Precio: $${el.precio}</h6>
              <h6 id="idCantidad">Cantidad: ${el.cantidad}</h6>`;
  
              //Crea el elemento Imagen de la Card
              const imgExcursion = document.createElement("img");
              imgExcursion.src= el.img;
              imgExcursion.className= "imagenCarrito"

               //Agrega la imagen y el boton a la Card
              card2.appendChild(imgExcursion);

              const btnEliminar = document.createElement("button");
              btnEliminar.innerText="Eliminar";
              btnEliminar.className="btn btn-secondary";

              card2.appendChild(btnEliminar);

              btnEliminar.onclick = () => eliminarDelCarrito(el.id);

              //Agrega la Card como hija del Container
              containerCarrito.appendChild(card2);
                  
            })

    //Agrega un elemento para mostrar el total en $ de las excursiones seleccionadas
        let itemTotal= document.createElement('p');
        itemTotal.innerText=`Total Excursiones: $${totalExcursiones()}`;
        containerCarrito.appendChild(itemTotal);
               
    //Agrega un boton para confirmar la compra
        const btnConfirmarCompra= document.createElement("button");
        btnConfirmarCompra.innerText= "Confirmar Compra"
        btnConfirmarCompra.className="btn btn-primary me-md-2";
        containerCarrito.appendChild(btnConfirmarCompra);
        btnConfirmarCompra.onclick = () => confirmarCompra();
         
    }else
        mostrarNotificacion("No hay excursiones en el carrito");

    }

       

   

    
  


