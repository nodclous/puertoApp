<?php
include("../php/conectar.php");
require_once 'dompdf/autoload.inc.php';
use Dompdf\Dompdf;
ini_set('max_execution_time', 300);
$rotacion=$_GET["rot"];
$pagina = '
  <html lang="es">
      <head>
        	<meta charset="UTF-8">
        	<title>buque</title>
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <script src="https://code.jquery.com/jquery-latest.js"></script>
          <script src="https://code.jquery.com/jquery-1.12.3.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.debug.js"></script>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
          <link rel="stylesheet" href="../estibas/estiloOrder_imprimir.css">
      </head>
      <body>
      <img src="../imagenes/logo.png" id="logo" >
          <div class=" container ">
            <div id="todo">
                <div class="titulo">
                      <h2><spam id="nombre">';
  $pagina=titulo_pagina($conexion,$pagina,$rotacion);

  $pagina=MakeTier($conexion,$pagina,$rotacion);
  $pagina=EndPagina($pagina);

imprimir_pdf($pagina,$rotacion);

function titulo_pagina($conexion,$pagina,$rotacion){
  $sql="SELECT * FROM nave WHERE ROTACION='$rotacion'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  $newpagina=$pagina."". $dat["NOMBRE"]." ARROW </spam><spam id='nave'>".$rotacion."</spam></h2></div><div class='ordenamiento' id='ordenamientos'>";
 return $newpagina;
}
function EndPagina($pagina){
  $newpagina=$pagina."</div></div></div></body></html>";
   return $newpagina;
}
function imprimir_pdf($pagina,$rotacion){
  $dompdf = new Dompdf();
  $dompdf->loadHtml($pagina);
  // $dompdf->setPaper('A4', 'landscape');
  $dompdf->set_paper(array(0, 0, 793, 1122), 'landscape');
  $dompdf->render();
   $pdf_gen = $dompdf->output();
  // $dompdf->stream($rotacion."plano");
  $dompdf->stream($rotacion."plano", array(
            "Attachment" => false));


}
function MakeTier($conexion,$pagina,$rotacion){
$datos_T_B=bodegas_and_tier($conexion,$rotacion);
$bodega=0;
$datos_tabla="";
  for ($i=0; $i < sizeof($datos_T_B); $i++){
        if($datos_T_B[$i]["linga"]!=0){
            if($bodega != $datos_T_B[$i]["num_bodega"]){
              $pagina= $pagina.'<h4 class="bodega_titulo"> HOLD '.$datos_T_B[$i]["num_bodega"].'</h4>';
              $bodega=$datos_T_B[$i]["num_bodega"];
            }

    $pagina= $pagina.'<div class="orden_tier_div" style="page-break-after:always;"><h4 class="tier_titulo">TIER '.$datos_T_B[$i]["nivel"].' ----- HOLD '.$datos_T_B[$i]["num_bodega"].' </h4>';
    $datos_tabla =SELECT_datosTabla($datos_T_B[$i]["id_tier"],$rotacion,$conexion);
    $pagina=$pagina."".$datos_tabla;
    $lingas_tier=SELECT_datosLingas($datos_T_B[$i]["id_tier"],$rotacion,$conexion);
    $pagina=$pagina.'<div class="dibujo1_tier"><div class="largo_tier"><p>'.$datos_T_B[$i]["largo"].' mts</p></div>';
    $pagina=$pagina.'<div class="dibujo_tier">'.$lingas_tier.'</div>';
    $pagina=$pagina.'<div class="ancho_tier"><p>'.$datos_T_B[$i]["ancho"].' mts</p></div>
                        </div></div>';
    }
  }
  return $pagina;
}


  //  --------------ESTRUCTURA --------------------------
  // $pagina= $pagina.'<div class="orden_tier_div" style="page-break-after:always;">
  //                         <div>
  //                           <h4 id="tier"> TIER '.$datos_T_B[$i]["nivel"].'</h4>
  //                           <table>
  //                             <tbody>
  //                             </tbody>
  //                           </table>
  //                         </div>
  //                          <div class="dibujo1_tier">
  //                            <div class="dibujo_tier">
  //                            </div>
  //                          </div>
  //                   </div>';
  // -------------ESTRUCTURA COMPLETA DE LA PAGINA----------------
  // <div class="container">
  // 			<div id="todo">
  // 						<div class="titulo">
  // 									<h2>
  // 												<span></span>
  // 												<span></span>
  // 									</h2>
  // 						</div> //titulo
  // 						<div class="ordenamiento"> BIEN
  // 									<h4></h4>
  // 									<div class="orden_tier_div">
  // 												<div class="">
  // 																<h4></h4>
  // 																<table></table>
  // 												</div>
  // 												<div class="dibujo1_tier">
  // 															<div class="dibujo_tier">
  // 																		<div class="lingassss">
  // 																				<p></p>
  // 																				<img src="" alt="">
  // 																		</div> //lingasaaa
  // 															</div> //dibujo_tier
  // 															<div class="largo"></div>
  // 															<div class="ancho"></div>
  // 												</div>//dibujo1_tier
  // 									</div>//orden_tier_div
  // 						</div> //ordenamiento
  // 			</div> //todo
  // </div> //container
function bodegas_and_tier($conexion,$rotacion){
    $sql="SELECT tier.id_tier,bodega.num_bodega,tier.nivel,tier.largo, tier.ancho,
          (SELECT COUNT(linga.id_linga) FROM linga WHERE linga.id_tier=tier.id_tier AND linga.ROTACION=nave.ROTACION ) as linga
          FROM nave,bodega,tier WHERE nave.id_buque=bodega.id_buque
          AND bodega.id_bodega=tier.id_bodega
          AND nave.ROTACION='$rotacion' ORDER BY bodega.num_bodega ASC,tier.nivel ASC";
    $resultado=mysqli_query($conexion,$sql);
    $arreglo=array();
       $i=0;
         while( $data = mysqli_fetch_assoc($resultado)){
             $arreglo[$i]=$data;
             $i++;
         }
       return $arreglo;
}

function SELECT_datosTabla($tier,$rotacion,$conexion){
  $sql="SELECT puertos.puerto,puertos.color,CONCAT(unit.empresa,' ',unit.tipo) as planta ,
   sum(linga.peso) as peso, puertos.marca_cmpc, puertos.marca_arauco, SUM(linga.cantidad) as cantidad, unit.company
   FROM linga,puertos, unit WHERE linga.id_destino=puertos.id_puerto
   AND unit.id_unit=linga.id_unit
   AND linga.id_tier=$tier
   AND linga.ROTACION='$rotacion'
   GROUP BY puertos.puerto, planta";
   $resultado=mysqli_query($conexion,$sql);
   $arreglo=array();
      $i=0;
        while( $data = mysqli_fetch_assoc($resultado)){
            $arreglo[$i]=$data;
            $i++;
        }
    $arreglo=CrearTabla($arreglo);
      return $arreglo;
}

function CrearTabla($arreglo){
  $cantidadTotal=0;
  $pesoTotal=0;
  $puerto=$arreglo[0]["puerto"];
  $tabla='<table class="table table-bordered dat"><tbody><tr class="active"><th colspan="4">'.$arreglo[0]["puerto"].'</th></tr>';
  for ($i=0; $i <sizeof($arreglo) ; $i++){

      if(strcmp($puerto,$arreglo[$i]["puerto"])){
        $puerto=$arreglo[$i]["puerto"];
        $tabla=$tabla.'<tr class="active"><th colspan="4">'.$arreglo[$i]["puerto"].'</th></tr>';
      }
      $marca;
      if($arreglo[$i]["company"]=="ARAUCO"){
        $marca=$arreglo[$i]["marca_arauco"];
      }else{
        $marca=$arreglo[$i]["marca_cmpc"];
      }
        $tabla=$tabla.'<tr >
                        <td>'.$arreglo[$i]["planta"].'</td>
                        <td>'.$arreglo[$i]["cantidad"].' Units</td>
                        <td>'.$arreglo[$i]["peso"].' Tns</td>
                      </tr>';
                      // <td><img src="../imagenes/marcas/'.$arreglo[$i]["company"].'/'.$marca.'.png" width="18px"></td>
      $cantidadTotal=$cantidadTotal+(int)$arreglo[$i]["cantidad"];
      $pesoTotal=$pesoTotal+(float)$arreglo[$i]["peso"];
  }

  $tabla=$tabla.'<tr class="danger">
                  <th>TOTAL</th>
                  <th>'.$cantidadTotal.' Units</th>
                  <th colspan="2" >'.$pesoTotal.' Tns</th>
                </tr>';
  $tabla=$tabla.'</tbody></table>';
  return $tabla;

}

function SELECT_datosLingas($tier,$rotacion,$conexion){
$sql="SELECT linga.id_linga, linga.ancho, linga.marca as marca,linga.alto, linga.posx, linga.posy, linga.cantidad, linga.giro, linga.marca_arauco, puertos.marca_cmpc,
      (SELECT unit.company FROM unit WHERE unit.id_unit=linga.id_unit) as company
      FROM linga, puertos, tier WHERE linga.id_destino=puertos.id_puerto
      AND linga.id_tier=tier.id_tier
      AND linga.ROTACION='$rotacion'
      AND tier.id_tier=$tier";
 $resultado=mysqli_query($conexion,$sql);
 $arreglo=array();
    $i=0;
      while( $data = mysqli_fetch_assoc($resultado)){
          $arreglo[$i]=$data;
          $i++;
      }
  $arreglo=DibujarLingas($arreglo);
  return $arreglo;
}
function DibujarLingas($arreglo){
    $giro=0;
    $marca="";
    for ($i=0; $i < sizeof($arreglo) ; $i++) {
      if((int)$arreglo[$i]["giro"]==0){
          $giro="cant_unit_sin_giro";
      }else{
        $giro="cant_unit_con_giro";
      }
      if($arreglo[$i]["marca"]==1){

        if($arreglo[$i]["company"]=="ARAUCO"){
            $marca='<img src="../imagenes/marcas/'.$arreglo[$i]["company"].'/'.$arreglo[$i]["marca_arauco"].'.png" width="18px" style="position: absolute; top: 4px; left: 4px;">';
        }else{
            $marca='<img src="../imagenes/marcas/'.$arreglo[$i]["company"].'/'.$arreglo[$i]["marca_cmpc"].'.png" width="18px" style="position: absolute; top: 4px; left: 4px;">';
        }

      }

      $pagina=$pagina.'<div style=" position: absolute; top: '.$arreglo[$i]["posx"].'px; left: '.$arreglo[$i]["posy"].'px; width: '.$arreglo[$i]["ancho"].'px; height: '.$arreglo[$i]["alto"].'px; text-align: center; outline: solid 1px;">
        <p class='.$giro.' style="display:inline-block; position:relative;  margin-top:'.(((int)$arreglo[$i]["alto"]/4)-5).'px; margin-left:'.(((int)$arreglo[$i]["ancho"]/2)-5).'px;">'.$arreglo[$i]["cantidad"].'</p>
        '.$marca.'
      </div>';
      $marca="";
    }
    return $pagina;
}
?>
