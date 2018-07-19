function recuperar_pw(){
  $(".segundo").hide("fast");
  $("#rut_usuario").focus();
  $("#olvido").text("Se te enviara un correo para que puedas recuperar conrtaseña");
  $("#form-index").attr("action","");
  $("#enviar").attr("type","button");

    $("#enviar").attr("onclick","rescatar_correo()");
}

function rescatar_correo(){
    var rut=  $("#rut_usuario").val();

      $.ajax({
         type:"POST",
         url:"../php/funciones_php.php",
          data:{"opcion":7,"rut":rut},
         datatype:"json",
      }).done(function(info){
        var data=JSON.parse(info);
        enviar_correo(data);

      }).error(function(error){
      alert("No se han podido cargar los datos");
      });
}

function enviar_correo(datos){
  $.ajax({
     type:"POST",
     url:"../php/funciones_php.php",
      data:{"opcion":8,"correo":datos.correo,"nombre":datos.nombre,"clave":datos.clave},
     datatype:"json",
  }).done(function(info){
      envio_exitoso();
  }).error(function(error){
  alert("No se han podido cargar los datos");
  });
}

function envio_exitoso(){
    $("#form-index").hide("fast");
    $("#pfin").show("fast");
}
