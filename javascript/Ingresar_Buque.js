var rotacion=0;
$(document).on("ready",inicio());

function inicio(){
  $(document).ready(function(){
     $("#mostrarmodal").modal("show");
  });

  window.location.hash="no-back-button";
  window.location.hash="Again-No-back-button" //chrome
  window.onhashchange=function(){window.location.hash="no-back-button";}
}


function guardar_menu1(){
  var nombre_buque = $("#nombre_buque").val();
// rotacion= $("#rotacion").val();
  var cant_bodegas = $("#cant_bodegas").val();
  var fecha_ingreso = $("#fecha_ingreso").val();

  if (nombre_buque==""){
    $("#letra_nombre").css("color","#C70039");
    $("#nombre_buque").parent().parent().attr("class"," has-error has-feedback");
	}else if (cant_bodegas==""){
		alert("EL campo cantidad bodegas no puede estar vacio");
	}else{
    $.ajax({
       type:"POST",
       url:"../php/funciones_php2.php",
       data: {"opcion":1, "nombre_buque":nombre_buque,"cant_bodegas":cant_bodegas},
       success:function(data){
         console.log(data);
       if(data==1){
        $("#letra_nombre").css("color","white");
        hacer_menu();

        $("#nombre_buque").attr("disabled", true);
        $("#rotacion").attr("disabled", true);
        $("#cant_bodegas").attr("disabled", true);
        // $("#fecha_ingreso").attr("disabled", true);
       }else {
           console.log(data);
        $(document).ready(function(){

          $("#mostrar").modal("show");
        });
       }
    },
    }).error(function(error){
        alert("No se han podido cargar los datoooos");
    });
  }

}


 function hacer_menu(){

  window.location.hash="no-back-button";
  window.location.hash="Again-No-back-button" //chrome
  window.onhashchange=function(){window.location.hash="no-back-button"};

  $('#enviar1').attr("disabled", true);
  $('#cant_bodegas').attr("disabled", true);
	$(".imagen_derecha").css("display","none");
	$(".ingreso_derecha").css("display","block");
	var cantidad_bodegas=$("#cant_bodegas").val();
	var padre=$(".control_izquierda"); //aqui las pestañas
	var padre2=$(".control_derecha");
  var datos_padre= $('<div/>');
  var form_contenedor_tier=$('<form/>');
  form_contenedor_tier.attr("class","tier_bodegas");
  datos_padre.attr("class","datos_padre formulario_ingreso");

  padre2.append(datos_padre);
  //datos_padre.append(form_contenedor_tier);
  var div_dentro_datos_padre=$('<div/>');
  div_dentro_datos_padre.attr("class","form-ingresar");
  div_dentro_datos_padre.attr("id","contenedor_bodega0");
  div_dentro_datos_padre.css("display","none");
  datos_padre.append(div_dentro_datos_padre);

  var div_dentro_datos_padre2=$('<div/>');
  div_dentro_datos_padre2.attr("class"," formulario_ingreso contenedor");
  div_dentro_datos_padre2.attr("id","contenedor_tanques");
  div_dentro_datos_padre2.css("display","none");

  padre2.append(div_dentro_datos_padre2);

  for (var i = 0; i<cantidad_bodegas; i++){
    j=i+1;
    var aux= $('<div/>');
    var aux_texto= $('<p/>');

    aux_texto.text("Bodega "+j);
    aux.append (aux_texto);
    aux.attr("class","dato_grupal");
    aux.attr("id","dato"+i);
    aux.attr("data-pestana",i);
    aux.attr("onclick","bodegas(this);cambiar_pagina(this)");
    padre.append(aux);

    var div_dentro_datos_padre=$('<div/>');
    div_dentro_datos_padre.attr("class","form-ingresar");
    div_dentro_datos_padre.attr("id","contenedor_bodega"+j);
    div_dentro_datos_padre.css("width","100%");
    div_dentro_datos_padre.css("display","none");
    div_dentro_datos_padre.attr("data-tier",j);

    var form_cant_tiers=$('<form/>');
        form_cant_tiers.attr("class","form-ingresar");
        form_cant_tiers.attr("id","form_tiers"+j);
        form_cant_tiers.css("width","100%");

    datos_padre.append(div_dentro_datos_padre);
    div_dentro_datos_padre.append(form_cant_tiers);
  }
  menu_bodega(cantidad_bodegas);
}


function bodegas(elemento){

  var cantidad_bodegas=$("#cant_bodegas").val();
  var prueba = elemento.id; //input ficticio para rescatar variable
  $("#id_data").val(prueba);

  for (var i = 0; i < cantidad_bodegas; i++) {
    j=i+1;
    $("#contenedor_bodega"+j).css("display","none");
    if(elemento.id=="dato"+i){
      $("#contenedor_bodega"+j).css("display","block");

      for (var k = 0; k < cantidad_bodegas; k++) {
        if(elemento.id!="dato"+i){
          $("#contenedor_bodega"+j).css("display","none");
        }
      }
    }
  }
}



function menu_bodega(cantidad_bodegas){

  var j;
  for (var i = 0; i<cantidad_bodegas; i++){
    j=i+1;
    var padre=$("#form_tiers"+j);
    var label_cantidad_tanques= $('<label/>');
        label_cantidad_tanques.text("Cantidad de Tiers");
        label_cantidad_tanques.attr("class","letra");
        label_cantidad_tanques.css("padding-top","27px");
        label_cantidad_tanques.css("padding-bottom","6px");
    label_cantidad_tanques.appendTo(padre);

    var select_cantidad_tanques=$('<select/>');
        select_cantidad_tanques.attr("class","form-control");
        select_cantidad_tanques.attr("id","tier"+j); //+i

    var option_cantidad_tanques8=$('<option/>');
        option_cantidad_tanques8.text("8");
        option_cantidad_tanques8.attr("value","8");
        option_cantidad_tanques8.attr("class","form-control");
    var option_cantidad_tanques9=$('<option/>');
        option_cantidad_tanques9.text("9");
        option_cantidad_tanques9.attr("value","9");
        option_cantidad_tanques9.attr("class","form-control");
    var option_cantidad_tanques10=$('<option/>');
        option_cantidad_tanques10.text("10");
        option_cantidad_tanques10.attr("value","10");
        option_cantidad_tanques10.attr("class","form-control");
    var option_cantidad_tanques11=$('<option/>');
        option_cantidad_tanques11.text("11");
        option_cantidad_tanques11.attr("value","11");
        option_cantidad_tanques11.attr("class","form-control");
    var option_cantidad_tanques12=$('<option/>');
        option_cantidad_tanques12.text("12");
        option_cantidad_tanques12.attr("value","12");
        option_cantidad_tanques12.attr("class","form-control");

    option_cantidad_tanques8.appendTo(select_cantidad_tanques);
    option_cantidad_tanques9.appendTo(select_cantidad_tanques);
    option_cantidad_tanques10.appendTo(select_cantidad_tanques);
    option_cantidad_tanques11.appendTo(select_cantidad_tanques);
    option_cantidad_tanques12.appendTo(select_cantidad_tanques);

    var label_alto_bodega= $('<label/>');
        label_alto_bodega.text("Alto de la bodega "+j);
        label_alto_bodega.attr("class","letra");
        label_alto_bodega.css("padding-top","20px");
        label_alto_bodega.attr("id","alto_tier_label"+j);

    var alto_cantidad_tier = $('<input/>');
        alto_cantidad_tier.attr("class","form-control");
        alto_cantidad_tier.attr("id","alto_tier"+j);
        alto_cantidad_tier.attr("placeholder","mts");

    var input_guardar= $('<input/>');
        input_guardar.attr("value","GUARDAR");
        input_guardar.attr("class","btn-buque1 btn");
        input_guardar.attr("id","aceptar"+j);
        input_guardar.attr("onclick","guardar_menu2(this)");

    select_cantidad_tanques.appendTo(padre);
    label_alto_bodega.appendTo(padre);
    alto_cantidad_tier.appendTo(padre);
    input_guardar.appendTo(padre);
  }
}


function guardar_menu2(elemento){
  var prueba=elemento.id; //input ficticio para rescatar variable
      prueba = prueba.replace(/\D/g,'');  //num_bodega
  var nombre_buque = $("#nombre_buque").val(); //id_IMO
  var alto_bodega=$("#alto_tier"+prueba).val(); //alto de la bodega
  var cantidad_tier=$("#tier"+prueba).val();  //cantidad de pisos de la bodega
  var letra_label=$("#alto_tier_label"+prueba).val();

  if (alto_bodega==""){
    $("#alto_tier_label"+prueba).css("color","#C70039");
    $("#alto_tier"+prueba).parent().parent().attr("class"," has-error has-feedback");
    console.log(alto_bodega);
    console.log(cantidad_tier);

	}else if(cantidad_tier==""){
    alert("EL campo cantidad de tiers de la bodega no puede estar vacio");
  }else{
    $.ajax({
       type:"POST",
       url:"../php/funciones_php2.php",
       data: {"opcion":2,  "rotacion":rotacion,"alto_bodega":alto_bodega,"num_bodega":prueba,"cantidad_tier":cantidad_tier},
       success:function(data){
         console.log(data);
         
        if(data!=""){
          $('#aceptar'+prueba).attr("disabled", true);
          $('#tier'+prueba).attr("disabled", true);
          $('#alto_tier'+prueba).attr("disabled", true);

          $(document).ready(function(){
            $("#guardo").modal("show");
          });

          cantidad_tanques();
        }else{
          $("#alto_tier_label"+prueba).css("color","#C70039");
          $("#alto_tier"+prueba).parent().parent().attr("class"," has-error has-feedback");}
       },
    }).error(function(error){
       alert("No se han podido cargar los datoooos");
    });
  }
}


function cantidad_tanques(){

  var contenedor=$("#contenedor_tanques");
  var cantidad_bodegas=$("#cant_bodegas").val();
  var prueba2=$("#id_data").val();
  prueba2 = prueba2.replace(/\D/g,'');

  contenedor.css("display","block");
  contenedor.attr("width","50%");

  for (var j = 0; j <cantidad_bodegas; j++) {
    if(prueba2==j){
          $('#aceptar'+j).attr("disabled", true);
          $('#tanques'+j).attr("disabled", true);
          var cantidad_tanques=$("#tanques"+j).val();
          var div_contiene=$('<div/>');
          div_contiene.attr("id","tanque"+j);
          contenedor.append(div_contiene);
          div_contiene.attr("style","display:none");
          var form_contenedor=$('<form/>');
              form_contenedor.attr("class","form-ingresar");
              form_contenedor.attr("id","form_contenedor"+j);
              form_contenedor.css("width","100%");
          div_contiene.append(form_contenedor);
    }
  }
  dentro_cantidad_atnques();
}


function dentro_cantidad_atnques(){

   var cantidad_bodegas=$("#cant_bodegas").val();
   var prueba2=$("#id_data").val();
   prueba2 = prueba2.replace(/\D/g,'');
   var canti_aux=0;
   var cantidad_tanquess=0;
   var numk=0;
   var aux=0;

   for (var j = 0; j <cantidad_bodegas; j++) {
     p=j+1;
      var cantenedoraux=$("#tanque"+j);
      cantenedoraux.attr("style","display:none");

      var contenedor_contenedor =$('#form_contenedor'+j);
      var cantidad_tanques=$("#tier"+p).val();
      canti_aux=parseInt(canti_aux)+parseInt(cantidad_tanques);

      if(prueba2==j){
       for (var i = cantidad_tanquess; i <canti_aux; i++) {
        aux=parseInt(aux)+1;
        k=i+1;
        numk=parseInt(numk)+1;
        hola=parseInt(cantidad_tanquess);

        var label_titulo=$('<label/>');
        label_titulo.attr("class","letra");
        label_titulo.text("BODEGA NIVEL "+numk);
        label_titulo.attr("id","titulo_label"+k);
        contenedor_contenedor.append(label_titulo);
        var input_largo= $('<input/>');
        var label_largo= $('<label/>');
        input_largo.attr("class","form-control");
        input_largo.attr("id","input_largo"+k);
        label_largo.attr("class","letra");
        label_largo.attr("id","label_largo"+k)
        label_largo.text("Largo");
        contenedor_contenedor.append(label_largo);
        contenedor_contenedor.append(input_largo);

        var input_ancho= $('<input/>');
        var label_ancho= $('<label/>');
            label_ancho.text("Ancho");
        input_ancho.attr("class","form-control");
        input_ancho.attr("id","input_ancho"+k);
        input_ancho.attr("style","margin-bottom:30px");
        label_ancho.attr("class","letra");
        label_ancho.attr("id","label_ancho"+k)
        contenedor_contenedor.append(label_ancho);
        contenedor_contenedor.append(input_ancho);

        var input_guardar= $('<input/>');
        input_guardar.attr("value","GUARDAR");
        input_guardar.attr("class","btn-buque1");
        input_guardar.attr("name","numero"+aux);
        input_guardar.attr("id","guardar_tier_bodega"+k);
        input_guardar.attr("onclick","guardar_menu3(this,k,hola)");
        contenedor_contenedor.append(input_guardar);

        if(k>1){
          $('#input_largo'+k).attr("disabled", true);
          $('#input_ancho'+k).attr("disabled", true);
          $('#guardar_tier_bodega'+k).attr("disabled", true);
        }
       }
       cantenedoraux.css("display","block");
     }
     aux=0;
     cantidad_tanquess=parseInt(canti_aux);
  }
}

function cambiar_pagina(elemento){
  var prueba2=elemento.id;
  prueba2 = prueba2.replace(/\D/g,'');
  var cantidad_bodegas=$("#cant_bodegas").val();

  for (var j = 0; j <cantidad_bodegas; j++) {
    $("#tanque"+j).css("display","none");
    if(prueba2==j){
      $("#tanque"+j).css("display","block");
    }
  }
}


// var veector=new array();
// veector[veector.lenght]=$("#cantidad_tanques"+i).val();
function guardar_menu3(elemento,final,inicio){

  var niveloriginal=elemento.name;
  niveloriginal = niveloriginal.replace(/\D/g,'');

  var nivel=elemento.id;
  nivel = nivel.replace(/\D/g,'');//nivel
  aux=parseInt(nivel)+1;

  largo=$("#input_largo"+nivel).val();
  ancho=$("#input_ancho"+nivel).val();

  if (largo==""){
    $("#titulo_label"+nivel).css("color","#C70039");
    $("#label_largo"+nivel).css("color","#C70039");
    $("#input_largo"+nivel).parent().parent().attr("class"," has-error has-feedback");
    if(ancho==""){
      $("#label_ancho"+nivel).css("color","#C70039");
      $("#input_ancho"+nivel).parent().parent().attr("class"," has-error has-feedback");
    }else $("#label_ancho"+nivel).css("color","white");
  }else if(ancho==""){
    $("#label_largo"+nivel).css("color","white");
    $("#titulo_label"+nivel).css("color","#C70039");
    $("#label_ancho"+nivel).css("color","#C70039");
    $("#input_ancho"+nivel).parent().parent().attr("class"," has-error has-feedback");
  }else {
    $("#titulo_label"+nivel).css("color","white");
    $("#label_largo"+nivel).css("color","white");
    $("#titulo_label"+nivel).css("color","white");
    $("#label_ancho"+nivel).css("color","white");
    $.ajax({
       type:"POST",
       url:"../php/funciones_php2.php",
       data: {"opcion":3, "niveloriginal":niveloriginal,"largo":largo,"ancho":ancho},
       success:function(data){
        if(data!=""){
          for (var i = parseInt(nivel); i <=parseInt(final); i++) {
           $('#input_largo'+i).attr("disabled", true);
           $('#input_ancho'+i).attr("disabled", true);
           $('#guardar_tier_bodega'+i).attr("disabled", true);
           if(aux==i){
            $('#input_largo'+i).attr("disabled", false);
            $('#input_ancho'+i).attr("disabled", false);
            $('#guardar_tier_bodega'+i).attr("disabled", false);
            }
          }
          $(document).ready(function(){
            $("#guardo").modal("show");
          });
        }else {
          $(document).ready(function(){
            $("#mostrar").modal("show");
          });
        }
       },
    }).error(function(error){
       alert("No se han podido cargar los datoooos");
    });
  }
  }
