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
    // Retorna Todos los Datos de la Tabla Nave con Busqueda por ROTACION y NOMBRE
    if ($search->filterSelected == 'Rotacion') {
      $search->whereSearch = 'nave';
      $search->filterSelected = 'ROTACION';
      $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%'
            OR NOMBRE LIKE '%$search->searching%' )";
    }


    // Caso de Filtro = Unit
    // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla Unit con Busqueda por EMPRESA y TIPO
    if ($search->filterSelected == 'Unit') {
      $search->whereSearch = 'unit';
      $search->filterSelected = 'tipo';
      $sql = "SELECT *
              FROM unit
              WHERE ($search->filterSelected LIKE '%$search->searching%'
              OR empresa LIKE '%$search->searching%')
              AND estado = 1";
    }


    // Caso de Filtro = Embarcador
    // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla embarcador con Busqueda por EMPRESA y RUT
    if ($search->filterSelected == 'Planta') {
      $search->whereSearch = 'embarcador';
      $search->filterSelected = 'empresa';
      $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%'
            OR rut LIKE '%$search->searching%' )
            AND estado = 1";
    }


    // Caso de Filtro = Puerto
    // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla puertos con Busqueda por PUERTO y PAIS
    if ($search->filterSelected == 'Puerto') {
      $search->whereSearch = 'puertos';
      $search->filterSelected = 'puerto';
      $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%'
            OR pais LIKE '%$search->searching%' )
            AND estado = 1";
    }

    if ($search->filterSelected == 'Nave') {
      $search->whereSearch = 'buque';
      $search->filterSelected = 'nombre';
      $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%')
            AND estado = 1";
    }


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
