var buques_obj=0,bodegas_obj=0,tier_obj=0; // OBJETOS DONDE ALMACENAN TABLAS DE LA BASE DE DATOS
var ROTACION_buque; //ROTACION DEL BUQUE SELECCIONADO
var Linga; // OBJET ARRAY QUE ALMACENA TODAS LAS LINGAS DE ESTA ROTACION
var seleccion=0;  // ON-OFF DEL BOTON SELECCION
// var doc = new jsPDF();

$(document).ready(function(){
   ROTACION_buque=pasarVariables(); //RESCATAR VARIABLE DE ROTACION
   $("#nave").html(ROTACION_buque);
   buscar_lingas(ROTACION_buque, buscar_tier_bodegas); // LINGAS DE LA ROTACION ALMACENADAS EN LINGAS
   nombre_buque(ROTACION_buque); // SE BUSCA EL NOMBRE DEL BUQUE DE ESA ROTACION

});

function imprimir_ratita(){

  window.location='../paginas/imprimir_ordenamiento.php?rot='+ROTACION_buque;
  $("#cargando_pdf").css("display","block");
  $("#container").animate({
      opacity:0.2,
    },100,function (){
    $("#cargando_pdf").animate({
        opacity:1,
      },100,function (){
        $("#cargando_text").animate({
            opacity:1,
          },200,function(){

          });

    });
  console.log("IMmmm");
});
}

// RETORNA VARIABLE CON LA ROTACION ENTREGADA POR EL LINK
function pasarVariables() {
  cadVariables = location.search.substring(1,location.search.length); //VARIABLES EN EL LINK
  arrVariables = cadVariables.split("&");
  for (i=0; i<arrVariables.length; i++) {
    arrVariableActual = arrVariables[i].split("=");
  }
  return (arrVariableActual[1]);
}

function buscar_lingas(ROTACION,callback){
  $.ajax({
     type:"POST",
     url:"funciones_listar_estiba.php",
      data:{"opcion":2,"ROTACION":ROTACION},
     datatype:"json",
  }).done(function(info){
      Linga=JSON.parse(info);
      console.log("1");
  }).error(function(){
  });
  setTimeout(function() {
       callback(ROTACION_buque,dibujar_tier); // function buscar_tier_bodegas
   },200)
}

function buscar_tier_bodegas(ROTACION,callback){
  $.ajax({
     type:"POST",
     url:"funciones_listar_estiba.php",
      data:{"opcion":3,"ROTACION":ROTACION},
     datatype:"json",
     complete:callback
  }).done(function(info){
      tier_obj=JSON.parse(info); // GUARDA DATOS DE LOS TIER DE LA NAVE EN LA VARIABLE GLOBAL
  }).error(function(){
  });
}

//DIBUJA TODOS LOS TIER DE LA NAVE DE LA ROTACION SELECCIONADA
function dibujar_tier(){

  var aux=0;
  var padre=$("#ordenamientos"); // CONTENEDOR DE TODOS LOS TIER Y TABLAS
    for(var i=0;i<tier_obj.length;i++){ // tier_obj = OBJETO CONTENEDOR DE TODOS LOS TIER DE LA NAVE
      if(i==0) {  // PRIMER CASO
          aux=tier_obj[0].id_bodega;
          aux=tier_obj[i].id_bodega;
          var titulo1= $("<h4 id='bodega' > BODEGA "+tier_obj[i].num_bodega+"</h4>");
            padre.append(titulo1);
      }
      if(aux!=tier_obj[i].id_bodega){
            aux=tier_obj[i].id_bodega;
            var titulo1= $("<h4 id='bodega' > BODEGA "+tier_obj[i].num_bodega+"</h4>");
              padre.append(titulo1);
      }

      // DIV CONTENEDOR DEL TITULO, TABLA DE DATOS Y TIER
        var tier_div= $("<div class='orden_tier_div'></div>");
           padre.append( tier_div );

      // DIV CON EL TITULO Y LA TABLA VACIA
        var titulo2= $("<div id='div"+tier_obj[i].id_tier+"'><h4 id='tier'> M/N. "+tier_obj[i].nombre+" ARROW . . . . .HOLD Nº "+tier_obj[i].num_bodega+" </h4><table  class='table table-bordered dat'></table></div>");
          tier_div.append( titulo2 );

      // DIV CON EL TIER Y SUS DIMENSIONES
        var dibujo_tier=$("<div class='dibujo1_tier'></div>");

                //DIV DEL RECTANGULO QUE SIMuLA UN TIER

                // LARGO AL LADO DERECHO DEL TIER
                  var largo_tier=$("<div class='largo_tier'><p>"+tier_obj[i].largo+" mts</p></div>");
                    dibujo_tier.append( largo_tier );

                // EL ID DEL DIV, SERA EL ID DEL TIER EN LA BASE DE DATOS
                  var cuadrado_tier=$("<div class='dibujo_tier' id="+tier_obj[i].id_tier+"></div>");
                    dibujo_tier.append( cuadrado_tier );

                // ANCHO DEBAJO DEL TIER
                  var ancho_tier=$("<div class='ancho_tier'><p>"+tier_obj[i].ancho+" mts</p></div>");
                    dibujo_tier.append( ancho_tier );

          tier_div.append( dibujo_tier );
    }

    datos_tier(); // ASIGNAR DATOS A LA TABLE DE CADA TIER
}

// DIBUJA TODAS LAS LINGAS DE LA ROTACION EN SU RESPECTIVO TIER.
function dibujar_lingas_tier(){
        for(var i=0;i<Linga.length;i++){
            var padre=$("#"+Linga[i].id_tier); // SELECCIONO EL TIER PADRE
            var left=padre.position().left;
            var top=padre.position().top;

            // ASIGNAR CLASE RESPECTO A SU GIRO
                if(Linga[i].giro=="0"){
                      var linga_tier=$("<div><p class='cant_unit_sin_giro'>"+Linga[i].cantidad+"</p></div>");
                }else{
                    var linga_tier=$("<div><p class='cant_unit_con_giro'>"+Linga[i].cantidad+"</p></div>");
                }

           // ASIGNAR MARCA SEGUN EMPRE

           if(Linga[i].marca==1){

                if(Linga[i].company == "ARAUCO"){
                  var marca=$("<img src='../imagenes/marcas/ARAUCO/"+Linga[i].marca_arauco+".png' width='18px'>");
                }
                if(Linga[i].company == "CMPC"){
                  var marca=$("<img src='../imagenes/marcas/CMPC/"+Linga[i].marca_cmpc+".png' width='18px'>");
                }
            }
            // ESTILOS DE LA IMAGEN DE LA MARCA
            $(marca).css({
              "position":"absolute",
              "top":4,
              "left":4
            });

            // ESTILOS DE A LINGA
            $(linga_tier).css({
              "position":"absolute",                                      // YA QUE SU POSITION ES ABSOLUTE
                "top":(parseFloat(Linga[i].posx)+parseFloat(top))+"px",   //SE ASIGNA POSICION RESPECTO
                "left":(parseFloat(Linga[i].posy)+parseFloat(left))+"px", // AL DOCUMENT
                "width":Linga[i].ancho,
                "height":Linga[i].alto,
                "text-align":"center",
                "outline": "1px solid"  // BORDE HACIA DENTRO
            });
            linga_tier.append(marca);
            padre.append(linga_tier);
                marca="";
        }
}


function nombre_buque(rotacion){

      $.ajax({
          type:"POST",
          url:"funciones_listar_estiba.php",
          data:{"opcion":4,"ROTACION":rotacion},
          datatype:"json"
      }).done(function(info){
          var nombre=JSON.parse(info);
          $("#nombre").text(' " '+nombre.NOMBRE+' ARROW "');  // NOMBRE EN EL TITULO
      }).error(function(){
          alert("No se han podido cargar los datos");
      });

}

function solo_tier_con_carga(){
  if(seleccion==0){
    $("#select").text("DESELECCIONAR");
    $(".dibujo_tier").parent().parent().css("display","none");
      for(var i=0;i<Linga.length;i++){
          $("#"+Linga[i].id_tier).empty(); // SE BORRAN LAS LINGAS DIBUJADAS
          $("#"+Linga[i].id_tier).parent().parent().css("display","block");
          seleccion=1; // QUEDA SELECCIONADO
      }
    dibujar_lingas_tier(); // SE DIBUJAN NUEVAMENTE EN LA NUEVA POSICION
                          //QUE TENDRA EL TIER EN EL DOCUMENT

  }else if(seleccion==1){
        $(".dibujo_tier").parent().parent().css("display","block");
        $(".dibujo_tier").empty();
        $("#select").text("SELECCIONAR");
      dibujar_lingas_tier();
      seleccion=0; // SE DESELECCIONA
  }
}

function datos_tier(){
  var linga_temp=[]; // ARRAY AUXILIAR
    for (var i = 0; i < tier_obj.length; i++) {
        for (var j = 0; j < Linga.length; j++) {
            if(tier_obj[i].id_tier==Linga[j].id_tier){
              linga_temp.push(Linga[j]); // SE GUARDAN LINGAS DE UN TIER A LA VEZ
            }
        }
        insert_datos_tier(linga_temp);
        var tam_obj=  (linga_temp.length);
        linga_temp.splice(0,tam_obj); // INICIALIZA ARRAY linga_temp
    }
      dibujar_lingas_tier(); // DIBUJA TIER DE LAS LINGAS
}

function insert_datos_tier(newLinga){
  var array_destinos=cantidad_destinos(newLinga);
  var cant_unit=0;
  var peso_emb=0;
  var peso_total=0;
  var destino;
  var padre,hijo;
  var total_unit=0;
  var marca=0;
  var empresa=0;
    for (var i = 0; i < array_destinos.length; i++) {
            var array_emb=cantidad_embarcadores(array_destinos[i],newLinga);
            var nom_destino=buscar_nombre_destino(array_destinos[i],newLinga);
            colocar_destino_tier(nom_destino,newLinga[0].id_tier,newLinga[0].nivel); // AGREGA FILA CON DESTINO
        for (var j = 0; j < array_emb.length; j++) {
            for (var k = 0; k < newLinga.length; k++) {
                if(newLinga[k].id_destino==array_destinos[i] && newLinga[k].id_unit==array_emb[j]){
                    cant_unit=parseInt(newLinga[k].cantidad)+cant_unit;

                    company=newLinga[k].company;
                    if(company=="ARAUCO") {
                        marca=newLinga[k].marca_arauco;
                    }else{
                      marca=newLinga[k].marca_cmpc;
                    }

                    peso_emb=parseFloat(newLinga[k].peso)+parseFloat(peso_emb);
                }
            }
            total_unit=  cant_unit + total_unit;
              var nombre_embarcador=buscar_nombre_emb(array_emb[j],newLinga);

            // AGREGA FILA CON LOS EMBARCADORES
             colocar_embarcador_tier(cant_unit,nombre_embarcador,newLinga[0].id_tier,marca,company,peso_emb);
            cant_unit=0;
            marca=0;
            company=0;
            peso_total=peso_emb+peso_total;
            peso_emb=0;
        }
        padre = $("#div"+newLinga[0].id_tier+" > table ");  // SELECCION TABLA DEL TIER CORRESPONDIENTE
        hijo =  $("<tr class='danger'><th>TOTAL UNIT</th><th>"+total_unit+" Units</th><th colspan='2'>"+parseFloat(peso_total.toFixed(3))+" Tns</th><tr>");
    }
  $(padre).append(hijo);
}

// DEVUELVE ARRAY CON LOS ID DE LOS DESTINOS DEL TIER SEECCIONADO
function cantidad_destinos(array){
  var destinos= new Array();
      if( array.length > 0 ){
         destinos.push( array[0].id_destino );
         var aux = array[0].id_destino;
            for (var i = 1; i < array.length; i++) {
                  if( array[i].id_destino != aux ){
                    destinos.push( array[i].id_destino );
                    aux = array[i].id_destino;
                  }
            }
      }
      return destinos;
}

// DEVUELVE ARRAY LOS EMBARCADORES DEL TIER Y EL DESTINO SELECCIONADO
function cantidad_embarcadores(id_destino,array){
    var embarcadores= new Array();
    var aux;
          if( array.length > 0 ){
                  for (var i = 0; i < array.length; i++) {
                        if(array[i].id_destino == id_destino && embarcadores.length==0){
                          embarcadores.push(array[i].id_unit);
                          aux = array[i].id_unit;
                        }
                        if(array[i].id_destino == id_destino && embarcadores.length>0){
                            if( aux != array[i].id_unit ){
                                embarcadores.push(array[i].id_unit);
                                aux=array[i].id_unit;
                            }
                        }
                  }
          }
          return embarcadores;
}

function buscar_nombre_destino(id,array){
    for (var i = 0; i < array.length; i++) {
        if (array[i].id_destino==id) {
            return array[i].puerto;
        }
    }
}

function buscar_nombre_emb(id,array){
  for (var i = 0; i < array.length; i++){
      if (array[i].id_unit==id){
          return array[i].nombre_emb;
      }
  }
}

// AGREGA FILA CON EL DESTINO
function colocar_destino_tier(Name_destino,tier,tier_n){
    var padre = $("#div"+tier+" > table");
    if($(padre)[0].rows.length == 0){
      var hijo =  $("<tr class='active' ><th >"+Name_destino+"</th><th colspan='3'>TIER "+tier_n+"</th><tr>");
    }else{
      var hijo =  $("<tr class='active'><th colspan='4' >"+Name_destino+"</th><tr>");
    }
    padre.append(hijo);
}

// AGREGA FILA CON EMBARCADOR
function colocar_embarcador_tier(cant_unit,nombre,id_tier,marca,empresa,peso){

  var padre = $("#div"+id_tier+" > table ");
  if(empresa == "ARAUCO"){

      //var hijo =  $("<tr><td > #"+nombre+"</td><td> "+cant_unit+" Units</td><td>"+peso.toFixed(3)+" Tns</td><td><img src='../imagenes/marcas/ARAUCO/"+marca+".png' width='18px'></td><tr>");
      var hijo =  $("<tr><td > #"+nombre+"</td><td colspan='2' > "+cant_unit+" Units</td><tr>");
  }
  if(empresa == "CMPC"){
     // var hijo =  $("<tr><td > #"+nombre+"</td><td> "+cant_unit+" Units</td><td>"+peso.toFixed(3)+" Tns</td><td><img src='../imagenes/marcas/CMPC/"+marca+".png' width='18px'></td><tr>");
     var hijo =  $("<tr><td > #"+nombre+"</td><td colspan='2' > "+cant_unit+" Units</td><tr>");
  }
  padre.append(hijo);
}

function plano(){
  localStorage.setItem('ROTACION', ROTACION_buque);
  window.location='../paginas/plano.php';
}
