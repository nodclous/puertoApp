<?php
include "../php/conectar.php";
session_start();

						 if(isset($_SESSION['userAdmin']) || isset($_SESSION['userOperario'])){
						   echo "";
						 }else{
						   echo '<script> window.location="../index.php"; </script>';
						 }
 ?><!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<title>Plano</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

	<!-- <script src="https://code.jquery.com/jquery-latest.js"></script> -->
	<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type=text/javascript> </script> -->
<!-- <script src="https://code.jquery.com/jquery-1.12.3.js"></script> -->
<script src="https://code.jquery.com/jquery-2.1.4.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"> -->
  <link rel="stylesheet"  href="https://fonts.googleapis.com/css?family=Roboto" >
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.2.3/jquery-confirm.min.css"> -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.2.3/jquery-confirm.min.js"></script> -->
		<link rel="stylesheet" href="../estilos/menu.css">
    <link rel="stylesheet" href="../estilos/estilos-estiba.css">
		<script src="../javascript/fun_ajax.js"></script>
		<script src="../javascript/menu_creador_lingas.js"></script>
    <script src="../javascript/estiba2.js"></script>

</head>
<body>
	<div id="div_carga">
			<img src="../imagenes/loading2.png" id="cargando" width="300px">
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
										<?php if(isset($_SESSION['userAdmin'])) echo " <li><a class='nav_style' href='../paginas/admin.php'>Admin</a> </li> "; ?>
										<li><a class='nav_style' href='../paginas/Buscar.php'>Buscar</a> </li>
			 							<!-- <li class="active"><a href='../paginas/estiba.php'>Estiba</a></li> -->
										<li><a class='nav_style' href="../php/logout.php" >Salir</a> </li>
			 						</ul>
		 						</div>
 					</div>
 	</nav>




	  <!-- Modal -->
	  <div class="modal fade" id="modal_marca_arauco" role="dialog">
	    <div class="modal-dialog">

	      <!-- Modal content-->
	      <div class="modal-content">
	        <div class="modal-header head_modal">
	          <button type="button" class="close" data-dismiss="modal">&times;</button>
	          <h4>Marcas Arauco <span id="puerto_marca"></span>
					</h4>
	        </div>
	        <div class="modal-body" style="padding:30px 30px;">
						<div id="content_marcas_arauco">

						</div>

						<div id="View_Marca" style="text-align: center;padding:40px 50px;">

						</div>
	        </div>
	        <div class="modal-footer">
	          <button type="button" class="btn btn-danger btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>
						<button type="button" class="btn btn-default pull-right" id="edit_marca" onclick="crear_select_marcas()"><span class="glyphicon glyphicon-plus"></span>Editar</button>
	        </div>
	      </div>

	    </div>
	  </div>


<div class="cuerpo0">
	<div class="vacio"></div>
	<div id="buques_inicio">
		<div id="titulo_buque">
			<label class="letra buque_letra">ERROR AL GENERAR ESTIBA </label>
		</div>
		<label for="">ASEGURESE DE TENER CREADA LAS BODEGAS Y TIER DEL BUQUE DE FORMA CORRECTA</label>
	</div>
	<div class="vacio"></div>
</div>
<div class="con2">
<div class="cuerpo" id="cuerpo">
  <div class="Atrabajo">
            <div class="tiers" id="tiers">
                  <div class="tier-arriba">
                      <ul class="nav nav-tabs" id="nav_tier">
												<li class='a active' id='tier_bod1'  onclick='tier(this)' data-tier="1"><a href='#'>1</a></li>
												<li class='a ' id='tier_bod2' onclick='tier(this)' data-tier="2"><a href='#'>2</a></li>
												<li class='a ' id='tier_bod3'  onclick='tier(this)' data-tier="3"><a href='#'>3</a></li>
												<li class='a ' id='tier_bod4'  onclick='tier(this)' data-tier="4"><a href='#'>4</a></li>
												<li class='a ' id='tier_bod5'  onclick='tier(this)' data-tier="5"><a href='#'>5</a></li>
												<li class='a ' id='tier_bod6'  onclick='tier(this)' data-tier="6"><a href='#'>6</a></li>
												<li class='a ' id='tier_bod7'  onclick='tier(this)' data-tier="7"><a href='#'>7</a></li>
												<li class='a ' id='tier_bod8'  onclick='tier(this)' data-tier="8"><a href='#'>8</a></li>
												<li class='a ' id='tier_bod9'  onclick='tier(this)' data-tier="9"><a href='#'>9</a></li>
												<li class='a ' id='tier_bod10'  onclick='tier(this)' data-tier="10"><a href='#'>10</a></li>
												<li class='a ' id='tier_bod11'  onclick='tier(this)' data-tier="11"><a href='#'>11</a></li>
												<li class='a ' id='tier_bod12'  onclick='tier(this)' data-tier="12"><a href='#'>12</a></li>
                      </ul>
                  </div>
            </div>
      <div class="trabajo2" id="trabajo2">
            <div class="bodegas" id="bodegas">
							<div class='bod activo' id='bodega1' onclick='bodegas(this)' data-nbod='1' ><p>Bodega 1</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega2' onclick='bodegas(this)' data-nbod='2' ><p>Bodega 2</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega3' onclick='bodegas(this)' data-nbod='3' ><p>Bodega 3</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega4' onclick='bodegas(this)' data-nbod='4' ><p>Bodega 4</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega5' onclick='bodegas(this)' data-nbod='5' ><p>Bodega 5</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega6' onclick='bodegas(this)' data-nbod='6' ><p>Bodega 6</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega7' onclick='bodegas(this)' data-nbod='7' ><p>Bodega 7</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega8' onclick='bodegas(this)' data-nbod='8' ><p>Bodega 8</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega9' onclick='bodegas(this)' data-nbod='9' ><p>Bodega 9</p><div class='datos_bodega'></div></div>
							<div class='bod' id='bodega10' onclick='bodegas(this)' data-nbod='10' ><p>Bodega 10</p><div class='datos_bodega'></div></div>

					  </div>
						<ul id="menuCapa" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
							<li role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="eliminar_linga()">Eliminar</a></li>
							<li role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="rotar_linga()">Rotar</a></li>
								<li role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="marcar_linga(this)">Marcar</a></li>
							<!-- <li role="presentation" class="divider"></li> -->
						</ul>
						<ul id="menuCapa3" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
							<li role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="limpiar_tier()">Limpiar</a></li>
						</ul>
						<ul id="menuCapa4" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
							<li role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="limpiar_bodega()">Limpiar bodega</a></li>
						</ul>
						<ul id="menuCapa2" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu3">
							<!-- <li role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="dividir_tier_X(event)">Dividir en eje X</a></li>
							<li role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="dividir_tier_Y(event)">Dividir en eje Y</a></li> -->
						</ul>
						<div id="lllinzo">

						</div>
						<div id="largo_li">
							<p id="largo_lienzo_m" class="dim_tier dim_t" style="display:inline-block"><spam id="largo_lie"><spam>m</p>
						</div>
      </div>


  </div>
	<div id="ancho_li">
<p id="ancho_lienzo_m" class="dim_t" style="display:inline-block"><spam id="ancho_lie"><spam>m</p>
	</div>

	<div class="botones">

			<div class="boton_crear tabla_botones" id="btn-crear" >CREAR LINGA</div>
			<div class="boton_marcas tabla_botones" id="btn-marcas" onclick="marcas_arauco(this)">MARCAS</div>
		<!-- <div class="boton_crear tabla_botones"><span class="glyphicon glyphicon-arrow-right"></span></div> -->
	</div>
</div>

<!-- <button class="btn btn-puerto1 seguir" id="btn-crear" >Crear</button> -->
<div class="datos_tier" >
	<table class="table table-bordered">
	    <thead>
	      <tr>
	        <th>Bodega</th>
	        <th>Tier</th>
					<th>Destino</th>
	        <th>Embarcador</th>
					<th>Cantidad unit</th>
					<th>Lingas</th>
						<th>Peso</th>
	      </tr>
	    </thead>
	    <tbody id="tabla_datos">


	    </tbody>
	  </table>
</div>
</div>



 </div>

 <!--- CREADOR DE LINGAS POSICIONADO A LA DERECHA--->
 	<div class="lingas" id="lingas">
			  <div class="lingas-boton" id="lingas-boton" >
			   					<span class="glyphicon glyphicon-arrow-left" id="boton-creador" ></span>
			  </div>

			  <div class="creador-lingas" id="creador-lingas">
					<div class="formulario">
								<div class="form-group form-linga">
											<label for="">Cantidad</label>
											<select  id="cantidad" class="form-control">

											  <option>20</option>
											  <option>19</option>
											  <option>18</option>
											  <option>17</option>
											  <option>16</option>
												<option>15</option>
												<option>14</option>
												<option>13</option>
												<option>12</option>
												<option>11</option>
												<option>10</option>
												<option>9</option>
												<option>8</option>
												<option>7</option>
												<option>6</option>
												<option>5</option>
												<option>4</option>
												<option>3</option>
												<option>2</option>
												<option>1</option>
											</select>
									</div>

									<div class="form-group form-linga" >
												<label for="">Destino Final</label>
												<select id="destino" class="form-control" onclick="nombre_destino()">

												</select>
										</div>
										<div class="form-group form-linga" >
													<label for="">Destino inicial</label>
													<select id="destino2" class="form-control" onclick="nombre_destino()">
														<option value="NULL">-------</option>
													</select>
											</div>
											<div class="form-group form-linga-b">
														<label for="">Embarcador</label>
														<select  id="tipo_celulosa" onclick="dimensiones_linga()" class="form-control">
														</select>
												</div>
											<div class="form-group form-linga-b">
														<label for="">Orden</label>
														<select  id="tipo_linga" class="form-control">
															<option>Linga</option>
															<option>Media linga</option>
															<option>Espejo Simple</option>
															<option>Espejo</option>
														</select>
												</div>
												<div class="form-group form-linga-b">
													<label for="">COMANDOS</label>
													<input type="checkbox" name="" value="1" id="switch_comando">
													<p>C -> Crear linga </p>
													<p>V -> Eliminar linga </p>
													<p>R -> Rotar linga </p>
												</div>
								<button  class="btn btn-block btn-puerto1" id="btn-creador" name="button">Crear linga</button>
					</div>
			  </div>

 </div>



 <script src="https://code.jquery.com/ui/1.9.1/jquery-ui.min.js"></script>


</body>
</html>
