<?php
	// Coneccion Base de Datos
  include 'conecction.php';

		// Creacion de Objeto, Captura de Variables Enviadas por Peticion Ajax
    $data = new StdClass();
    $data->option = $_POST["option"];

    if ($data->option == 1) {
      // Creacion de Objeto para Enviarlo como Respuesta

      $data->nombre = $_POST["name"];
      $data->bodegas = $_POST["bodegas"];

      $json = new StdClass();

      $sql2 = "INSERT INTO buque (nombre, cantidad_bodegas, estado)
              VALUES ('$data->nombre', '$data->bodegas', 1)";
      //mysqli_query($conn,$sql);
      $conn->query($sql2);

      $json = json_encode($conn->insert_id);
      echo $json;
    }

    if ($data->option == 2) {
      // Creacion de Objeto para Enviarlo como Respuesta

      $data->id_buque = $_POST["idBuque"];
      $data->alto = $_POST["altoBodega"];
      $data->cantidadTier = $_POST["numero_tier"];
      $data->nbodega = $_POST["numero_bodega"];


      $json = new StdClass();

      $sql2 = "INSERT INTO bodega (alto, cant_tiers, num_bodega, id_buque)
              VALUES ('$data->alto', '$data->cantidadTier','$data->nbodega','$data->id_buque')";
      //mysqli_query($conn,$sql);
      $conn->query($sql2);

      $json = json_encode($conn->insert_id);
      echo $json;
    }

    if ($data->option == 3) {
      // Creacion de Objeto para Enviarlo como Respuesta

      $data->id_bodega = $_POST["idBodega"];
      $data->nivel = $_POST["nivel"];
      $data->largoTier = $_POST["largo_tier"];
      $data->anchoTier = $_POST["ancho_tier"];


      $json = new StdClass();

      $sql2 = "INSERT INTO tier (id_bodega, nivel, largo, ancho)
              VALUES ('$data->id_bodega', '$data->nivel','$data->largoTier','$data->anchoTier')";
      //mysqli_query($conn,$sql);
      $conn->query($sql2);

      $json = json_encode($conn->insert_id);
      echo $json;
    }



    $conn->close();
?>
