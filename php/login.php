<?php
session_start();
include("conectar.php");

            if(isset($_POST['button'])){
                $rut = (string)$_POST['rut_usuario'];
                $pw = $_POST['clave'];
                $log = mysqli_query($conexion,"SELECT * FROM usuario WHERE rut_usuario='$rut' AND clave='$pw' ");
                $aa= mysqli_num_rows($log);
                  if($aa >0){
                    $row = mysqli_fetch_array($log);
                          if($row['tipo_usuario']=="administrador"){
                            $_SESSION['userAdmin'] = (string)$row['rut_usuario'];
                             echo '<script> window.location="../paginas/Buscar.php";</script>';
                          }
                          if($row['tipo_usuario']=="operario"){
                            $_SESSION['userOperario'] = (string)$row['rut_usuario'];
                             echo '<script> window.location="../paginas/Buscar.php";</script>';
                          }
                           if($row['tipo_usuario']=="maquinista"){
                            $_SESSION['userMaquinista'] = (string)$row['rut_usuario'];
                             echo '<script> window.location="../paginas/Buscar.php";</script>';
                          }
                  }else{
                    echo '<script> alert("usuario o contraseña incorrecta"); </script>';
                    echo '<script> window.location="../index.php" </script>';
                  }

              }
?>
