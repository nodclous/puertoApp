var ultima_rotacion; // GUARDA LA ULTIMA ROTACION REALIZADA POR LA NAVE SELECCIONADA
var datos_nave; // GURDA ARRAY DE LOS DATOS TOTALES DE UNA NAVE
// var rotaciones_list;
var data_rot;// ARRAY CON LA LISTA TOTAL DE ROTACIONES
var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
$(document).ready(function(){
  cargar_usuarios(); // RESCATA TODOS LOS DATOS DE LOS USUARIOS
  modificar_usuarios();
  eliminarUsuarioRut(); // MODIFICA ALUGUN DATO CON DOBLE CLICK EN LA CELDA
  modificar_nave(); // MODIFICA DIMENSION DE LA NAVE SELECCIONADA
  obtener_datos_nave(listar_naves); // SE OBTIENEN DATOS DE LAS NAVES

  $("#ingreso").submit(function (event) { // INGRESO DE USUARIO
            // Aqui evitamos que el formulario haga el submit
            event.preventDefault();
            $('#myModal').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').hide();
            agregar_nuevo_usuario();
  });

  $("#rut_nuevo").rut({formatOn: 'keyup',
                                              minimumLength: 8,
                                              validateOn: 'blur',
                                              useThousandsSeparator : false,
                                              ignoreControlKeys: false});

  var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
});


function cargar_usuarios(){
    $.ajax({
       type:"POST",
       url:"../php/admin.php",
        data:{"opcion":1},
       datatype:"json",
    }).done(function(info){
      var data=JSON.parse(info);
        listar_usuarios(data,0);
        //console.log(info);
    }).error(function(error){
    alert("No se han podido cargar los datoooos");
    });
}

function listar_usuarios(data,num){
      //  console.log("eaaaaaaaaaaaaaaa");
      if(num==0){ // num == 0  MUESTRA SOLO LOS USUARIOS ACTIVOS
        //  console.log("algunos");
        //  console.log(data.length);
        // INICIALIZA TABLA
            $("#estado").css("display","none");
            var padre=$("#tabla_datos");
            padre.empty();
        // INGRESA LOS DATOS
            for(var i=0;i<data.length;i++){
              if (data[i].habilitado == 1) {
                var usuario=$("<tr id="+data[i].rut_usuario+"><td class='nombre'>"+data[i].nombre+"</td><td class='rut'>"+data[i].rut_usuario+"</td><td class='correo'>"+data[i].correo+"</td><td class='tipo'>"+data[i].tipo_usuario+"</td><td class='eliminar_usuario'><a href='#' id='eliminarUser' class='btn btn-info btn-lg eliminarUsuario'><span class='glyphicon glyphicon-remove'></span></a><a href='#' class='btn btn-info btn-lg modUsuario' id='modificarUsuario'><span class='glyphicon glyphicon-pencil'></span></a><a href='#' class='btn btn-info btn-lg btn-ok' id='aceptarModificar"+data[i].rut_usuario+"'><span class='glyphicon glyphicon-ok'></span></a><a href='#' class='btn btn-info btn-lg btn-cancel' id='declinarModificar"+data[i].rut_usuario+"'><span class='glyphicon glyphicon-remove'></span></a></td></tr>");

    //            console.log(  $('#aceptarModificar'+data[i].rut_usuario));
                padre.append(usuario);
                $('#aceptarModificar'+data[i].rut_usuario).css("display","none");
                $('#declinarModificar'+data[i].rut_usuario).css("display","none");
              }

            }
      }else if(num==1){ // MUESTRA TODOS LOS USUARIOS

          // INICIALIZA TABLA
              $("#estado").css("display","block");
              var padre=$("#tabla_datos");
              padre.empty();
              console.log("todos");
              console.log(data.length);
          // INGRESA LOS DATOS
              for(var i=0;i<data.length;i++){
                  var usuario=$("<tr id="+data[i].rut_usuario+"><td class='nombre'>"+data[i].nombre+"</td><td class='rut'>"+data[i].rut_usuario+"</td><td class='correo'>"+data[i].correo+"</td><td class='tipo'>"+data[i].tipo_usuario+"</td><td class='habilitado'>"+data[i].habilitado+"</td><td class='eliminar_usuario'><a href='#' id='eliminarUser' class='btn btn-info btn-lg eliminarUsuario'><span class='glyphicon glyphicon-remove'></span></a><a href='#' class='btn btn-info btn-lg modUsuario' id='modificarUsuario'><span class='glyphicon glyphicon-pencil'></span></a><a href='#' class='btn btn-info btn-lg btn-ok' id='aceptarModificar"+data[i].rut_usuario+"'><span class='glyphicon glyphicon-ok'></span></a><a href='#' class='btn btn-info btn-lg btn-cancel' id='declinarModificar"+data[i].rut_usuario+"'><span class='glyphicon glyphicon-remove'></span></a></td></tr>");
                  padre.append(usuario);
                  $('#aceptarModificar'+data[i].rut_usuario).css("display","none");
                  $('#declinarModificar'+data[i].rut_usuario).css("display","none");
              }
          // SE MARCA EL BOTON
              $("#usuarios_completo").css("background","#b4b5e0");
              $('#panel-usuarios .eliminarUsuario').css('display','none');
      }

}

// MODIFICA CAMPO SELECCIONADO DE LA TABLA E USUAIOS
function modificar(id,campo,nuevo_dato){
  $.ajax({
     type:"POST",
     url:"../php/admin.php",
      data:{"opcion":2,"id":id,"campo":campo,"nd":nuevo_dato},
     datatype:"json",
  }).done(function(info){
  //  console.log(info);
  }).error(function(error){
    alert("No se han podido cargar los datoooos");
  });
}

function modificar_usuarios(){

      $('#tabla_datos').on('click','#modificarUsuario', function(evt){
         // SI SE HACE DOBLE CiCK EN UN td
        $('.modUsuario').css('display','none');
        $('.eliminarUsuario').css('display','none');
      //  console.log("click");
          var t_dat=$(this).attr("id");
        //  console.log(t_dat);
            if(t_dat=="modificarUsuario"){
                var elemento=$(this).parent(); // SE RESCATA EL DATO DE LA CELDA
                var elemento2=elemento.parent();

                $('#aceptarModificar'+elemento2.children(1)[1].textContent).css('display','inline-block');
                  $('#declinarModificar'+elemento2.children(1)[1].textContent).css('display','inline-block');
        //        console.log(elemento2);
        //        console.log(elemento2.children(1)[0].textContent);
          //      console.log(elemento2.children(1).length);

                for (var i = 0; i < elemento2.children(1).length-1; i++) {

                  if(i == 0){
                    nombreInput = elemento2.children(1)[i].textContent;
                  }
                  if (i == 1) {
                    var input=$("<input type='text' required='required'  name='rut_usuario' autocomplete='off' placeholder='11111111-1' maxlength='10' id='input"+i+"'>");
                    $(input).val(elemento2.children(1)[i].textContent);
              //      console.log(elemento2.children(1)[i].textContent);
              rutInput = elemento2.children(1)[i].textContent;
                    elemento2.children(1)[i].textContent="";
                //    console.log(input);
                    elemento2.children(1)[i].append(input[0]);
                    $(input).focus();


                      $(input).rut({formatOn: 'keyup',
                                            minimumLength: 8,
                                            validateOn: 'blur',
                                            useThousandsSeparator : false,
                                            ignoreControlKeys: false});
                  }

                  if(i == 2){
                    correoInput = elemento2.children(1)[i].textContent;

                    var input=$("<input type='email' name='email' id='input"+i+"'>");
                    $(input).val(elemento2.children(1)[i].textContent);
              //      console.log(elemento2.children(1)[i].textContent);
                    elemento2.children(1)[i].textContent="";
                //    console.log(input);
                    elemento2.children(1)[i].append(input[0]);
                    $(input).focus();


                  }

                  if(i != 3 && i!=1 && i!=2){
                    if (i == 4) {
                      var datoHabilitado = elemento2.children(1)[i].textContent;
                      console.log(datoHabilitado);
                    }
                    var input=$("<input type='text' id='input"+i+"'>");

                    $(input).val(elemento2.children(1)[i].textContent);
              //      console.log(elemento2.children(1)[i].textContent);
                    elemento2.children(1)[i].textContent="";
                //    console.log(input);
                    elemento2.children(1)[i].append(input[0]);
                    $(input).focus();

                  //  console.log(input.attr('id'));

                }if(i == 3){
                  var dato_us_tipo = elemento2.children(1)[i].textContent;

                  //console.log(dato_us_tipo);
              //      console.log(elemento2.children(1)[i].textContent);
                  var input=$("<select id='input"+i+"'><option>administrador</option><option>operario</option><option>maquinista</option></select>");
                  elemento2.children(1)[i].textContent="";
                  elemento2.children(1)[i].append(input[0]);
                  $(input).focus();

                }



                }

  $('#tabla_datos').on('click','#aceptarModificar'+elemento2.attr('id'), function(evt){

    $('.modUsuario').css('display','inline-block');
    $('.eliminarUsuario').css('display','inline-block');

    for (var i = 0; i < 5; i++) {

        if(i != 3 && i!=4){
    //    console.log(elemento2.children(1).find('#input'+i).val());
        var dato_us = elemento2.children(1).find('#input'+i).val();
        //console.log(elemento2.children(1).find('#input'+i).parent().attr('class'));
        modificar(elemento2.attr('id'),elemento2.children(1).find('#input'+i).parent().attr('class'),elemento2.children(1).find('#input'+i).val());
        var father = elemento2.children(1).find('#input'+i).parent();
        elemento2.children(1).find('#input'+i).remove();
        father.append(dato_us);
      }
      if (i == 3) {
          var dato_us = elemento2.children(1).find('#input'+i).val();
          modificar(elemento2.attr('id'),"tipo_usuario",elemento2.children(1).find('#input'+i).val());
          var father = elemento2.children(1).find('#input'+i).parent();
          elemento2.children(1).find('#input'+i).remove();
          father.append(dato_us);
      }
      if (i == 4) {
        console.log(elemento2.children(1).find('#input'+i).val());
        var dato_us = elemento2.children(1).find('#input'+i).val();
        //console.log(elemento2.children(1).find('#input'+i).parent().attr('class'));
        modificar(elemento2.attr('id'),"habilitado",elemento2.children(1).find('#input'+i).val());
        var father = elemento2.children(1).find('#input'+i).parent();
        elemento2.children(1).find('#input'+i).remove();
        father.append(dato_us);
      }


    }
      $('#aceptarModificar'+elemento2.attr('id')).css('display','none');
      $('#declinarModificar'+elemento2.attr('id')).css('display','none');
  });

  $('#tabla_datos').on('click','#declinarModificar'+elemento2.attr('id'), function(evt){

    $('#aceptarModificar'+elemento2.attr('id')).css('display','none');
    $('#declinarModificar'+elemento2.attr('id')).css('display','none');
    $('.modUsuario').css('display','inline-block');
    $('.eliminarUsuario').css('display','inline-block');

    for (var i = 0; i < 5; i++) {
        if (i == 0) {
          var father = elemento2.children(1).find('#input'+i).parent();
          elemento2.children(1).find('#input'+i).remove();
          father.append(nombreInput);

        }
        if (i == 1) {
          var father = elemento2.children(1).find('#input'+i).parent();
          elemento2.children(1).find('#input'+i).remove();
          father.append(rutInput);
        }

        if (i == 2) {

          var father = elemento2.children(1).find('#input'+i).parent();
          elemento2.children(1).find('#input'+i).remove();
          father.append(correoInput);

        }
        if (i == 3) {

          var father = elemento2.children(1).find('#input'+i).parent();
          elemento2.children(1).find('#input'+i).remove();
          father.append(dato_us_tipo);

        }

        if(i == 4){

          //  console.log(elemento2.children(1).find('#input'+i).parent().attr('class'));
          //  modificar(elemento2.attr('id'),elemento2.children(1).find('#input'+i).parent().attr('class'),elemento2.children(1).find('#input'+i).val());
            var father = elemento2.children(1).find('#input'+i).parent();
            elemento2.children(1).find('#input'+i).remove();
            father.append(datoHabilitado);
            console.log(datoHabilitado);

        }





    }



  });

}else if($(this).attr("class")=="eliminar_usuario"){
              if(confirm("Seguro desea eliminar al usuario?")){
                 eliminar_usuario_rut($(this).parent().attr("id"));
              }else{
                 $(this).parent().css("background","#fff");
              }
            }
      });



}

function eliminarUsuarioRut(){

  $('#tabla_datos').on('click','#eliminarUser', function(evt){
    console.log("eaaa");


      var t_dat=$(this).attr("id");
      //console.log(t_dat);
        if(t_dat=="eliminarUser"){
            var elemento=$(this).parent(); // SE RESCATA EL DATO DE LA CELDA
            var elemento2=elemento.parent();
            console.log(elemento2.children(1)[1].textContent);

            if(confirm("Seguro desea eliminar al usuario?")){
               eliminar_usuario_rut(elemento2.children(1)[1].textContent);
            }else{
              // $(this).parent().css("background","#fff");
            }

          }
/*



        }

*/
});

}


// VALIDADOR AL INGRESAR USUARIOS NUEVOS
function agregar_nuevo_usuario(){

  var n=$("#nombre_nuevo")[0].checkValidity();
  var c=$("#correo_nuevo")[0].checkValidity();
  var r=$("#rut_nuevo")[0].checkValidity();



  if(n && r && c){ // LAS TRES TIENEN QUE EXISTIR
    var nombre=$("#nombre_nuevo").val();
    var correo=$("#correo_nuevo").val();
    var rut=$("#rut_nuevo").val();
    var tipo= $("#tipo_nuevo").val();


    $.ajax({
       type:"POST",
       url:"../php/admin.php",
        data:{"opcion":5,"nombre":nombre,"rut":rut,"correo":correo,"tipo":tipo},
       datatype:"json",
    }).done(function(info){
    //  console.log(info);
          if(info==1){
            var padre=$("#tabla_datos");
            var usuario=$("<tr id="+rut+"><td class='nombre'>"+nombre+"</td><td class='rut'>"+rut+"</td><td class='correo'>"+correo+"</td><td class='tipo'>"+tipo+"</td><td class='eliminar_usuario'><a href='#' id='eliminarUser' class='btn btn-info btn-lg eliminarUsuario'><span class='glyphicon glyphicon-remove'></span></a><a href='#' class='btn btn-info btn-lg modUsuario' id='modificarUsuario'><span class='glyphicon glyphicon-pencil'></span></a><a href='#' class='btn btn-info btn-lg btn-ok' id='aceptarModificar"+rut+"'><span class='glyphicon glyphicon-ok'></span></a><a href='#' class='btn btn-info btn-lg btn-cancel' id='declinarModificar"+rut+"'><span class='glyphicon glyphicon-remove'></span></a></td></tr>");



            padre.append(usuario);
            $('#aceptarModificar'+rut).css("display","none");
            $('#declinarModificar'+rut).css("display","none");
          }
          if (info == 2) {
            console.log("ya existe");
            alert("Usuario ya existe");

          }
          $("#nombre_nuevo").val("");
          $("#correo_nuevo").val("");
          $("#rut_nuevo").val("");


    }).error(function(error){
    alert("No se han podido cargar los datoooos");
    });
  }
}

// MODIFICA EL ESTADO DEL USUARIO SELECCIONADO
function eliminar_usuario_rut(rut){
  $.ajax({
     type:"POST",
     url:"../php/admin.php",
      data:{"opcion":3,"rut":rut},
     datatype:"json",
  }).done(function(info){
    if(info==1){
        $("#"+rut).empty();
        var usuario=$("<td id='borrado' colspan='5' > <strong>USUARIO ELIMINADO</strong></td>");
        $(usuario).css({
          "text-align":"center",
          "background":"rgba(155,23,23,0.2)"
        });
          $("#"+rut).append(usuario);
          $("#borrado").delay(100).hide("slow");
          $("#"+rut).remove();
    }else{
      alert("No se ha podido eliminar al usuario");
    }
  }).error(function(error){
    alert("No se han podido cargar los datoooos");
  });
}

// DEVUELVE TODOS LOS DATOS DE LOS USUARIOS
function mostrar_usuarios_completo(){
    $.ajax({
       type:"POST",
       url:"../php/admin.php",
       data:{"opcion":4},
       datatype:"json",
    }).done(function(info){
      var data=JSON.parse(info);
        if($("#estado").css("display")=="none"){
                listar_usuarios(data,1);
        }else{
            $("#usuarios_completo").css("background","#fff");
              listar_usuarios(data,0);
        }
    }).error(function(error){
        alert("No se han podido cargar los datoooos");
    });


}




// FUNCION QUE ORDENA UN ARRAY
Array.prototype.orderByString=function(p,so,ic){
  if(so!=-1&&so!=1)so=1;
  this.sort(function(a,b){
    var sa=a[p]!=null?a[p].toString():'',sb=b[p]!=null?b[p].toString():'';
    if(ic==true){sa=sa.toLowerCase();sb=sb.toLowerCase()}
    return(sa<sb?-1:sa>sb?1:0)*so;
  })
}



// FUNCION QUE ELIMINA LOS DATOS DEPETIDOS EN UN ARRAY
function eliminar_repetido(array){
  var copia=array;
  var id_b='';
  for (var i = array.length; i > 0; i--) {
    if(array[i].id_buque!=id_b){
      id_b=array[i].id_buque;
    }else{
      copia.splice(i, 1);
    }
  }
  return copia;
}
