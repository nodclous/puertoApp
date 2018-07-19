$(function() {

    // Obtiene el tipo de usuario
    getUserType();

    // limpia el input de busqueda
    clearInput($("#search"));

    // limpia las opciones de filtrado y pone una por defecto Naves
    clearChecked($('input[name=optradio]'));

    console.log( "ready!" );

    // Se gatilla cuando se selecciona un Filtro y aplica la busqueda correspondiente
    $(".radioBox-options label input").change(function(){
      $(".radioBox-options label.is-checked").toggleClass('is-checked');
      $(this).parent().toggleClass('is-checked');
      var searching = $("#search").val();
      var filterSelected = $(this).parent().text();

      var send = {
          "searching": searching,
          "filter": filterSelected
      }
      changeNameSearch(filterSelected);
      defaultSearchAjax(send);
    });

    // se gatilla cuando se van ingresando letras en el input de busqueda
    // le da la magia de busqueda en tiempo real
    $("#search").keyup(function () {
        standardSearch();
    });


});

// captura el tipo de usuario y lo transfiere a una variable global user
function getUserType() {
    $.ajax({
        url:  '../php/buscador/getUser.php',
        type: 'POST',
         dataType: 'JSON',
        success:  function (response) {
            console.log(response);
            if (response.userOperario) {
                console.log('operario');
                user = 'operario';
            }
            if (response.userAdmin) {
                console.log('administrador');
                user = 'administrador';
            }
            if (response.userMaquinista) {
                console.log('maquinista');
                user = 'maquinista';
            }

        },
        error: function(err){
          alert("An error occured: " + err.status + " " + err.statusText);

        }
    });

}

// captura los valores de la busqueda Input de busqueda y el filtro
// dependiendo de los valores gatilla la busqueda correspondiente
function standardSearch() {
  var searching = $("#search").val();
  var selected = $(".radioBox-options label input:checked");
  var filterSelected = selected.parent().text();

  var send = {
      "searching": searching,
      "filter": filterSelected
  }

  changeNameSearch(filterSelected);
  if (searching !== '' && searching.length >= 1) {
    return searchAjax(send);
  } else {
    return defaultSearchAjax(send);
  }
}


// limpia el input de busqueda
function clearInput(context) {
  context.val('');
}

// limpia los filtros y selecciona el filtro Naves
// Cambia el nombre del titulo de los resultados de busqueda
// hace una peticion con los valores capturados deñ filtro seleccionado
function clearChecked(context) {
  context.prop('checked',false);
  context.first().prop('checked',true);
  context.first().parent().toggleClass('is-checked');
  var searching = $("#search").val();
  var filterSelected = context.first().parent().text();

  var send = {
      "searching": searching,
      "filter": filterSelected
  }
  changeNameSearch(filterSelected);
  defaultSearchAjax(send);
}

// cambia el titulo de los resultados de busqueda
// crea los botones para el administrador
function changeNameSearch(string) {
  if (string == 'Nave') { $(".nameSearch").text('Naves');$('.btn-container').empty(); }
  if (string == 'Puerto') {$(".nameSearch").text('Puertos'); if (user === 'administrador') {createControlsButtons();}}
  if (string == 'Unit') { $(".nameSearch").text('Units'); if (user === 'administrador') {createControlsButtons();}}
  if (string == 'Embarcador') { $(".nameSearch").text('Embarcadores');if (user === 'administrador') {createControlsButtons();}}
}


// injecta los botones para el administrador
function createControlsButtons() {
    $('.btn-container').empty();
    $('.btn-container').append(
        '<button type="button" class="btn btn-primary btn-xs btn-add">Agregar <span class="glyphicon glyphicon-plus"></span></button>'+
        '<button type="button" class="btn btn-primary btn-xs btn-eliminados">Eliminados <span class="glyphicon glyphicon-trash"></span></button>'
    );

    // crea el popUp con sus respectivos inputs cuando el boton Agregar es Clickeado
    // como tiene formularios, gatilla validaciones para cada caso de filtro
    $('.btn-add').on('click',function () {
        var filterSelected = $(".radioBox-options label input:checked").parent().text();
        if ($('html').height() > window.innerHeight && $('html').width() > 1280 ) {
            $('html').css('overflow-y', 'hidden');
            $('html').css('padding-right','17px' );
        }else{
            $('html').css('overflow-y', 'hidden');
        }
        createAddPopUp(filterSelected);
        var container = $('.click-popUp .addLayout .popUp-panel');

        if (filterSelected === 'Unit' ) {
          createSelectEmbarcadoresAdd(container, 'Empresa');
          createContentAdd(container,'Tipo','Tipo de Unit');
          createContentAdd(container,'Alto','Alto');
          createContentAdd(container,'Ancho','Ancho');
          createContentAdd(container,'Largo','Largo');
          createContentAdd(container,'Peso','Peso');
          var type = 'agregar-unit';
          allValidation(type);
        }

        if (filterSelected === 'Embarcador') {
          createContentAdd(container,'Empresa','Nombre de la Empresa');
          createContentAdd(container,'Rut','Rut de la Empresa');
          var type = 'agregar-embarcador';
          allValidation(type);
        }

        if (filterSelected === 'Puerto') {
          createContentAdd(container,'Puerto','Nombre del Puerto');
          createContentAdd(container,'Pais','Pais del Puerto');
          var type = 'agregar-puerto';
          allValidation(type);
        }

        // Animacion de los layout
        $('.click-popUp').toggleClass('active').delay(100).queue(function() {
            $('.click-popUp .addLayout').toggleClass('active');
        });
    });

    // crea el popUp Eliminados cuando el boton Eliminados es Clickeado
    // gatilla la busqueda de los elementos eliminados temporalmente dependiendo del filtro
    $('.btn-eliminados').on('click',function () {
      var filterSelected = $(".radioBox-options label input:checked").parent().text();
      if ($('html').height() > window.innerHeight && $('html').width() > 1280 ) {
          $('html').css('overflow-y', 'hidden');
          $('html').css('padding-right','17px' );
      }else{
          $('html').css('overflow-y', 'hidden');
      }
      createEliminadosPopUp(filterSelected+'s');
      deletedSearchAjax(filterSelected);

      var container = $('.click-popUp .deletedLayout .popUp-panel');
  });
}

// busca los elementos eliminados temporalmente y los injecta a la lista del layout Eliminados
function deletedSearchAjax(data) {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/deletedSearch.php',
      data: { where: data },
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        $('.click-popUp .deletedLayout .popUp-panel').empty();
        if (response.type === 'Unit' ) {
          $.each(response.objects,function (i,objects) {
            $('.click-popUp .deletedLayout .popUp-panel').append(
              '<div class="deletedItem col-sm-12" data-index="'+objects.id_unit+'">'+
                  '<div class="element-name">'+objects.empresa+' - '+objects.tipo+'</div>'+
                  '<div class="element-props">'+objects.alto+' - '+objects.ancho+' - '+objects.largo+' - '+objects.peso+'</div>'+
                  '<span class="remove4EVER glyphicon glyphicon-remove-circle" aria-hidden="true"></span>'+
                  '<span class="restoreElement glyphicon glyphicon-ok-circle" aria-hidden="true"></span>'+
              '</div>'
            );
          });
        }

        if (response.type === 'Embarcador') {
          $.each(response.objects,function (i,objects) {
            $('.click-popUp .deletedLayout .popUp-panel').append(
              '<div class="deletedItem col-sm-12" data-index="'+objects.id_embarcador+'">'+
                  '<div class="element-name">'+objects.empresa+' - '+objects.rut+'</div>'+
                  '<span class="remove4EVER glyphicon glyphicon-remove-circle" aria-hidden="true"></span>'+
                  '<span class="restoreElement glyphicon glyphicon-ok-circle" aria-hidden="true"></span>'+
              '</div>'
            );
          });
        }

        if (response.type === 'Puerto') {
          $.each(response.objects,function (i,objects) {
            $('.click-popUp .deletedLayout .popUp-panel').append(
              '<div class="deletedItem col-sm-12" data-index="'+objects.id_puerto+'">'+
                  '<div class="element-name">'+objects.puerto+' - '+objects.pais+'</div>'+
                  '<span class="remove4EVER glyphicon glyphicon-remove-circle" aria-hidden="true"></span>'+
                  '<span class="restoreElement glyphicon glyphicon-ok-circle" aria-hidden="true"></span>'+
              '</div>'
            );
          });
        }

        if (response.objects.length === 0) {
          $('.click-popUp .deletedLayout .popUp-panel').append(
              '<div class="alert alert-warning" role="alert">'+
                  '<p><strong>Warning!  </strong> No se han encontrado registros eliminados de forma temporal<p>'+
              '</div>'
          );

        }

        // se gatilla cuando se apreta la X de algun elemento de la lista de Eliminados
        $('.deletedItem .remove4EVER').on('click',function () {
           var request = {
            type: 'remove4EVER',
            message:'¿Estas seguro de eliminar para siempre este registro?',
            warning: 'Advertencia! eliminar este registro implica que desaparecera de la base de datos, esto puede influir directamente en elementos del proceso de Estiba'
          }
          var requestData = {
            type: 'remove4EVER',
            dataType: data,
            id: $(this).parent().attr('data-index')
          }
          console.log(requestData);
          // crea popUp de confirmacion para eliminar para siempre
          createConfirmationRequest(requestData, request);

        });

        // se gatilla cuando se apreta el tick de algun elemento de la lista de Eliminados
        $('.deletedItem .restoreElement').on('click',function () {
          var request = {
           type: 'restore',
           message:'¿Estas seguro de restaurar este registro?',
           warning: 'Advertencia! restaurar este registro puede influir directamente en elementos del proceso de Estiba'
         }
         var requestData = {
           type: 'restore',
           dataType: data,
           id: $(this).parent().attr('data-index')
         }
         console.log(requestData);
         // crea popUp de confirmacion para restaurar el elemento
         createConfirmationRequest(requestData, request);
       });

        console.log(response);
        $('.click-popUp').toggleClass('active').delay(100).queue(function() {
            $('.click-popUp .deletedLayout').toggleClass('active');
        });
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}

// injecta el popUp Agregar a la paguina HTML
function createAddPopUp(data) {
  $('body').append(
    '<div class="click-popUp">'+
      '<div class="body-popUp">'+
        '<div class="addLayout well col-xs-12">'+
          '<form id="info-form">'+
            '<fieldset>'+
              '<legend>'+
                '<p class="data-name">Agregar '+data+'</p>'+
              '</legend>'+
              '<span class="closeView closeIcon glyphicon glyphicon-remove" aria-hidden="true"></span>'+
            '</fieldset>'+
            '<div class="popUp-panel col-xs-12">'+
            '</div>'+

            '<div class="button-panel col-xs-12">'+
              '<div class="col-xs-12">'+
                '<button class="btn btn-coronel btn-center btn-agregar">Agregar</button>'+
              '</div>'+
            '</div>'+
          '</form>'+
        '</div>'+
      '</div>'+
    '</div>'
  );

  // cierra el popUp cuando se apreta la X superior
  $('.click-popUp .closeView').on('click',function () {
      closeClickPopUp();
  });
}

// injecta el popUp Eliminados a la paguina HTML
function createEliminadosPopUp(data) {
  if (data === 'Embarcadors') {data = 'Embarcadores';}
  $('body').append(
    '<div class="click-popUp">'+
      '<div class="body-popUp">'+
        '<div class="deletedLayout well col-xs-12">'+
          '<form id="info-form">'+
            '<fieldset>'+
              '<legend>'+
                '<p class="data-name">'+data+' Eliminados</p>'+
              '</legend>'+
              '<span class="closeView closeIcon glyphicon glyphicon-remove" aria-hidden="true"></span>'+
            '</fieldset>'+
            '<div class="popUp-panel col-xs-12">'+
            '</div>'+
          '</form>'+
        '</div>'+
      '</div>'+
    '</div>'
  );

   // cierra el popUp cuando se apreta la X superior
  $('.click-popUp .closeView').on('click',function () {
      closeClickPopUp();
  });
}



// Injecta el numero de registros encontrado por las peticiones AJAX
function changeLabelTotalData(totalDataSet) {
  if (totalDataSet === 1) {
      $(".total-registros").text(totalDataSet+' registro');
  }else{
      $(".total-registros").text(totalDataSet+' registros');
      if (totalDataSet === 0) {
          $('.headResult').append(
              '<div class="alert alert-warning" role="alert">'+
                  '<p><strong>Warning!</strong>     No se han encontrado registros<p>'+
              '</div>'
          );
      }
  }
}


// crea los elementos resultados de las busquedas
// crea los encabezados para cada filtro
// crea los elementos pertenecientes a cada filtro
function createDataTable(data) {
  if (data.type == 'Nave' && data.objects.length !== 0) {
      $('.headResult').append(
          '<tr class="bg-primary bg-oscuro" >'+
              '<th>#</th>'+
              '<th>Rotacion</th>'+
              '<th>Importacion</th>'+
              '<th>Exportacion</th>'+
              '<th>Nombre</th>'+
              '<th>Largo</th>'+
              '<th>Arribo</th>'+
              '<th>Zarpe</th>'+
          '</tr>'
      );

      $.each(data.objects,function (i,objects) {
          $('.bodyResult').append(
              '<tbody>'+
                  '<tr data-index="'+objects.ROTACION+'" class="bg-primary">'+
                      '<td>'+(i+1)+'</td>'+
                      '<td>'+objects.ROTACION+'</td>'+
                      '<td>'+objects.VIAJE_IMPO+'</td>'+
                      '<td>'+objects.VIAJE_EXPO+'</td>'+
                      '<td>'+objects.NOMBRE+'</td>'+
                      '<td>'+objects.LARGO+'</td>'+
                      '<td>'+objects.F_ARRIBO+'</td>'+
                      '<td>'+objects.F_ZARPE+'</td>'+
                  '</tr>'+
              '<tbody>'
          );
      });
  }

  if (data.type == 'Puerto' && data.objects.length !== 0) {
      $('.headResult').append(
          '<tr class="bg-primary bg-oscuro" >'+
              '<th>#</th>'+
              '<th>Puerto</th>'+
              '<th>Pais</th>'+
          '</tr>'
      );

      $.each(data.objects,function (i,objects) {
          $('.bodyResult').append(
              '<tbody>'+
                  '<tr data-index="'+objects.id_puerto+'" class="bg-primary">'+
                      '<td>'+(i+1)+'</td>'+
                      '<td>'+objects.puerto+'</td>'+
                      '<td>'+objects.pais+'</td>'+
                  '</tr>'+
              '<tbody>'
          );
      });
  }


  if (data.type == 'Unit' && data.objects.length !== 0) {
      $('.headResult').append(
          '<tr class="bg-primary bg-oscuro" >'+
              '<th>#</th>'+
              '<th>Empresa</th>'+
              '<th>Tipo</th>'+
              '<th>Alto</th>'+
              '<th>Ancho</th>'+
              '<th>Largo</th>'+
              '<th>peso</th>'+
          '</tr>'
      );

      $.each(data.objects,function (i,objects) {
          $('.bodyResult').append(
              '<tbody>'+
                '<tr data-index="'+objects.id_unit+'" class="bg-primary">'+
                    '<td>'+(i+1)+'</td>'+
                    '<td>'+objects.empresa+'</td>'+
                    '<td>'+objects.tipo+'</td>'+
                    '<td>'+objects.alto+'</td>'+
                    '<td>'+objects.ancho+'</td>'+
                    '<td>'+objects.largo+'</td>'+
                    '<td>'+objects.peso+'</td>'+
                '</tr>'+
              '<tbody>'
          );
      });
  }

  if (data.type == 'Embarcador' && data.objects.length !== 0) {
      $('.headResult').append(
          '<tr class="bg-primary bg-oscuro" >'+
              '<th>#</th>'+
              '<th>Empresa</th>'+
              '<th>Rut</th>'+
          '</tr>'
      );

      $.each(data.objects,function (i,objects) {
          $('.bodyResult').append(
              '<tbody>'+
                '<tr data-index="'+objects.id_embarcador+'" class="bg-primary">'+
                    '<td>'+(i+1)+'</td>'+
                    '<td>'+objects.empresa+'</td>'+
                    '<td>'+objects.rut+'</td>'+
                '</tr>'+
              '<tbody>'
          );
      });
  }
  console.log(data);
}


// crea los eventos cuando son clickeados los elementos del resultados de busqueda
// crea un popUp
// gatilla los datos de la busqueda del elemento clickeado
function createTableLineEvents() {
  $('.bodyResult td').on('click',function () {
      if ($('html').height() > window.innerHeight && $('html').width() > 1280 ) {
          $('html').css('overflow-y', 'hidden');
          $('html').css('padding-right','17px' );
      }else{
          $('html').css('overflow-y', 'hidden');
      }
      var trigger = $(this).parent().attr('data-index');
      createPopUpNew(trigger);
      console.log($(".radioBox-options label input:checked").parent().text());
      var send = {
        "searching": trigger,
        "filter": $(".radioBox-options label input:checked").parent().text()
      }
      searchOneAjax(send);
  });
}


// Peticion para la busqueda de los datos
// llama a la funcion que cambia el total de registros encontrados
// llama a la funcion crea los encabezados y elementos de la tabla
// llama a la funcion que crea los eventos para cada elemento de la tabla
function searchAjax(data) {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/search.php',
      data: data,
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        $('.headResult').empty();
        $('.bodyResult').empty();
        changeLabelTotalData(response.objects.length);
        createDataTable(response);
        createTableLineEvents();
        console.log(response ,response.objects.length );
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// Peticion para la busqueda de los datos
// llama a la funcion que cambia el total de registros encontrados
// llama a la funcion crea los encabezados y elementos de la tabla
// llama a la funcion que crea los eventos para cada elemento de la tabla
function defaultSearchAjax(data) {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/defaultSearch.php',
      data: data,
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        $('.headResult').empty();
        $('.bodyResult').empty();
        changeLabelTotalData(response.objects.length);
        createDataTable(response);
        createTableLineEvents();
        console.log(response ,response.objects.length );
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// Peticion para la busqueda de los datos del elemento clickeado de la tablas de resultado
// injecta los datos en el layout de vista dependiendo del filtro
// llama a la funcion que injecta los botones correspondiente para cada tipo de usuario
// define las funciones que se gatillan cuando los botones son apretados
function searchOneAjax(data) {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/searchOne.php',
      data: data,
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        var userType = user;
        console.log(response);
        if (response.type == 'Unit' && response.objects.length !== 0) {


          $('.click-popUp .data-type').text(response.type);
          $('.click-popUp .data-name').text(response.objects.empresa+' - '+response.objects.tipo);
          var container = $('.click-popUp .viewLayout .popUp-panel');
          createContent(container,'Empresa',response.objects.empresa);
          createContent(container,'Tipo',response.objects.tipo);
          createContent(container,'Alto',response.objects.alto);
          createContent(container,'Ancho',response.objects.ancho);
          createContent(container,'Largo',response.objects.largo);
          createContent(container,'Peso',response.objects.peso);

          if (userType === 'administrador' || userType === 'operario') {
            var container = $('.click-popUp .editLayout .popUp-panel');
            createContent(container,'Empresa',response.objects.empresa);
            createContent(container,'Tipo',response.objects.tipo);
            createContentEdit(container,'Alto',response.objects.alto);
            createContentEdit(container,'Ancho',response.objects.ancho);
            createContentEdit(container,'Largo',response.objects.largo);
            createContentEdit(container,'Peso',response.objects.peso);
            allValidation(response.type);
          }else{
            $('.editLayout').remove();
            $('.click-popUp .viewLayout .button-panel').remove();
          }
        }

        if (response.type == 'Embarcador' && response.objects.length !== 0) {
          $('.click-popUp .data-type').text(response.type);
          $('.click-popUp .data-name').text(response.objects.empresa);
          var container = $('.click-popUp .viewLayout .popUp-panel');
          createContent(container,'Empresa',response.objects.empresa);
          createContent(container,'Rut',response.objects.rut);

          if (userType === 'administrador' || userType === 'operario') {
            var container = $('.click-popUp .editLayout .popUp-panel');
            createContentEdit(container,'Empresa',response.objects.empresa);
            createContentEdit(container,'Rut',response.objects.rut);
            allValidation(response.type);
          }else{
            $('.editLayout').remove();
            $('.click-popUp .viewLayout .button-panel').remove();
          }
        }

        if (response.type == 'Puerto' && response.objects.length !== 0) {
          $('.click-popUp .data-type').text(response.type);
          $('.click-popUp .data-name').text(response.objects.puerto);
          var container = $('.click-popUp .viewLayout .popUp-panel');
          createContent(container,'Puerto',response.objects.puerto);
          createContent(container,'Pais',response.objects.pais);
          if (userType === 'administrador' || userType === 'operario') {
            var container = $('.click-popUp .editLayout .popUp-panel');
            createContentEdit(container,'Puerto',response.objects.puerto);
            createContentEdit(container,'Pais',response.objects.pais);
            allValidation(response.type);
          }else{
            $('.editLayout').remove();
            $('.click-popUp .viewLayout .button-panel').remove();
          }
        }


        if (response.type == 'Nave' && response.objects.length !== 0) {
          $('.click-popUp .data-type').text(response.type);
          $('.click-popUp .data-name').text(response.objects.NOMBRE);
          var container = $('.click-popUp .viewLayout .popUp-panel');
          createContent(container,'Rotacion',response.objects.ROTACION);
          createContent(container,'Importacion',response.objects.VIAJE_IMPO);
          createContent(container,'Exportacion',response.objects.VIAJE_EXPO);
          createContent(container,'Nombre',response.objects.NOMBRE);
          createContent(container,'Largo',response.objects.LARGO);
          createContent(container,'Arribo',response.objects.F_ARRIBO);
          createContent(container,'Zarpe',response.objects.F_ZARPE);
          $('.click-popUp .editLayout').remove();
          $('.click-popUp .btn-eliminar').remove();
          $('.click-popUp .btn-editar').remove();

          createNaveButtons(userType,response.objects.ROTACION);

        }

        if (userType === 'administrador' || userType === 'operario') {
          $('.click-popUp .btn-eliminar').on('click',function () {
              var request = {
                type: 'eliminar',
                message:'¿Estas seguro de eliminar este registro?',
                warning: '<strong>Advertencia!</strong> eliminar este registro puede influir directamente en elementos del proceso de Estiba'
              }
              createConfirmationRequest(data, request);
          });
        }


        $('.click-popUp').toggleClass('active');
        $('.click-popUp .viewLayout').toggleClass('active');
        $('html, body').css("cursor", "auto");

      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// Peticion para la eliminacion temporal de los datos cuando se clickea el boton eliminar
// se crea y muestra un popUp que refleja el resultado de esta peticion
function removeDataAjax(data) {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/removeData.php',
      data: data,
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        console.log(response);
        if (response.type === 'Success') {
            createPopUpActionMSG(response);
            standardSearch().then(function () {
              closeClickPopUp();
              showPopUpActionMSG(response.type);
            });
            console.log(response);
        }

        if (response.type === 'Failure') {
            $('.click-popUp .click-confirmationPopUp').remove();
            createPopUpActionMSG(response);
            showPopUpActionMSG(response.type);

            console.log(response);
        }
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// Peticion para la modificacion de los datos cuando se clickea el boton editar
// se crea y muestra un popUp que refleja el resultado de esta peticion
function updateDataAjax(data) {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/updateData.php',
      data: data,
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        console.log(response);
        if (response.type === 'Success') {
            createPopUpActionMSG(response);
            standardSearch().then(function () {
              closeClickPopUp();
              showPopUpActionMSG(response.type);
            });
            console.log(response);
        }

        if (response.type === 'Failure') {
            $('.click-popUp .click-confirmationPopUp').remove();
            createPopUpActionMSG(response);
            showPopUpActionMSG(response.type);

            console.log(response);
        }
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// Peticion para la insercion de los datos cuando se clickea el boton Agregar
// se crea y muestra un popUp que refleja el resultado de esta peticion
function addDataAjax(data) {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/addData.php',
      data: data,
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        console.log(response);
        if (response.type === 'Success') {
            createPopUpActionMSG(response);
            standardSearch().then(function () {
              closeClickPopUp();
              showPopUpActionMSG(response.type);
            });
            console.log(response);
        }

        if (response.type === 'Failure') {
            $('.click-popUp .click-confirmationPopUp').remove();
            createPopUpActionMSG(response);
            showPopUpActionMSG(response.type);

            console.log(response);
        }
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// Peticion para la restauracion o eliminacion para siempre cuando se apretan los botones tick o X
// en el layout de los elementos eliminados temporalmente
// se crea y muestra un popUp que refleja el resultado de esta peticion
function deletedDataAjax(data) {
  console.log(data);
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/deletedData.php',
      data: data,
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        console.log(response);
        if (response.type === 'Success') {
            createPopUpActionMSG(response);
            standardSearch().then(function () {
              closeClickPopUp();
              showPopUpActionMSG(response.type);
            });
            console.log(response);
        }

        if (response.type === 'Failure') {
            $('.click-popUp .click-confirmationPopUp').remove();
            createPopUpActionMSG(response);
            showPopUpActionMSG(response.type);

            console.log(response);
        }
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// injecta el popUp que refleja el resultado de las peticiones o acciones al HTML principal
function createPopUpActionMSG(response) {
  var color;
  var icon;
  if (response.type === 'Success') {color = 'success'; icon = 'glyphicon-ok-sign';}
  if (response.type === 'Failure') {color = 'danger'; icon = 'glyphicon-exclamation-sign';}
  $('body').append(
    '<div class="action-popUp">'+
        '<div class="actionMSG alert '+color+'" role="alert">'+
              '<p><span class="glyphicon '+icon+'" aria-hidden="true"></span>'+response.msg+'<p>'+
        '</div>'+
    '</div>'
  );

  if (response.type === 'Failure') {
    $('.action-popUp').append(
      '<div class="alert alert-danger" role="alert">'+
          '<p><strong>Error!  </strong> '+response.error+'<p>'+
      '</div>'
    );
  }
}

// Animacion para el popUp que refleja el resultado de las peticiones o acciones
function showPopUpActionMSG(type) {
  if (type === 'Success') {
    $('.click-popUp').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
      $('.action-popUp').addClass('active');
    });

    $('.action-popUp').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
        $(this).remove();
    });
  }

  if (type === 'Failure') {
    $('.action-popUp').addClass('active');
    $('.action-popUp').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
        $(this).remove();
    });
  }

}


// injecta el popUp con layout para la visualizacion del elemento clickeado correspondiente a la tabla
// y crea las funciones que se gatillan cuando se clickean los botones del layout
function createPopUpNew(data) {
  $('body').append(
    '<div class="click-popUp">'+
      '<div class="body-popUp">'+
        '<div class="viewLayout well col-xs-12">'+
          '<fieldset>'+
            '<legend>'+
              '<p class="data-type"></p>'+
              '<p class="data-name"></p>'+
            '</legend>'+
            '<span class="closeView closeIcon glyphicon glyphicon-remove" aria-hidden="true"></span>'+
          '</fieldset>'+
          '<div class="popUp-panel col-xs-12">'+
          '</div>'+

          '<div class="button-panel col-xs-12">'+
            '<div class="col-xs-6">'+
              '<button class="btn btn-coronel btn-center btn-editar">Editar</button>'+
            '</div>'+
            '<div class="col-xs-6">'+
              '<button class="btn btn-coronel btn-center btn-eliminar">Eliminar</button>'+
            '</div>'+
          '</div>'+
        '</div>'+

        '<div data-index="'+data+'"class="editLayout well col-xs-12">'+
          '<form id="info-form">'+
            '<fieldset>'+
              '<legend>'+
                '<p class="data-type"></p>'+
                '<p class="data-name"></p>'+
              '</legend>'+
              '<span class="closeEdit closeIcon glyphicon glyphicon-remove" aria-hidden="true"></span>'+
            '</fieldset>'+

            '<div class="popUp-panel col-xs-12">'+
            '</div>'+

            '<div class="button-panel col-xs-12">'+
              '<div class="col-xs-12">'+
                '<button class="btn btn-coronel btn-center btn-guardar">Guardar</button>'+
              '</div>'+
            '</div>'+
          '</form>'+
        '</div>'+
      '</div>'+
    '</div>'
  );

  $('.click-popUp .closeView').on('click',function () {
      closeClickPopUp();
  });

  $('.click-popUp .btn-editar').on('click',function () {
      $('.click-popUp .viewLayout').toggleClass('active');
      $('.click-popUp .editLayout').toggleClass('active');
  });

  $('.click-popUp .closeEdit').on('click',function () {
      $('.click-popUp .editLayout').toggleClass('active');
      $('.click-popUp .viewLayout').toggleClass('active');
  });



}


// injecta el los labels al html con la informacion capturada de las peticiones
function createContent(container, labelText, dataText) {
  container.append(
    '<div class="form-group col-sm-12">'+
      '<div class="col-sm-4">'+
        '<label class="rightText">'+labelText+':</label>'+
      '</div>'+
      '<div class="col-sm-8">'+
        '<label >'+dataText+'</label>'+
      '</div>'+
    '</div>'
  )
}


// injecta labels e inputs para el layout de editar
function createContentEdit(container, labelText, dataText) {
  container.append(
    '<div class="form-group col-sm-12">'+
      '<div class="col-sm-4">'+
        '<label class="rightText">'+labelText+':</label>'+
      '</div>'+
      '<div class="col-sm-8">'+
        '<input class="form-control" name="'+labelText+'" id="'+labelText+'" placeholder="'+dataText+'" value="'+dataText+'">'+
      '</div>'+
    '</div>'
  )
}


// Injecta labels e inputs para el layout de Agregar elementos
function createContentAdd(container, labelText, dataText) {
  container.append(
    '<div class="form-group col-sm-12">'+
      '<div class="col-sm-4">'+
        '<label class="rightText">'+labelText+':</label>'+
      '</div>'+
      '<div class="col-sm-8">'+
        '<input class="form-control" name="'+labelText+'" id="'+labelText+'" placeholder="'+dataText+'">'+
      '</div>'+
    '</div>'
  )
}


// Injecta crea el input selector de embarcadores para el Agregar Unit
// pide todos los embarcadores disponibles con una peticion Ajax
function createSelectEmbarcadoresAdd(container, labelText) {
  container.append(
    '<div class="form-group col-sm-12">'+
      '<div class="col-sm-4">'+
        '<label class="rightText">'+labelText+':</label>'+
      '</div>'+
      '<div class="col-sm-8">'+
        '<select name="selectEmbarcadores" class="form-control" id="selectEmbarcadores">'+
          '<option value="">Selecciona Una Empresa</option>'+
        '</select>'+
      '</div>'+
    '</div>'
  )
  allEmbarcadoresAjax();
}


// peticion para capturar todos los embarcadores disponibles para crear un Unit
function allEmbarcadoresAjax() {
  $('html, body').css("cursor", "wait");
  return $.ajax({
      url:  '../php/buscador/getEmbarcadores.php',
      type: 'POST',
      dataType: 'JSON',
      success:  function (response) {
        console.log(response);
        $.each(response.objects,function (i,objects) {
            $('#selectEmbarcadores').append(
              '<option>'+objects.empresa+'</option>'
            );
        });
        $('html, body').css("cursor", "auto");
      },
      error: function(err){
        alert("An error occured: " + err.status + " " + err.statusText);
      }
  });
}


// injecta los botones para la vista de datos de las naves
// crea los eventos de cada boton
// Boton Estibar redirije a la pagina Estiba con la rotacion de la nave que se selecciono
// Boton Informe redirije a la pagina orden con la rotacion de la nave que se selecciono
function createNaveButtons(type,rotacion) {
  if (type === 'administrador' || type === 'operario' ) {
    $('.click-popUp .viewLayout .button-panel').append(
      '<div class="col-xs-6">'+
        '<button class="btn btn-coronel btn-center btn-estibas">Estibas</button>'+
      '</div>'+
      '<div class="col-xs-6">'+
        '<button class="btn btn-coronel btn-center btn-informe">Informe</button>'+
      '</div>'
    );

    $('.click-popUp .viewLayout .btn-estibas').on('click',function () {
        localStorage.setItem('ROTACION', rotacion);
        window.location="../paginas/estiba.php";
    });
  }else{
    $('.click-popUp .viewLayout .button-panel').append(
      '<div class="col-xs-12">'+
        '<button class="btn btn-coronel btn-center btn-informe">Informe</button>'+
      '</div>'
    );
  }


  $('.click-popUp .viewLayout .btn-informe').on('click',function () {
    window.location="../estibas/orden.html?rotacion="+rotacion+"";
  });

}


// injecta el popUp para la confirmacion de las acciones que quiere realizar el usuario
// el popUp es dinamico y se adecua a el tipo de accion que lo invoco
// crea los mensajes y botones
// gatilla las funciones de Peticiones Ajax dependiendo de la accion que lo invoco
function createConfirmationRequest(data, request) {
      $('.click-popUp .body-popUp').append(
          '<div class="click-confirmationPopUp">'+
            '<div class="confirmationPopUp col-xs-6">'+
                '<div class="request-panel col-xs-12">'+
                    '<p id="messageRequest">'+request.message+'</p>'+
                    '<p id="warningRequest">'+request.warning+'</p>'+
                '</div>'+

                '<div class="request-button-panel col-xs-12">'+
                  '<div class="col-xs-6">'+
                    '<button class="btn btn-coronel btn-center btn-accept-request">Aceptar</button>'+
                  '</div>'+
                  '<div class="col-xs-6">'+
                    '<button class="btn btn-coronel btn-center btn-cancel-request">Cancelar</button>'+
                  '</div>'+
                '</div>'+
            '</div>'+
          '</div>'
      );
      $('.click-confirmationPopUp').css('display', 'block');

      $('.click-confirmationPopUp .btn-cancel-request').on('click',function () {
          $('.click-popUp .click-confirmationPopUp').remove();
      });

      $('.click-confirmationPopUp .btn-accept-request').on('click',function () {
          $('.click-popUp .click-confirmationPopUp').append(
              '<div class="blocking-screen">'+
              '</div>'
          );

          console.log(data);
          if (request.type === 'eliminar') {
              console.log(data);
              removeDataAjax(data);
          }

          if (request.type === 'guardar') {
              console.log(data);
              updateDataAjax(data);
          }

          if (request.type === 'agregar') {
              console.log(data);
              addDataAjax(data);
          }

          if (request.type === 'restore') {
              console.log(data);
              deletedDataAjax(data);
          }

          if (request.type === 'remove4EVER') {
              console.log(data);
              deletedDataAjax(data);
          }
      });
}


// Cierra el popUp cuando se apreta la X superior
function closeClickPopUp() {
  $('.click-popUp').toggleClass('active');
  $('.click-popUp').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
    $('html').css('overflow-y', 'auto');
    $('html').css('padding-right','0px' );
    $('.click-popUp').remove();
  });
}


// Validaciones para cuando se completa los formulacion
// abarca los casos cuando se quiere Editar elementos
// abarca los casos cuando se quiere Agregar elementos
// se utilizo un framework JQuery validation js que hace mas facil el proceso
// y aqui esta la documentacion https://jqueryvalidation.org/documentation/
function allValidation(type) {

  // metodos de validaciones adicionales
  jQuery.validator.addMethod("metros", function(value, element) {
  	return this.optional(element) || /^(\d{1,3}\.\d{2})?$/i.test(value);
	}, "Debes ingresar un número con 2 decimales, ej: 0.40 (metros)");

  $.validator.addMethod( "letterswithspaces", function( value, element ) {
    return this.optional( element ) || /^([a-z]+[\s]?[a-z]+)?$/i.test(value);
  }, "Solo puedes ingresar letras y solo un espacio" );

  $.validator.addMethod( "rutChileno", function( value, element ) {
    return this.optional( element ) || /^(\d{1,2}\.\d{3}\.\d{3}\-\d{1})?$/i.test(value);
  }, "Debes ingresar un Rut valido ej: 19.999.999-9, Para -k ingresar -0" );


  // configuracion de clases CSS en el caso de que los inputs no sean validos
  $.validator.setDefaults({
      errorClass: 'help-block',
      highlight: function(element) {
        $(element)
          .closest('.form-group')
          .addClass('has-error');
      },
      unhighlight: function(element) {
        $(element)
          .closest('.form-group')
          .removeClass('has-error');
      }
  });

  // aqui empiezan las validaciones
  // leer documentacion para su entendimiento
  // aqui esta la documentacion https://jqueryvalidation.org/documentation/
  if (type === 'Unit') {
    $('#info-form').validate({
      rules:{
        Alto:{
          required: true,
          metros:true,
          min: 0.01,
          max: 200.00
        },
        Ancho:{
          required: true,
          metros:true,
          min: 0.01,
          max: 200.00
        },
        Largo:{
          required: true,
          metros:true,
          min: 0.01,
          max: 200.00
        },
        Peso:{
          required: true,
          metros:true,
          min: 0.01,
          max: 2000.00
        }
      },
      messages:{
        Alto:{
          required: 'El Alto es obligatorio',
          min: 'El Alto debe ser mayor o igual que 0.01 metros',
          max: 'El Alto debe ser menor o igual que 200.00 metros'
        },
        Ancho:{
          required: 'El Ancho es obligatorio',
          min: 'El Ancho debe ser mayor o igual que 0.01 metros',
          max: 'El Ancho debe ser menor o igual que 200.00 metros'
        },
        Largo:{
          required: 'El Largo es obligatorio',
          min: 'El Largo debe ser mayor o igual que 0.01 metros',
          max: 'El Largo debe ser menor o igual que 200.00 metros'
        },
        Peso:{
          required: 'El Peso es obligatorio',
          min: 'El Peso debe ser mayor o igual que 0.01 kg',
          max: 'El Peso debe ser menor o igual que 2000.00 kg'
        }

      },
      submitHandler: function(form) {
        var request = {
          type: 'guardar',
          message:'¿Estas seguro de guardar los cambios realizados?',
          warning: 'Advertencia! guardar los cambios puede influir directamente en elementos del proceso de Estiba'
        }
        var data = {
          dataType: 'unit',
          fields:{
            id: $('.editLayout').attr('data-index'),
            alto: $('#Alto').val(),
            ancho: $('#Ancho').val(),
            largo: $('#Largo').val(),
            peso: $('#Peso').val()
          }
        }
        createConfirmationRequest(data, request);
        console.log(data);
      }
    });
  }

  if (type === 'Puerto') {
    $('#info-form').validate({
      rules:{
        Puerto:{
          required: true,
          letterswithspaces: true,
          minlength: 5,
          maxlength: 30
        },
        Pais:{
          required: true,
          letterswithspaces: true,
          minlength: 5,
          maxlength: 30
        }
      },
      messages:{
        Puerto:{
          required: 'Debes ingresar el nombre del Puerto, es obligatorio',
          minlength: 'Debe contener minimo 5 letras',
          maxlength: 'Debe contener maximo 30 letras'
        },
        Pais:{
          required: 'Debes ingresar un Pais, es obligatorio',
          minlength: 'Debe contener minimo 5 letras',
          maxlength: 'Debe contener maximo 30 letras'
        }

      },
      submitHandler: function(form) {
        var request = {
          type: 'guardar',
          message:'¿Estas seguro de guardar los cambios realizados?',
          warning: 'Advertencia! guardar los cambios puede influir directamente en elementos del proceso de Estiba'
        }
        var data = {
          dataType: 'puertos',
          fields:{
            id: $('.editLayout').attr('data-index'),
            puerto: $('#Puerto').val(),
            pais: $('#Pais').val()
          }
        }
        createConfirmationRequest(data, request);
        console.log(data);
      }
    });
  }

  if (type === 'Embarcador') {
    $('#info-form').validate({
      rules:{
        Empresa:{
          required: true,
          letterswithspaces: true,
          minlength: 4,
          maxlength: 30
        },
        Rut:{
          required: true,
          rutChileno: true
        }
      },
      messages:{
        Empresa:{
          required: 'Debes ingresar el nombre de la Empresa, es obligatorio',
          minlength: 'Debe contener minimo 4 letras',
          maxlength: 'Debe contener maximo 30 letras'
        },
        Rut:{
          required: 'Debes ingresar el Rut, es obligatorio',
        }

      },
      submitHandler: function(form) {
        var request = {
          type: 'guardar',
          message:'¿Estas seguro de guardar los cambios realizados?',
          warning: 'Advertencia! guardar los cambios puede influir directamente en elementos del proceso de Estiba'
        }
        var data = {
          dataType: 'embarcador',
          fields:{
            id: $('.editLayout').attr('data-index'),
            empresa: $('#Empresa').val(),
            rut: $('#Rut').val()
          }
        }
        createConfirmationRequest(data, request);
        console.log(data);

      }

    });
  }

  if (type === 'agregar-unit') {
    $('#info-form').validate({
      rules:{
        selectEmbarcadores:{
          required: true
        },
        Tipo:{
          required: true,
          letterswithspaces: true,
          minlength: 1,
          maxlength: 30,
          remote: {
            url: "../php/buscador/isValid.php" ,
            type: "post" ,
            data: {
               "type": function() {
                 return 'unit-tipoUnit';
               },
               "empresa": function() {
                 return $('#selectEmbarcadores').val();
               }
               ,
               "tipo": function() {
                 return $('#Tipo').val();
               }
             }
          }
        },
        Alto:{
          required: true,
          metros:true,
          min: 0.01,
          max: 200.00
        },
        Ancho:{
          required: true,
          metros:true,
          min: 0.01,
          max: 200.00
        },
        Largo:{
          required: true,
          metros:true,
          min: 0.01,
          max: 200.00
        },
        Peso:{
          required: true,
          metros:true,
          min: 0.01,
          max: 2000.00
        }
      },
      messages:{
        selectEmbarcadores:{
          required: 'Debes seleccionar una Empresa, es obligatorio'
        },
        Tipo:{
          required: 'Debes ingresar el nombre del Tipo de Unit, es obligatorio',
          minlength: 'Debe contener minimo 1 letra',
          maxlength: 'Debe contener maximo 30 letras',
          remote: $.validator.format("El Unit {0} de la empresa que seleccionaste ya existe")
        },
        Alto:{
          required: 'El Alto es obligatorio',
          min: 'El Alto debe ser mayor o igual que 0.01 metros',
          max: 'El Alto debe ser menor o igual que 200.00 metros'
        },
        Ancho:{
          required: 'El Ancho es obligatorio',
          min: 'El Ancho debe ser mayor o igual que 0.01 metros',
          max: 'El Ancho debe ser menor o igual que 200.00 metros'
        },
        Largo:{
          required: 'El Largo es obligatorio',
          min: 'El Largo debe ser mayor o igual que 0.01 metros',
          max: 'El Largo debe ser menor o igual que 200.00 metros'
        },
        Peso:{
          required: 'El Peso es obligatorio',
          min: 'El Peso debe ser mayor o igual que 0.01 kg',
          max: 'El Peso debe ser menor o igual que 2000.00 kg'
        }

      },
      submitHandler: function(form) {
        var request = {
          type: 'agregar',
          message:'¿Estas seguro de agregar este nuevo Unit?',
          warning: 'Advertencia! agregar un Unit puede influir directamente en elementos del proceso de Estiba'
        }
        var data = {
          dataType: 'unit',
          fields:{
            empresa: $('#selectEmbarcadores').val(),
            tipo: $('#Tipo').val(),
            alto: $('#Alto').val(),
            ancho: $('#Ancho').val(),
            largo: $('#Largo').val(),
            peso: $('#Peso').val()
          }
        }
        createConfirmationRequest(data, request);
        console.log(data);
      }
    });
  }

  if (type === 'agregar-puerto') {
    $('#info-form').validate({
      rules:{
        Puerto:{
          required: true,
          letterswithspaces: true,
          minlength: 5,
          maxlength: 30,
          remote: {
            url: "../php/buscador/isValid.php" ,
            type: "post" ,
            data: {
               "type": function() {
                 return 'puerto-nombrePuerto';
               },
               "puerto": function() {
                 return $('#Puerto').val();
               }
             }
          }
        },
        Pais:{
          required: true,
          letterswithspaces: true,
          minlength: 5,
          maxlength: 30
        }
      },
      messages:{
        Puerto:{
          required: 'Debes ingresar el nombre del Puerto, es obligatorio',
          minlength: 'Debe contener minimo 5 letras',
          maxlength: 'Debe contener maximo 30 letras',
          remote: $.validator.format("El Puerto {0} ya existe ")
        },
        Pais:{
          required: 'Debes ingresar un Pais, es obligatorio',
          minlength: 'Debe contener minimo 5 letras',
          maxlength: 'Debe contener maximo 30 letras'
        }

      },
      submitHandler: function(form) {
        var request = {
          type: 'agregar',
          message:'¿Estas seguro de agregar este nuevo Puerto?',
          warning: 'Advertencia! agregar un nuevo Puerto puede influir directamente en elementos del proceso de Estiba'
        }
        var data = {
          dataType: 'puertos',
          fields:{
            puerto: $('#Puerto').val(),
            pais: $('#Pais').val()
          }
        }
        createConfirmationRequest(data, request);
        console.log(data);
      }
    });
  }

  if (type === 'agregar-embarcador') {
    $('#info-form').validate({
      rules:{
        Empresa:{
          required: true,
          letterswithspaces: true,
          minlength: 4,
          maxlength: 30,
          remote: {
           url: "../php/buscador/isValid.php" ,
           type: "post" ,
           data: {
              "type": function() {
                return 'embarcador-empresa';
              },
              "empresa": function() {
                return $('#Empresa').val();
              }
            }
          }
        },
        Rut:{
          required: true,
          rutChileno: true,
          remote: {
           url: "../php/buscador/isValid.php" ,
           type: "post" ,
           data: {
              "type": function() {
                return 'embarcador-rut';
              },
              "rut": function() {
                return $('#Rut').val();
              }
            }
          }
        }
      },
      messages:{
        Empresa:{
          required: 'Debes ingresar el nombre de la Empresa, es obligatorio',
          minlength: 'Debe contener minimo 4 letras',
          maxlength: 'Debe contener maximo 30 letras',
          remote: $.validator.format("El nombre {0} ya existe ")
        },
        Rut:{
          required: 'Debes ingresar el Rut, es obligatorio',
          remote: $.validator.format("El rut {0} ya existe ")
        }

      },
      submitHandler: function(form) {
        var request = {
          type: 'agregar',
          message:'¿Estas seguro de agregar esta nueva Empresa Embarcadora ?',
          warning: 'Advertencia! agregar una nueva Empresa Embarcadora puede influir directamente en elementos del proceso de Estiba'
        }
        var data = {
          dataType: 'embarcador',
          fields:{
            empresa: $('#Empresa').val(),
            rut: $('#Rut').val()
          }
        }
        createConfirmationRequest(data, request);
        console.log(data);
      }

    });
  }
}
