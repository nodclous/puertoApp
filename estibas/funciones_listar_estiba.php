<?php
include("../php/conectar.php");
  $opcion = $_POST['opcion']; // RECIBE LA OPCION DEL AJAX

    switch($opcion){
          case 2:
                $RTC = $_POST['ROTACION'];
                // PETICION RETORNA TODOS LOS DATOS DE LAS LINGA DE LA ROTACION SELECCIONADA
                seleccionar_lingas($conexion,$RTC);
              break;
          case 3:
                $RTC = $_POST['ROTACION'];
                // RETORNA TODOS LOS DATOS DEL TIER QUE CORRESPODEN A LA NAVE DE LA ROTACION SELECCIONADA
                seleccionar_tier_bodegas($conexion,$RTC);
              break;
          case 4:
                $RTC = $_POST['ROTACION'];
                // RETORNA EL NOMBRE DE LA NAVE DE LA ROTACION ENTREGADA
                nombre_buque($conexion,$RTC);
              break;
}

function seleccionar_lingas($conexion,$RTC){
  $sql="SELECT linga.id_linga,linga.ancho, linga.alto, linga.cantidad, linga.posx, linga.posy ,
        linga.tipo, linga.giro, linga.id_tier, linga.id_unit, linga.id_destino, linga.ROTACION, puertos.puerto,
        linga.marca_arauco ,puertos.marca_cmpc, unit.empresa,nave.NOMBRE,CONCAT(unit.empresa,' ',unit.tipo) as nombre_emb, tier.nivel,linga.peso, unit.company,linga.marca
        FROM linga,puertos,unit,nave,tier
        WHERE linga.ROTACION=nave.ROTACION
        AND linga.id_destino=puertos.id_puerto
        AND linga.id_unit=unit.id_unit
        AND linga.id_tier=tier.id_tier
        AND linga.ROTACION='$RTC'";

      $resultado=mysqli_query($conexion,$sql);
      $arreglo=array();
         $i=0;

           while( $data = mysqli_fetch_assoc($resultado)){
               $arreglo[$i]=$data;
               $i++;
           }

         echo json_encode($arreglo);
}
function seleccionar_tier_bodegas($conexion,$RTC){
  $sql="SELECT tier.id_bodega,bodega.num_bodega,tier.id_tier,tier.nivel,tier.ancho,tier.largo,buque.nombre FROM tier, bodega,buque WHERE tier.id_bodega=bodega.id_bodega and bodega.id_buque=buque.id and bodega.id_buque=(SELECT id_buque FROM nave WHERE nave.ROTACION='$RTC')";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
    // echo $sql;
}
function nombre_buque($conexion,$RTC){
  $sql="SELECT NOMBRE FROM nave WHERE ROTACION='$RTC'";
  $resultado=mysqli_query($conexion,$sql);
  $dato=mysqli_fetch_assoc($resultado);
     echo  json_encode($dato);
}
?>
