<?php
session_start();
include("../php/conectar.php");
						 if(isset($_SESSION['userAdmin'])){
						 }else {
						   echo '<script> window.location="../index.php"; </script>';
						 }
 ?>
<!DOCTYPE html>
<html lang="es">
<head>
	<meta http-equiv="Content-Type" content="text/html">
	<meta charset="UTF-8">
  <meta charset="ISO-8859-1">
	<title>PuertoCoronel-Buscador</title>
  <!-- <link rel="shortcut icon" href="../imagenes/icono.ico"> -->
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet"  href="https://fonts.googleapis.com/css?family=Roboto" >
	<script src="https://code.jquery.com/jquery-latest.js"></script>
	<script src="https://code.jquery.com/jquery-1.12.3.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="../estilos/menu.css">
	<link rel="stylesheet" type="text/css" href="../estilos/admin.css">
	<script src="../javascript/jquery.rut.js"> </script>

	<script src="../javascript/admin.js"></script>
</head>
<body>
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
									   <li class="active"><a href='../paginas/armin.php'>Admin</a> </li>
									 	 <li><a href='../paginas/Buscar.php'  >Inicio</a> </li>
								 		<!-- <li><a href='../paginas/estiba.php' >Estiba</a></li> -->
								  	 <li><a href="../php/logout.php">Salir</a></li>
							   </ul>
						 </div>
					</div>
	 </nav>
	<ul class="nav nav-tabs">
    	<li class="active" id="usuarios" onclick="cargar_usuarios();">
					<a data-toggle="tab" href="#panel-usuarios" >
						USUARIOS
					</a>
			</li>
    
  </ul>

  <div class="tab-content">
			    <div id="panel-usuarios" class="tab-pane fade in active ">
						<table class="table table-bordered">
							<thead>
								<tr class="active">

										<th>Nombre</th>
										<th>Rut</th>
										<th>Correo</th>
										<th>Tipo de Usuario</th>

										<th style="display:none" id="estado">Estado</th>
										<th>Opción</th>
								</tr>
							</thead>
									<tbody id="tabla_datos">

								</tbody>
						</table>
						<button type="button" class="btn btn-default"  data-toggle="modal" data-target="#myModal">Agregar usuario</button>
						<button type="button" class="btn btn-default" id="usuarios_completo" onclick="mostrar_usuarios_completo()">Usuarios Totales</button>
					</div>

			    <div id="panel-rotaciones" class="tab-pane fade ">
								<table class="table table-bordered">
												<thead>
															<tr class="active">
																<th></th>
																<th>ROTACION</th>
																<th>IMPORTACION</th>
																<th>EXPORTACION</th>
																<th>NOMBRE</th>
																<th>ARRIBO</th>
																<th>ZARPE</th>
															</tr>
												</thead>
														<tbody id="tabla_datos_rotaciones">
														</tbody>
								</table>
								<button type="button" class="btn btn-default"  data-toggle="modal" data-target="#myModal2" onclick=" list_rotacion_select()">Agregar rotacion</button>
			    </div>
			    <div id="panel-naves" class="tab-pane fade ">
						<div id="buscar_nave">
							<div id="titulo_nave" class="dblock ">
								<h4>Nave:</h4>
							</div>
							<div id="buscador_select" class="dblock ">
								<select id="select_nave" class="form-control ">NAVES
								</select>
							</div>
							<div  class="dblock boton-a">
								<button type="button" class="btn btn-primary" name="button" onclick="listar_datos_nave()">Aceptar</button>
							</div>
						</div>
						<div id="datos_nave">
							<table class="table table-bordered">
											<thead>
														<tr class="active">
															<th></th>
															<th>NOMBRE</th>
															<th>ID</th>
															<th>BODEGA</th>
															<th>TIER</th>
															<th>LARGO</th>
															<th>ANCHO</th>
														</tr>
											</thead>
													<tbody id="tabla_datos_naves">
													</tbody>
							</table>
						</div>
			  </div>




    <!-- Modal -->
 <div class="modal fade" id="myModal" role="dialog">
   <div class="modal-dialog">

     <!-- Modal content-->
     <div class="modal-content">
          <form id="ingreso">
       <div class="modal-header">
         <button type="button" class="close" data-dismiss="modal">&times;</button>
         <h4 class="modal-title" style="text-align:center">Nuevo Usuario </h4>
       </div>
       <div class="modal-body">

                <div class="agregar">
                  <label for="usr" name="nombre"  class="agregar-label" >Nombre:</label>
                  <input type="text" pattern="[A-Za-z]{4,20}" placeholder="Alberto" class="form-control agregar-input" id="nombre_nuevo" maxlength="30" required='required'>
                </div>
                <div class="agregar">
                  <label for="usr" class="agregar-label" placeholder="11111111-1">Rut:</label>
                  <input type="text" pattern="\d{3,8}-[\d|kK]{1}"   name='rut_usuario' autocomplete='off'  maxlength='10' placeholder="11111111-1" class="form-control agregar-input"   id="rut_nuevo" required='required'>

                </div>
                <div class="agregar">
                  <label for="usr" class="agregar-label" >Correo:</label>
                  <input type="email" name="email"  placeholder="correo@aaaa.cl" class="form-control agregar-input" maxlength="40" id="correo_nuevo" required='required'>
                </div>
                <div class="agregar">
                  <label for="usr" class="agregar-label">Tipo:</label>
                  <select class="form-control agregar-input" id="tipo_nuevo">
										<option value=" "> </option>
                    <option value="administrador">administrador</option>
                    <option value="operador">operador</option>

                  </select>
                </div>

       </div>
       <div class="modal-footer">
         <button type="button" class="btn btn-default" id="ea" data-dismiss="modal">Cerrar</button>
         <button type="submit" class="btn btn-default" >Agregar</button>

       </div>
              </form>
     </div>

   </div>
 </div>
 <!-- Modal2 -->
<div class="modal fade" id="myModal2" role="dialog">
<div class="modal-dialog">

	<!-- Modal content-->
	<div class="modal-content">
			 <form id="ingreso_rotacion">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">&times;</button>
			<h4 class="modal-title" style="text-align:center">NUEVA ROTACION </h4>
		</div>
		<div class="modal-body" id="form-insert">
			<!-- <div id="form-insert"> -->
						 <div class="agregar">
							 <label for="usr" name="nombre"  class="agregar-label" >NAVE</label>
							 <select class="form-control agregar-input" id="add_rotaciones">
							 </select>
						 </div>
						 <div class="agregar">
							 <label for="usr" name="nombre"  class="agregar-label" >VIAJE:</label>
							 <select class="form-control agregar-input" id="add_viaje">
								 <option value="impo">IMPOTACION</option>
								 <option value="expo">EXPORTACION</option>
							 </select>
						 </div>
						 <div class="agregar">
							 <label for="usr" class="agregar-label" placeholder="11111111-1">ARRIBO</label>
							  <input type="date"  class="agregar-input type-bots" name="bday" id="add_arribo">
						 </div>
						 <div class="agregar">
							 <label for="usr" class="agregar-label" >ZARPE</label>
							 <input type="date"  class="agregar-input type-bots" name="bday" id="add_zarpe">
						 </div>
		</div>
		<div id="insert_finish">
			<img  src="../imagenes/listo.png" >
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-default"  data-dismiss="modal">Cerrar</button>
			<button type="button" onclick="insert_rotacion()" class="btn btn-default">Agregar</button>

		</div>
					 </form>
	</div>

</div>
</div>
  </div><!-- CONTAINER-->
	<!-- <script src="../javascript/librerias/jquery-ui.js"></script> -->

</body>

</html>
