<?php
include("conectar.php");
  $opcion = $_POST['opcion'];

    switch($opcion){
          case 1:
                // RESCATAR LISTA DE USUARIOS HABILITADOS
                usuarios($conexion);
              break;
          case 2:
                $id= $_POST['id'];
                $campo= $_POST['campo'];
                $nd= $_POST['nd']; // NUEVO DATO
                // MODIFICA UN CAMPO $campo DE USUARIO DE ID $id
                modificar($conexion,$id,$campo,$nd);
              break;
          case 3:
              // ELIMINAR USUARIO POSEEDOR DEL RUT ENVIADO
                $rut= $_POST['rut'];
                eliminar_usuario_rut($conexion,$rut);
                break;
          case 4:
                // RESCATO TODAS LOS USUARIOS HABILITADO Y NO HABITADO
                usuarios_completo($conexion);
             break;
         case 5:
               $rut= $_POST['rut'];
               $tipo= $_POST['tipo'];
               $correo= $_POST['correo'];
               $nombre= $_POST['nombre'];
               // AGREGA UN USUARIO CON CLAVE 1
               agregar_usuario($conexion,$rut,$tipo,$correo,$nombre);
              break;

}

function usuarios($conexion){
  $sql="SELECT * FROM usuario WHERE habilitado=1";
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
function modificar($conexion,$id,$campo,$nd){
$sqll="UPDATE usuario SET $campo='$nd' WHERE rut_usuario='$id'";
 mysqli_query($conexion,$sqll);
echo $sqll;
}
function eliminar_usuario_rut($conexion,$rut){
$sqll="UPDATE usuario SET habilitado=0 WHERE rut_usuario='$rut'";
     if(mysqli_query($conexion,$sqll)){
       echo 1;
     }else{
       echo 0;
     }
}
function usuarios_completo($conexion){
  $sql="SELECT * FROM usuario";
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
function  agregar_usuario($conexion,$rut,$tipo,$correo,$nombre){

  $exist = "SELECT rut_usuario FROM usuario WHERE rut_usuario='$rut'";

  if($resultado = mysqli_query($conexion,$exist)){
    if (mysqli_num_rows($resultado)>0) {
    echo 2;
    }else {
    $sql="INSERT INTO usuario(rut_usuario,nombre,clave,habilitado,tipo_usuario,correo)
    VALUES('$rut','$nombre','$rut',1,'$tipo','$correo')";
     if(mysqli_query($conexion,$sql)){
       echo 1;
     }
  }

}
}

?>
