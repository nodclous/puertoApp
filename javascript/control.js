function ingresar_bodegas(id,id2){
	var rut_buque = $("#id_IMO").val();
	var nombre_buque = $("#nombre_buque").val();
	var generacion_buque = $("#generacion_buque").val();
	var cant_bodegas = $("#cant_bodegas").val();
	//alert(rut_buque+';'+nombre_buque+';'+generacion_buque+';'+cant_bodegas);

	if (rut_buque==""){
		alert("EL campo IMO del buque no puede estar vacio")
	}
	else if (nombre_buque==""){
		alert("EL campo nombre del buque no puede estar vacio")
	}
	else if (generacion_buque==""){
		alert("EL campo generacion del buque no puede estar vacio")
	}
	else if (cant_bodegas==""){
		alert("EL campo cantidad bodegas no puede estar vacio")
	}
	else{
		$.ajax({
			url:"insertar.php",
			type:"POST", //primero el nombre que va vamos a mandar al php y el segundo nombre variable recibido en ajax
			//, "nombre_buquee":nombre_buque, "generacion_buquee":generacion_buque, "cant_bodegass":cant_bodegas
			data: {"id_IMOO":rut_buque, "nombre_buquee":nombre_buque, "generacion_buquee":generacion_buque, "cant_bodegass":cant_bodegas},
			async:true,
			beforeSend: function(){ //desabilita bton
				//alert("desabilita");
				$("#enviar1").attr("disabled",true);
			},
			success:function(data){
				//alert(rut_buque+';'+nombre_buque+';'+generacion_buque+';'+cant_bodegas);
				console.log(data);
				$("#enviar1").attr("disabled",false);//habilito nuevamente el boton
				// if (data==true) { //NO FUNCIONA
				// 	alert("Se guardo");
				// }
				// else {alert("NO se ingreso");} 
			},
			error:function(){
				alert("ERROR de comunicacion");
			}
		})
		obj = document.getElementById(id);
    	obj.style.visibility = (obj.style.visibility == 'visible') ? 'hidden' : 'hidden';

    	obj = document.getElementById(id2);
    	obj.style.visibility = (obj.style.visibility == 'hidden') ? 'visible' : 'visible';
	}
}

function respon(a,b){
	if (screen.width<769){
		obj = document.getElementById(a);
		objd = document.getElementById(b);
        obj.style.visibility = (obj.style.visibility == 'hidden') ? 'visible' : 'hidden';
        if (objd.style.display=='none') 
        	objd.style.display='block';
        else objd.style.display='none';
}
