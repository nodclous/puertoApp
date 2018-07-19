<?php
	// Coneccion Base de Datos
  include 'conecction.php';
		// Creacion de Objeto, Captura de Variables Enviadas por Peticion Ajax
    $data = new StdClass();
    $data->dataType = $_POST["dataType"];
    $data->fields = $_POST["fields"];

		// Creacion de Objeto para Enviarlo como Respuesta
    $json = new StdClass();
    $json->type = $data->dataType;

		// Tipo de Peticion = puertos
		// Crea la Sentencia SQL con los Valores de la Tabla puertos
    if ($data->dataType === 'puertos') {
       $puerto = $data->fields["puerto"];
       $pais = $data->fields["pais"];
       $color = $data->fields["color"];

       $sql = "INSERT INTO puertos (puerto, pais, estado, color)
               VALUES ('$puerto', '$pais', 1, '$color')";
		}

		// Tipo de Peticion = unit
		// Crea la Sentencia SQL con los Valores de la Tabla unit
    if ($data->dataType === 'unit') {
       $empresa = $data->fields["empresa"];
       $tipo = $data->fields["tipo"];
       $alto = $data->fields["alto"];
       $ancho = $data->fields["ancho"];
       $largo = $data->fields["largo"];
       $peso = $data->fields["peso"];

       $sql = "INSERT INTO unit (tipo, alto, ancho, largo, peso, empresa, estado)
               VALUES ('$tipo', '$alto', '$ancho', '$largo', '$peso', '$empresa', 1)";
		}

		// Tipo de Peticion = embarcador
		// Crea la Sentencia SQL con los Valores de la Tabla embarcador
    if ($data->dataType === 'embarcador') {
       $empresa = $data->fields["empresa"];
       $rut = $data->fields["rut"];

       $sql = "INSERT INTO embarcador (empresa, rut, estado)
               VALUES ('$empresa', '$rut', 1)";
    }

    if ($data->dataType === 'nave') {
       $nombre = $data->fields["nombre"];
       $nBodegas = $data->fields["numero_bodegas"];

       $sql = "INSERT INTO embarcador (empresa, rut, estado)
               VALUES ('$empresa', '$rut', 1)";
    }


		// Ejecuta la Sentencia SQL Basada en el Tipo de Parametros Enviados por Peticion Ajax
    if (mysqli_query($conn,$sql)) {
			// Caso de Exito en Ejecucion
      $json->type = 'Success';
      $json->msg = 'Se ha agregado el registro correctamente';
    }else{
			// Caso de Fracaso en Ejecucion
      $json->type = 'Failure';
      $json->msg = 'Error al intentar agregar el registro';
      $json->error = $conn->error;

    }

		// Transformacion de Objeto a Formato JSON
		// La Peticion Ajax Espera una Respuesta en Formato JSON
    $json = json_encode($json);
    echo $json;

		// Cierre de Coneccion
    $conn->close();
?>
