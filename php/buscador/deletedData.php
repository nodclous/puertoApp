<?php

  // Coneccion
  include 'conecction.php';

    // Captura de Variables desde la Peticion Ajax
    $data = new StdClass();
    $data->type = $_POST["type"];
    $data->dataType = $_POST["dataType"];
    $data->id = $_POST["id"];


    // Caso Tipo de Accion = Restaurar Elementos Eliminados
    if ($data->type == 'restore') {

        // Caso Datos Puerto
        // Cambia de Estado No Disponible = 0  => Disponible = 1
        if ($data->dataType == 'Puerto') {
            $sql = "UPDATE puertos
                    SET estado = 1
                    WHERE id_puerto = '$data->id'";
        }

        // Caso Datos Unit
        // Cambia de Estado No Disponible = 0  => Disponible = 1
        if ($data->dataType == 'Unit') {
            $sql = "UPDATE unit
                    SET estado = 1
                    WHERE id_unit = '$data->id'";
        }

        // Caso Datos Embarcador
        // Cambia de Estado No Disponible = 0  => Disponible = 1
        if ($data->dataType == 'Planta') {
            $sql = "UPDATE embarcador
                    SET estado = 1
                    WHERE id_embarcador = '$data->id'";
        }

        if ($data->dataType == 'Nave') {
            $sql = "UPDATE buque
                    SET estado = 1
                    WHERE id = '$data->id'";
        }

        // Ejecuta la Sentencia SQL Basada en el Tipo de Parametros Enviados por Peticion Ajax
        if (mysqli_query($conn,$sql)) {
            // Caso de Exito en Ejecucion
            $json->type = 'Success';
            $json->msg = 'Se ha restaurado los datos del registro correctamente';
        }else{
            // Caso de Fracaso en Ejecucion
            $json->type = 'Failure';
            $json->msg = 'Error al intentar restaurar el registro';
            $json->error = $conn->error;
        }
    }


    // Caso Tipo de Accion = Remover para Siempre de la Base de Datos
    if ($data->type == 'remove4EVER') {
        // Caso Datos Puerto
        // Elimina Completamente de la Base de Datos
        if ($data->dataType == 'Puerto') {
            $sql = "DELETE FROM puertos
                    WHERE id_puerto = '$data->id'";
        }

        // Caso Datos Unit
        // Elimina Completamente de la Base de Datos
        if ($data->dataType == 'Unit') {
            $sql = "DELETE FROM unit
                    WHERE id_unit = '$data->id'";
        }

        // Caso Datos Embarcador
        // Elimina Completamente de la Base de Datos
        if ($data->dataType == 'Embarcador') {
            $sql = "DELETE FROM embarcador
                    WHERE id_embarcador = '$data->id'";
        }

        // Ejecuta la Sentencia SQL Basada en el Tipo de Parametros Enviados por Peticion Ajax
        if (mysqli_query($conn,$sql)) {
            // Caso de Exito en Ejecucion
            $json->type = 'Success';
            $json->msg = 'Se ha eliminado para siempre los datos del registro correctamente';
        }else{
            // Caso de Fracaso en Ejecucion
            $json->type = 'Failure';
            $json->msg = 'Error al intentar eliminar el registro de la base de datos';
            $json->error = $conn->error;
        }
    }

    // Transformacion de Objeto a Formato JSON
		// La Peticion Ajax Espera una Respuesta en Formato JSON
    $json->objects = $data;
    $json = json_encode($json);
    echo $json;

    // Cierre de Coneccion
    $conn->close();
?>
