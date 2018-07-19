<?php
session_start();
  include("php/conectar.php");
    if(isset($_SESSION['userAdmin'])){
      echo '<script> window.location="./paginas/admin.php";</script>';
    }
    if(isset($_SESSION['userOperario'])){
      echo '<script> window.location="../paginas/Buscar.php";</script>';
    }
    if(isset($_SESSION['userMaquinista'])){
      echo '<script> window.location="../paginas/Buscar.php";</script>';
    }
?>
<!DOCTYPE html>
<html>
  <head>
    <head>
	      <meta charset="UTF-8">
	      <title>INICIAR </title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <link rel="stylesheet"  href="https://fonts.googleapis.com/css?family=Roboto" >
    	  <script src="https://code.jquery.com/jquery-latest.js"></script>
	      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-1.12.3.js"></script>
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.10.12/js/dataTables.bootstrap.min.js"></script>
	      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		    <link rel="stylesheet" href="estilos/inicio.css">
        <script src="javascript/jquery.rut.js"> </script>
        <script src="javascript/recuperarPW.js"> </script>

    </head>
  </head>
  <body>
    <div class="login">
          <div class="titulo">
              <h3>EstibApp</h3>
                <div class="">
                  <center><img src="imagenes/logo.png" width="200" alt="Logo corporativo" /></center>
                </div>
          </div>
          <div class="formulario">
            <form role="form" autocomplete="off" id="form-index" method="post" action="../php/login.php">
                <div class="form-group ">
                  <label>Rut</label>
                 <input type="text"class="form-control" id="rut_usuario" pattern="\d{3,8}-[\d|kK]{1}" required="required"  name="rut_usuario" autocomplete="off" placeholder="11111111-1" maxlength="10"> <!--pattern="[0-9]{7,8}"-->
                 <!--  -->
                </div>
                <div class="form-group segundo" >
                  <label>Contraseña</label>
                  <input type="password" class="form-control" id="clave" name="clave" required="required">
                </div>
                <button type="submit" id="enviar" class="btn btn-default btn-block" name="button">Enviar</button>
                <div style="text-align: center">
                  <a class="olvido" id="olvido" href="#" onclick="recuperar_pw()">¿Olvido contraseña?</a>
                </div>
              </form>
              <div id="pfin">
                <p style="text-align: center">Proceso exitoso</p>
                <button type="button" id="fin" class="btn btn-default btn-block" name="button">Finalizar</button>

              </div>

          </div>
          <!-- <div class="sello">
            <p class="sello-titulo">Developer by</p>
            <img class="sello-imagen" src="imagenes/nodclous.jpg" alt="">

          </div> -->
      </div>
  </body>
</html>
