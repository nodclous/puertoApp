<?php
require_once 'dompdf/autoload.inc.php';
use Dompdf\Dompdf;

$eaaa = '<html lang="es" id="ea"> <head>
	<meta charset="UTF-8">
	<title>buque</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<script src="https://code.jquery.com/jquery-latest.js"></script>
  <script src="https://code.jquery.com/jquery-1.12.3.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.debug.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
	  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="estiloOrder.css">
		<script src="ordenamiento.js"></script>
</head>
<body>
	<!-- BOTONES ARRIBA DE LA PAGINA -->
  <button type="button" class="btn" id="btn-pdf" onclick="window.print();">GENERAR PDF</button>
	<button type="button" class="btn" onclick="solo_tier_con_carga()" id="select" name="button">SELECCION</button>
	<button type="button" class="btn" id="btn-pdf" onclick=" plano()">PLANO GENERAL</button>
	<button type="button" class="btn" id="new-pdf" onclick="getUrl()" name="button">NEW PDF</button>

	<div class=" container ">
	  <div id="todo">
			<!-- EL TITULO DE LA NAVE -->
				<div class="titulo">
							<h2>
								<spam id="nombre"> " JAPIN  ARROW X"</spam>
								<spam id="nave">17/0004</spam>
							</h2>
							<br>
				</div>

			<!-- DIV PADRE DONDE ESTARAN TODAS LAS ORDENACIONES CON SUS DATOS -->
				<div class="ordenamiento" id="ordenamientos">
				<h4 id="bodega"> BODEGA 1</h4><div class="orden_tier_div"><div id="div248"><h4 id="tier"> M/N. JAPIN ARROW . . . . .HOLD Nº 1 </h4><table class="table table-bordered dat"><tbody><tr class="active"><th>Shanghai</th><th colspan="3">TIER 1</th></tr><tr></tr><tr><td> #Arauco EKP</td><td> 80 Units</td><td>162.400 Tns</td><td><img src="../imagenes/marcas/A-ARAUCO.png" width="18px"></td></tr><tr></tr><tr><td> #Valdivia EKP</td><td> 20 Units</td><td>40.000 Tns</td><td><img src="../imagenes/marcas/CMPC/A-CMPC.png" width="18px"></td></tr><tr></tr><tr><td> #Nueva Aldea BKP</td><td> 20 Units</td><td>40.600 Tns</td><td><img src="../imagenes/marcas/CMPC/A-CMPC.png" width="18px"></td></tr><tr></tr><tr class="active"><th colspan="4">Jining</th></tr><tr></tr><tr><td> #Arauco EKP</td><td> 20 Units</td><td>40.600 Tns</td><td><img src="../imagenes/marcas/A-ARAUCO.png" width="18px"></td></tr><tr></tr><tr class="active"><th colspan="4">Kunsan</th></tr><tr></tr><tr><td> #Arauco EKP</td><td> 20 Units</td><td>40.600 Tns</td><td><img src="../imagenes/marcas/A-ARAUCO.png" width="18px"></td></tr><tr></tr><tr class="active"><th colspan="4">Dagan</th></tr><tr></tr><tr><td> #Valdivia EKP</td><td> 40 Units</td><td>80.000 Tns</td><td><img src="../imagenes/marcas/CMPC/D-CMPC.png" width="18px"></td></tr><tr></tr><tr class="active"><th colspan="4">Shanghai</th></tr><tr></tr><tr><td> #Arauco EKP</td><td> 80 Units</td><td>162.400 Tns</td><td><img src="../imagenes/marcas/A-ARAUCO.png" width="18px"></td></tr><tr></tr><tr><td> #Valdivia EKP</td><td> 20 Units</td><td>40.000 Tns</td><td><img src="../imagenes/marcas/CMPC/A-CMPC.png" width="18px"></td></tr><tr></tr><tr><td> #Nueva Aldea BKP</td><td> 20 Units</td><td>40.600 Tns</td><td><img src="../imagenes/marcas/CMPC/A-CMPC.png" width="18px"></td></tr><tr></tr><tr class="danger"><th>TOTAL UNIT</th><th>320 Units</th><th colspan="2">647.2 Tns</th></tr><tr></tr></tbody></table></div><div class="dibujo1_tier"><div class="dibujo_tier" id="248"><div style="position: absolute; top: 874px; left: 228px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/A-ARAUCO.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 990px; left: 140px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/A-ARAUCO.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 874px; left: 411px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/A-ARAUCO.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 875px; left: 720px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/A-ARAUCO.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 1046px; left: 125px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/A-ARAUCO.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 1089px; left: 485px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/A-ARAUCO.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 874px; left: 546px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/CMPC/D-CMPC.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 1046px; left: 228px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/CMPC/D-CMPC.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 986px; left: 180px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/CMPC/A-CMPC.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div><div style="position: absolute; top: 876px; left: 842px; width: 183.35px; height: 251.31px; text-align: center; outline: solid 1px;"><p class="cant_unit_sin_giro">20</p><img src="../imagenes/marcas/CMPC/A-CMPC.png" width="18px" style="position: absolute; top: 4px; left: 4px;"></div></div><div class="largo_tier"><p>15.810 mts</p></div><div class="ancho_tier"><p>15.500 mts</p></div></div></div><div class="orden_tier_div"><div id="div249"><h4 id="tier"> M/N. JAPIN ARROW . . . . .HOLD Nº 1 </h4><table class="table table-bordered dat"></table></div><div class="dibujo1_tier"><div class="dibujo_tier" id="249"></div><div class="largo_tier"><p>15.810 mts</p></div><div class="ancho_tier"><p>15.500 mts</p></div></div></div><div class="orden_tier_div"><div id="div250"><h4 id="tier">
  	</div>
</div>


</body></html>';
// instantiate and use the dompdf class
$dompdf = new Dompdf();
$dompdf->loadHtml($eaaa);
// (Optional) Setup the paper size and orientation
$dompdf->setPaper('A4', 'landscape');

// Render the HTML as PDF
$dompdf->render();

// Output the generated PDF to Browser
$dompdf->stream("eaaa");
?>
