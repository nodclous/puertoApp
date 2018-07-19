<?php include "../php/conectar.php";
session_start();
						 if(isset($_SESSION['userAdmin']) || isset($_SESSION['userOperario'])){
						   echo "";
						 }else{
						   echo '<script> window.location="../index.php"; </script>';
						 }?>
<!DOCTYPE html>
<html lang="es" id="pagina">
<head>
<meta charset="UTF-8">
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
	<title>PLANO</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<script src="https://code.jquery.com/jquery-latest.js"></script>
  <script src="https://code.jquery.com/jquery-1.12.3.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.debug.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"></script>
			<script type="text/javascript" src="../estibas/jsPDF-master/dist/jspdf.debug.js"></script>
			<script  src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/2.3.2/jspdf.plugin.autotable.js"> </script>
			<script type="text/javascript" src="../estibas/html2canvas.js"></script>
  		<link  rel="stylesheet" href="../estilos/plano.css" media="screen">
	  	<link  rel="stylesheet" href="../estilos/plano_imprimir.css" media="print">
  <script type="text/javascript" src="../javascript/plano_general.js"></script>
</head>
<body>

	<img src="../imagenes/loading.png" id="cargando" width="300px">
				<p id="cargando_text">Generando PDF..</p>
  <div class=" container " id="container">
		<ul id="menuCapa" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1" >
			<li  id="ea" role="presentation"><a href="#" role="menuitem" tabindex="-1" onclick="edit_secuence()">Editar</a></li>
		</ul>
		<img src="../imagenes/logo.png" id="logo" >
    <div id="titulo-plano" >
      <h3 id="titulo">StowagE Plan M.N " <span id="nameNave"></span>  ARROW" </h3>
    </div>
		<div id="T-destinos">
  	<div id="T-destinosInicial">
			<table id="tabla_CMPC" class="table table-bordered">
				<tr id="tabla_CMPC_marcas">
					<td class="datos_tbl titulos_tablas">Marcas</td>
				</tr>
				<tr id="tabla_CMPC_puertos">
					<td class="datos_tbl titulos_tablas">Puertos</td>
				</tr>
			</table>
    </div>
    <div id="T-destinosFinal">
			<table id="tabla_ARAUCO" class="table table-bordered">
				<tr id="tabla_ARAUCO_marcas">
					<td class="datos_tbl titulos_tablas">Marcas</td>
				</tr>
				<tr id="tabla_ARAUCO_puertos">
					<td class="datos_tbl titulos_tablas">Puertos</td>
				</tr>
			</table>
    </div>
		</div>
		<div id="t2">
			<div id="T-gran_total">
				<table id="t_gran_total" class="table table-bordered">
					<tr >
						<td class="datos_tbl">GRAN TOTAL</td>
						<td class="datos_tbl" id="gran_total"></td>
					</tr>
				</table>
			</div>
			<div id="T-secuence">
				<table id="t_secuence_tabla" class="table table-bordered">
					<tr >
						<td class="datos_tbl" id="ordenamiento" onclick="planimetria()"> PLANIMETRIA</td>
						<td class="datos_tbl" id="ordenamiento" onclick="ordenamiento()"> ESTIBAR</td>
						<td class="datos_tbl" id="ordenamiento" onclick="imprimir_plano()"> GENERAR PDF</td>
						<td class="datos_tbl">SECUENCE</td>
						<td class="datos_tbl" id="secuence_dato" onmousedown="opciones_secuence(this,event)"></td>
					</tr>
				</table>
			</div>
		</div>
    <div id="T-plano">
      <table id="planoBody">
      </table>
      </div>
      <div id="planoFooter"></div>
</div></div></body></html>
