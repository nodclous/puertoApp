var cant_bod=0;
var rot=0;
$(document).ready(function(){
  $(document).bind("contextmenu",function(e){ //No mostrar menu por defecto con boton derecho
      return false;
  });
  $("#menuCapa").mouseleave(function(){ // esconder el menu de boton derecho al salir de el
      $("#menuCapa").hide("fast");
  });
  if (localStorage.getItem('ROTACION')) {
    ROTACION = localStorage.getItem('ROTACION');
    rot=ROTACION;
    // funcion ajax: rescata cantidad de bodegas del buque y el numero mas alto de tier
    // solo para hacer el dibujo inicial
    comenzar(ROTACION);
    // info_general(ROTACION,generar_plano);
  }
});
function comenzar(ROTACION){
  info_general(ROTACION,function(info,ROTACION){
    generar_plano(info,ROTACION,function(ROTACION){
       info_buque(ROTACION,function(info,ROTACION){
         crear_bodegas(info,ROTACION,function(ROTACION){
           lingas_nave(ROTACION, function(data){
             datos_tier(data,function(ROTACION){
               puertos_cmpc(ROTACION,function(data,ROTACION,strin){
                 tabla_puertos_finales(data,ROTACION,"CMPC",function(ROTACION){
                    puertos_arauco(ROTACION,function(data,ROTACION,string){
                      tabla_puertos_finales(data,ROTACION,"ARAUCO",function(ROTACION){
                        resultados_tabla_inferior(ROTACION,function(data,v){
                            datos_tabla_inferior(data);
                            secuence(ROTACION);
                            gran_total();
                            inicio();
                            console.log("pagina completamente cargadaa");

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

function opciones_secuence(e,event){
      if(event.button==2){
           $("#menuCapa").css("top",event.pageY-2);
           $("#menuCapa").css("left",event.pageX-70);
           $("#menuCapa").show("fast");
      }
      linga_seleccionada=e;
}
function inicio(){
   $("#cargando").animate({
       opacity:0,
     },100,function (){
       $("#cargando").css("display","inline-block");
       $("#container").animate({
           opacity:1,
         },200,function (){
       });
   });
}

function info_general(ROTACION,callback){
  $.ajax({
     type:"POST",
     url:"../php/funciones_plano.php",
     data:{"opcion":1, "rotacion":ROTACION},
     datatype:"json",
  }).done(function(info){
    callback(info,ROTACION,info_buque); // Se dibujan los tier y bodegas que tiene ese buque antes de poner los datos
  }).error(function(error){
      alert("No se ha podido cargar datos iniciales");
  });
}

//GENERO EL ESQUELETO DEL PLANO GENERAL, CANTIDAD DE TIER, POR CANTIDAD DE BODEGAS
function generar_plano(info,ROTACION,callback){
  var datos=JSON.parse(info);
  $("#nameNave").html(datos[0].nombre); // Se le asigna el nombre del buque en el titulo
  var tierHead=$("<tr class='tier-P'></tr>");
  cant_bod=datos[0].cantidad_bodegas;
    for (var i = datos[0].cantidad_bodegas; i > 0; i--) {
      var bodega=$("<td class='bodega-P head-P'>"+(i)+"</td>");
      tierHead.append(bodega);
    }
    $("#planoBody").append(tierHead);
    for (var j = datos[0].cant_tiers; j >= 1; j--) {
      var tier_P=$("<tr class='tier-P' id=tier"+(j)+"></tr>");
        for (var k = datos[0].cantidad_bodegas; k >0 ; k--) {
          var bodega=$("<td class='bodega-P' id='bodega"+(k)+"-"+j+"'></td>");
          tier_P.append(bodega);
        }
      $("#planoBody").append(tier_P);
    }
    callback(ROTACION,crear_bodegas);  // Funcion ajax: Rescata cantidades de tier por bodega
}

function info_buque(ROTACION,callback){ // callback=crear_bodegas
  $.ajax({
     type:"POST",
     url:"../php/funciones_plano.php",
     data:{"opcion":2, "rotacion":ROTACION},
     datatype:"json",
  }).done(function(info){
    callback(info,ROTACION,lingas_nave);  // crea cada tier, con su numero identificados en la esquina superior derecha
  }).error(function(error){
      alert("No se han podido cargar los datos de la nave");
  });
}
                            //callback=lingas_nave
function crear_bodegas(info,ROTACION,callback){ //Le pongo el numerito en la esquina, y asigno ID a cada tier.
    var datos_bodega=JSON.parse(info);
  for (var i = 0; i < datos_bodega.length; i++) {
    for (var j = 1; j <= datos_bodega[i].cant_tiers; j++) {
       $("#bodega"+(i+1)+"-"+j).append("<span class='tierNum'>"+j+"-"+(i+1)+"</span><table class='tab_tier'></table>");
    }
  }
  callback(ROTACION,datos_tier);
}

function lingas_nave(ROTACION,callback){ //callback=datos_tier
  $.ajax({
     type:"POST",
     url:"../php/funciones_plano.php",
     data:{"opcion":3, "rotacion":ROTACION},
     datatype:"json",
  }).done(function(info){
    var data=JSON.parse(info);
    callback(data,puertos_arauco);
  }).error(function(error){
      alert("No se han podido cargar los datos de la carga");
  });
}

// CREO LOS DATOS DE LOS TIER, EN LA TABLA GENERAL
function datos_tier(datos_tier,callback){ //callback=puertos_finales
  var nom_puerto=null;
  var nivel_Tier=null;
  var nivel_Bod=null;
  var nom_planta=null;
  console.log(datos_tier);
  for (var i = 0; i < datos_tier.length; i++) {

      // GUARDO EN UNA VARIABLE LA MARCA CORRESPONDIENTE ARAUCO O CMPC
              var marca;
              if(datos_tier[i].empresa=="ARAUCO"){
                console.log(datos_tier[i].marca_arauco);
                if(datos_tier[i].marca_arauco==""){

                  marca="<span class='dato-body-tier nom-planta'>"+datos_tier[i].planta+"</span>";
                }else{
                  marca="<span class='dato-body-tier nom-planta'>"+datos_tier[i].planta+"<img src='../imagenes/marcas/"+datos_tier[i].empresa+"/"+datos_tier[i].marca_arauco+".png'/></span>";

                }
              }
              if(datos_tier[i].empresa=="CMPC"){
                if(datos_tier[i].marca_cmpc==""){
                  marca="<span class='dato-body-tier nom-planta'>"+datos_tier[i].planta+"</span>";
                }else{
                  marca="<span class='dato-body-tier nom-planta'>"+datos_tier[i].planta+"<img src='../imagenes/marcas/"+datos_tier[i].empresa+"/"+datos_tier[i].marca_cmpc+".png'/></span>";

                }
              }
                console.log("da");
                console.log(datos_tier);
      // ELEMENTO HTML DEL PUERTO
       var puerto= $("<tr><td><div class='destino-T'><div class='head-T'><span class='tierTitle'>"+datos_tier[i].puerto+"</span></div></div></td></tr>");

       // ELEMENTO HTML DE LAS PLANTAS QUE IRAN LISTADA DEBAJO DEL NOMBRE DEL PUERTO
       // var planta=$("<div class='body-T'><div class='planta-T'>"+
       //                "<span class='dato-body-tier nom-planta'>"+datos_tier[i].planta+"</span>"+
       //                "<div class='datos-planta'><span class='num-unit'>"+datos_tier[i].unit+" ut</span>"+
       //                "<span class='num-tn'>"+datos_tier[i].peso+" tn</span></div></div></div>");
       var planta2=$("<div class='head-T'><div class='body-T'><div class='planta-T'>"+marca+
                    "<div class='datos-planta'><span class='num-unit'>"+datos_tier[i].unit+" ut</span>"+
                    "<span class='num-tn'>"+datos_tier[i].peso+" tn</span></div></div></div></div>");


        // SI EL NOMBRE DEL PUERTO ES DISTINTO SIGNIFICA QUE
        // ESTAMOS EN OTRO TIER   O   EL TIER TIENE DOS PUERTOS DISTINTOS
        if(nom_puerto!=datos_tier[i].puerto){
              // SI ESTAMOS EN UN TIER DISTINTO
              if(parseInt(nivel_Tier)!=parseInt(datos_tier[i].nivel) || (parseInt(nivel_Bod)!=parseInt(datos_tier[i].num_bodega))){
                $(puerto).css("background",datos_tier[i].color);
                var dat_puerto=  $("#bodega"+(datos_tier[i].num_bodega)+"-"+(datos_tier[i].nivel)+" >table")[0];
                  $(dat_puerto).append(puerto);
                  $("#bodega"+(datos_tier[i].num_bodega)+"-"+(datos_tier[i].nivel)+" .destino-T").append(planta2);
                nom_puerto=datos_tier[i].puerto;
                nivel_Bod=datos_tier[i].num_bodega;
                nivel_Tier=datos_tier[i].nivel;
              }else{
                // SI ESTAMOS EN EL MISMO TIER
                var puerto2= $("<tr><td><div class='destino-T'><div class='head-T'><span class='tierTitle'>"+datos_tier[i].puerto+"</span></div></div></td></tr>");
                $(puerto2).css("background",datos_tier[i].color);
                $(puerto2).css("border-top","solid 1px");
                $("#bodega"+(datos_tier[i].num_bodega)+"-"+(datos_tier[i].nivel)+" >table").append(puerto2);

                var tier=$("#bodega"+(datos_tier[i].num_bodega)+"-"+(datos_tier[i].nivel)+" .destino-T:last-child");
                var tier_a=tier[tier.length-1];
                $(tier_a).append(planta2);
                nom_puerto=datos_tier[i].puerto;
                nivel_Bod=datos_tier[i].num_bodega;
                nivel_Tier=datos_tier[i].nivel;
              }
        }else{ // SI EL NOMBRE DEL PUERTO ES IGUAL

              // SI ESTAMOS EN OTRO TIER, SIGNIFICA QUE ES OTRA PLANTA AL MISMO DESTINO
              if(parseInt(nivel_Tier)!=parseInt(datos_tier[i].nivel) || (parseInt(nivel_Bod)!=parseInt(datos_tier[i].num_bodega))){
                $(puerto).css("background",datos_tier[i].color);
                var dat_puerto=  $("#bodega"+(datos_tier[i].num_bodega)+"-"+(datos_tier[i].nivel)+" >table")[0];
                  $(dat_puerto).append(puerto);

                  $("#bodega"+(datos_tier[i].num_bodega)+"-"+(datos_tier[i].nivel)+" .destino-T").append(planta2);

                nom_puerto=datos_tier[i].puerto;
                nivel_Bod=datos_tier[i].num_bodega;
                nivel_Tier=datos_tier[i].nivel;
              }else{
                var tier=$("#bodega"+(datos_tier[i].num_bodega)+"-"+(datos_tier[i].nivel)+" .destino-T:last-child");
                var tier_a=tier[tier.length-1];
                      $(tier_a).append(planta2);
                      nom_puerto=datos_tier[i].puerto;
                      nivel_Bod=datos_tier[i].num_bodega;
                      nivel_Tier=datos_tier[i].nivel;
                }

        }
        planta2="";
      }
      callback(ROTACION,tabla_puertos_finales);
}


function puertos_cmpc(ROTACION,callback){ // callback=
  $.ajax({
     type:"POST",
     url:"../php/funciones_plano.php",
     data:{"opcion":4, "rotacion":ROTACION},
     datatype:"json",
  }).done(function(info){
    var data=JSON.parse(info);
    callback(data,ROTACION,"CMPC",puertos_arauco);

    // puertos_transito(ROTACION);
  }).error(function(error){

    alert("No se han podido cargar de las puertos de destino");
  });
}

Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

//CAMBIAR NOMBRE DESPUES
function tabla_puertos_finales(datos,ROTACION,nom_tabla,callback){ //ARAUCO
  console.log(datos);


  var puertos=T_puertos(datos).unique();
  var puertos_c=T_puertos_color(puertos,datos);
  var marcas=T_marcas(datos,nom_tabla,puertos);
  var plantas=T_plantas(datos).unique();
  var tabla=$("#tabla_"+nom_tabla);
  var tr_marcas=$("#tabla_"+nom_tabla+"_marcas");
  var tr_puertos=$("#tabla_"+nom_tabla+"_puertos");
  var total_planta=0;
  var total_puerto=[];
  var total_total=0;
  var aux=0;
  var marca_aux="";
  console.log();

    if(marcas.length>0){

     for (var i = 0; i < marcas.length; i++) {
       console.log(marcas);
       if(marcas[i]==""){
         $(tr_marcas).append("<td class='img_marca_tabla datos_tbl titulos_tablas'>-</td>");
       }else{
           $(tr_marcas).append("<td class='img_marca_tabla datos_tbl titulos_tablas'><img src='../imagenes/marcas/"+nom_tabla+"/"+marcas[i]+".png'/></td>");
       }

     }
      $(tr_marcas).append("<td class='datos_tbl titulos_tablas'></td>");
     for (var i = 0; i < puertos_c.length; i++) {
       if(datos[0].puerto1){
         var td=$("<td class='datos_tbl titulos_tablas' title='"+datos[0].puerto1+"'>"+puertos_c[i].nombre+"</td>");
         $(td).css("background",puertos_c[i].color);
         $(tr_puertos).append(td);
       }else{
         var td=$("<td class='datos_tbl titulos_tablas' >"+puertos_c[i].nombre+"</td>");
         $(td).css("background",puertos_c[i].color);
         $(tr_puertos).append(td);
       }
     }
     $(tr_puertos).append("<td class='datos_tbl titulos_tablas'>Total</td>");
     for (var i = 0; i < plantas.length; i++) {
       var nom_planta=plantas[i];
       var tr=$("<tr></tr>");
       $(tr).append("<td class='datos_tbl titulos_tablas'>"+nom_planta+"</td>");
       for (var k = 0; k < puertos.length; k++) {
            var nom_puerto=$("#tabla_"+nom_tabla+" tr td")[puertos.length+k+3].innerHTML;
                  for (var j = 0; j < datos.length; j++) {
                      if(datos[j].planta==plantas[i] && datos[j].puerto==nom_puerto){
                        var td=$("<td class='datos_tbl'>"+datos[j].peso+"</td>");
                        $(td).css("background",datos[j].color);
                        $(tr).append(td);
                        total_planta=parseFloat(total_planta)+parseFloat(datos[j].peso);
                        total_total=parseFloat(total_total)+parseFloat(datos[j].peso);
                        if(total_puerto[k]==null)total_puerto[k]=0;
                        total_puerto[k]=parseFloat(total_puerto[k])+parseFloat(datos[j].peso);
                        aux=1;
                        break;
                      }
                  }
              if(aux==1){
                    aux=0;
              }else{
                $(tr).append("<td class='datos_tbl'></td>");
              }
       }
       $(tr).append("<td class='datos_tbl'>"+total_planta.toFixed(2)+"</td>");
       $(tabla).append(tr);
       total_planta=0;
     }
     total_puerto.push(total_total);
     var tr=$("<tr></tr>");
     $(tr).append("<td class='datos_tbl titulos_tablas'>Total</td>");
      for (var i = 0; i < total_puerto.length; i++) {
        var peso=parseFloat(total_puerto[i]);
         if(i==(total_puerto.length-1)){
          $(tr).append("<td class='totales datos_tbl' id='total"+nom_tabla+"'>"+peso.toFixed(2)+"</td>");
         }else{
        $(tr).append("<td class='datos_tbl'>"+peso.toFixed(2)+"</td>");
         }
      }

       $(tabla).append(tr);
     }else{
          $("#tabla_"+nom_tabla).css("display","none");
     }
       if(nom_tabla=="CMPC"){
         // console.log(nom_tabla);
         callback(ROTACION,datos_tabla_inferior);
       }else{
         // console.log(nom_tabla);
         callback(ROTACION,tabla_puertos_finales);
       }
}

function puertos_arauco(ROTACION,callback){
  $.ajax({
     type:"POST",
     url:"../php/funciones_plano.php",
     data:{"opcion":5, "rotacion":ROTACION},
     datatype:"json",
  }).done(function(info){
    var data=JSON.parse(info);
     callback(data,ROTACION,"ARAUCO",resultados_tabla_inferior);

    // resultados_tabla_inferior(ROTACION);
  }).error(function(error){
      alert("No se han podido cargar de las puertos de transito");
  });
}
function gran_total(){
  var totales_A=$("#totalARAUCO").text();
  var totales_C=$("#totalCMPC").text();
  var total=0;
  // console.log(totales_A);
    if($("#totalARAUCO").text()){
      total=total+parseFloat(totales_A);
    }
    if($("#totalCMPC").text()){
      total=total+parseFloat(totales_C);
    }

      // console.log(total);
  $("#gran_total").text(total.toFixed(3));
}
function T_puertos(datos) {
  var arreglo=[];
  for (var i = 0; i < datos.length; i++) {
       arreglo.push(datos[i].puerto);
    }
    return arreglo;
 }
 function T_puertos_color(puertos,datos) {
   var arreglo=[];
   for (var j = 0; j < puertos.length; j++) {
         for (var i = 0; i < datos.length; i++) {
           if(datos[i].puerto==puertos[j]){
             arreglo.push({
               nombre:datos[i].puerto,
               color:datos[i].color
             });
             break;
           }
         }
   }
     return arreglo;
  }
 function T_plantas(datos) {
   var arreglo=[];
   for (var i = 0; i < datos.length; i++) {
        arreglo.push(datos[i].planta);
     }
     return arreglo;
  }
  function T_marcas(datos,empresa,puertos) {
    var arreglo=[];
      console.log(datos);
        for (var j = 0; j < puertos.length; j++) {
                for (var i = 0; i < datos.length; i++){
                      if(puertos[j]==datos[i].puerto){
                            if(empresa.localeCompare("CMPC")==0){
                              arreglo.push(datos[i].marca_cmpc);
                            }
                            if(empresa.localeCompare("ARAUCO")==0){
                              arreglo.push(datos[i].marca_arauco);
                            }
                        break;
                      }
                }
         }
      return arreglo;
}

function resultados_tabla_inferior(ROTACION,callback){
 $.ajax({
    type:"POST",
    url:"../php/funciones_plano.php",
    data:{"opcion":6, "rotacion":ROTACION},
    datatype:"json",
 }).done(function(info){
    var data=JSON.parse(info);

    callback(data,"hola");
 }).error(function(error){
     alert("No se han podido cargar los datos de la tabla inferior");
 });
}
function datos_tabla_inferior(datos){
  var aux=0;
  var puertos=T_puertos(datos).unique();
  var puertos_c=T_puertos_color(puertos,datos);
  var tabla=$("#planoBody");
  var tbody=$("<tbody class='resumen_inferior'></tbody>");
  tabla.append(tbody);
       for (var i = 0; i < puertos_c.length; i++) {

             var tr=$("<tr><td colspan="+cant_bod+">"+puertos_c[i].nombre+"</td></tr>").css("background",puertos_c[i].color);
             $(tbody).append(tr);
             var tr=$("<tr></tr>");
             var totales_bod_puerto=datos_por_puerto(puertos_c[i].nombre,datos);
                 for (var j = cant_bod; j > 0; j--){
                          for (var k = 0; k < totales_bod_puerto.length; k++) {
                              if(totales_bod_puerto[k].num_bodega==j){
                                var td=$("<td>"+totales_bod_puerto[k].peso+"</td>").css("background",puertos_c[i].color);
                                  $(tr).append(td);
                                  aux=1;
                                    break;
                               }
                          }
                        if(aux==0){
                              $(tr).append("<td></td>");
                        }else{
                                aux=0;
                        }
                    $(tbody).append(tr);
                 }
        }
  var total_bodega=total_por_bodega(datos);
  // console.log(total_bodega);
 var tr_final=$("<tr></tr>").css({
             "background":"#ffc107",
             "font-weight":"bold",
             "border-top":"solid"
             });
  for (var i = total_bodega.length-1; i >= 0; i--) {
    if(total_bodega[i]==0){
      var td=$("<td>---</td>");
    }else{
      var td=$("<td>"+total_bodega[i].toFixed(3)+"</td>");
    }

      $(tr_final).append(td);
  }
  var tbody_final=$("tbody.resumen_inferior")[0];
  // console.log(tbody);
  $(tbody_final).append(tr_final);
  // inicio();
}
function total_por_bodega(datos){
  var arregloNuevo=[];
  var peso_bodega=0;

  for (var i = 1; i <= cant_bod; i++) {
    for (var j = 0; j < datos.length; j++) {
      if(datos[j].num_bodega==i){
        peso_bodega=parseFloat(peso_bodega)+parseFloat(datos[j].peso);
      }
    }
    arregloNuevo.push(peso_bodega);
    peso_bodega=0;
  }
  return arregloNuevo;
}
function imprimir_plano(){
  var ancho=$("body").css("width");
    var alto=$("body").css("height");
  // console.log($(body).css("width"));
  window.location='../paginas/imprimir_P_general.php?rot='+rot+'&ancho='+ancho+'&alto='+alto;
  $("#cargando_text").css("display","block");
    $("#container").animate({
        opacity:0,
      },200,function (){
          $("#cargando").css("display","inline-block");
        $("#cargando").animate({
            opacity:1,
          },800,function (){
        });
        $("#cargando_text").animate({
            opacity:1,
          },800,function (){
        });
    });


}
function datos_por_puerto(puerto,datos){
  var arregloNuevo=[];
  for (var i = 0; i < datos.length; i++) {
    if(datos[i].puerto==puerto){
      arregloNuevo.push(datos[i]);
    }
  }
  return arregloNuevo;
}
function secuence(ROTACION){
  $.ajax({
     type:"POST",
     url:"../php/funciones_plano.php",
     data:{"opcion":7, "rotacion":ROTACION},
  }).done(function(sec){
    if(sec!=0){
      $("#secuence_dato").text(sec);
    }else{
        $("#secuence_dato").text("----");
    }

  }).error(function(error){
      alert("No se han podido cargar los datos de la tabla secuence");
  });
}
function edit_secuence(){
  var secuence= $("#secuence_dato").text();
  var input=$("<input id='input_secuence' type='text' value="+secuence+">");
  $("#secuence_dato").html(input);
  $(input).focus();
  $(input).blur(function (){ // EVENTO AL MOMENTO DE DESELECCIONAR EL INPUT
      var elemento=$(this).val();
      var padre=  $(this).parent();
      $(this).remove();
      if(elemento){
        $("#secuence_dato").text(elemento);
      }else{
          $("#secuence_dato").text("---");
      }
      modificar_secuence(rot,elemento);
  });
}
function modificar_secuence(rot,secuence){
  $.ajax({
     type:"POST",
     url:"../php/funciones_plano.php",
     data:{"opcion":8, "rotacion":rot, "secuence":secuence},
  }).done(function(info){
  }).error(function(error){
      alert("No se han podido cargar los datos de la tabla inferior");
  });
}
function ordenamiento(){
  localStorage.setItem('ROTACION', rot);
  window.location='../paginas/estiba.php';
}
function planimetria(){

  localStorage.setItem('ROTACION', rot);
  window.location='../estibas/orden.html?rototacion='+rot;
}
