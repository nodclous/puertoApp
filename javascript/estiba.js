// Creador de lingas
var buques_obj=0,bodegas_obj=0,tier_obj=0;
var ROTACION_buque;
var lingas_BD=[];
var Linga=[];
var nm_largo=0;
var nm_ancho=0;
var ancho_tier=0;
var largo_tier=0;
var max_id_unit=1;
var nombre_puerto;
var unit_seleccionado, puerto_seleccionado;
var tier_pinchado=0,bodega_pinchada=0;
var linga_selec;
var datos_unit;
var success_linga=0;
const WIDTH_PX=980;   // ANCHO DEL TIER
const HEIGHT_PX=473;  // LARGO DEL TIER
$(document).ready(function(){
  inicio_total(buscar_bodegas_buque);
    // EVENTO QUE ACTIVA O DESACTIVA LOS COMANDOS
    $("#switch_comando").click(function(){
      comandos(this.checked);
    });

   // Funcion para arrastrar el menu creador de lingas
    $('#btn-crear').attr("onclick","boton();");
    $('#btn-creador').attr("onclick","boton();");

    $(".a").attr("onmousedown",'opciones_tier(this,event);'); //ponerle menu al lienzo
    $(".bod").attr("onmousedown",'opciones_bodega(this,event);'); //ponerle menu al lienzo

    $(document).bind("contextmenu",function(e){ //No mostrar menu por defecto con boton derecho
        return false;
    });

    // MENU BOTON DERECHO LINGAS
    $("#menuCapa").mouseleave(function(){ // esconder el menu de boton derecho al salir de el
        $("#menuCapa").hide("fast");
    });

    // MENU BOTON DERECHO TIER
    $("#menuCapa3").mouseleave(function(){ // esconder el menu de boton derecho al salir de el
        $("#menuCapa3").hide("fast");
    });

    // MENU BOTON DERECHO BODEGAS
    $("#menuCapa4").mouseleave(function(){ // esconder el menu de boton derecho al salir de el
        $("#menuCapa4").hide("fast");
    });

     // AL INICIAL EL ORDENAMIENTO,
    //SE MOSTRARA POR DEFECTO EL PRIMER LIENZO
    $("div.lienzo:first").css("display","block");
});


function inicio_total(callback){ // CALLBACK = buscar_bodegas_buque ()
  // RESCATAR VARIABLE ROTACION POR localStorage
  if (localStorage.getItem('ROTACION')) {
    ROTACION_buque = localStorage.getItem('ROTACION');
      callback();
  }
}
// VARIABLES GLOBALES, LAS CUALES MARCAN EL TIER Y LA BODEGA SELECCIONADA
var tier_seleccion=1;
var bodega=1;

// FUNCION QUE ACTIVA COMANDOS AL TECLADO
function comandos(estado){
        if(estado){ // ESTADO 1 ENCENDIDO, 0 APAGADO
              $(document).keypress(function (e,event){
                if(e.keyCode==99){ // ASIGNA FUNCION PARA LA TECLA C
                      boton();
                }else if(e.keyCode==118){ // ASIGNA FUNCION PARA LA TECLA V
                      eliminar_linga();
                }else if(e.keyCode==108){ // ASIGNA FUNCION PARA LA TECLA L
                    document.getElementById("tipo_linga").options.item(0).selected = 'selected';
                }else if(e.keyCode==109){ // ASIGNA FUNCION PARA LA TECLA M
                  document.getElementById("tipo_linga").options.item(1).selected = 'selected';
                }else if(e.keyCode==101){ // ASIGNA FUNCION PARA LA TECLA E
                  document.getElementById("tipo_linga").options.item(2).selected = 'selected';
                }else if(e.keyCode==115){ // ASIGNA FUNCION PARA LA TECLA S
                  document.getElementById("tipo_linga").options.item(3).selected = 'selected';
                }else if(e.keyCode==114){ // ASIGNA FUNCION PARA LA TECLA R => ROTAR LINGA
                  rotar_linga();
                }else{
                  $(document).off("keypress");
                }
            });
        }else{
          // EN CASO DE APAGARSE, SE DETIENE EL EVENTO
          $(document).keypress().stop( true, true );
        }
}

// FUNCION PARA ROTAR UNA LINGA
function rotar_linga(){
  if (linga_seleccionada){ // linga_seleccionada = VARIABLE GLOBAL QUE CONTIENE LA ULTIMA LINGA SELECCIONADA
      var ancho =linga_seleccionada.style.width; // ANCHO DE LA LINGA
      var largo =linga_seleccionada.style.height;// LARGO DE LA LINGA
      var id=linga_seleccionada.id;
          for(i=0;i<Linga.length;i++){
              if(id==Linga[i].id){
                    var tipo=Linga[i].tipo;
                    break;
              }
          }
      // SE OBTIENEN LOS TAMAÑOS EN METROS DE LA LINGA
      var ancho_l_r=parseFloat((parseFloat(ancho)*parseFloat(ancho_tier))/WIDTH_PX);
      var largo_l_r= parseFloat((parseFloat(largo)*parseFloat(largo_tier))/HEIGHT_PX);

      // CON REGLA DE 3 SIMPLES SE RELACIONAN INVERSAMENTE
      // ANCHO_LINGA=>LARGO_TIER
      // LARGO_LINGA=>ANCHO_TIER
      var largo_l= parseFloat((parseFloat(ancho_l_r)*HEIGHT_PX)/largo_tier);
      var ancho_l= parseFloat((parseFloat(largo_l_r)*WIDTH_PX)/ancho_tier);

      //SE ASIGNAN NUEVAS DIMENSIONES
      linga_seleccionada.style.width=ancho_l+"px";
      linga_seleccionada.style.height=largo_l+"px";
      girar_numero(id); // FUNCION PARA ROTAR EL NUMERO DENTRO DE LA LINGA
      var elemento=$("#"+id+" p:first")[0];
      // SE OBTIENEN LOS DATOS DE LA LINGA ROTADA Y SE HACE LA MODIFICACION
      // CORRESPONDIENTE EN LA BASE DE DATOS
      for(i=0;i<Linga.length;i++){
          if(id==Linga[i].id){
              if(elemento.className=="number"){
                  Linga[i].giro=0;
                  Linga[i].ancho=ancho_l;
                  Linga[i].largo=largo_l;
                editar_rotacion_linga(Linga[i]);
              }else{
                Linga[i].giro=1;
                Linga[i].ancho=ancho_l;
                Linga[i].largo=largo_l;
                editar_rotacion_linga(Linga[i]);
              }
                break;
          }
      }
  }else{
    alert("No hay linga seleccionada para ROTAR");
  }
}

// GIRA EL NUMERO DENTRO DE LA LINGA AL MOMENTO DE GIRAR LA LINGA
function girar_numero(id){
  var elemento=$("#"+id+" p:first")[0];
  if(  elemento.className=="number" ){
        elemento.className="giro1"; // class giro1 GIRA EL ELEMENTO
  }else{
      elemento.className="number"; // class number NO GIRA EL ELEMENTO
  }
}

// ELIMINA LINGAS SELECCIONADA DE LA BASE DE DATOS
function eliminar_linga(){
  if (linga_seleccionada){ // VARIABLE GLOBAL
          $("#menuCapa").hide("fast"); // ESCONDE MENU
          var id_linga=linga_seleccionada.id;
          var i;
            // BUSCA LA LINGA EN EL ARRAY DE LINGAS
            for(i=0;i<Linga.length;i++){
                if(id_linga==Linga[i].id){
                    //ENVIA LOS DATOS PARA ELIMINARLA
                    eliminar_linga_bd(Linga[i].id_linga);
                    Linga.splice(i,1); // LA ELIMINA DEL ARRAY
                    break;
                }
            }
            // SE VUELVEN A EJECUTAR ESTAS FUNCIONES PARA OBTENER NUEVOS CALCULOS
            info_bodegas();
            datos_tier();
            // SE REMUEVE EL DIV DEL LIENZO
            linga_seleccionada.parentNode.removeChild(linga_seleccionada);
    }else{
      alert("No hay linga seleccionada para ELIMINAR");
    }
}

// IGUAL QUE LA FUNCION ANTERIOR, ELIMINA UNA LINGA ESPECIFICA PASADA POR PARAMETRO
function eliminar_linga_selec(elemento){

          var id_linga=$(elemento).attr("id");
          var i;
            for(i=0;i<Linga.length;i++){
                if(id_linga==Linga[i].id){
                    eliminar_linga_bd(Linga[i].id_linga);
                    Linga.splice(i,1);
                    break;
                }
            }
            info_bodegas();
            datos_tier();
          $(elemento).remove();
}

// FUNCION SE EJECUTA EN EL MENU DEL BOTON DERECHO DEL TIER
// BORRA TODAS LAS LINGAS DEL TIER
function limpiar_tier(){

    if(confirm("'¿Seguro desea eliminar todos las Lingas de este TIER?")){
      var tier=$(tier_pinchado).data("tier");
      var bod=bodega;
      var tier_linga;
      var tam=Linga.length;
          for(i=0;i<tam;i++){
           tier_linga=(Linga[i].tier).split("-");
              if(tier==tier_linga[2] && bod==tier_linga[1] ){ // BUSCA TODAS LAS LINGAS DEL TIER SELECCIONADO

                   eliminar_linga_bd(Linga[i].id_linga);  // ELIMINAR LINGA DE LA BASE DE DATOS
                   var linga_Del= document.getElementById(Linga[i].id);
                   linga_Del.parentNode.removeChild(linga_Del); // ELIMINAR DIV DEL LIENZO
                   Linga.splice(i,1);   // ELIMINAR LINGA DEL ARRAY GLOBAL
                   i=i-1;
              }
          }
    }
}

// FUNCION QUE BORRA TODOS LAS LINGAS DE UNA BODEGA
function limpiar_bodega(){
    if(confirm("¿Seguro desea eliminar todos las Lingas de esta bodega?")){
          if(confirm("BORRAR TODAS LAS LINGAS DE ESTA BODEGA")){
            var bod=$(bodega_pinchada).data("nbod");
            var tier_linga;
            var tam=Linga.length;
                for(i=0;i<tam;i++){
                 tier_linga=(Linga[i].tier).split("-");
                    if(bod==tier_linga[1]){
                         eliminar_linga_bd(Linga[i].id_linga);
                         var linga_Del= document.getElementById(Linga[i].id);
                         $(linga_Del).remove();
                         Linga.splice(i,1);
                         i=i-1;
                    }
                }
          }
    }
}

 var positionCarga=0;
 var linga_seleccionada=0; // VARIABLE GLOBAL QUE CONTIENE LA ULTIMA LINGA CREADA O ARRRASTRADA

// MUESTRA MENU AL HACER CLICK CON BOTON DERECHO  EN LA LINGA
 function opciones_lingas(e,event){
       if(event.button==2){
            $("#menuCapa").css("top",event.pageY-5);
            $("#menuCapa").css("left",event.pageX-5);
              $("#menuCapa").show("fast");
       }
       linga_seleccionada=e;
  }
// MUESTRA MENU AL HACER CLICK CON BOTON DERECHO  EN EL TIER
  function opciones_tier(e,event){
        if(event.button==2){
             $("#menuCapa3").css("top",event.pageY-5);
             $("#menuCapa3").css("left",event.pageX-5);
               $("#menuCapa3").show("fast");
        }
          tier_pinchado=e;
   }

  // MUESTRA MENU AL HACER CLICK CON BOTON DERECHO  EN LA BODEGA
   function opciones_bodega(e,event){

         if(event.button==2){
              $("#menuCapa4").css("top",event.pageY-5);
              $("#menuCapa4").css("left",event.pageX-5);
                $("#menuCapa4").show("fast");
         }else {}
           bodega_pinchada=e;
    }

// AL PINCHAR EL <option> GUARDA EL NOMBRE DEL DESTINO SELECCIONADO EN LA VARIABLE GLOBAL
function nombre_destino(){
    var combo = document.getElementById("destino");
    var selected = combo.options[combo.selectedIndex].text;
     nombre_puerto=selected;
}

// SE CALCULA PESO DE LA LINGA
function calcular_peso(cantidad,id){
  for (var i = 0; i < datos_unit.length; i++) {
      if ( datos_unit[i].id_unit == id) {
          return parseFloat(parseFloat(datos_unit[i].peso)*cantidad).toFixed(3);
      }
  }
}
// SE CREA UNA NUEVA LINGA
function nueva_linga(id,cantidad,tipo_linga){
        var peso_linga=calcular_peso(cantidad,unit_seleccionado);
        var id_linga= $(id).attr("id");
      //  var class_linga= $(id).attr("class");
        var ancho_linga=$(id).css("width");
        var ancho_lienzo= $(".lienzo:visible").css("width");
        var alto_linga=$(id).css("height");
        var posicionX;
        var posicionY;
        var tier=  $(".lienzo:visible").attr("id");
        // PRIMERO SE GUARDA EN EL ARRAY GLOBAL DE LINGAS
        Linga.push({
          id:id_linga,
          id_linga:0,
          rotacion:bodegas_obj[0].ROTACION,
          clase:'col-sm-2 unit draggable  ui-widget-header',
          ancho:parseFloat(ancho_linga),
          alto:parseFloat(alto_linga),
          cantidad:cantidad,
          pos_x:0,
          pos_y:0,
          peso:peso_linga,
          tipo:tipo_linga,
          giro:0,
          tier:tier,
          id_unit:unit_seleccionado,
          id_puerto:$("#destino").val(),
          nombre_puerto:nombre_puerto
        });
        guardar_linga(); // SE GUARDA LA LINGA CREADAS
        datos_tier(); // SE REFRESCAN LOS DATOS DE LA TABLA DE LINGAS
        $(id).css("position","absolute"); // SE LE DA POSICION ABSOLUTA
        elemento_arrastrable(id); // SE LE ASIGNA LA PROPIEDAD ARRASTRABLE
}

// FUNCION QUE ASIGNA UN ELEMENTO COMO ARRASTRABLE
function elemento_arrastrable(id){
  linga_selec= $(id);
  $(id).draggable({
    snap:true,
    containment:"parent",
    cursor:"pointer",

    addClasses:"tomar_linga",
    snapMode: "both",
      start:function(event, ui){ // EVENTO AL COMENZAR A MOVER
               $(".unit").css("box-shadow","0 0 0 #000");
                 linga_selec= $(this);
                 if(1){
                   dimensiones_linga_seleccionada(linga_selec);
                 }
      },
      drag: function(event, ui){  // EVENTO AL MOVER
             posicionY=$(id).position().left;
             posicionX=$(id).position().top;
             // LA LINGA SELECCIONADA SIEMPRE ESTARA POR ENCIMA DEL RESTO CON SOMBRA
             $(".unit").css("z-index","0");
             $(this).css("z-index","1");
             $(".unit").css("box-shadow","0 0 0 #000");
             $(this).css("box-shadow","rgb(0, 0, 0) 2px 1px 5px 1px");
      },

      stop: function(event, ui){ // EVENTO AL DETENER EL MOVIMIENTO
        // LA LINGA EDITA SUS POSICIONES
          var ea=$(id).attr("id");
          var i;
          var lienzoX= $(".lienzo:visible").position().top;
          var lienzoY= $(".lienzo:visible").position().left;
            for(i=0;i<Linga.length;i++){
                if(ea==Linga[i].id){
                      Linga[i].pos_x=posicionX-lienzoX;
                      Linga[i].pos_y=posicionY-lienzoY;
                      editar_linga_posicion(Linga[i]);
                      // console.log(Linga);
                      break;
                }
            }
          $(".dim").css("display","none");
    }
  });
}
var id=0;

// FUNCION QUE CREA UN NUEVO DIV COMO FUTURA LINGA
function boton(){
          var cantidadCarga=$('#cantidad').val();
          var proveedor=$('#proveedor').val();
          var tipo_linga= $("#tipo_linga").val();
          id=parseInt(id)+1;

          var element = document.createElement('div');
          element.setAttribute('id','carga'+id);
          element.setAttribute('class','col-sm-2 unit draggable  ui-widget-header');
          element.setAttribute("onmousedown",'opciones_lingas(this,event);');
          element.style.background="#ccc";
          var num_int = document.createElement('p');
          num_int.setAttribute('class','number');
          num_int.innerHTML=cantidadCarga;
          element = crear_tipo_linga(element); // SE CREA EL ELEMENTO DEACUERDO A SU  TIPO

            if(element!="0"){
                nueva_linga(element,cantidadCarga,tipo_linga);
                if(success_linga==1){
                  element.appendChild(num_int);
                  var a= $(".lienzo:visible").attr("id");

                  var b=document.getElementById(a);
                  b.appendChild(element);
                  info_bodegas();
                        $("#linga div:first").appendTo('#linga:first');
                        $(".unit").css("box-shadow","0 0 0 #000");
                        $(element).css("box-shadow","rgb(0, 0, 0) 2px 1px 5px 1px");
                        success_linga=1;
                }
                linga_seleccionada=element; // LA LINGA SELECCIONADA SERA LA ULTIMA CREADA

            }
  }

// SE ESCRIBEN LAS DIMENSIONES DEL TIER Y SE GUARDAN EN VARIABLE GLOBALES
function asignar_numeros_magicos(dato){
  nm_ancho=parseFloat((WIDTH_PX*parseFloat(largo_unit))/parseFloat(dato.ancho));
  nm_largo=parseFloat((HEIGHT_PX*parseFloat(ancho_unit))/parseFloat(dato.largo));
  $("#ancho_lie").text(parseFloat(dato.ancho)+" mts");
  $("#largo_lie").text(parseFloat(dato.largo)+" mts");
  ancho_tier=parseFloat(dato.ancho);
  largo_tier=parseFloat(dato.largo);
}

// SE CREAN LAS DIMENSIONES DE LA LINGA DEACUERDO A SU CANTIDAD Y TIPO DE LINGA
function crear_tipo_linga(elemento){
    var tipo_linga= $("#tipo_linga").val();
      var cantidad= $("#cantidad").val();
    switch (tipo_linga) {
      case "Linga":
      console.log(ancho_tier);
      return new_linga(elemento,cantidad);
        break;
      case "Media linga":
      return new_media_linga(elemento,cantidad,largo_unit,ancho_unit);
        break;
      case "Espejo Simple":
      return new_espejo_simple(elemento,cantidad,largo_unit,ancho_unit);
        break;
      case "Espejo":
        return new_espejo(elemento,cantidad,largo_unit,ancho_unit);
        break;
    }
  }

// LINGA NORMAL
function new_linga(elemento,cantidad,largo,ancho){
    if(cantidad%2==0){
        elemento.style.width=parseFloat(nm_ancho)*2+"px";
        elemento.style.height=parseFloat(parseFloat(nm_largo)*(cantidad/2))+"px";
        if(validar_tam(elemento.style.width,elemento.style.height)){
          return elemento;

        }else{
         return 0;
        }
    }else{
      alert("linga normal solo acepta cantidades pares");
    }
}
// MEDIA LINGA
function new_media_linga(elemento,cantidad,largo,ancho){
        elemento.style.width=parseFloat(nm_ancho)+"px";
        elemento.style.height=parseFloat( parseFloat(nm_largo)*cantidad)+"px";
        if(validar_tam(elemento.style.width,elemento.style.height)){
          return elemento;
        }else{
          return 0;
        }

}

// lINGA ESPEJO SIMPLE
function new_espejo_simple(elemento,cantidad,largo,ancho){
        elemento.style.height=parseFloat(nm_largo)+"px";
        elemento.style.width=parseFloat(nm_ancho)*cantidad+"px";
        if(validar_tam(elemento.style.width,elemento.style.height)){
          return elemento;
        }else{
          return 0;
        }
}
// LINGA ESPEJO DOBLE
function new_espejo(elemento,cantidad,largo,ancho){
    if(cantidad%2==0){
        elemento.style.width=parseFloat(nm_ancho)*(cantidad/2)+"px";
        elemento.style.height=parseFloat(nm_largo)*2+"px";
        if(validar_tam(elemento.style.width,elemento.style.height)){
          return elemento;
        }else{
          return 0;
        }
    }else{
      alert("linga espejo solo acepta cantidades pares");
    }
}

// ESTA FUNCION SE EJECUTA AL HACER CLICK EN UNA bodega
//SELECCIONANDOLA Y GUARDANDOLA EN LA VARIABLE GLOBAL
// ADEMAS SE SELECCIONA SIEMPRE EL TIER 1 DE LA BODEGA
function bodegas(elemento){
    bodega=elemento.dataset.nbod;
    // PARA OBTENER EL NUMERO DE TIER
    for(i=0;i<bodegas_obj.length;i++){
      if(bodegas_obj[i].num_bodega== bodega){
        var cantidad=bodegas_obj[i].cant_tiers;
      }
    }
    //OCULTAR LOS QUE NO EXISTEN
    var all_tier=$("#nav_tier li");
    all_tier.css("display","none");
    for(i=0;i<cantidad;i++){
      $(all_tier[i]).css("display","block");
    }
    $(".bod").attr("class","bod");
    elemento.className="bod activo";
    $(".lienzo").css("display","none");
    $("#liezo-"+bodega+"-"+tier_seleccion).css("display","block");
        obtener_medidas_tier(bodega,tier_seleccion);
        datos_tier();  // SE MUESTRAN LOS DATOS DEL NUEVO TIER VISIBLE
        deseleccionar(); // SE DESELECCIONA LA LINGA SELECCIONADA
}

//FUNCION QUE SE EJECUTA AL HACER CLICK EN UN TIER
// PARA MOSTRANDO ESE TIER
function tier(elemento){
    tier_seleccion=$(elemento).data('tier');
    $(".lienzo").css("display","none");
    $(".a").attr("class","a");
    $(elemento).attr("class","a active");
    $("#liezo-"+bodega+"-"+$(elemento).data('tier')).css("display","block");
    obtener_medidas_tier(bodega,tier_seleccion);
    datos_tier(); // SE MUESTRAN LOS DATOS DE ESE TIER, REESCRIBIENDOSE LA TABLA
     deseleccionar(); // SE DESELECCIONA LA LINGA SELECCIONADA
}
function info_bodegas(){
  var i;
  var cantidad1=0;
    var cantidad2=0;
      var cantidad3=0;
      var peso1=0,peso2=0,peso3=0;
    for(i=0;i<Linga.length;i++){
              if(  Linga[i].tier=="liezo2"||  Linga[i].tier=="liezo3" ||  Linga[i].tier=="liezo4" ){
                      cantidad1=parseInt(Linga[i].cantidad) + parseInt(cantidad1);
                      // peso1=Linga[i].peso+ peso;
            }else if ( Linga[i].tier==("liezo5"|| "liezo6" || "liezo7")) {
                      cantidad2=Linga[i].cantidad + cantidad2;
            }else if ( Linga[i].tier==("liezo8"|| "liezo9" || "liezo10")) {
                      cantidad3=Linga[i].cantidad + cantidad3;
            }
    }
      $('.cantidad_unit:first').text(cantidad1+" unit");
}

// VALIDA AL MOMENTO DE CREAR UNA LINGA SI EL TAMAÑO ES MENOR AL DEL TIER
function validar_tam(tam1,tam2){
  var x=parseInt($(".lienzo:visible").css("width"));
  var y=parseInt($(".lienzo:visible").css("height"));
  if(parseInt(tam1)>x){
    alert("supero maximo tamaño");
    return 0;
  }else if(parseInt(tam2)>y){
    alert("supero maximo tamaño");
    return 0;
  }else{
    return 1;
  }
}

function reanudar(){
  // nombre = prompt("introduza su nombre por favor");
      var id_tier= $(".lienzo:visible").attr("id");
      for(i=0;i<Linga.length;i++){
          if(id_tier==Linga[i].tier){
              Linga.splice(i,1);
          }
      }
      info_bodegas();
      $(".lienzo:visible").empty();
}

// LISTA TODOS LOS BUQUES EN UN <select>
function listar_buques(){
  var buques=buques_obj;
  var i=0;
  var div=$("<div/>");
  var div_padre=$("#bodegas_inicio");
  div.addClass("listado_buques");
  var selector= $("<select/>");
  var boton= $("<button/>");
      for(i=0;i<buques.length;i++){
        var opciones=$("<option/>");
          $(opciones).text(buques[i].NOMBRE);
          $(opciones).attr("value",buques[i].ROTACION);
        selector.append (opciones);
      }
  var div_buques= $("#buques_inicio");
  $(selector).attr("class","form-control lista-buques");
  $(selector).attr("id","seleccion");
  div.append (selector);
  $(boton).attr("class","btn boton_buque_inicio");
  $(boton).attr("onfocus","buscar_bodegas_buque()");
  // $(boton).attr("onmouseup","setTimeout('iniciar_estiba()',200)");
  $(boton).text("LISTAR");
  div.append (boton);
  div_buques.append (div);
}

// FUNCION QUE INICIA LA ESTIBA CON LA ROTACION SELECCIONADA
function buscar_bodegas_buque(){
    ver_bodegas(ROTACION_buque,obtener_medidas_tier);
    datos_embarcadores();
    datos_puertos();
    // tier_bodegas(ROTACION_buque);
    menu_creador_lingas();
    datos_tier();
    restaurar(ROTACION_buque);
}

// CREA TODOS LOS LIENZOS, TIER Y BODEGAS CORRESPONDIENTES A LA NAVE SELECCIONADA
function iniciar_estiba(){

  var i=0;
  var aux=0;
  var num_bod=1;
  var num_tier=1;
  aux = tier_obj[0];
  var cantidad_tier;
  var cantidad_bodega;
  var padre_tier= $("#nav_tier");
  var padre_bodega= $("#bodegas");
  var padre_lienzo=$("#lllinzo");
  var primera_bodega;
  // console.log(tier_obj[1].id_bodega);
  var j=1;
  var i=1;

                  for(j=0;j<bodegas_obj.length;j++){
                  aux=bodegas_obj[j].cantidad_tier;
                        for(i=0;i<tier_obj.length;i++){
                              if(bodegas_obj[j].id_bodega == tier_obj[i].id_bodega){
                                if(bodegas_obj[j].num_bodega==1 && tier_obj[i].nivel==1){
                                  var lienzo= $("<div class='lienzo ui-widget-header droppable'  id='liezo-"+bodegas_obj[j].num_bodega+"-"+tier_obj[i].nivel+"'></div>");
                                  $(lienzo).css("display","block");
                                  padre_lienzo.append (lienzo);
                                }

                                var lienzo= $("<div class='lienzo ui-widget-header droppable' id='liezo-"+bodegas_obj[j].num_bodega+"-"+tier_obj[i].nivel+"'></div>");
                                $(lienzo).css("display","none");
                                padre_lienzo.append (lienzo);
                              }
                      }
                  }
                  for(i=0;i<bodegas_obj.length;i++){
                    var id_bod=$(".bod")[i].id;
                    $("#"+id_bod).css("display","block");
                  }
                  bodegas($(".bod")[0]);

}

// ESCRIBE LOS DATOS DEL TIER VISIBLE SEPARADO POR DESTINOS
function datos_tier(){
  var cantidad_puertos=[];
    var cant_embar_puerto=[];
  var contador=0;
  var cantidad_unit=0;
  var cantidad_lingas=0;
  var primero=0;
  var puerto=0;
  var padre=$("#tabla_datos");
    var id_tier= $(".lienzo:visible").attr("id");
    // Para obtener la cantidad de puertos a los que van las lingas de respectivo
    // TIER guardandolas en un JSON (cantidad_puertos)
    for(i=0;i<Linga.length;i++){
        if(id_tier == Linga[i].tier){
          if(puerto==0) {
            puerto=Linga[i].id_puerto;
            cantidad_puertos.push({id_puerto:puerto});
          }else{
            if(puerto!=Linga[i].id_puerto){
              puerto=Linga[i].id_puerto;
              cantidad_puertos.push({id_puerto:puerto});
            }
          }
          cant_embar_puerto.push({id_puerto:Linga[i].id_puerto,id_unit:Linga[i].id_unit });
          }
    }

    puerto=0;// inicializo variable puerto para ocuparla nuevamente

    $("#tabla_datos").empty(); // Borro todos los datos que existan en la tabla para reescribirlos nuevamente

  cant_embar_puerto=removeDuplicates(  cant_embar_puerto);
  var  id_de_puerto=0;

var lingas_t=0,unit_t=0,peso_t=0;
var lingas_total_tier=0,unit_total_tier=0,peso_total_tier=0;
    for(j=0;j<cant_embar_puerto.length;j++){
      if(j==0){
        id_de_puerto=cant_embar_puerto[j].id_puerto;
        for(i=0;i<Linga.length;i++){
              if(id_tier == Linga[i].tier && cant_embar_puerto[j].id_puerto==Linga[i].id_puerto && cant_embar_puerto[j].id_unit==Linga[i].id_unit){
                            puerto=Linga[i].id_puerto;
                            cantidad_unit=parseInt(cantidad_unit)+parseInt(Linga[i].cantidad);
                            cantidad_lingas++;
                            embarcador=Linga[i].id_unit;
                            nombre_del_puerto=Linga[i].nombre_puerto;
                            peso_t=parseFloat(peso_t)+parseFloat(Linga[i].peso);
                }
        }
        var datos=$("<tr><td>"+bodega+"</td><td>"+tier_seleccion+"</td><td>"+nombre_del_puerto+"</td><td >"+NameEmb(embarcador)+"</td><td>"+cantidad_unit+"</td><td>"+cantidad_lingas+"</td><td>"+parseFloat(peso_t.toFixed(3))+" Tn</td></tr>")
        padre.append(datos);
        lingas_total_tier= lingas_total_tier+cantidad_lingas;
        unit_total_tier=unit_total_tier+cantidad_unit;
        peso_total_tier=peso_total_tier+peso_t;
        embarcador=0;
        cantidad_unit=0;
        cantidad_lingas=0;
        peso_t=0;


      }else{
          for(i=0;i<Linga.length;i++){
                if(id_tier == Linga[i].tier && cant_embar_puerto[j].id_puerto==Linga[i].id_puerto && cant_embar_puerto[j].id_unit==Linga[i].id_unit){
                              puerto=Linga[i].id_puerto;
                              cantidad_unit=parseInt(cantidad_unit)+parseInt(Linga[i].cantidad);
                              cantidad_lingas++;
                              embarcador=Linga[i].id_unit;
                              nombre_del_puerto=Linga[i].nombre_puerto;
                              peso_t=parseFloat(peso_t)+parseFloat(Linga[i].peso);

                  }
          }

          var datos=$("<tr><td>"+bodega+"</td><td>"+tier_seleccion+"</td><td>"+nombre_del_puerto+"</td><td>"+NameEmb(embarcador)+"</td><td>"+cantidad_unit+"</td><td>"+cantidad_lingas+"</td><td>"+parseFloat(peso_t.toFixed(3))+" Tn</td></tr>")
          padre.append(datos);
          lingas_total_tier= lingas_total_tier+cantidad_lingas;
          unit_total_tier=unit_total_tier+cantidad_unit;
          peso_total_tier=peso_total_tier+peso_t;

          embarcador=0;
          cantidad_unit=0;
          cantidad_lingas=0;

      }

    }
    var datos=$("<tr class='total_tier'><td>Bod"+bodega+"</td><td colspan='3' class='centrado' > Tier "+tier_seleccion+"</td><td>"+unit_total_tier+"</td><td>"+lingas_total_tier+"</td><td>"+parseFloat(peso_total_tier.toFixed(3))+" Tn</td></tr>")
    padre.append(datos);
}

// ELIMINA TODOS LOS DATOS REPETIDOS DE UN ARRAY
function removeDuplicates(originalArray) {
     var Copia=originalArray;
     var Copia2=  originalArray;
     var aux=0;
     for(var i =0 ;i<originalArray.length;i++){
       for(var j=0 ;j<Copia.length;j++){
          if(Copia[j].id_puerto==originalArray[i].id_puerto && Copia[j].id_unit==originalArray[i].id_unit){
            aux=parseInt(aux)+1;
            if(aux==2){
                Copia.splice(j,1);
                aux=1;
                j=0;
                aux=0;
            }
          }

       }
   aux=0;
     }
     Copia.orderByString("id_puerto");
     return   Copia;
 }

// ORDENA TODOS LOS ARRAY DE OBJETOS RESPECTO A UN ATRIBUTO
 Array.prototype.orderByString=function(p,so,ic){
   if(so!=-1&&so!=1)so=1;
   this.sort(function(a,b){
     var sa=a[p]!=null?a[p].toString():'',sb=b[p]!=null?b[p].toString():'';
     if(ic==true){sa=sa.toLowerCase();sb=sb.toLowerCase()}
     return(sa<sb?-1:sa>sb?1:0)*so;
   })
 }
function restaurar(ROTACION){
  buscar_lingas(ROTACION);
}

// OBTIENE TODAS LAS LINGAS ANTERIORMENTE CREADAS, LAS DIBUJA,
// Y LAS GUARDA EN EL ARRAY GLOBAL DE LINGAS
function crear_array_linga(lingas){
    for(var i=0;i<lingas.length;i++){
      Linga.push({
        id:"carga"+i,
        id_linga:lingas[i].id_linga,
        rotacion:lingas[i].ROTACION,
        clase:"unit col-sm-2  draggable ui-widget-header ui-draggable",
        ancho:lingas[i].ancho,
        alto:lingas[i].alto,
        cantidad:lingas[i].cantidad,
        pos_x:lingas[i].posx,
        pos_y:lingas[i].posy,
        peso:lingas[i].peso,
        tipo:lingas[i].tipo,
        giro:lingas[i].giro,
        tier:"liezo-"+lingas[i].num_bodega+"-"+lingas[i].nivel,
        id_unit:lingas[i].id_unit,
        id_puerto:lingas[i].id_destino,
        nombre_puerto:lingas[i].puerto
      });
    }
    id=parseInt(id)+i+1;
setTimeout('dibujar_lingas_tier()',700);
}

// DIBUJA TODAS LAS LINGAS CORRESPONDIENTES A CADA TIER ANTERIORMENTE CREADAS PARA ESA ROTACION
function dibujar_lingas_tier(){
    for(var i=0;i<Linga.length;i++){
      $(".lienzo").css("display","none");
      $("#"+Linga[i].tier).css("display","block");
    var padre=$("#"+Linga[i].tier);

    var left=$(padre).position().left;
    var top=$(padre).position().top;
    if(Linga[i].giro==0){
          var linga_tier=$("<div id="+Linga[i].id+" class="+Linga[i].clase+"   onmousedown='opciones_lingas(this,event);'><p class='number'>"+Linga[i].cantidad+"</p></div>");
    }else{
        var linga_tier=$("<div id="+Linga[i].id+" class="+Linga[i].clase+" onmousedown='opciones_lingas(this,event);'><p class='giro1'>"+Linga[i].cantidad+"</p></div>");
    }
    $(linga_tier).css({
      "position":"absolute",
      "left":(parseFloat(Linga[i].pos_y)+parseFloat(left))+"px",
      "top":(parseFloat(Linga[i].pos_x)+parseFloat(top))+"px",
      "width":Linga[i].ancho,
      "height":Linga[i].alto,
      "text-align":"center",
      "outline": "1px solid",
      "background":"#a1a4b3"
    });
          padre.append(linga_tier);
          elemento_arrastrable(linga_tier);
    }
    $(".lienzo").css("display","none");
    $("#liezo-1-1").css("display","block");
    datos_tier();
    $('.lienzo').attr("onclick","deseleccionar();");
}

// DESELECCIONA LA LINGA SELECCINADA
function deseleccionar(){
      $(".unit").css("box-shadow","0 0 0 #000");
      $(".dim").css("display","none");
      linga_seleccionada=0;
}

// AL MOMENTO DE ARRASTRAR SE MUESTRAN LAS DIMENSIONES DE LA LINGA
function dimensiones_linga_seleccionada(elemento){
  $(".dim").remove();
  var ancho=parseFloat(elemento[0].style.width);
  ancho=parseFloat((parseFloat(ancho)*parseFloat(ancho_tier))/980);
  var ancho=$("<p class='dim'>"+ancho.toFixed(2)+"m</p>").css({
    "position":"absolute",
    "top":100+"%",
    "left":"48%"
  });
    elemento.append(ancho);

  var largo=parseFloat(elemento[0].style.height);
  largo=parseFloat((parseFloat(largo)*parseFloat(largo_tier))/473);
  var largo=$("<p class='dim'>"+largo.toFixed(2)+"m</p>").css({
    "position":"absolute",
    "top":"40%",
    "left":"101%"
  });
    elemento.append(largo);
}
// GENERAL EL NOMBRE COMPLETO DEL EMBARCADOR "TIPO MAS LA EMPRESA"
function NameEmb(id){
  for (var i = 0; i < datos_unit.length; i++) {
    if(datos_unit[i].id_unit==id){
        return datos_unit[i].tipo+" "+datos_unit[i].empresa;
    }
  }
}
