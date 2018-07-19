<?php
    // Coneccion
    include 'conecction.php';

    // Captura de Variables desde la Peticion Ajax
    $search = new StdClass();
    $search->type = $_POST["type"];

    // Caso Tipo de Seleccion = Embarcador Empresa
    // Sentencia Para Saber La Existencia del registro en la Base de datos
    if ($search->type === 'embarcador-empresa') {
        $search->empresa = $_POST["empresa"];
        $sql = "SELECT * FROM embarcador 
                WHERE empresa = '$search->empresa'";
    }

    // Caso Tipo de Seleccion = Embarcador RUT
    // Sentencia Para Saber La Existencia del registro en la Base de datos
    if ($search->type === 'embarcador-rut') {
        $search->rut = $_POST["rut"];
        $sql = "SELECT * FROM embarcador 
                WHERE rut ='$search->rut'";
    }


    // Caso Tipo de Seleccion = Unit TIPO - EMPRESA EMBARCADORA  RELACION UNICA
    // Sentencia Para Saber La Existencia del registro en la Base de datos
    if ($search->type === 'unit-tipoUnit') {
      $search->empresa = $_POST["empresa"];
      $search->tipo = $_POST["tipo"];
      $sql = "SELECT * FROM unit
              WHERE empresa ='$search->empresa'
              AND tipo = '$search->tipo'";
    }

    // Caso Tipo de Seleccion = NOMBRE PUERTO
    // Sentencia Para Saber La Existencia del registro en la Base de datos
    if ($search->type === 'puerto-nombrePuerto') {
      $search->puerto = $_POST["puerto"];
      $sql = "SELECT * FROM puertos
              WHERE puerto ='$search->puerto'";
    }
    
    // Ejecucion de Sentencia SQL
    $json = new StdClass();
    $results = mysqli_query($conn,$sql);

    if($results->num_rows == 0){
      echo "true"; //good to register Disponible
    }else{
      echo "false"; //already registered No Disponible
    }
?>