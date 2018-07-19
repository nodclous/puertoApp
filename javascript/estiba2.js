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
var nombre_puerto2;
var unit_seleccionado, puerto_seleccionado;
var tier_pinchado=0,bodega_pinchada=0;
var linga_selec;
var datos_unit;
var success_linga=0;
const WIDTH_PX=980;   // ANCHO DEL TIER
const HEIGHT_PX=473;  // LARGO DEL TIER
var primeraCarga=0;
$(document).ready(function(){

    // EVENTO QUE ACTIVA O DESACTIVA LOS COMANDOS
    $("#switch_comando").click(function(){
      comandos(this.checked);
    });
    $(document).keydown(function(e,event) {
      if(e.keyCode==17){ //Se presiona control para contar
        console.log("pulsando tecla");
          medir_distancias();
      }
    });
    $( document ).keyup(function(e,event) {
      if(e.keyCode==17){ //Se presiona control para contar
          console.log("solto tecla");
            $(".unit").keypress().stop( true, true );
      }
    });
   // Funcion para arrastrar el menu creador de lingas
    $('#btn-crear').attr("onclick","boton();");
    $('#btn-creador').attr("onclick","boton();");

    $(".a").attr("onmousedown",'opciones_tier(this,event);'); //ponerle menu al lienzo
    $(".bod").attr("onmousedown",'opciones_bodega(this,event);'); //ponerle menu al lienzo

    $(document).bind("contextmenu",function(e){ //No mostrar menu por defecto con boton derecho
        return false;
    });
        inicio_total();
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


});

function medir_distancias(){
  var ancho_S=0;
  var alto_S=0;
  $(".unit").click(function(){
    if(conexion()){

          ancho_S=parseFloat(this.style.width);
          ancho_S=parseFloat((parseFloat(ancho_S)*parseFloat(ancho_tier))/980);

          alto_S=parseFloat(this.style.height);
          alto_S=parseFloat((parseFloat(alto_S)*parseFloat(largo_tier))/473);

          ancho_S=0;
          alto_S=0;
    }else{
      alert("ERROR Compruebe conexion a internet");
    }
    console.log("ancho:"+ancho_S+" Largo:"+alto_S);
  });
}

function inicio_total(){ // CALLBACK = buscar_bodegas_buque ()
  // RESCATAR VARIABLE ROTACION POR localStorage
  if (localStorage.getItem('ROTACION')) {
    ROTACION_buque = localStorage.getItem('ROTACION');

      buscar_bodegas_buque(function (ROTACION_buque){ console.log("1");
          ver_bodegas(ROTACION_buque,function(bodega,tier_seleccion){console.log("2");
            obtener_medidas_tier(bodega,tier_seleccion,function (dato_medidas){console.log("3");
                datos_embarcadores(dato_medidas,function(data,dato_medidas){console.log("4");
                  listar_embarcadores(data,dato_medidas,function (dato_medidas){console.log("5");
                    asignar_numeros_magicos(dato_medidas,function (){console.log("6");
                      datos_puertos(function (data){console.log("7");
                        listar_puertos(data,function(ROTACION_buque){console.log("8");
                          buscar_lingas(ROTACION_buque,function(lingas_BD){console.log("9");
                            crear_array_linga(lingas_BD,function(ROTACION_buque){console.log("10");
                              tier_bodegas(ROTACION_buque,function(tier_objeto){console.log("11");
                                iniciar_estiba(tier_objeto,function(){console.log("12");
                                 dibujar_lingas_tier();
                                 menu_creador_lingas();
                                 bodegas($(".bod")[0]);
                                 linga_traslapada();
                                            $("div.lienzo:first").css("display","block");
                                            $("#cargando").animate({
                                                opacity:0,
                                              },100,function (){
                                                $("#cargando").css("display","none");
                                                $("#div_carga").css("display","none");
                                                $(".container").animate({
                                                    opacity:1,
                                                  },200,function (){
                                                    $("#lingas").css("display","block");
                                                  });
                                              });


                                });
                              });
                            });
                          });
                        });
                      });
                  });
                });
              });
            });
          });
      });
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
  if(conexion()){
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
}else{
  alert("ERROR Compruebe su conexion con internet");
}
linga_traslapada();
}

function marcas_arauco(){

  ver_marcas_arauco(function(data){
    listar_marcas_arauco(data,function(){
      $("#modal_marca_arauco").modal("show");
      console.log("se so");
    });

  });
}
function listar_marcas_arauco(data,callback){
  $("#content_marcas_arauco").empty();
    $("#edit_marca").html('<span class="glyphicon glyphicon-plus"></span> Editar');
  var table="<table class='table table-bordered'><tr><th>Puerto</th><th>Marca</th></tr>";
    for (var i = 0; i < data.length; i++) {

	      if(data[i].marca_arauco==""){
	        table=table+"<tr>"+
	          "<td>"+data[i].puerto+"</td><td class='select_MA' data-puerto="+data[i].puerto+" data-marca='-' data-posicion="+i+" >"+data[i].marca_arauco+"</td>"+
	          "</tr>";
	      }else{
	        table=table+"<tr>"+
	          "<td>"+data[i].puerto+"</td><td class='select_MA' data-puerto="+data[i].puerto+" data-marca="+data[i].marca_arauco+" data-posicion="+i+" >"+data[i].marca_arauco+"</td>"+
	          "</tr>";
	      }
    }
    table=table+"</table>";
    $("#content_marcas_arauco").append($(table));
    callback();
}

function crear_select_marcas(){
  var array=["Cuadrado","Circulo","Circulo-Guion","Dos-Circulos","Dos-Cuadrados","Triangulo"];
  var option="<option value=''></option>";
  var datos=$(".select_MA");
  var ea;
  var aux=0;
      for(var k=0;k<datos.length;k++){
          for (var j = 0; j < array.length; j++) {
              for(var i=0;i<datos.length;i++){
                   if($(datos[i]).data("marca")==array[j] && i!=k){
                     aux=1;
                   }
              }
              if(aux==1){
                aux=0;
              }else{
                option=option+"<option value="+(array[j])+">"+(array[j])+"</option>";
                aux=0;
              }
          }
                ea=$('.select_MA')[k];
                var selected=$("<select class='select_M form-control' data-puerto="+$(datos[k]).data("puerto")+">"+option+"</select>");
                // console.log($(selected).val());
                // $(ea).html("<select class='select_M form-control' data-puerto="+$(datos[k]).data("puerto")+">"+option+"</select>");
                $(ea).empty();
                $(selected).val($(datos[k]).data("marca"));
                $(ea).append($(selected));
          option="";
      }

      $("#edit_marca").html('<span class="glyphicon glyphicon-plus"></span> Aceptar');
      $("#edit_marca").attr("onclick","editar_marcas_arauco()");
}



function marcar_linga(){
    if(conexion()){
      var id_linga=linga_seleccionada.id;
      var id_linga_bd;
      var i;
      var posicion=0;
      var empresa="";  //Variable donde guardo la empresa de la linga
      var puerto="";

      if (linga_seleccionada ){ // VARIABLE GLOBAL , solo si existe
          // BUSCA LA LINGA EN EL ARRAY DE LINGAS
          for(i=0;i<Linga.length;i++){
              if(id_linga==Linga[i].id){
              empresa=Linga[i].empresa;
              id_linga_bd=Linga[i].id_linga;
              puerto=Linga[i].nombre_puerto;
              posicion=i;
                  break;
              }
          }

          if(verificar_marca(id_linga)){
            // YA TIENE MARCA, SE LE SACA LA MARCA
            if(confirm("Seguro desea desmarcar?")){
              desmarcar_linga(id_linga_bd,id_linga,posicion);
            }
          }else{

          // NO TIENE MARCA, ENTONCES SE LE PONE LA MARCA
            if(empresa=="CMPC"){
                marcar_linga_CMPC(id_linga_bd,id_linga,posicion);
            }else{
              //Abre modal para seleccionar marca arauco
                marcar_linga_arauco(id_linga_bd,id_linga,posicion);
              //Al seleccionar se ejecuta funcion Guarda_marca_arauco() en fun_ajax.js
            }
        }
      }
    }else{
        alert("ERROR Compruebe conexion a internet");
      }

}

function verificar_marca(id_linga){
  var img_hijos=$('div#'+id_linga).children('img');

  if(img_hijos.length==1){
    return 1; //si tiene marca
  }else{
    return 0; // no tiene marca
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
  if(conexion()){
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
  }else{

    alert("ERROR Compruebe conexion a internet");
  }
   linga_traslapada();
}

// IGUAL QUE LA FUNCION ANTERIOR, ELIMINA UNA LINGA ESPECIFICA PASADA POR PARAMETRO
function eliminar_linga_selec(elemento){
      if(conexion()){
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
        }else{
          alert("ERROR Compruebe conexion a internet");
        }
}

// FUNCION SE EJECUTA EN EL MENU DEL BOTON DERECHO DEL TIER
// BORRA TODAS LAS LINGAS DEL TIER
function limpiar_tier(){
  if(conexion()){
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
                   // tam=tam-1;
              }
              if(Linga.length==(i+1)){
                break;
              }
          }
            datos_tier();
    }
  }else{
    alert("ERROR Compruebe conexion a internet");
  }

}

// FUNCION QUE BORRA TODOS LAS LINGAS DE UNA BODEGA
function limpiar_bodega(){
  if(conexion()){
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
                    if(Linga.length==(i+1)){
                      break;
                    }
                }
                    datos_tier();
          }
    }
  }else{
    alert("ERROR compruebe conexion a internet");
  }

}

 var positionCarga=0;
 var linga_seleccionada=0; // VARIABLE GLOBAL QUE CONTIENE LA ULTIMA LINGA CREADA O ARRRASTRADA

// MUESTRA MENU AL HACER CLICK CON BOTON DERECHO  EN LA LINGA
 function opciones_lingas(e,event){
   if(conexion()){
       if(event.button==2){
            $("#menuCapa").css("top",event.pageY-5);
            $("#menuCapa").css("left",event.pageX-5);
              $("#menuCapa").show("fast");
       }
       linga_seleccionada=e;
  }else{
    alert("ERROR compruebe conexion a internet");
  }
}
// MUESTRA MENU AL HACER CLICK CON BOTON DERECHO  EN EL TIER
  function opciones_tier(e,event){
    if(conexion()){
        if(event.button==2){
             $("#menuCapa3").css("top",event.pageY-5);
             $("#menuCapa3").css("left",event.pageX-5);
               $("#menuCapa3").show("fast");
        }
          tier_pinchado=e;
        }else{
          alert("ARROR compruebe conexion a internet");
        }
   }


  // MUESTRA MENU AL HACER CLICK CON BOTON DERECHO  EN LA BODEGA
   function opciones_bodega(e,event){
         if(conexion()){
           if(event.button==2){
                $("#menuCapa4").css("top",event.pageY-5);
                $("#menuCapa4").css("left",event.pageX-5);
                  $("#menuCapa4").show("fast");
           }
             bodega_pinchada=e;
         }else{
           alert("ARROR compruebe conexion a internet");
         }
    }

// AL PINCHAR EL <option> GUARDA EL NOMBRE DEL DESTINO SELECCIONADO EN LA VARIABLE GLOBAL
function nombre_destino(){
    var combo = document.getElementById("destino");
    var selected = combo.options[combo.selectedIndex].text;
     nombre_puerto=selected;
}

// AL PINCHAR EL <option> GUARDA EL NOMBRE DEL DESTINO2 SELECCIONADO EN LA VARIABLE GLOBAL
function nombre_destino2(){
    var combo = document.getElementById("destino2");
    var selected = combo.options[combo.selectedIndex].text;
     nombre_puerto2=selected;
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
function nueva_linga(id,cantidad,tipo_linga,ElementPadre){
        var peso_linga=calcular_peso(cantidad,unit_seleccionado);
        var id_linga= $(id).attr("id");
      // var class_linga= $(id).attr("class");
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
          id_puerto2:$("#destino2").val(),
          nombre_puerto:nombre_puerto,
          marca:0,
          empresa:$("#tipo_celulosa").find(':selected').data("empresa")
        });

        //GUARDA LINGA EN LA BASE DE DATOS
        guardar_linga(ElementPadre,id,function(){
              //BOTON CREADOR QUEDA DESABILITADO MIENTRAS NO SE GUARDA LA LINGA
              $("#btn-crear").attr("onclick", "boton()");
              $("#btn-creador").attr("onclick", "boton()");
              $(".unit").css("z-index","0");
              $(id).css("z-index","1");
              linga_traslapada();
        }); // SE GUARDA LA LINGA CREADAS


}

// FUNCION QUE ASIGNA UN ELEMENTO COMO ARRASTRABLE
function elemento_arrastrable(id){
  linga_selec= $(id);
  $(id).draggable({
    snap:true,
    containment:"parent",
    cursor:"pointer",
    addClasses:"tomar_linga",
        snapTolerance:8,
    snapMode: "both",
      start:function(event, ui){ // EVENTO AL COMENZAR A MOVER
               $(".unit").css("box-shadow","0 0 0 #000");
                 linga_selec= $(this);
                 // LA LINGA SELECCIONADA SIEMPRE ESTARA POR ENCIMA DEL RESTO CON SOMBRA
                 $(".unit").css("z-index","0");
                 $(this).css("z-index","1");
                 $(".unit").css("box-shadow","0 0 0 #000");
                 $(this).css("box-shadow","rgb(0, 0, 0) 0px 0px 3px 1.2px");
                   dimensiones_linga_seleccionada(linga_selec);

      },
      drag: function(event, ui){  // EVENTO AL MOVER
             posicionY=$(id).position().left;
             posicionX=$(id).position().top;
             // LA LINGA SELECCIONADA SIEMPRE ESTARA POR ENCIMA DEL RESTO CON SOMBRA
             $(".unit").css("z-index","0");
             $(this).css("z-index","1");
             $(".unit").css("box-shadow","0 0 0 #000");
             $(this).css("box-shadow","rgb(0, 0, 0) 0px 0px 3px 1.2px");


      },

      stop: function(event, ui){ // EVENTO AL DETENER EL MOVIMIENTO
        // LA LINGA EDITA SUS POSICIONES
          var ea=$(id).attr("id");
          var i;
          var lienzoX= $(".lienzo:visible").position().top;
          var lienzoY= $(".lienzo:visible").position().left;
            for(i=0;i<Linga.length;i++){
                if(ea==Linga[i].id){
                      Linga[i].pos_x=posicionX;
                      Linga[i].pos_y=posicionY;
                      editar_linga_posicion(Linga[i]);
                      // console.log(Linga);
                      break;
                }
            }
          $(".dim").css("display","none");
          linga_traslapada();
    }
  });

}
var id=0;

// FUNCION QUE CREA UN NUEVO DIV COMO FUTURA LINGA
function boton(){
    $("#btn-crear").attr("onclick", "");
      $("#btn-creador").attr("onclick", "");
          var cantidadCarga=$('#cantidad').val();
          var proveedor=$('#proveedor').val();
          var tipo_linga= $("#tipo_linga").val();
          id=parseInt(id)+1;

          var element = document.createElement('div');
          element.setAttribute('id','carga'+id);
          element.setAttribute('class','col-sm-2 unit draggable  ui-widget-header');
          element.setAttribute("onmousedown",'opciones_lingas(this,event);');
          element.setAttribute("onclick",'sobresalir(this);');
          element.style.background="#a1a4b3";
          var num_int = document.createElement('p');
          num_int.setAttribute('class','number');
          num_int.innerHTML=cantidadCarga;
          element = crear_tipo_linga(element); // SE CREA EL ELEMENTO DEACUERDO A SU  TIPO
            if(element!="0"){
                element.appendChild(num_int);
                  var a= $(".lienzo:visible").attr("id");
                  var b=document.getElementById(a);
                nueva_linga(element,cantidadCarga,tipo_linga,b);
          // LA LINGA SELECCIONADA SERA LA ULTIMA CREADA
        }else{
          $("#btn-crear").attr("onclick", "boton()");
          $("#btn-creador").attr("onclick", "boton()");
        }
  }

// SE BORRO LA MIERDA
function linga_traslapada(){

   var id_tier=$(".lienzo:visible").attr("id");

   var traslapado=0;
   var aux=0;
   $(".unit").css({
     "outline":"#8e8a8a 1px solid",
     "box-shadow":"rgb(0, 0, 0) 0px 0px 0px",
     "background":"#cccccc"
   });
      for (var i = 0; i < Linga.length; i++) {
          if(Linga[i].tier==id_tier){

              var linga_1=buscar_posicion_elemento(Linga[i].id);

                for (var j = 0; j < Linga.length; j++) {
                      if(Linga[j].tier==id_tier && Linga[i].id!=Linga[j].id ){

                          var linga_2=buscar_posicion_elemento(Linga[j].id);

                          traslapado=verificar_traslapada(linga_1,linga_2);

                          if(traslapado){

                            $("#"+Linga[i].id).css({
                              "outline":"rgb(195, 118, 118) solid 1px",
                              "box-shadow":"rgb(206, 134, 134) 0px 2px 5px 1px",
                              "background":"#ff7f7f"
                            });
                            $("#"+Linga[j].id).css({
                              "outline":"rgb(195, 118, 118) solid 1px",
                              "box-shadow":"rgb(206, 134, 134) 0px 2px 5px 1px",
                              "background":"#ff7f7f"
                            });
                            break;
                          }

                      }
                }

          }
      }
      if(linga_seleccionada){
        // LA LINGA SELECCIONADA SIEMPRE ESTARA POR ENCIMA DEL RESTO CON SOMBRA
        $(linga_seleccionada).css("box-shadow","rgb(0, 0, 0) 0px 0px 3px 1.2px");
      }





}

function sobresalir(elemento){
linga_seleccionada=elemento;
  $(elemento).css("box-shadow","rgb(0, 0, 0) 0px 0px 3px 1.2px");
}

function verificar_traslapada(p1,p2){
 if((p1.x1>=p2.x1 && p1.x1<p2.x2)||(p1.x2>p2.x1 && p1.x2<=p2.x2)||(p1.x1<p2.x1&&p1.x2>p2.x2)||(p1.x1>p2.x1&&p1.x2<p2.x2)||(p1.x1==p2.x1&&p1.x2==p2.x2)) {
    if((p1.y1>=p2.y1 && p1.y1<p2.y2)||(p1.y2>p2.y1 && p1.y2<=p2.y2)||(p1.y1<p2.y1&&p1.y2>p2.y2)||(p1.y1>p2.y1&&p1.y2<p2.y2)||(p1.y1==p2.y1&&p1.y2==p2.y2)) {
      console.log("SI");
      return 1;
    }
  }


  return 0;
}

function buscar_posicion_elemento(id){
  var punto_X_1=$("#"+id).position().left;
  var punto_Y_1=$("#"+id).position().top;
  var punto_X_2=parseFloat($("#"+id).position().left)+parseFloat($("#"+id).css("width"));
  var punto_Y_2=$("#"+id).position().top+parseFloat($("#"+id).css("height"));

  var posicion={
    "x1":punto_X_1,
    "x2":punto_X_2,
    "y1":punto_Y_1,
    "y2":punto_Y_2
  }
  return posicion;
}

// SE ESCRIBEN LAS DIMENSIONES DEL TIER Y SE GUARDAN EN VARIABLE GLOBALES
function asignar_numeros_magicos(dato,CALLBACK){
  console.log("ASIGNAR");
  nm_ancho=parseFloat((WIDTH_PX*parseFloat(largo_unit))/parseFloat(dato.ancho));
  nm_largo=parseFloat((HEIGHT_PX*parseFloat(ancho_unit))/parseFloat(dato.largo));

  $("#ancho_lie").text(parseFloat(dato.ancho)+" mts");
  $("#largo_lie").text(parseFloat(dato.largo)+" mts");

  ancho_tier=parseFloat(dato.ancho);
  largo_tier=parseFloat(dato.largo);

  if(primeraCarga==0){
    CALLBACK(listar_embarcadores);
    primeraCarga=1;
  }else{
    return 0;
  }
}

function ancho_linga(ancho){

}

// SE CREAN LAS DIMENSIONES DE LA LINGA DEACUERDO A SU CANTIDAD Y TIPO DE LINGA
function crear_tipo_linga(elemento){
    var tipo_linga= $("#tipo_linga").val();
    var cantidad= $("#cantidad").val();
          // console.log("LARGO: "+largo_tier+" ANCHO: "+ancho_tier);
    switch (tipo_linga) {
      case "Linga":
      // console.log(ancho_tier);
      return new_linga(elemento,cantidad,largo_unit,ancho_unit);
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
        elemento.style.width=((parseFloat(largo*980)*2)/ancho_tier)+"px";
        elemento.style.height=parseFloat(((parseFloat(ancho*473))/largo_tier)*(cantidad/2))+"px";
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
        elemento.style.width=(parseFloat(largo*980)/ancho_tier)+"px";
        elemento.style.height=parseFloat(((parseFloat(ancho*473))/largo_tier)*(cantidad))+"px";
        if(validar_tam(elemento.style.width,elemento.style.height)){
          return elemento;
        }else{
          return 0;
        }

}

// lINGA ESPEJO SIMPLE
function new_espejo_simple(elemento,cantidad,largo,ancho){

        elemento.style.width=parseFloat((parseFloat(ancho*980)/ancho_tier))+"px";
        elemento.style.height=parseFloat((parseFloat(largo*473)/largo_tier)*cantidad)+"px";
        if(validar_tam(elemento.style.width,elemento.style.height)){
          return elemento;
        }else{
          return 0;
        }
}
// LINGA ESPEJO DOBLE
function new_espejo(elemento,cantidad,largo,ancho){
    if(cantidad%2==0){
        elemento.style.width=parseFloat((parseFloat(ancho*980)/ancho_tier)*2)+"px";
        elemento.style.height=parseFloat((parseFloat(largo*473)/largo_tier)*parseFloat((cantidad)/2))+"px";
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
  //
    bodega=elemento.dataset.nbod;
    var i;
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
    if(cantidad<tier_seleccion){
      tier($(".a")[0]);
    }

    $(".bod").attr("class","bod");
    elemento.className="bod activo";
    $(".lienzo").css("display","none");
    $("#liezo-"+bodega+"-"+tier_seleccion).css("display","block");

      // SE MUESTRAN LOS DATOS DEL NUEVO TIER VISIBLE
    datos_tier();
    deseleccionar(); // SE DESELECCIONA LA LINGA SELECCIONADA
    obtener_medidas_tier(bodega,tier_seleccion,asignar_numeros_magicos);
     linga_traslapada();

}

//FUNCION QUE SE EJECUTA AL HACER CLICK EN UN TIER
// PARA MOSTRANDO ESE TIER
function tier(elemento){
    tier_seleccion=$(elemento).data('tier');
    $(".lienzo").css("display","none");
    $(".a").attr("class","a");
    $(elemento).attr("class","a active");
    $("#liezo-"+bodega+"-"+$(elemento).data('tier')).css("display","block");

    datos_tier(); // SE MUESTRAN LOS DATOS DE ESE TIER, REESCRIBIENDOSE LA TABLA
    deseleccionar(); // SE DESELECCIONA LA LINGA SELECCIONADA
    obtener_medidas_tier(bodega,tier_seleccion,asignar_numeros_magicos);
     linga_traslapada();
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
// no la ocupo
function reanudar(){

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
function buscar_bodegas_buque(CALLBACK){

    // ver_bodegas(ROTACION_buque,obtener_medidas_tier);
    CALLBACK(ROTACION_buque,obtener_medidas_tier);
    // datos_embarcadores();
    // datos_puertos();
    // tier_bodegas(ROTACION_buque);
    // datos_tier();
    // restaurar(ROTACION_buque);

}

// CREA TODOS LOS LIENZOS, TIER Y BODEGAS CORRESPONDIENTES A LA NAVE SELECCIONADA
function iniciar_estiba(tier_objeto,callback){

  var i=0;
  var aux=0;
  var num_bod=1;
  var num_tier=1;
  aux = tier_objeto[0];
  var cantidad_tier;
  var cantidad_bodega;
  var padre_tier= $("#nav_tier");
  var padre_bodega= $("#bodegas");
  var padre_lienzo=$("#lllinzo");
  var primera_bodega;
  var j=1;
  var i=1;
                  for(j=0;j<bodegas_obj.length;j++){
                  aux=bodegas_obj[j].cantidad_tier;
                        for(i=0;i<tier_objeto.length;i++){
                              if(bodegas_obj[j].id_bodega == tier_objeto[i].id_bodega){
                                if(bodegas_obj[j].num_bodega==1 && tier_objeto[i].nivel==1){
                                  var lienzo= $("<div class='lienzo ui-widget-header droppable'  id='liezo-"+bodegas_obj[j].num_bodega+"-"+tier_objeto[i].nivel+"'></div>");
                                  $(lienzo).css("display","block");
                                  padre_lienzo.append (lienzo);
                                }

                                var lienzo= $("<div class='lienzo ui-widget-header droppable' id='liezo-"+bodegas_obj[j].num_bodega+"-"+tier_objeto[i].nivel+"'></div>");
                                $(lienzo).css("display","none");
                                padre_lienzo.append (lienzo);
                              }
                      }
                  }
                  for(i=0;i<bodegas_obj.length;i++){
                    var id_bod=$(".bod")[i].id;
                    $("#"+id_bod).css("display","block");
                  }
                //
        callback();
}

// ESCRIBE LOS DATOS DEL TIER VISIBLE SEPARADO POR DESTINOS
function datos_tier(){
  var cantidad_puertos=[];
    var cant_embar_puerto=[];
      var cant_embar_puerto2=[];
  var contador=0;
  var cantidad_unit=0;
  var cantidad_lingas=0;
  var primero=0;
  var puerto=0;
  var padre=$("#tabla_datos");
  var id_tier= $(".lienzo:visible").attr("id");
    // Para obtener la cantidad de puertos a los que van las lingas de respectivo
    // TIER guardandolas en un JSON (cantidad_puertos)
    for(i=0;i<Linga.length;i++){// recorremos todas las lingas de esta rotacion
        if(id_tier == Linga[i].tier){  // si la linga pertenece al tier seleccionado
          if(puerto==0) { // el puerto es dintinto a anterior
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

  cant_embar_puerto=removeDuplicates(cant_embar_puerto);
  var  id_de_puerto=0;

var lingas_t=0;
var unit_t=0;
var peso_t=0;
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
          peso_t=0;
      }

    }
    var datos=$("<tr class='total_tier'><td>Bod"+bodega+"</td><td colspan='3' class='centrado' > Tier "+tier_seleccion+"</td><td>"+unit_total_tier+"</td><td>"+lingas_total_tier+"</td><td>"+parseFloat(peso_total_tier.toFixed(3))+" Tn</td></tr>")
    padre.append(datos);
    console.log(unit_total_tier);
    if(unit_total_tier==0){
      $(".datos_tier").css("display","none");
    }else{
        $(".datos_tier").css("display","block");
    }
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
// function restaurar(ROTACION){
//   buscar_lingas(ROTACION,crear_array_lingas);
// }

// OBTIENE TODAS LAS LINGAS ANTERIORMENTE CREADAS, LAS DIBUJA,
// Y LAS GUARDA EN EL ARRAY GLOBAL DE LINGAS
function crear_array_linga(lingas,callback){
  // console.log(lingas);
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
        nombre_puerto:lingas[i].puerto,
        marca_a: lingas[i].marca_arauco,
        marca_cmpc: lingas[i].marca_cmpc,
        marca:lingas[i].marca,
        empresa:lingas[i].company
      });
    }
    id=parseInt(id)+i+1;
 callback(ROTACION_buque,iniciar_estiba);
}

// DIBUJA TODAS LAS LINGAS CORRESPONDIENTES A CADA TIER ANTERIORMENTE CREADAS PARA ESA ROTACION
function dibujar_lingas_tier(){
  // console.log(Linga);
    for(var i=0;i<Linga.length;i++){
      $(".lienzo").css("display","none");
      $("#"+Linga[i].tier).css("display","block");
    var padre=$("#"+Linga[i].tier);

    var left=$(padre).position().left;
    var top=$(padre).position().top;

      if(Linga[i].giro==0){
          var linga_tier=$("<div id="+Linga[i].id+" class="+Linga[i].clase+"   onmousedown='opciones_lingas(this,event)' onclick='sobresalir(this)' ><p class='number'>"+Linga[i].cantidad+"</p></div>");
      }else{
          var linga_tier=$("<div id="+Linga[i].id+" class="+Linga[i].clase+" onmousedown='opciones_lingas(this,event)' onclick='sobresalir(this)' ><p class='giro1'>"+Linga[i].cantidad+"</p></div>");
      }
    var marca="";
      if(Linga[i].empresa=="ARAUCO" && Linga[i].marca==1){
         marca=$("<img src='../imagenes/marcas/ARAUCO/"+Linga[i].marca_a+".png' width='23px'>");
        // console.log(Linga[i].id_linga);
        // console.log(Linga[i].id);
      }
      if(Linga[i].empresa=="CMPC" && Linga[i].marca==1){
       marca=$("<img src='../imagenes/marcas/CMPC/"+Linga[i].marca_cmpc+".png' width='23px'>");
      }
      // ESTILOS DE LA IMAGEN DE LA MARCA
      $(marca).css({
        "position":"absolute",
        "top":4,
        "left":4
      });
      console.log("es");
    $(linga_tier).css({
      "position":"absolute",
      "left":parseFloat(Linga[i].pos_y)+"px",
      "top":parseFloat(Linga[i].pos_x)+"px",
      "width":Linga[i].ancho,
      "height":Linga[i].alto,
      "text-align":"center",
      "background":"#a1a4b3"
    });
          linga_tier.append(marca);
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
  var ancho=$("<p class='dim'>"+ancho.toFixed(2)+"</p>").css({
    "position":"absolute",
    "top":102+"%",
    "left":"47%",
    "font-weight": "bold",
    "color": "#6d6b6b"
  });
    elemento.append(ancho);

  var largo=parseFloat(elemento[0].style.height);
  largo=parseFloat((parseFloat(largo)*parseFloat(largo_tier))/473);
  var largo=$("<p class='dim'>"+largo.toFixed(2)+"</p>").css({
    "position":"absolute",
    "top":"40%",
    "left":"calc(100% - 3px)",
    "transform":"rotate(90deg)",
    "font-weight": "bold",
    "color": "#6d6b6b"
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
