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

    // Caso de Filtro = Nave
    // Indica donde Buscar y por que Atributo Buscar
    if ($search->filterSelected == 'Rotacion') {
      $search->whereSearch = 'nave';
      $search->filterSelected = 'ROTACION';
    }

    // Caso de Filtro = Embarcador
    // Indica donde Buscar y por que Atributo Buscar
    if ($search->filterSelected == 'Planta') {
      $search->whereSearch = 'embarcador';
      $search->filterSelected = 'id_embarcador';
    }

    // Caso de Filtro = Puerto
    // Indica donde Buscar y por que Atributo Buscar
    if ($search->filterSelected == 'Puerto') {
      $search->whereSearch = 'puertos';
      $search->filterSelected = 'id_puerto';
    }

    // Caso de Filtro = Unit
    // Indica donde Buscar y por que Atributo Buscar
    if ($search->filterSelected == 'Unit') {
      $search->whereSearch = 'unit';
      $search->filterSelected = 'id_unit';
    }

    if ($search->filterSelected == 'Nave') {
      $search->whereSearch = 'buque';
      $search->filterSelected = 'id';
    }


    // Sentencia SQL
    $sql = "SELECT *
            FROM $search->whereSearch
            WHERE $search->filterSelected = '$search->searching'";




    // Ejecucion de Sentencia SQL
    // Dar Formato a Resultados de Busqueda SQL => OBJETOS
    $result = mysqli_query($conn,$sql);
    $obj = mysqli_fetch_object($result);

    // Transformacion de Objeto a Formato JSON
		// La Peticion Ajax Espera una Respuesta en Formato JSON
    $json->objects = $obj;
    $json = json_encode($json);
    echo $json;

    // Cierre de Coneccion
    $conn->close();
?>
