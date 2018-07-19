<?php
include("conectar.php");
$opcion = $_POST['opcion'];

switch($opcion){
  case 1:
          $nombre_buque=$_POST['nombre_buque'];
          $cant_bodegas=$_POST['cant_bodegas'];
          ingresar_buque($conexion,$nombre_buque,$cant_bodegas);
  break;

  case 2:
          $alto=$_POST['alto_bodega'];
          $rotacion=$_POST['rotacion'];
          $pet="SELECT MAX(id) FROM buque";
          $dato=mysqli_query($conexion,$pet);
          $id=mysqli_fetch_assoc($dato);
          mysqli_free_result($dato);
          $numero_bodega=$_POST['num_bodega'];
          $cantidad_tiers=$_POST['cantidad_tier'];
          ingresar_bodega($conexion,$id,$alto,$numero_bodega,$cantidad_tiers);
  break;

  case 3:
        $nivel=$_POST['niveloriginal'];
        $largo=$_POST['largo'];
        $ancho=$_POST['ancho'];
        ingresar_tier($conexion,$nivel,$largo,$ancho);
  break;
}



function ingresar_buque($conexion,$nombre_buque,$cant_bodegas){
  $sql="INSERT INTO buque(nombre,id,cantidad_bodegas)
        VALUES ('$nombre_buque',NULL,$cant_bodegas)";
    if(mysqli_query($conexion,$sql)){
echo 1;
    }


}

function ingresar_bodega($conexion,$id,$alto,$numero_bodega,$cantidad_tiers){
  $id_b=$id["MAX(id)"];
  $sqll="INSERT INTO bodega (id_bodega, alto, cant_tiers, num_bodega,id_buque)
        VALUES (NULL,0,$cantidad_tiers,$numero_bodega,$id_b)";
   mysqli_query($conexion,$sqll);
   echo $sqll;
}

function ingresar_tier($conexion,$nivel,$largo,$ancho){
  $sql="INSERT INTO tier(id_bodega,nivel,largo,ancho)
        VALUES ((SELECT max(id_bodega) from bodega),$nivel,$largo,$ancho)";
  echo mysqli_query($conexion,$sql);
}

?>
