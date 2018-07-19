<?php
include("../php/conectar.php");
session_start();
						//Consultar Tipo de usuario
						 if(isset($_SESSION['userOperario'])){

						 }else if (isset($_SESSION['userAdmin'])) {

						 }else if (isset($_SESSION['userMaquinista'])) {

						 }else {
							//Redireccionamiento pagina principal
						   echo '<script> window.location="../index.php"; </script>';
						 }
 ?>
<!DOCTYPE html>
<html lang="es">
<head><meta http-equiv="Content-Type" content="text/html; charset=gb18030">
	<meta charset="UTF-8">
  <meta charset="ISO-8859-1">

	<title>PuertoCoronel-Buscador</title>
  <link rel="shortcut icon" href="../imagenes/icono.ico">
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<link rel="stylesheet"  href="https://fonts.googleapis.com/css?family=Roboto" >
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
		 <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
		 <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
		<script src="http://code.jquery.com/jquery-1.12.3.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css?family=Roboto:400i,700,900" rel="stylesheet">
    <link rel="stylesheet" href="../estilos/menu.css">
    <link rel="stylesheet" href="../estilos/Luis.css">
    <link rel="stylesheet" href="../estilos/click-popUp.css">
		<script type="text/javascript" src="../javascript/search.js" charset="UTF-8"></script>
		<script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.13.0/jquery.validate.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/additional-methods.min.js"></script>
</head>
<body>
 <div class="container">

	<!-- Menu de Navegacion -->
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
							 <?php if(isset($_SESSION['userAdmin'])) echo " <li><a href='../paginas/admin.php'>Admin</a> </li>"; ?>
							 <li class="active" > <a >Inicio</a> </li>
						 		<!-- <li class="estibar-opt"> <a href='../paginas/estiba.php' >Estiba</a></li> -->
							 <!-- <li  ><a href='../paginas/ingresar.php'>Ingresar</a></li> -->
							 	<li ><a href="../php/logout.php">Salir</a></li>
					 	 </ul>
					 </div>
					 </div>

	 </nav>
	 <!-- Pagina de Busqueda -->
	 <div class="search-body">
		 <div class="ingresos_busqueda">
			<!-- Titulo principal -->
			 <div class="titulo_busqueda">
				 <h3 class="titulo_pagina">Buscador</h3>
			 </div>

			 <hr>
			<!-- Interaccion con el usuario Input-Options-Filtros -->
			 <div class="input_ingresos ">
				<!-- Input Buscador -->
				 <input id="search" class="form-control form-busqueda" type="text" placeholder = "Buscar" >
				 <!-- Opciones de Filtrado -->
				 <div class="radioBox-options">
					 <label class="radio-inline"><input type="radio" name="optradio">Rotacion</label>
					 <label class="radio-inline"><input type="radio" name="optradio">Puerto</label>
					 <label class="radio-inline"><input type="radio" name="optradio">Unit</label>
					 <label class="radio-inline"><input type="radio" name="optradio">Planta</label>
					 <label class="radio-inline"><input type="radio" name="optradio">Nave</label>
				 </div>

			 </div>
							 <hr>
							 </div>
			 <!-- Resultado de Busquedas -->
			 <div class="datos_busqueda">
				<div class="titulo_busqueda search">
					<!-- Titulo de Zona de Busqueda -->
					<h3 class="titulo_pagina nameSearch">Nombre de Tabla</h3>
					<!-- Cantidad Total de Registros Encontrados -->
					<span class="total-registros label label-primary">Totales</span>
					<!-- Panel de Opciones Para Administrador -->
					<div class="btn-container">
				</div>

				 </div>
				<!-- Tabla de Resultados Encontrados -->
				 <div class="dato_resultado">
					 <table>
						 <!-- Encabezado de la Tabla -->
						<thead class="headResult">
						</thead>
						<!-- Elementos de la Tabla -->
						<tbody class="bodyResult table  table-condensed">
						</tbody>
					 </table>
				 </div>

			 </div>
			 <!-- Logo Pre-Footer -->
			 <div class="pre-footer">
					 <hr>
					 <img src="/imagenes/logo-footer.png">
			 </div>
	 </div>


</div>
<!-- Footer -->
<footer>
	 Puerto Coronel S.A. 2016. Av. Carlos Prats 40. Coronel, Chile. Fono:+56-41 2727200. Fax:+56-41 2727201. </
</footer>
</body>

</html>
