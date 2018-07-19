<?php
include("../php/conectar.php");
session_start();

			if(isset($_SESSION['userAdmin']) || isset($_SESSION['userOperario'])){
				echo "";
			}else{
				echo '<script> window.location="../index.php"; </script>';
			}
 ?>

<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<title>Ingresar Bodegas</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet"  href="https://fonts.googleapis.com/css?family=Roboto" >
	<script src="https://code.jquery.com/jquery-latest.js"></script>
<script src="https://code.jquery.com/jquery-1.11.2.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" type=text/javascript> </script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
<script src="../javascript/Ingresar_Buque.js"></script>
	<link rel="stylesheet" href="../estilos/ingresos.css">
    <link rel="stylesheet" href="../estilos/menu.css">
</head>

<div class="container">
  <div class="modal fade" id="mostrarmodal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- ventana -->
        <div class="modal-header">
          <button tyle="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="text-title modal-title"><strong>Bienvenido</strong></h4>
        </div>

        <!-- contenido -->
        <div class="modal-body">
          <p class="">
            Importante !!! Si ingresa erróneamente algún valor o desea cambiar algún dato, se deberá borrar todo lo asociado a la nave para ingresar nuevamente desde cero.
          </p>
        </div>

        <!-- fooder de la ventana -->
        <div class="modal-footer">
          <button class="btn btn-buque1 " data-dismiss="modal">Cerrar</button>
          <!-- <button class="btn btn-primary" data-dismiss="modal">Guardar Cambios</button> -->
        </div>
      </div>

    </div>
  </div>
</div>


<div class="container">
  <div class="modal fade" id="mostrar">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- ventana -->
        <div class="text-center modal-header">
          <button tyle="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="text-title modal-title">"Algunos de los campos estan mal ingresados"</h4>
        </div>
      </div>

    </div>
  </div>
</div>

<div class="container">
  <div class="modal fade" id="guardo">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- ventana -->
        <div class="text-center modal-header">
          <button tyle="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="text-title modal-title">"Los datos fueron almacenado correctamente"</h4>
        </div>
      </div>

    </div>
  </div>
</div>




 <div class="container">
   <nav class="navbar navbar-default navbar-static-top" role="navigation" >
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex6-collapse" id"menu_arriba" onclick="respon('izq_form','todo')">
              <span class="sr-only">Desplegar navegación</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <div style="display:inline">
              <a class="navbar-brand" href="#" ><img src="../imagenes/logo.png" width="200" alt="Logo corporativo" /> </a>
            </div>

            <div class="collapse navbar-collapse navbar-ex6-collapse" >

            <ul class="nav navbar-nav">
							<li><a href='../paginas/Buscar.php'>Buscar</a> </li>
              <?php if(isset($_SESSION['userAdmin'])) echo " <li><a href='../paginas/admin.php'>Admin</a> </li>"; ?>
							<li class='active'><a  href='../paginas/ingresos.php'>Ingresar</a></li>
							<li ><a href="../php/logout.php" >Salir</a></li>

          </ul>
          </div>
          </div>

  </nav>

<!-- Este div contiene ambos, la barra lateral y el contenido principal de la página -->
<!-- <div class='envoltura navbar navbar-default " role="navigation"' id="hola"> -->
  <div class="contenido_pagina">
    <div class="contenido_izquierdo">
      <div class="formulario_ingreso">
        <form class="form-ingresar">
          <div id="titulo_buque">
            <label class="letra buque_letra">INGRESAR BODEGAS</label>
          </div>
          <div class="form-buque1">
            <!-- <label for"id_IMO" class="letra" >IMO del buque </label>
            <input class="form-control" type="text" id="id_IMO" placeholder="">  -->
          </div>
					<div class="form-buque1">
            <label id="letra_nombre" for"nombre_buque" class="letra" >Nombre de la Nave </label>
            <input class="form-control" type="text" id="nombre_buque" placeholder="Ej: Japin ARROW" autofocus required>
          </div>

					<!-- <div class="form-buque1">
            <label for"rotacion" class="letra">Rotacion</label>
						<input class="form-control" type="text" id="rotacion" placeholder="Ej:10/0003" autofocus required>
          </div> -->

          <div class="form-buque1">
            <label for"cant_bodega" class="letra">Cantidad de Bodegas de la Nave</label>
            <select class="form-control" name="cant_bodegas" id="cant_bodegas" >
              <option value="1">1</option> <!--value toma el valor-->
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
            </select>
          </div>
					<div class="form-buque1">
						<!-- <label for"id_IMO" class="letra" >Fecha de ingreso </label>
						<input type="date" name="fecha_buque" id="fecha_ingreso" class="form-control"> -->
					</div>

          <input class="btn-buque1 btn" type="button" onclick="guardar_menu1();" value="ACEPTAR" id="enviar1">
      </form>
      </div>
    </div>
    <div class="contenido_derecho">
          <div class="imagen_derecha">
            <img style="width:100%;" src="../imagenes/imgb1.jpg">
          </div>

          <div class="ingreso_derecha">

                <div class="control_izquierda">
                </div>

                <div class="control_derecha">
                </div>
                <input type="hidden" id="id_data" value="">  <!-- input ficticio para rescatar variable-->
          </div>

    </div>
 </div>


</body>
</html>
