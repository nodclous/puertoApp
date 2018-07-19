<?php
include("../php/conectar.php");
require_once 'dompdf/autoload.inc.php';
use Dompdf\Dompdf;
ini_set('max_execution_time', 300);
$ancho=$_REQUEST["ancho"];
$alto=$_REQUEST["alto"];
$rotacion=$_REQUEST["rot"];
$cantidad_bodegas=0;
// $rotacion="17/0004";
$pagina = '
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
	  	<link  rel="stylesheet" href="../estilos/plano_imprimir.css" >
</head>
<body>
<div class="container">';
  $pagina=titulo_pagina($conexion,$pagina,$rotacion); // Genero solo el titulo y el logo
  $pagina=MakeTablas($conexion,$pagina,$rotacion); // Genera las tablas de destinos y destinos segundarios
  $pagina=MakePost_tabla($conexion,$pagina,$rotacion); // Aca salen los datos del GRAN TOTAL y SECUENCE del plano

  $pagina=MakePlano($conexion,$pagina,$rotacion); // DATOS COMPLETOS DEL PLANO CON TODOS SUS TIER
  $pagina=EndPagina($pagina); // SOLO PARA CERRAR ALGUNOS DIV, EL BODY Y EL HTML
	// imprimir_pdf($pagina,$rotacion,$alto, $ancho);
  echo $pagina;
// header('Location: ../estibas/orden.html');
// echo $pagina;
function titulo_pagina($conexion,$pagina,$rotacion){
  $sql="SELECT * FROM nave WHERE ROTACION='$rotacion'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  $newpagina=$pagina."<div id='titulo-plano'>
                        <h3 id='titulo'>
                          <span id='nameNave'>". $dat["NOMBRE"]." ARROW ".$rotacion."</spam>
                        </h3>
                      </div>";
 return $newpagina;
}
function EndPagina($pagina){
  $newpagina=$pagina."</div></body></html>";
   return $newpagina;
}
function MakePost_tabla($conexion,$pagina,$rotacion){
  $newpagina=$pagina.'
                  <div id="t2">
                    <table>
                      <tr>
                        <td>
                            <table class="table table-bordered">
                                <tr>
                                  <td class="datos_tbl" style="background:#ddd; font-weight:bold;" >GRAN TOTAL</td>
                                  <td class="datos_tbl" id="gran_total"> '.gran_total($conexion,$rotacion).'</td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <table class="table table-bordered">
                                <tr>
                                  <td class="datos_tbl"  style="background:#ddd; font-weight:bold;" >SECUENCE</td>
                                  <td class="datos_tbl" id="gran_total">'.secuence_rotacion($conexion,$rotacion).'</td>
                                </tr>
                            </table>
                        </td>
                      </tr>
                    </table>
                  </div>';
   return $newpagina;
}
function gran_total($conexion,$rotacion){
  $sql="SELECT SUM(linga.peso) as peso FROM linga WHERE linga.ROTACION='$rotacion'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  return $dat["peso"];
}
function secuence_rotacion($conexion,$rotacion){
  $sql="SELECT nave.secuence FROM nave WHERE ROTACION='$rotacion'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  return $dat["secuence"];
}
function MakePlano($conexion,$pagina,$rotacion){
  $newpagina=$pagina.'<div id="T-plano">
                          <table id="planoBody">
                              <tbody>'
                              .numero_bodega_titulo($conexion,$rotacion).''
                              .generar_plano_body($conexion,$rotacion).'
															</tbody>
															<tbody >
															'.generar_resumen_bodegas($conexion,$rotacion).'
															</tbody>
                          </table>
                      </div>';
   return $newpagina;
}
function generar_resumen_bodegas($conexion,$rotacion){
	$puertos_rotacion=puertos_rot($conexion,$rotacion);
	// $newpagina=$newpagina."".$puertos_rotacion;
	 return $puertos_rotacion;
}
function puertos_rot($conexion,$rotacion){
	$sql="SELECT DISTINCT puertos.id_puerto, puertos.puerto, puertos.color
				FROM puertos, linga
				WHERE puertos.id_puerto=linga.id_destino
				AND linga.ROTACION='$rotacion' ";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
			 $num_bodegas=num_bod_rot($conexion,$rotacion);
			 	for ($i=0; $i < sizeof($arreglo); $i++) {
			 		$pagina=$pagina.'  <tr style="background:'.$arreglo[$i]["color"].'; border:solid 1px #9a9a9a; font-weight:bold; height:26px;">
					                      <td colspan="'.$num_bodegas.'">'.$arreglo[$i]["puerto"].'</td>
					                    </tr><tr style="height:26px;">';
										for ($j=$num_bodegas; $j >=1; $j--) {
											$total_bod_puerto=resumen_bodega($conexion,$rotacion,$j,$arreglo[$i]["id_puerto"]);
											if($total_bod_puerto){
												$pagina=$pagina.'  <td style="background:'.$arreglo[$i]["color"].'; border:solid 1px #9a9a9a; font-weight: bold;">'.$total_bod_puerto.'</td>';
											}else{
														$pagina=$pagina.'  <td ></td>';
											}

										}
				  $pagina=$pagina.'</tr>';
			 	}
				$pagina=$pagina.'<tr class="final_resumen" style="height:26px;">';
				for ($j=$num_bodegas; $j >=1; $j--) {
					$dato=peso_total_por_bodega($conexion,$rotacion,$j);
					if($dato!=0){
							 $pagina=$pagina.'<td>'.$dato.'</td>';
					}else{
 							$pagina=$pagina.'<td>--</td>';
					}

				}
				$pagina=$pagina.'</tr>';
     return $pagina;
}
function peso_total_por_bodega($conexion,$rotacion,$bodega){
	$sql="SELECT SUM(linga.peso) as peso
	 FROM linga, tier, bodega
	 WHERE linga.id_tier=tier.id_tier
	 AND tier.id_bodega=bodega.id_bodega
	 AND linga.ROTACION='$rotacion'
	 AND bodega.num_bodega=$bodega
	 GROUP BY bodega.num_bodega ";
	 $resultado=mysqli_query($conexion,$sql);
	 $data = mysqli_fetch_assoc($resultado);

				return $data["peso"];
}
function resumen_bodega($conexion,$rotacion,$num_bodega,$id_puerto){
 $sql="SELECT SUM(linga.peso) as peso FROM linga, tier, bodega
	    WHERE linga.id_tier=tier.id_tier
		  AND tier.id_bodega=bodega.id_bodega
		  AND bodega.num_bodega=$num_bodega
			AND linga.ROTACION='$rotacion'
			AND linga.id_destino=$id_puerto
			GROUP BY bodega.num_bodega ";
	$resultado=mysqli_query($conexion,$sql);
	$dat = mysqli_fetch_assoc($resultado);

	return $dat["peso"];
}
function num_bod_rot($conexion,$rotacion){
	$sql="SELECT nave.cantidad_bodegas  FROM nave WHERE ROTACION='$rotacion'";
	$resultado=mysqli_query($conexion,$sql);
	$dat = mysqli_fetch_assoc($resultado);
	return $dat["cantidad_bodegas"];
}
function numero_bodega_titulo($conexion,$rotacion){
  $sql="SELECT nave.cantidad_bodegas  FROM nave WHERE ROTACION='$rotacion'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  $pagina_r='<tr class="tier-P">';
  for ($i=0; $i < (int)$dat["cantidad_bodegas"]; $i++){
    $pagina_r=$pagina_r.'<td class="bodega-P head-P">'.($dat["cantidad_bodegas"]-$i).'</td>';
  }

  $pagina_r=$pagina_r.'</tr>';
 return $pagina_r;
}


function generar_plano_body($conexion,$rotacion){
  $sql="SELECT bodega.num_bodega, tier.nivel FROM nave, bodega, tier
  WHERE nave.id_buque=bodega.id_buque AND bodega.id_bodega=tier.id_bodega
  AND nave.ROTACION='$rotacion'
  ORDER BY tier.nivel DESC, bodega.num_bodega DESC";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }

     return generar_plano_body2($conexion,$rotacion,$arreglo);
}
function tier_bodegas_max($conexion,$rotacion){
  $sql="SELECT MAX(bodega.num_bodega) as max_b, MAX(tier.nivel) as max_t
        FROM nave, bodega, tier
        WHERE nave.id_buque=bodega.id_buque
        AND bodega.id_bodega=tier.id_bodega
        AND nave.ROTACION='$rotacion'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  return $dat;
}
function generar_plano_body2($conexion,$rotacion,$arreglo){
  $datos=tier_bodegas_max($conexion,$rotacion);
  for ($i=0; $i < (int)$datos["max_t"]; $i++) {
       $return_pagina=$return_pagina.'<tr class="tier-P">';

    for ($j=0; $j < (int)$datos["max_b"]; $j++) {
			 $cantidad_destinos= cantidad_destinos_tier($conexion,$rotacion,((int)$datos["max_t"]-$i),((int)$datos["max_b"]-$j));
			 $tam=sizeof($cantidad_destinos);
			 echo $cantidad_destinos[$tam]["color"];
             $return_pagina=$return_pagina.'<td class="bodega-P"   style="background: '.$cantidad_destinos[$tam-1]["color"].'; padding: 0px; ">
																			             <span class="tierNum" >'.((int)$datos["max_t"]-$i).'-'.((int)$datos["max_b"]-$j).'</span>
																			             <table class="tab_tier">
																									 	'.datos_tier($conexion,$rotacion,((int)$datos["max_t"]-$i),((int)$datos["max_b"]-$j)).'
																									 </table>
																	            </td>';

    }
     $return_pagina=$return_pagina.'</tr>';
  }
  return $return_pagina;
}


function datos_tier($conexion,$rotacion,$num_tier,$num_bod){
	$cantidad_destinos= cantidad_destinos_tier($conexion,$rotacion,$num_tier,$num_bod);
$pagina="";
if(sizeof($cantidad_destinos) !=0){
	for ($i=0; $i < sizeof($cantidad_destinos); $i++) {
		$pagina=$pagina.'<tr style="background: '.$cantidad_destinos[$i]["color"].';">
												<td>
														<div class="destino-T">
																<div class="head-T">
																		<span class="tierTitle">'.$cantidad_destinos[$i]["puerto"].'</span>
																	</div>
																		'.datos_planta_tier($conexion,$rotacion,$num_tier,$num_bod,$cantidad_destinos[$i]).'
																</div>
														</div>
												</td>
										</tr>';
	}
}

	return $pagina;
}

function cantidad_destinos_tier($conexion,$rotacion,$num_tier,$num_bod){
	$sql="SELECT  DISTINCT linga.id_destino as destinos,
	(SELECT puertos.puerto FROM puertos WHERE linga.id_destino=puertos.id_puerto) as puerto,
(SELECT puertos.color FROM puertos WHERE linga.id_destino2=puertos.id_puerto) as color,
(SELECT puertos.marca_cmpc FROM puertos WHERE linga.id_destino=puertos.id_puerto) as marca_cmpc,
linga.marca_arauco as marca_arauco,
(SELECT unit.company FROM unit WHERE linga.id_unit=unit.id_unit) as empresa
	FROM linga,tier,bodega
	WHERE linga.id_tier=tier.id_tier
	AND tier.id_bodega=bodega.id_bodega
	AND tier.nivel=$num_tier
	AND bodega.num_bodega=$num_bod
	AND linga.ROTACION='$rotacion'
	GROUP BY puerto ";
	$resultado=mysqli_query($conexion,$sql);
	$arreglo=array();
		 $i=0;

			 while( $data = mysqli_fetch_assoc($resultado)){
					 $arreglo[$i]=$data;
					 $i++;
			 }
 return $arreglo;
}
function datos_planta_tier($conexion,$rotacion,$num_tier,$num_bod,$id_destino){
	$id_destin=$id_destino['destinos'];
	$sql="SELECT DISTINCT (SELECT CONCAT(unit.empresa,' ', unit.tipo) FROM unit WHERE unit.id_unit=linga.id_unit) as planta,
				SUM(linga.peso) as peso,
				SUM(linga.cantidad) as cantidad,
				(SELECT unit.company FROM unit WHERE unit.id_unit=linga.id_unit) as empresa,
				(SELECT puertos.marca_cmpc FROM puertos WHERE puertos.id_puerto=linga.id_destino) as marca_cmpc,
				linga.marca_arauco as marca_arauco
				FROM linga,tier,bodega
				WHERE linga.id_tier=tier.id_tier
				AND tier.id_bodega=bodega.id_bodega
				AND tier.nivel=$num_tier
				AND bodega.num_bodega=$num_bod
				AND linga.ROTACION='$rotacion'
				AND linga.id_destino=$id_destin
				GROUP BY planta";
				$resultado=mysqli_query($conexion,$sql);
				$arreglo=array();
					 $i=0;
						 while( $data = mysqli_fetch_assoc($resultado)){
								 $arreglo[$i]=$data;
								 $i++;
						 }

						 if(sizeof($arreglo)!=0){
							 for ($j=0; $j <sizeof($arreglo) ; $j++) {

								 if($arreglo[$j]["empresa"]=="ARAUCO"){
									 if($arreglo[$j]["marca_arauco"]!=""){
										$marca_aux='<img class="imagen_tier" src="../imagenes/marcas/'.$arreglo[$j]["empresa"].'/'.$arreglo[$j]["marca_arauco"].'.png">';
									}else{
										$marca_aux='';
									}

								 }
								 if($arreglo[$j]["empresa"]=="CMPC"){
									 $marca_aux='<img class="imagen_tier" src="../imagenes/marcas/'.$arreglo[$j]["empresa"].'/'.$arreglo[$j]["marca_cmpc"].'.png">';
								 }
								$pagina=$pagina.'<div class="head-T">
																								 <div class="body-T">
																											 <div class="planta-T">
																														 <span class="dato-body-tier nom-planta">'.$arreglo[$j]["planta"].''.$marca_aux.'</span>
																														 <div class="datos-planta">
																															 <span class="num-unit">'.$arreglo[$j]["cantidad"].' ut</span>
																															 <span class="num-tn">'.$arreglo[$j]["peso"].' tn</span>
																														 </div>
																											 </div>
																								 </div>
																	</div>';
							 }
						 }

			 return $pagina;

}
function imprimir_pdf($pagina,$rotacion,$alto, $ancho){
  $dompdf = new Dompdf();
  $dompdf->loadHtml($pagina);
  // $dompdf->setPaper('A4', 'landscape');
  // $dompdf->set_paper(array(0, 0,1414 , 1000), 'landscape');
  $dompdf->set_paper(array(0, 0,1600 , 1000), 'landscape');

  $dompdf->render();
   $pdf_gen = $dompdf->output();
  // $dompdf->stream($rotacion."plano");
  $dompdf->stream($rotacion."plano", array(
            "Attachment" => false));
}
function MakeTablas($conexion,$pagina,$rotacion){
// $datos_T_B=tabla_destinos_finales($conexion,$rotacion);

$pagina=$pagina.'
            <div id="T-destinos">
                <table id="tabla_tablas">
								<tbody style="vertical-align: -webkit-baseline-middle;">
                    <tr >
                              <td style="padding-right: 3px;">
                                      <div id="T-destinosInicial">';


																				$pagina=$pagina.''.tabla_destinos_arauco($conexion,$rotacion,"CMPC");


$pagina=$pagina.'</div>
                              </td>
                              <td style="padding-left: 3px;">
                                    <div id="T-destinosFinal">';
																			$pagina=$pagina.''.tabla_destinos_arauco($conexion,$rotacion,"ARAUCO");

                        $pagina=$pagina.'</div>
                              </td>
                      </tr>
											</tbody>
                </table>
            </div>';
  return $pagina;
}

function tabla_destinos_arauco($conexion,$rotacion,$company){
        $sql="SELECT puertos.puerto,puertos.color, linga.marca_arauco, puertos.marca_cmpc,  sum(linga.peso) as peso FROM linga,puertos, unit
               WHERE linga.id_destino=puertos.id_puerto AND unit.id_unit=linga.id_unit
               AND linga.ROTACION='$rotacion'
               AND unit.company='$company'
							 GROUP BY puertos.puerto";
        $resultado=mysqli_query($conexion,$sql);
        $arreglo=array();
           $i=0;
             while( $data = mysqli_fetch_assoc($resultado)){

                 $arreglo[$i]=$data;

                 $i++;
             }
        $pagina=crear_tabla_destinos_finales($arreglo,$conexion,$rotacion,$company);
       return $pagina;
}
function crear_tabla_destinos_finales($arreglo,$conexion,$rotacion,$empresa){
  $pagina='<table id="tabla_'.$empresa.'" class="table table-bordered">
                  <tr id="tabla_'.$empresa.'_marcas">
                    <td class="datos_tbl titulos_tablas"> Marcas</td>
                    '.set_marcas($arreglo,$empresa).'
                    <td class="datos_tbl titulos_tablas"></td>
                  </tr>
                  <tr id="tabla_'.$empresa.'_puertos">
                    <td class="datos_tbl titulos_tablas"> Puertos</td>
                    '.set_puertos($arreglo).'
                    <td class="datos_tbl titulos_tablas">Total</td>
                  </tr>
                      '.set_plantas($arreglo,$conexion,$rotacion,$empresa).'
                  <tr>
                      '.set_total_puertos($arreglo).'
                  </tr>
          </table>';
  return $pagina;
}
function set_marcas($arreglo,$empresa){
  for ($i=0; $i <sizeof($arreglo) ; $i++){
		if($empresa=="ARAUCO" ){
			if($arreglo[$i]["marca_arauco"]!=""){
					$pagina=$pagina.'<td class="datos_tbl titulos_tablas"><img class="img_marca_tabla" src="../imagenes/marcas/'.$empresa.'/'.$arreglo[$i]["marca_arauco"].'.png"></td>';
			}else{
					$pagina=$pagina.'<td class="datos_tbl titulos_tablas">-</td>';
			}

		}
		if($empresa=="CMPC"){
			$pagina=$pagina.'<td class="datos_tbl titulos_tablas"><img class="img_marca_tabla" src="../imagenes/marcas/'.$empresa.'/'.$arreglo[$i]["marca_cmpc"].'.png"></td>';
		}

  }
    return $pagina;
}
function set_puertos($arreglo){
  for ($i=0; $i <sizeof($arreglo) ; $i++){
			$pagina=$pagina.'<td class="datos_tbl titulos_tablas" style="background:'.$arreglo[$i]["color"].';">'.$arreglo[$i]["puerto"].'</td>';
  }
    return $pagina;
}
function set_plantas($arreglo,$conexion,$rotacion,$empresa){
$planta=total_planta_rotacion($rotacion, $conexion,$empresa);
    for ($j=0; $j <sizeof($planta) ; $j++) {
      $pagina=$pagina.'<tr><td class="datos_tbl titulos_tablas">'.$planta[$j]["planta"].'</td>';
        for ($i=0; $i <sizeof($arreglo) ; $i++) {
          $pagina=$pagina.'<td class="datos_tbl titulos_tablas" style="background: '.$arreglo[$i]["color"].';">'.total_planta_por_puerto($rotacion,$arreglo[$i]["puerto"],$planta[$j]["planta"],$conexion)[0]["peso"].'</td>';
        }
      $pagina=$pagina.'<td class="datos_tbl">'.$planta[$j]["peso"].'</td></tr>';
    }
  return $pagina;
}
function set_total_puertos($arreglo){
  $pagina=$pagina.'<td class="datos_tbl titulos_tablas" >Total</td>';
  $peso_total=0;
  for ($i=0; $i <sizeof($arreglo) ; $i++){
      $pagina=$pagina.'<td class="datos_tbl " >'.$arreglo[$i]["peso"].'</td>';
      $peso_total=$peso_total+$arreglo[$i]["peso"];
  }
    $pagina=$pagina.'<td class="datos_tbl titulos_tablas" >'.$peso_total.'</td>';
    return $pagina;
}
function total_planta_por_puerto($rotacion, $puerto,$planta, $conexion){
  $sql="SELECT CONCAT(unit.empresa,' ',unit.tipo) as planta, SUM(linga.peso) as peso
  FROM linga,puertos, unit
  WHERE linga.id_destino=puertos.id_puerto
   AND unit.id_unit=linga.id_unit
   AND linga.ROTACION='$rotacion'
   AND CONCAT(unit.empresa,' ',unit.tipo)='$planta'
   AND puertos.puerto='$puerto' GROUP BY planta";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
 return $arreglo;
}
function total_planta_rotacion($rotacion, $conexion,$empresa){
  $sql="SELECT CONCAT(unit.empresa,' ',unit.tipo) as planta, SUM(linga.peso) as peso,
			  puertos.color FROM linga,puertos,unit
			  WHERE linga.id_destino=puertos.id_puerto
				AND unit.id_unit=linga.id_unit
				AND linga.ROTACION='$rotacion'
				AND unit.company='$empresa'
			  GROUP BY planta";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }

 return $arreglo;
}


?>
