<?php

  // Coneccion
  include 'conecction.php';

    // Captura de Variables desde la Peticion Ajax
    $search = new StdClass();
    $search->type = $_POST["where"];

    // Creacion de Objeto para Enviarlo como Respuesta
    $json = new StdClass();
    $json->type = $search->type;

    // Dirije hacia donde Buscar Dependiendo el Tipo de Tabla Seleccionada
    if ($search->type === 'Planta') {$search->whereSearch = 'embarcador';}
    if ($search->type === 'Puerto') {$search->whereSearch = 'puertos';}
    if ($search->type === 'Unit') {$search->whereSearch = 'unit';}
    if ($search->type === 'Nave'){$search->whereSearch = 'buque';}

    // Sentencia SQL
    $sql = "SELECT *
            FROM $search->whereSearch
            WHERE estado = 0";


    // Creacion de Array
    // Ejecucion de Sentencia SQL
    // Dar Formato a Resultados de Busqueda SQL => OBJETOS => ARRAY
    $array = array();
    $result = mysqli_query($conn,$sql);
    while ($obj = mysqli_fetch_object($result)) {
      $array[] = $obj;
    }

    // Transformacion de Objeto a Formato JSON
		// La Peticion Ajax Espera una Respuesta en Formato JSON
    $json->objects = $array;
    $json = json_encode($json);
    echo $json;

    // Cierre de Coneccion
    $conn->close();
?>
