//==============================
// HORIZON FACTURADOR
//==============================

let productos = [];

let historial =
JSON.parse(localStorage.getItem("historialFacturas")) || [];

let numeroFactura =
parseInt(localStorage.getItem("numeroFactura")) || 1;

//==============================
// AGREGAR PRODUCTO
//==============================

function agregarProducto(){

    const nombre =
    document.getElementById("producto").value.trim();

    const cantidad =
    Number(document.getElementById("cantidad").value);

    const precio =
    Number(document.getElementById("precio").value);

    if(nombre==="" || cantidad<=0 || precio<=0){

        alert("Completa todos los campos");

        return;

    }

    productos.push({

        nombre,
        cantidad,
        precio,
        total:cantidad*precio

    });

    document.getElementById("producto").value="";
    document.getElementById("cantidad").value=1;
    document.getElementById("precio").value="";

    renderProductos();

}

//==============================
// TABLA PRODUCTOS
//==============================

function renderProductos(){

    const lista =
    document.getElementById("listaProductos");

    lista.innerHTML="";

    let total=0;

    productos.forEach((p,index)=>{

        total+=p.total;

        lista.innerHTML+=`

        <tr class="fade">

            <td>${p.nombre}</td>

            <td>${p.cantidad}</td>

            <td>C$${p.precio}</td>

            <td>C$${p.total}</td>

            <td>

                <button
                class="eliminar"
                onclick="eliminarProducto(${index})">

                <i class="fa fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("totalFactura").innerHTML=

    "C$"+total.toLocaleString();

}

//==============================
// ELIMINAR
//==============================

function eliminarProducto(i){

    productos.splice(i,1);

    renderProductos();

}

//==============================
// NUEVA FACTURA
//==============================

function nuevaFactura(){

    productos=[];

    document.getElementById("cliente").value="";
    document.getElementById("telefono").value="";
    document.getElementById("direccion").value="";

    renderProductos();

}

//==============================
// TOTAL
//==============================

function calcularTotal(){

    return productos.reduce((a,b)=>a+b.total,0);

}

//==============================
// GUARDAR VENTA
//==============================

function guardarVenta(){

    if(productos.length===0){

        alert("No hay productos");

        return;

    }

    const venta={

        numero:numeroFactura,

        fecha:new Date().toLocaleString(),

        cliente:document.getElementById("cliente").value,

        telefono:document.getElementById("telefono").value,

        direccion:document.getElementById("direccion").value,

        productos:productos,

        total:calcularTotal()

    };

    historial.push(venta);

    localStorage.setItem(

        "historialFacturas",

        JSON.stringify(historial)

    );

    numeroFactura++;

    localStorage.setItem(

        "numeroFactura",

        numeroFactura

    );

    cargarHistorial();

    alert("Venta guardada correctamente");

}

//==============================
// CARGAR HISTORIAL
//==============================

function cargarHistorial(){

    const tbody=document.getElementById("historial");

    tbody.innerHTML="";

    historial.forEach((venta,index)=>{

        tbody.innerHTML+=`

        <tr>

            <td>${venta.numero}</td>

            <td>${venta.cliente}</td>

            <td>${venta.fecha}</td>

            <td>C$${venta.total.toLocaleString()}</td>

            <td>

                <button
                class="descargar"
                onclick="generarPDF(${index})">

                <i class="fa fa-file-pdf"></i>

                PDF

                </button>

            </td>

        </tr>

        `;

    });

}//==============================
// GENERAR PDF SIN GUARDAR
//==============================

async function generarPDFAux(venta){


if(!window.jspdf){

    alert("No se cargó la librería PDF");
    return;

}


const { jsPDF } = window.jspdf;


const doc = new jsPDF();


const centro = 105;

let y = 18;



//==============================
// LOGO
//==============================

let logo = await cargarLogo("1.jpeg");


if(logo){

    doc.addImage(
        logo,
        "JPEG",
        92,
        y,
        26,
        26
    );

}


y += 35;



//==============================
// TITULO
//==============================

doc.setFont(
    "helvetica",
    "bold"
);

doc.setFontSize(22);


doc.text(
    "HORIZON",
    centro,
    y,
    {
        align:"center"
    }
);



y += 7;



doc.setFont(
    "helvetica",
    "normal"
);

doc.setFontSize(10);


doc.text(
    "Calzado • Ropa • Accesorios",
    centro,
    y,
    {
        align:"center"
    }
);



y += 15;


doc.line(
    20,
    y,
    190,
    y
);



y += 15;



//==============================
// CLIENTE
//==============================

doc.setFontSize(11);


doc.text(
    "Factura #: "+venta.numero,
    20,
    y
);


doc.text(
    "Fecha: "+venta.fecha,
    190,
    y,
    {
        align:"right"
    }
);



y += 9;


doc.text(
    "Cliente: "+(venta.cliente || "Cliente general"),
    20,
    y
);



y += 7;


doc.text(
    "Teléfono: "+(venta.telefono || "-"),
    20,
    y
);



y += 7;


doc.text(
    "Dirección: "+(venta.direccion || "-"),
    20,
    y
);



y += 15;


doc.line(
    20,
    y,
    190,
    y
);



y += 12;



//==============================
// PRODUCTOS
//==============================


doc.setFont(
    "helvetica",
    "bold"
);



doc.text(
    "Producto",
    20,
    y
);


doc.text(
    "Cant.",
    105,
    y
);


doc.text(
    "Precio",
    130,
    y
);


doc.text(
    "Total",
    165,
    y
);



y += 8;



doc.line(
    20,
    y,
    190,
    y
);



y += 10;



doc.setFont(
    "helvetica",
    "normal"
);



venta.productos.forEach(p=>{


    let subtotal = p.cantidad * p.precio;


    doc.text(
        p.nombre.substring(0,25),
        20,
        y
    );


    doc.text(
        String(p.cantidad),
        110,
        y
    );


    doc.text(
        "C$ "+p.precio.toLocaleString("es-ES"),
        130,
        y
    );


    doc.text(
        "C$ "+subtotal.toLocaleString("es-ES"),
        165,
        y
    );


    y += 10;


});



//==============================
// TOTAL
//==============================

y += 5;


doc.line(
    20,
    y,
    190,
    y
);



y += 15;


doc.setFont(
    "helvetica",
    "bold"
);


doc.setFontSize(18);


doc.text(
    "TOTAL: C$ "+venta.total.toLocaleString("es-ES"),
    centro,
    y,
    {
        align:"center"
    }
);



//==============================
// PIE
//==============================

y += 25;


doc.setFont(
    "helvetica",
    "normal"
);


doc.setFontSize(11);


doc.text(
    "¡Gracias por comprar en HORIZON!",
    centro,
    y,
    {
        align:"center"
    }
);



y += 8;


doc.setFontSize(9);

doc.text(
    "WhatsApp: 83606001",
    centro,
    y,
    {
        align:"center"
    }
);

doc.text(
    "Instagram: @horizonwear.of",
    centro,
    y+6,
    {
        align:"center"
    }
);



//==============================
// DESCARGAR
//==============================

doc.save(
    "Factura-HORIZON-"+venta.numero+".pdf"
);


}



//==============================
// CARGAR LOGO
//==============================

function cargarLogo(src){

return new Promise(resolve=>{


    const img = new Image();


    img.src = src;


    img.onload = ()=>resolve(img);


    img.onerror = ()=>resolve(null);


});


}



//==============================
// DESCARGAR FACTURA ACTUAL
//==============================

function descargarFactura(){


if(productos.length===0){

    alert("No hay productos");
    return;

}



let venta={


    numero:numeroFactura,


    fecha:new Date().toLocaleString(),


    cliente:document.getElementById("cliente").value,


    telefono:document.getElementById("telefono").value,


    direccion:document.getElementById("direccion").value,


    productos:[...productos],


    total:calcularTotal()


};



generarPDFAux(venta);


}



//==============================
// ENTER PARA AGREGAR
//==============================

document.addEventListener(
"keydown",
e=>{


if(e.key==="Enter"){


    let activo=document.activeElement.id;


    if(
        activo==="producto" ||
        activo==="cantidad" ||
        activo==="precio"
    ){

        agregarProducto();

    }


}


});

//==============================
// FORMATO MONEDA
//==============================

function moneda(valor){

    return "C$"+Number(valor).toLocaleString();

}

//==============================
// CARGAR AL INICIO
//==============================

window.onload=function(){

    cargarHistorial();

    renderProductos();

};