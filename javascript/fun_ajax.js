// ESTAS FUNCIONES SON SOLO AJAX

// RESCATA TODOS LOS DATOS DE LOS BUQUES
function ver_buques(){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":1},
     datatype:"json",
  }).done(function(info){
    var data=JSON.parse(info);
      buques_obj=data;
     listar_buques();
  }).error(function(error){
  alert("No se han podido cargar los datoooos");
  });
}

// RESCATA TODOS LOS DATOS DE LA NAVE SELECCIONADA
function ver_bodegas(ROTACION,callback){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":2,"ROTACION":ROTACION},
     datatype:"json"
  }).done(function(info){
      bodegas_obj=JSON.parse(info);
      callback(bodega,tier_seleccion,asignar_numeros_magicos);
  }).error(function(){
  // alert("No se han podido cargar los datoos");
  });
}


function marcar_linga_arauco(id_linga,id_obj_linga,posicion){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
     data:{
        "opcion":19,
        "id_linga":id_linga
      },
     datatype:"json",
     success: function(info) {
       var data=JSON.parse(info);
       console.log(data);
       Linga[posicion].marca=1;
       if(data.marca_arauco==""){

         alert("Asignar marca a la linga");
       }else{
         var linga_tier=$("#"+id_obj_linga);
                  var marca=$("<img src='../imagenes/marcas/ARAUCO/"+data.marca_arauco+".png' width='23px'>");
                  // ESTILOS DE LA IMAGEN DE LA MARCA
                  $(marca).css({
                    "position":"absolute",
                    "top":4,
                    "left":4
                  });
                  linga_tier.append(marca);
       }

     },
     error: function(error){
       alert("error");
     }
  });
}
function ver_marcas_arauco(callback){

  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
     data:{
        "opcion":22,
        "rotacion":ROTACION_buque
      },
     datatype:"json",
     success: function(info) {
      var data=JSON.parse(info);
      callback(data);
     },
     error: function(error){
       alert("error");
     }
  });
}

function editar_marcas_arauco(){
    var datos=$(".select_MA select");

    for (var i = 0; i < datos.length; i++) {
        $($(".select_MA > select")[i]).attr("data-marca",$(datos[i]).val());
    }
    // console.log($($(".select_MA select")[0]).data());

      var marca="";
      var puerto="";
      for (var i = 0; i < datos.length; i++) {
          puerto=$($(".select_MA select")[i]).data("puerto");
          marca=$($(".select_MA select")[i]).data("marca");
          modificar_marcas_ajax(puerto,marca,function(){
    console.log("sin=");

              for(i=0;i<Linga.length;i++){
                  if(Linga[i].empresa=="ARAUCO" && Linga[i].nombre_puerto==puerto ){
                      Linga[i].marca_a=marca;
                    if(Linga[i].marca==1){
                      if($("#"+Linga[i].id).find('img')[0]){
                        $("#"+Linga[i].id).find('img')[0].remove();
                      }else{
                        console.log("no tiene marca");
                      }

                        var marcaOBJ=$("<img src='../imagenes/marcas/ARAUCO/"+marca+".png' width='23px'>");
                        // ESTILOS DE LA IMAGEN DE LA MARCA
                        $(marcaOBJ).css({
                          "position":"absolute",
                          "top":4,
                          "left":4
                        });
                        $("#"+Linga[i].id).append(marcaOBJ);
                    }

                  }
              }
          });
      }
        $("#modal_marca_arauco").modal("hide");
        $("#edit_marca").attr("onclick","crear_select_marcas()");
}

//MODIFICA TODAS LAS MARCAS DE ARAUCO
function modificar_marcas_ajax(puerto, marca,callback){

      $.ajax({
         type:"POST",
         url:"../php/funciones_php.php",
         data:{
            "opcion":23,
            "rotacion":ROTACION_buque,
            "puerto":puerto,
            "marca":marca
          },
          datatype:"json",
          success: function(info) {
            console.log("info: "+info);
            callback();
         },
         error: function(error){
           alert("error");
         }
      });

}
function marcar_linga_CMPC(id_linga,id_obj_linga,posicion){
  console.log(Linga);
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
     data:{
        "opcion":20,
        "id_linga":id_linga

      },
     datatype:"json",
     success: function(info) {
      var data=JSON.parse(info);
      var linga_tier=$("#"+id_obj_linga);
       Linga[posicion].marca=1;
               var marca=$("<img src='../imagenes/marcas/CMPC/"+data.marca_cmpc+".png' width='23px'>");
               // ESTILOS DE LA IMAGEN DE LA MARCA
               $(marca).css({
                 "position":"absolute",
                 "top":4,
                 "left":4
               });
               linga_tier.append(marca);
     },
     error: function(error){
       alert("error");
     }
  });
}

function Guardar_marca_arauco( ){
    var id_linga=linga_seleccionada.id;
    var id_linga_bd;
    //Busco el id de la linga en la base de datos
    for(i=0;i<Linga.length;i++){
          if(id_linga==Linga[i].id){
              id_linga_bd=Linga[i].id_linga;
              break;
          }
    }

    $("#View_Marca").empty();
    var marca_selec=$("#select_Marca_Arauco").val();
    if(marca_selec=="-"){
      alert("Error de seleccion");
    }else{
      $.ajax({
         type:"POST",
         url:"../php/funciones_php.php",
         data:{
            "opcion":19,
            "id_linga":id_linga_bd,
            "marca":marca_selec
          },
         datatype:"json",
         success: function(info) {
           console.log(marca_selec);
           console.log(info);
          var linga_tier=$("#"+id_linga);
                   var marca=$("<img src='../imagenes/marcas/ARAUCO/"+marca_selec+".png' width='23px'>");
                   // ESTILOS DE LA IMAGEN DE LA MARCA
                   $(marca).css({
                     "position":"absolute",
                     "top":4,
                     "left":4
                   });
                   linga_tier.append(marca);
         },
         error: function(error){
           alert("error");
         }
      });
    }
}


function desmarcar_linga(id_linga,id_obj_linga,posicion){
  console.log(Linga);
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
     data:{
        "opcion":21,
        "id_linga":id_linga
      },
     datatype:"json",
     success: function(info) {
        Linga[posicion].marca=0;
       console.log(info);
      $('#'+id_obj_linga).find('img')[0].remove();
     },
     error: function(error){
       alert("error");
     }
  });
}
// RESCATA TODOS LOS DATOS DEL TIER DE LA ROTACION SELECCIONADA
function ver_tier(id_IMO){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":3,"id_bodega":id_IMO},
     datatype:"json"
  }).done(function(info){
     var data=JSON.parse(info);
  }).error(function(){
  // alert("No se han podido cargar los datos");
  });
}

// RESCATA TODOS LOS DATOS CONMBINADOS DE TIER Y BODEGAS RELACIONADOS AL LA ROTACION
function tier_bodegas(ROTACION,callback){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":4,"ROTACION":ROTACION},
     datatype:"json",
  }).done(function(info){
    var data=JSON.parse(info);
      tier_obj=data;
      if(tier_obj && tier_obj.length){
          callback(tier_obj,dibujar_lingas_tier);
      } else {
         $(".cuerpo").fadeOut();
         $(".cuerpo0").fadeIn();
         $("#lingas-boton").fadeOut();
         $(".con2").fadeOut();
      }
  }).error(function(error){
  });

}

// RESCATA TODOS LOS DATOS DE LOS EMBARCADORES GUARDANDOLOS EN UN OBJETO
function datos_embarcadores(dato_medidas,callback){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":5},
     datatype:"json",
  }).done(function(info){
    var data=[];
    data=  JSON.parse(info);
    // SE LISTAN LOS EMBARCADORES EN EL <select>
    // MENU CREADOR DE LINGAS LATERAL
    //callback=listar_embarcadores
    callback(data,dato_medidas,asignar_numeros_magicos);
    datos_unit=data;
  }).error(function(error){
  // alert("No se han podido cargar los datoooos");
  });
}

// DEVUELVE TODOS LOS DATOS DE LOS PUERTOS GUARDANDOLO EN UN OBJETO
function datos_puertos(callback){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":14},
     datatype:"json",
  }).done(function(info){
    var data=[];
    data=  JSON.parse(info);
    // LISTA LOS PUERTOS EN EL <select> CREADOR DE LINGAS LATERAL
    //callback=listas_puertos;
    callback(data,buscar_lingas);
  }).error(function(error){
  // alert("No se han podido cargar los datoooos");
  });
}

// DEVUELVE LAS DIMENSIONES DEL UNIT SELECCIONADO PARA CALCULAR LAS DIMENSIONES DE LA LINGA
function nueva_dimension_linga(id){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":6,"id":id},
     datatype:"json",
  }).done(function(info){
    var dato=JSON.parse(info);
    // GUARDA LAS DIMENSIONES DEL UNIT SELECCIONADO EN VARIABLES GLOBALES
        largo_unit=dato.largo;
        ancho_unit=dato.ancho;

  }).error(function(error){
  // alert("No se han podido cargar los datoooos");
  });
}

// DEVUELEV LAS DIMENSIONES DEL TIER SELECCIONADO
function obtener_medidas_tier(bodega,tier_seleccion,callback){
  // console.log(bodega);
  // console.log(tier_seleccion);
  var Rotacion =bodegas_obj[0].id_buque;
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{
        "opcion":9,
        "num_b":bodega,
        "num_t":tier_seleccion,
        "ROTACION":Rotacion
      },
     datatype:"json",
  }).done(function(info){
    var dato=JSON.parse(info);
    callback(dato,listar_embarcadores);
    // asignar_numeros_magicos(dato); // SE ASIGNAN COLOCAL LAS DIMENSIONES DEL TIER
  }).error(function(error){
  // alert("No se han podido cargar los datoooos");
  });
}


// SE GUARDA LA LINGA AL CREARSE
function guardar_linga(ElementPadre,ElementHijo,callback){
  var id_buque =bodegas_obj[0].id_buque;
  var Lingaa= Linga[Linga.length-1];

  // CASTEO UN JSON, PARA PODER ENVIARLO POR POST Y DECODIFICARLO EN EL PHP
  var LingaPHP = JSON.stringify(Lingaa);
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
     data:{
        "opcion":10,
        "linga":LingaPHP,
        "rotacion":ROTACION_buque,
        "id_buque":id_buque,
        "bodega":bodega
      },
     datatype:"json",
     success: function(info) {
           Linga[Linga.length-1].id_linga=parseInt(info);
            ElementPadre.appendChild(ElementHijo);
            info_bodegas();
            $("#linga div:first").appendTo('#linga:first');
            $(".unit").css("box-shadow","0 0 0 #000");
            $(ElementHijo).css("box-shadow","rgb(0, 0, 0) 0px 0px 3px 1.2px");
             linga_seleccionada=ElementHijo;
             datos_tier(); // SE REFRESCAN LOS DATOS DE LA TABLA DE LINGAS
             $(ElementHijo).css("position","absolute"); // SE LE DA POSICION ABSOLUTA
             elemento_arrastrable(ElementHijo); // SE LE ASIGNA LA PROPIEDAD ARRASTRABLE
             callback(info);
     },
     error: function(error){
           alert("No se han podido cargar los daartoooos");
        Linga.pop();
     }
  });
}

// ESTA FUNCION SE EFECTUA AL MOMENTO DE SOLTAR O DEJAR DE MOVER LA LINGA
// EDITANDO SU POSICION ANTERIOR POR LA NUEVA
function editar_linga_posicion(lingaa){
    // CASTEO UN JSON, PARA PODER ENVIARLO POR POST Y DECODIFICARLO EN EL PHP
    var LingaPHP = JSON.stringify(lingaa);
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{
        "opcion":11,
        "linga":LingaPHP
      },
     datatype:"json",
  }).done(function(info){
  }).error(function(error){
    alert("No se han podido cargar los datoooos");
  });
}

// ESTA FUNCION SE EJECUTA AL MOMENTO DE ROTAR LA LINGA
// MODIFICANDO SU ROTACION
function editar_rotacion_linga(lingaa){
  // CASTEO UN JSON, PARA PODER ENVIARLO POR POST Y DECODIFICARLO EN EL PHP
  var LingaPHP = JSON.stringify(lingaa);
  $.ajax({
    type:"POST",
    url:"../php/funciones_php.php",
    data:{
      "opcion":12,
      "linga":LingaPHP
    },
    datatype:"json",
  }).done(function(info){
  }).error(function(error){
  alert("No se han podido cargar los datoooos");
  });
}

// ESTA FUNCION SE EJECUTA AL MOMENTO DE ELIMINAR LA LINGA
function eliminar_linga_bd(id_linga){
  $.ajax({
    type:"POST",
    url:"../php/funciones_php.php",
    data:{"opcion":13,"id_linga":id_linga},
    datatype:"json",
  }).done(function(info){
  }).error(function(error){
  alert("No se han podido cargar los datoooos");
  });
}

// ESTA FUNCION RESCATA EL NOMBRE UN PUERTO CON SU ID
function nombre_puerto_por_id(id_puerto){
  $.ajax({
    type:"POST",
    url:"../php/funciones_php.php",
    data:{"opcion":15,"id_puerto":id_puerto},
    datatype:"json",
  }).done(function(info){
      var dato=JSON.parse(info);
      nombre_puerto=dato["puerto"];  // SE GUARDA EL NOMBRE EL PUERTO SELECCIONADO EN VARIABLE GLOBAL
  }).error(function(error){
  alert("No se han podido cargar los datoooos");
  });
}

// AL MOMENTO DE INICIAL LA ESTIBA SE RESCATA DE LA BASE DE DATOS TODAS LAS
// LINGAS ANTERIORMENTE GUARDADAS EN LA ROTACION
function buscar_lingas(ROTACION,callback){
  $.ajax({
       type:"POST",
      url:"../php/funciones_php.php",
        data:{"opcion":16,"ROTACION":ROTACION},
       datatype:"json"
    }).done(function(info){
        lingas_BD=JSON.parse(info); // SE GUARDAN EN UNA VARIABLE GLOBAL
        //callback= crear_array_linga
        callback(lingas_BD,tier_bodegas); // SE GUARDAN LAS LINGAS ANTERIORES EN EL ARRAY DE LINGAS
    }).error(function(){
  });
}

// SE OBTIENE EL NOMBRE DEL EMBARCADOR CON SU ID
function nombre_embarcador(id){
  $.ajax({
     type:"POST",
    url:"../php/funciones_php.php",
      data:{"opcion":17,"id_emb":id},
     datatype:"json"
  }).done(function(info){
    var dato=JSON.parse(info);
      $("#"+embarcador).text(dato.nombre_unit); // SE ASIGNA EL NOMBRE DEL EMBARCADOR EN LA TABLA DE DATOS
  }).error(function(){
  });
}
function conexion(){
  if(navigator.onLine){
    return 1;
  } else {
    return 0;
  }
}
