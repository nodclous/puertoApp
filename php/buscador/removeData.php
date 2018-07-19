<?php
  // Coneccion
  include 'conecction.php';

    // Captura de Variables desde la Peticion Ajax
    $search = new StdClass();
    $search->searching = $_POST["searching"];
    $search->filterSelected = $_POST["filter"];

    // Creacion de Objeto para Enviarlo como Respuesta
    $json = new StdClass();
    $json->type = $search->filterSelected;

    // Caso Filtro Unit
    // Indica donde Buscar y por que Atributo Buscar
    if ($search->filterSelected == 'Unit') {
      $search->whereSearch = 'unit';
      $search->filterSelected = 'id_unit';
    }


    // Caso Filtro Embarcador
    // Indica donde Buscar y por que Atributo Buscar
    if ($search->filterSelected == 'Planta') {
      $search->whereSearch = 'embarcador';
      $search->filterSelected = 'id_embarcador';
    }

    // Caso Filtro Puerto
    // Indica donde Buscar y por que Atributo Buscar
    if ($search->filterSelected == 'Puerto') {
      $search->whereSearch = 'puertos';
      $search->filterSelected = 'id_puerto';
    }

    if ($search->filterSelected == 'Nave') {
      $search->whereSearch = 'buque';
      $search->filterSelected = 'id';
    }

    // Sentencia SQL
    // Cambia de estado a No Disponible
    $sql = "UPDATE $search->whereSearch
               SET estado = 0
               WHERE $search->filterSelected = '$search->searching'";



    // Ejecuta la Sentencia SQL Basada en el Tipo de Parametros Enviados por Peticion Ajax
    if (mysqli_query($conn,$sql)) {
      // Caso de Exito en Ejecucion
      $json->type = 'Success';
      $json->msg = 'Se ha eliminado el registro correctamente';
    }else{
      // Caso de Fracaso en Ejecucion
      $json->type = 'Failure';
      $json->msg = 'Error al intentar eliminar el registro';
      $json->error = $conn->error;
    }

    // Transformacion de Objeto a Formato JSON
		// La Peticion Ajax Espera una Respuesta en Formato JSON
    $json = json_encode($json);
    echo $json;

    // Cierre de Coneccion
    $conn->close();
?>
