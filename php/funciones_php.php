<?php
include("conectar.php");
  $opcion = $_POST['opcion'];

    switch($opcion){
          case 1:
              // RESCATA TODAS LAS NAVES DE LA BASE DE DATOS
                buques($conexion);
              break;
          case 2:
              // RESCATA TODAS LAS BODEGAS DE LA NAVE CON LA ROTACION INDICADA
                $ROTACION = $_POST['ROTACION'];
                bodegas_buque($conexion,$ROTACION);
              break;
          case 3:
              // RESCATA TODOS LOS TIER DE UNA BODEGA EN PARTICULAR
                $id_bodega = $_POST['id_bodega'];
                buscar_tier($conexion,$id_bodega);
              break;
          case 4:
              // RESCATA UN OBJETO CON TODAS LAS BODEGAS Y TIER DE UNA NAVE DE ROTACION INDICADA
                $ROTACION = $_POST['ROTACION'];
                tier_bodegas($conexion,$ROTACION);
              break;
          case 5:
               // SELECCIONA TODOS LOS EMBARCADORES DE LA BASE DE DATOS
                embarcadores($conexion);
              break;
          case 6:
              // SELECCIONA EL ANCHO Y LARGO DEL UNIT INDICADO POR SU ID
                $id_unit = $_POST['id'];
                nueva_dimension_linga($conexion,$id_unit);
              break;
          case 7:
              // VERIFICA RUT EN EL INDEX
                $rut = $_POST['rut'];
                verificar_rut($conexion,$rut);
              break;
          case 8:
              // ENVIA CORREO EN CASO DE OLVIDAR CONTRASEÑA EN INDEX
                $correo = $_POST['correo'];
                $clave = $_POST['clave'];
                $nombre = $_POST['nombre'];
                correo_recuperacion_pw($conexion,$correo,$clave,$nombre);
              break;
          case 9:
              // RESCATA LAS DIMENSIONES DE UN TIER ESPECIFICO
                $bodega = $_POST['num_b'];
                $tier= $_POST['num_t'];
                $ROTACION = $_POST['ROTACION'];
                dimesiones_tier($conexion,$bodega ,$tier,$ROTACION);
              break;
          case 10:
          // GUARDA LA LINGA CREADA
                $aux = $_POST['linga'];
                $linga=json_decode($aux);
                $rotacion = $_POST['rotacion'];
                  $id_buque= $_POST['id_buque'];
                $bodega = $_POST['bodega'];
                guardar_linga($conexion,$linga,$rotacion,$bodega,$id_buque);
              break;
          case 11:
            // EDITA LAS POSICIONES DE LA LINGA AL MOMENTO DE MOVERSE
                $aux = $_POST['linga'];
                $linga=json_decode($aux);
                editar_linga_posicion($conexion,$linga);
              break;
          case 12:
            // EDITA LA ORIENTACION DE LA LINGA AL MOMENTO DE ROTARSE
                $aux = $_POST['linga'];
                $linga=json_decode($aux);
                editar_rotacion_linga($conexion,$linga);
              break;
          case 13:
              // ELIMINA LINGA DE LA BASE DE DATOS
                $id_linga = $_POST['id_linga'];
                eliminar_linga($conexion,$id_linga);
              break;
          case 14:
              // LISTA TODOS LOS PUESTO DE LA BASE DE DATOS
                puertos($conexion);
              break;
          case 15:
              // RESCATA EL NOMBRE DE UN PUERTO POR SU ID
                $id_puerto = $_POST['id_puerto'];
                nombre_puertos($conexion,$id_puerto);
              break;
          case 16:
              // DEVUELVES TODAS LAS LINGAS DE DICHA ROTACION
                    $RTC = $_POST['ROTACION'];
                    seleccionar_lingas($conexion,$RTC);
                  break;
          case 17:
              // RESCATA EL NOMBRE COMPLETO DEL EMBARCADOR CON SU ID
                    $id= $_POST['id_emb'];
                    getName_embarcador($conexion,$id);
                  break;
          case 18:
                    $id= $_POST['id_linga'];
                    get_empresa($conexion,$id);
                  break;
          case 19:
                    $id= $_POST['id_linga'];

                   marcar_linga_arauco($conexion,$id); //solo marcara marca=1
                  break;
          case 20:
                    $id= $_POST['id_linga'];
                    marcar_linga_CMPC($conexion,$id);
                break;
          case 21:
                    $id= $_POST['id_linga'];
                    desmarcar_linga($conexion,$id);
                break;
          case 22:

                    $rot= $_POST['rotacion'];
                    puertos_arauco_mark($conexion,$rot);
                break;
          case 23:
                    $rot= $_POST['rotacion'];
                    $puerto = $_POST['puerto'];
                    $marca = $_POST['marca'];
                    marcas_araucos_totales($conexion,$rot,$puerto,$marca);
                break;

}
function  marcas_araucos_totales($conexion,$rot,$puerto,$marca){
  $sql1="SELECT puertos.id_puerto FROM linga,puertos,unit
        WHERE linga.id_destino=puertos.id_puerto
        AND linga.id_unit=unit.id_unit
        AND unit.company='ARAUCO'
        AND linga.rotacion='$rot'
        AND puertos.puerto='$puerto'
        GROUP BY puertos.id_puerto";

 if( $resultado=mysqli_query($conexion,$sql1)){
      $dato = mysqli_fetch_assoc($resultado);
 }
  $puerto_id =  $dato["id_puerto"];
 mysqli_free_result($resultado);
  $datos_UNIT="";


  $sql2="SELECT unit.id_unit FROM unit, linga WHERE unit.id_unit=linga.id_unit AND unit.company='ARAUCO' AND linga.rotacion='$rot' GROUP BY unit.id_unit";

   if( $resultado2=mysqli_query($conexion,$sql2)){
        // $i=0;
        $primer = mysqli_fetch_assoc($resultado2);
        $datos_UNIT = $datos_UNIT."( linga.id_unit=".$primer["id_unit"];
        while ($row = mysqli_fetch_assoc($resultado2)) {
          $datos_UNIT=$datos_UNIT." OR linga.id_unit=".$row["id_unit"];
          // $i++;
        }
   }
   $SQL="UPDATE linga SET  marca_arauco='$marca' WHERE linga.id_destino='$puerto_id' AND   $datos_UNIT  ) ";
  $result=mysqli_query($conexion,$SQL);

}
function marca_arauco_nueva_linga($conexion,$puerto,$unit){
  $sql="SELECT marca_arauco FROM linga WHERE id_destino=$puerto AND (SELECT unit.company FROM unit WHERE unit.id_unit=$unit)= 'ARAUCO' GROUP BY id_destino";
  if ($resultado=mysqli_query($conexion,$sql)) {
        $primer = mysqli_fetch_assoc($resultado);
  }
  return $primer;
}
function puertos_arauco_mark($conexion,$rotacion){
  $sql="SELECT puertos.puerto,linga.marca_arauco
        FROM linga,unit,puertos
        WHERE linga.id_unit=unit.id_unit
        AND puertos.id_puerto=linga.id_destino
        AND unit.company='ARAUCO'
        AND linga.ROTACION='$rotacion'
        GROUP BY puertos.puerto";
    $resultado=mysqli_query($conexion, $sql);
    $arreglo=array();
           $i=0;
             while( $data = mysqli_fetch_assoc($resultado)){
                 $arreglo[$i]=$data;
                 $i++;
             }
       echo json_encode($arreglo);
       mysqli_free_result($resultado);
}
function buques($conexion){
  $sql="SELECT * FROM nave";
  $resultado=mysqli_query($conexion, $sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
         mysqli_free_result($resultado);
}

function bodegas_buque($conexion,$ROTACION){
  $sql="SELECT * FROM bodega WHERE id_buque=(SELECT nave.id_buque FROM nave WHERE ROTACION='$ROTACION')";
  $resultado=mysqli_query($conexion, $sql);
  $arreglo=array();
    $i=0;
      while( $data = mysqli_fetch_assoc($resultado)){
          $arreglo[$i]=$data;
          $i++;
      }
    echo json_encode($arreglo);
}

function buscar_tier($conexion,$id_bodega){
  $sql="SELECT * FROM tier WHERE id_bodega='$id_bodega'";
  $resultado=mysqli_query($conexion, $sql);
  $arreglo=array();
    $i=0;
      while( $data = mysqli_fetch_assoc($resultado)){
          $arreglo[$i]=$data;
          $i++;
      }
    echo json_encode($arreglo);
    mysqli_free_result($resultado);
}

function tier_bodegas($conexion,$ROTACION){
  $sql="SELECT id_tier,tier.id_bodega,nivel FROM tier,bodega WHERE bodega.id_bodega=tier.id_bodega and bodega.id_buque=(SELECT nave.id_buque FROM nave WHERE ROTACION='$ROTACION')";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
         mysqli_free_result($resultado);
}

function embarcadores($conexion){
  $sql="SELECT* FROM unit";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
     mysqli_free_result($resultado);
}

function nueva_dimension_linga($conexion,$id_unit){
  $sql="SELECT largo,ancho FROM unit WHERE id_unit='$id_unit'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  echo json_encode($dat);
}
function verificar_rut($conexion,$rut){
      $sql="SELECT correo,clave,nombre FROM usuario WHERE rut_usuario='$rut'";
      $resultado=mysqli_query($conexion,$sql);
      $dat = mysqli_fetch_assoc($resultado);
      echo json_encode($dat);
}

function correo_recuperacion_pw($conexion,$correo,$clave,$nombre){
    $mensaje = "Sr(a) ".$nombre." por este medio se en envia la clave solicitada en la pagina de Puerto Coronel\r\nClave:".$clave;
    mail($correo, 'Recuperacion de Clave EstibApp', $mensaje);
}
function dimesiones_tier($conexion,$bodega ,$tier,$ROTACION){
  $sql="SELECT tier.largo,tier.ancho
  FROM tier,bodega
  WHERE bodega.id_bodega=tier.id_bodega
  and bodega.num_bodega=$bodega
   and tier.nivel=$tier
   and bodega.id_buque='$ROTACION'";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  echo json_encode($dat);
}
function guardar_linga($conexion,$linga,$rotacion,$bodega,$id_buque){
  list($a,$b,$c)= explode("-",$linga->tier);
  $D=conseguir_id_tier($conexion,$c,$bodega,$id_buque);
  if($linga->id_puerto2=="NULL") $linga->id_puerto2= $linga->id_puerto;
  $marca_arauco=marca_arauco_nueva_linga($conexion,$linga->id_puerto,$linga->id_unit);
  if($marca_arauco["marca_arauco"]!=""){
    $marca_a=$marca_arauco["marca_arauco"];
  }else{
    $marca_a="";
  }
   $sql="INSERT INTO linga(id_linga,ancho,alto,largo,cantidad,posx,posy,tipo,giro,id_tier,id_unit,id_destino,ROTACION,peso,id_destino2,marca,marca_arauco)
   VALUES(NULL,$linga->ancho,$linga->alto,5,$linga->cantidad,$linga->pos_x,$linga->pos_y,'$linga->tipo',$linga->giro, $D , $linga->id_unit,$linga->id_puerto,'$rotacion',$linga->peso,$linga->id_puerto2,0,'$marca_a')";
   mysqli_query($conexion,$sql);
   $res =rescatar_id_linga($conexion);
    echo $res;
}
function conseguir_id_tier($conexion,$tier,$bodega,$id_buque){
  $sql="SELECT id_tier FROM tier,bodega WHERE bodega.id_bodega=tier.id_bodega and bodega.num_bodega=$bodega and tier.nivel=$tier and bodega.id_buque=$id_buque";
  $resultado=mysqli_query($conexion,$sql);
  $dat = mysqli_fetch_assoc($resultado);
  return $dat['id_tier'];
  mysqli_free_result($resultado);
}
function rescatar_id_linga($conexion){
  $sqll="SELECT id_linga FROM linga ORDER BY id_linga DESC LIMIT 1";
  $result=mysqli_query($conexion,$sqll);
  $dato = mysqli_fetch_assoc($result);
  return $dato['id_linga'];
}
function editar_linga_posicion($conexion,$linga){
$sqlll="UPDATE linga SET posx=$linga->pos_x , posy=$linga->pos_y WHERE id_linga=$linga->id_linga";
  $result=mysqli_query($conexion,$sqlll);
    mysqli_free_result($result);
    echo $sqlll;
}

function editar_rotacion_linga($conexion,$linga){
$sqll="UPDATE linga SET giro=$linga->giro , ancho=$linga->ancho, alto=$linga->largo  WHERE id_linga=$linga->id_linga";
  $result=mysqli_query($conexion,$sqll);
  mysqli_free_result($result);
  echo "este es".$linga->giro;
}
function eliminar_linga($conexion,$id_linga){
  $sqll="DELETE FROM linga WHERE id_linga=$id_linga";
    $result=mysqli_query($conexion,$sqll);
    mysqli_free_result($result);
}
function   puertos($conexion){
  $sql="SELECT* FROM puertos";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
     mysqli_free_result($resultado);
}
function nombre_puertos($conexion,$id_puerto){
  $sqll="SELECT puerto FROM puertos WHERE id_puerto=$id_puerto";
  $result=mysqli_query($conexion,$sqll);
  $dato = mysqli_fetch_assoc($result);
   echo json_encode($dato);
}
function seleccionar_lingas($conexion,$RTC){
  $sql="SELECT linga.id_linga,puertos.puerto,linga.ancho,linga.alto,linga.cantidad,linga.posx,linga.posy,linga.peso,linga.tipo,
  linga.giro,linga.id_tier,linga.id_unit,linga.id_destino,linga.ROTACION,tier.nivel,bodega.num_bodega,linga.marca,linga.marca_arauco,puertos.marca_cmpc,unit.company
  FROM linga, bodega,tier,puertos,unit
  WHERE puertos.id_puerto=linga.id_destino
  AND linga.id_unit=unit.id_unit
  AND linga.id_tier=tier.id_tier
  and tier.id_bodega=bodega.id_bodega
  and linga.ROTACION='$RTC'";
  $resultado=mysqli_query($conexion,$sql);
  $arreglo=array();
     $i=0;
       while( $data = mysqli_fetch_assoc($resultado)){
           $arreglo[$i]=$data;
           $i++;
       }
     echo json_encode($arreglo);
}
function getName_embarcador($conexion,$id){
  $sqll="SELECT CONCAT(embarcador.empresa,' ', unit.tipo) as nombre_unit FROM embarcador, unit WHERE embarcador.empresa=unit.empresa AND unit.id_unit=$id";
  $result=mysqli_query($conexion,$sqll);
  $dato = mysqli_fetch_assoc($result);
  echo json_encode($dato);
}
function get_empresa($conexion,$id){
  $sqll="SELECT unit.company as name FROM linga, unit WHERE linga.id_unit=unit.id_unit and linga.id_linga=$id";
  $result=mysqli_query($conexion,$sqll);
  $dato=mysqli_fetch_assoc($result);
  echo json_encode($dato);
}
function marcar_linga_arauco($conexion,$id){
  $sqll="UPDATE linga SET marca=1 WHERE id_linga=$id";
  $result=mysqli_query($conexion,$sqll);
  $SQL="SELECT linga.marca_arauco FROM linga WHERE linga.id_destino=(SELECT linga.id_destino FROM linga WHERE linga.id_linga= $id)";
  $resultado=mysqli_query($conexion,$SQL);
  $datoMarcas=mysqli_fetch_assoc($resultado);
  echo json_encode($datoMarcas);
}
function marcar_linga_CMPC($conexion,$id){
  $sql="UPDATE linga SET marca=1 WHERE id_linga=$id";
  $SQL="SELECT puertos.marca_cmpc,puertos.marca_arauco FROM puertos
        WHERE id_puerto=( SELECT linga.id_destino FROM linga WHERE id_linga=$id )";
  $result=mysqli_query($conexion,$sql);
  $resultado=mysqli_query($conexion,$SQL);
  $datoMarcas=mysqli_fetch_assoc($resultado);
  echo json_encode($datoMarcas);
}

function desmarcar_linga($conexion,$id){
  $sql="UPDATE linga SET marca=0 WHERE id_linga=$id";
  $result=mysqli_query($conexion,$sql);
  echo $sql;
}
?>
