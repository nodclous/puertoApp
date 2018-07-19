<?php
  // Coneccion
  include 'conecction.php';

    $json = new StdClass();

    // Obtener Todos los Embarcadores Disponibles
    // Sentencia SQL
    $sql = "SELECT empresa
            FROM embarcador
            Where estado = 1";


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
