<?php
  // Coneccion
  include 'conecction.php';

    // Captura de Variables desde la Peticion Ajax
    $data = new StdClass();
    $data->dataType = $_POST["dataType"];
    $data->fields = $_POST["fields"];

    // Creacion de Objeto para Enviarlo como Respuesta
    $json = new StdClass();
    $json->type = $data->dataType;

    // Caso Filtro Puerto
    // Sentencia SQL Modifica los Datos Ingresados por el Usuario
    if ($data->dataType === 'puertos') {
       $id = $data->fields["id"];
       $puerto = $data->fields["puerto"];
       $pais = $data->fields["pais"];
       $color = $data->fields["color"];

       $sql = "UPDATE puertos
               SET puerto = '$puerto', color = '$color', pais = '$pais'
               WHERE id_puerto = '$id'";
    }

    // Caso Filtro Unit
    // Sentencia SQL Modifica los Datos Ingresados por el Usuario
    if ($data->dataType === 'unit') {
       $id = $data->fields["id"];
       $alto = $data->fields["alto"];
       $ancho = $data->fields["ancho"];
       $largo = $data->fields["largo"];
       $peso = $data->fields["peso"];

       $sql = "UPDATE unit
               SET  alto    =   '$alto',
                    ancho   =   '$ancho',
                    largo   =   '$largo',
                    peso    =   '$peso'
               WHERE id_unit = '$id'";
    }

    // Caso Filtro Embarcador
    // Sentencia SQL Modifica los Datos Ingresados por el Usuario
    if ($data->dataType === 'embarcador') {
       $id = $data->fields["id"];
       $empresa = $data->fields["empresa"];
       $rut = $data->fields["rut"];

       $sql = "UPDATE embarcador
               SET empresa = '$empresa', rut = '$rut'
               WHERE id_embarcador = '$id'";
    }

    if ($data->dataType === 'nave') {
       $id = $data->fields["id"];
       $nombre = $data->fields["nombre"];
       $bodegas = $data->fields["bodegas"];

       $sql = "UPDATE buque
               SET nombre = '$nombre', cantidad_bodegas = '$bodegas'
               WHERE id = '$id'";
    }

    // Ejecuta la Sentencia SQL Basada en el Tipo de Parametros Enviados por Peticion Ajax
    if (mysqli_query($conn,$sql)) {
      // Caso de Exito en Ejecucion
      $json->type = 'Success';
      $json->msg = 'Se han modificado los datos en el registro correctamente';
    }else{
      // Caso de Fracaso en Ejecucion
      $json->type = 'Failure';
      $json->msg = 'Error al intentar modificar los datos en el registro';
      $json->error = $conn->error;

    }

    // Transformacion de Objeto a Formato JSON
		// La Peticion Ajax Espera una Respuesta en Formato JSON
    $json = json_encode($json);
    echo $json;

    // Cierre de Coneccion
    $conn->close();
?>
