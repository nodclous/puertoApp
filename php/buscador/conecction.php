<?php

  // Datos de la Base de Datos
  $hostName = "localhost";
  $userName = "nodclous_puerto";
  $userPass = "Nodclous0558";
  $userDb = "nodclous_planimetria";

    // Sentencia de Coneccion
    $conn = mysqli_connect($hostName,$userName,$userPass,$userDb);
    // Formato UTF8 a la Coneccion
    $conn->set_charset("utf8");

  // Manejo de Error en caso de no Coneccion
  if(!$conn){
    die('Error al Conectar a la Base de Datos');
  }
 ?>
