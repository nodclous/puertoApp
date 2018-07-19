<?php
    // Coneccion
  include 'conecction.php';

    // Transformacion de Objeto a Formato JSON
    // La Peticion Ajax Espera una Respuesta en Formato JSON
    // Devuelve Todo el Objeto SESSION En el Caso de que se haya iniciado una Session de Usuario
    session_start();
    echo json_encode($_SESSION);
?>
