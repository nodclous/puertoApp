<?php

  // Coneccion
  include 'conecction.php';


    // Captura de Variables desde la Peticion Ajax
    $search = new StdClass();
    $search->searching = $_POST["searching"];
    $search->filterSelected = $_POST["filter"];

    // Creacion Objeto Respuesta
    $json = new StdClass();
    $json->type = $search->filterSelected;

    // Caso de Filtro = Rotacion
    if ($search->filterSelected == 'Rotacion') {
      $search->whereSearch = 'nave';
      $search->filterSelected = 'ROTACION';

      // Caso Input Vacio
      // Retorna Todos los Datos de la Tabla Nave del Filtro Seleccionado = Nave
      if ($search->searching === '') {
          $sql = "SELECT *
                  FROM $search->whereSearch";

      }else {
        // Caso Input No Vacio
        // Retorna Todos los Datos de la Tabla Nave con Busqueda por ROTACION y NOMBRE
         $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%'
            OR NOMBRE LIKE '%$search->searching%' )";
      }
    }

    // Caso de Filtro = Unit
    if ($search->filterSelected == 'Unit') {
      $search->whereSearch = 'unit';
      $search->filterSelected = 'tipo';

      // Caso Input Vacio
      // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla Unit del Filtro Seleccionado = Unit
      if ($search->searching === '') {
          $sql = "SELECT *
              FROM unit
              WHERE estado = 1";

      }else {
        // Caso Input No Vacio
        // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla Unit con Busqueda por EMPRESA y TIPO
         $sql = "SELECT *
              FROM unit
              WHERE ($search->filterSelected LIKE '%$search->searching%'
              OR empresa LIKE '%$search->searching%')
              AND estado = 1";
      }

    }

    // Caso de Filtro = Embarcador
    if ($search->filterSelected == 'Planta') {
      $search->whereSearch = 'embarcador';
      $search->filterSelected = 'empresa';

      // Caso Input Vacio
      // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla embarcador del Filtro Seleccionado = Embarcador
      if ($search->searching === '') {
        $sql = "SELECT *
            FROM $search->whereSearch
            WHERE $search->filterSelected LIKE '%$search->searching%'
            AND estado = 1";

      }else {

        // Caso Input No Vacio
        // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla embarcador con Busqueda por EMPRESA y RUT
         $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%'
            OR rut LIKE '%$search->searching%' )
            AND estado = 1";
      }

    }


    // Caso de Filtro = Puerto
    if ($search->filterSelected == 'Puerto') {
      $search->whereSearch = 'puertos';
      $search->filterSelected = 'puerto';

      // Caso Input Vacio
      // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla puertos del Filtro Seleccionado = Puerto
      if ($search->searching === '') {
        $sql = "SELECT *
            FROM $search->whereSearch
            WHERE $search->filterSelected LIKE '%$search->searching%'
            AND estado = 1";

      }else {
        // Caso Input No Vacio
        // Retorna Todos los Datos Disponibles = estado = 1 de la Tabla puertos con Busqueda por PUERTO y PAIS
         $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%'
            OR pais LIKE '%$search->searching%' )
            AND estado = 1";
      }

    }

    // Filtro por Naves
    if ($search->filterSelected == 'Nave') {
      $search->whereSearch = 'buque';
      $search->filterSelected = 'nombre';

      // Caso Input Vacio
      // Retorna Todos los Datos de la Tabla Nave del Filtro Seleccionado = Nave
      if ($search->searching === '') {
          $sql = "SELECT *
                  FROM $search->whereSearch
                  WHERE $search->filterSelected LIKE '%$search->searching%'
                  AND estado = 1";

      }else {
        // Caso Input No Vacio
        // Retorna Todos los Datos de la Tabla Nave con Busqueda por ROTACION y NOMBRE
         $sql = "SELECT *
            FROM $search->whereSearch
            WHERE ($search->filterSelected LIKE '%$search->searching%')
            AND estado = 1";
      }
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
