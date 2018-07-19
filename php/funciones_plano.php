<?php
include("conectar.php");
$opcion = $_POST['opcion'];

switch($opcion){
  case 1:
          $rotacion=$_POST['rotacion'];
          info_general($conexion,$rotacion);
        break;
  case 2:
          $rotacion=$_POST['rotacion'];
          info_buque($conexion,$rotacion);
  break;
  case 3:
          $rotacion=$_POST['rotacion'];
          lingas_nave($conexion,$rotacion);
  break;
  case 4:
          $rotacion=$_POST['rotacion'];
          tabla_general_cmpc($conexion,$rotacion);
  break;
  case 5:
          $rotacion=$_POST['rotacion'];
          tabla_destinos_transito($conexion,$rotacion);
  break;
  case 6:
          $rotacion=$_POST['rotacion'];
          tabla_inferior($conexion,$rotacion);
  break;
  case 7:
          $rotacion=$_POST['rotacion'];
          secuence($conexion,$rotacion);
  break;
  case 8:
          $rotacion=$_POST['rotacion'];
          $secuence=$_POST['secuence'];
          update_secuence($conexion,$rotacion,$secuence);
  break;


}

function info_general($conexion,$rotacion){
  $sql="SELECT nave.cantidad_bodegas, bodega.cant_tiers,nave.nombre
        FROM nave,bodega
        WHERE nave.id_buque=bodega.id_buque
        AND nave.ROTACION='$rotacion'
        ORDER BY bodega.cant_tiers DESC limit 0,1";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
}

function info_buque($conexion,$rotacion){
  $sql="SELECT  bodega.num_bodega, bodega.cant_tiers
        FROM nave,bodega
        WHERE nave.id_buque=bodega.id_buque
        AND nave.ROTACION='$rotacion'
        ORDER BY bodega.num_bodega ASC ";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
}
function lingas_nave($conexion,$rotacion){
  $sql="SELECT tier.nivel, bodega.num_bodega,linga.id_linga, sum(linga.cantidad) as unit, sum(linga.peso) as peso,
  (SELECT  CONCAT(unit.empresa,' ',unit.tipo) FROM unit WHERE unit.id_unit=linga.id_unit) as planta,
  (SELECT  unit.company FROM unit WHERE unit.id_unit=linga.id_unit) as empresa,
  (SELECT puerto FROM puertos WHERE puertos.id_puerto=linga.id_destino) as puerto,
  (SELECT color FROM puertos WHERE puertos.id_puerto=linga.id_destino2) as color,
  (SELECT marca FROM puertos WHERE puertos.id_puerto=linga.id_destino) as marca,
  linga.marca_arauco as marca_arauco,
  (SELECT marca_cmpc FROM puertos WHERE puertos.id_puerto=linga.id_destino) as marca_cmpc
  FROM tier, bodega,linga
  WHERE tier.id_bodega=bodega.id_bodega
  AND linga.id_tier=tier.id_tier
  AND linga.ROTACION='$rotacion'
  GROUP BY tier.id_tier, linga.id_destino2,linga.id_destino, planta";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
}

function tabla_general_cmpc($conexion,$rotacion){
  $sql="SELECT sum(linga.cantidad) as unit, sum(linga.peso) as peso,
   (SELECT CONCAT(unit.empresa,' ',unit.tipo) FROM unit WHERE unit.id_unit=linga.id_unit) as planta,
   (SELECT unit.company FROM unit WHERE unit.id_unit=linga.id_unit) as empresa,
   (SELECT puerto FROM puertos WHERE puertos.id_puerto=linga.id_destino) as puerto,
   (SELECT color FROM puertos WHERE puertos.id_puerto=linga.id_destino) as color,
   (SELECT marca FROM puertos WHERE puertos.id_puerto=linga.id_destino) as marca,
   (SELECT marca_cmpc FROM puertos WHERE puertos.id_puerto=linga.id_destino) as marca_cmpc
    FROM tier, bodega,linga
    WHERE tier.id_bodega=bodega.id_bodega
    AND linga.id_tier=tier.id_tier
    AND linga.ROTACION='$rotacion'
    AND (SELECT unit.company FROM unit WHERE unit.id_unit=linga.id_unit)='CMPC'
    GROUP BY puerto, planta";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
}
function tabla_destinos_transito($conexion,$rotacion){ //
  $sql="SELECT puertos.puerto,puertos.color, linga.id_destino,
      CONCAT(unit.empresa,' ',unit.tipo) as planta ,
     sum(linga.peso) as peso, linga.marca_arauco as marca_arauco,
     linga.marca as marca, unit.company as empresa
     FROM linga,puertos, unit
     WHERE linga.id_destino=puertos.id_puerto
     AND unit.id_unit=linga.id_unit
     AND linga.ROTACION='$rotacion'
     AND unit.company='ARAUCO'
     GROUP BY puertos.puerto, planta";

  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
}
function tabla_inferior($conexion,$rotacion){
  $sql="SELECT sum(linga.peso) as peso, bodega.num_bodega,
        (SELECT puertos.puerto FROM puertos WHERE puertos.id_puerto=linga.id_destino2) as puerto,
        (SELECT puertos.color FROM puertos WHERE puertos.id_puerto=linga.id_destino2) as color
        FROM linga, tier, bodega
        WHERE linga.id_tier=tier.id_tier
        AND tier.id_bodega=bodega.id_bodega
        AND linga.ROTACION='$rotacion'
        GROUP BY linga.id_destino2, tier.id_bodega
        ORDER BY bodega.num_bodega DESC";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
}
function secuence($conexion,$rotacion){
  $sql="SELECT secuence FROM nave WHERE ROTACION='$rotacion'";
  $resultado=mysqli_query($conexion,$sql);
  $dato = mysqli_fetch_assoc($resultado);
  echo $dato["secuence"];
}
function update_secuence($conexion,$rotacion,$secuence){
  $sqlll="UPDATE nave SET secuence='$secuence'  WHERE ROTACION='$rotacion'";
  $result=mysqli_query($conexion,$sqlll);
  mysqli_free_result($result);
  echo $sqlll;
}


?>
