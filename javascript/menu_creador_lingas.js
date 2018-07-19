var embarcador=0;
var largo_unit=0;
var ancho_unit=0;
// FUNCION PARA ANIMAR EL MENU LATERAL CREADOR DE LINGAS
function menu_creador_lingas(){
  var tam=  $("#creador-lingas").css("width");
    $("#lingas-boton").click(function (){ // EVENTO CLICK EN EL BOTON CON FLECHA LATERAL
      // SI EL PANEL ESTA OCULTO
      if(  $("#boton-creador").attr("class")=="glyphicon glyphicon-arrow-left"){
              $("#lingas").animate({
                  right:0,
                },300,function (){
                    $("#boton-creador").attr("class","glyphicon glyphicon-arrow-right");
              });
    // SI EL PANEL SE ESTA MOSTRANDO
      }else if($("#boton-creador").attr("class")=="glyphicon glyphicon-arrow-right"){
             $("#lingas").animate({
                  right:-325+"px",
              },300,function (){
                  $("#boton-creador").attr("class","glyphicon glyphicon-arrow-left");
              });
      }
    });


}

  // FUNCION QUE GUARDA LAS DIMENSIONES DE LA LINGA SELECCIONADA
  // ADEMAS GUARDA EL TIPO DE UNIT SELECCIONADO EN UNA VARIABLE GLOBAL
function dimensiones_linga(){
    id=$("#tipo_celulosa").val();
    nueva_dimension_linga(id);
    unit_seleccionado=$("#tipo_celulosa").val();
}

// LISTA TODOS LOS EMBARCADORES OBTENIDOS DE LA BASE DE DATOS
// EN UN SELECT EN MENU CREADOR DE LINGAS
function listar_embarcadores(data,dato_medidas,callback){
  console.log(data);
      var id_padre=$("#tipo_celulosa");
      for(var i =0; i<data.length;i++){
        var dato= $("<option value="+data[i].id_unit+" data-empresa="+data[i].company+" >"+data[i].empresa+" "+data[i].tipo+"</option>");
            id_padre.append (dato);
      }
      // SE GUARDA EN VARIABLES GLOABLES LOS VALORES DEL PRIMER UNIT POR DEFECTO
      largo_unit=data[0].largo;
      ancho_unit=data[0].ancho;
      console.log(dato_medidas);
      callback(dato_medidas,datos_puertos);
      dimensiones_linga();
}

// LISTA LOS PUERTOS EN EL <select> DEL MENU CREADOR DE LINGAS
function listar_puertos(data,callback){
      var id_padre=$("#destino");
        var id_padre2=$("#destino2");
      for(var i =0; i<data.length;i++){
        var dato= $("<option value="+data[i].id_puerto+" >"+data[i].puerto+"</option>");
            $(id_padre).append(dato);

      }
      for(var i =0; i<data.length;i++){
        var dato= $("<option value="+data[i].id_puerto+" >"+data[i].puerto+"</option>");

            $(id_padre2).append(dato);
      }
      // SE GUARDA EN UNA VARIABLE GLOBAL EL NOMBRE DEL PRIMER PUERTO
      nombre_puerto=data[0].puerto;
      //buscar_lingas
      callback(ROTACION_buque,crear_array_linga);
}
