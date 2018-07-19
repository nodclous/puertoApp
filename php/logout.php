<?php
session_start();
include("conectar.php");
     mysqli_select_db($conexion,"gruasmatcl_puertocoronel");
session_destroy();
echo 'Cerrar sesion';
echo '<script> window.location="../index.php"; </script>';
 ?>
